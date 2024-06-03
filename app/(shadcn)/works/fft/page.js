'use client';

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input"
import { Label } from "@components/ui/label"
import React, { useRef, useState, useEffect } from 'react';
import FFT from 'fft.js';

export default function DrawingCanvas() {

    const canvasRef = useRef(null);
    const resultCanvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);

    const canvasWidth = 512;
    const canvasHeight = 512;

    const startDrawing = (e) => {
        const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 0;
        ctx.beginPath();

        const rect = e.target.getBoundingClientRect();
        const x = e.nativeEvent.touches ? (e.nativeEvent.touches[0].clientX - rect.left) * (canvasRef.current.width / rect.width) : (e.nativeEvent.clientX - rect.left) * (canvasRef.current.width / rect.width);
        const y = e.nativeEvent.touches ? (e.nativeEvent.touches[0].clientY - rect.top) * (canvasRef.current.height / rect.height) : (e.nativeEvent.clientY - rect.top) * (canvasRef.current.height / rect.height);

        ctx.moveTo(x, y);
        setDrawing(true);
    };

    const draw = (e) => {
        if (!drawing) return;
        e.preventDefault(); // Add this line to prevent scrolling.
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const rect = e.target.getBoundingClientRect();

        const x = e.nativeEvent.touches ? (e.nativeEvent.touches[0].clientX - rect.left) * (canvasRef.current.width / rect.width) : (e.nativeEvent.clientX - rect.left) * (canvasRef.current.width / rect.width);
        const y = e.nativeEvent.touches ? (e.nativeEvent.touches[0].clientY - rect.top) * (canvasRef.current.height / rect.height) : (e.nativeEvent.clientY - rect.top) * (canvasRef.current.height / rect.height);

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const endDrawing = () => {
        setDrawing(false);
        updateResultCanvas();
    };

    const clearCanvas = () => {
        const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        const ctxResult = resultCanvasRef.current.getContext('2d', { willReadFrequently: true });
        ctxResult.fillStyle = 'black';
        ctxResult.fillRect(0, 0, canvasWidth, canvasHeight);
    };

    const imageDataToFloatArray = (imageData) => {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        const floatArray = new Float32Array(width * height);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
                floatArray[y * width + x] = gray;
            }
        }

        return floatArray;
    };

    const floatArrayToImageData = (floatArray, width, height) => {
        const imageData = new ImageData(width, height);
        const data = imageData.data;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = y * width + x;
                const value = floatArray[idx];
                const pixelIdx = idx * 4;

                data[pixelIdx] = value;
                data[pixelIdx + 1] = value;
                data[pixelIdx + 2] = value;
                data[pixelIdx + 3] = 255;
            }
        }

        return imageData;
    };

    function fftshift(arr) {
        const rows = arr.length;
        const cols = arr[0].length;
        const out = new Array(rows).fill().map(() => new Array(cols).fill(0));

        const halfRow = Math.floor(rows / 2);
        const halfCol = Math.floor(cols / 2);

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const newR = (r + halfRow) % rows;
                const newC = (c + halfCol) % cols;
                out[newR][newC] = arr[r][c];
            }
        }
        return out;
    }


    const fft2d = (imageData) => {
        const floatArray = imageDataToFloatArray(imageData);
        const width = imageData.width;
        const height = imageData.height;

        const input = new Array(height).fill(0).map(() => new Array(width).fill(0));
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = y * width + x;
                input[y][x] = floatArray[idx];
            }
        }

        const rows = input.length;
        const cols = input[0].length;
        const rowFFT = new FFT(cols);
        const rowResult = input.map(row => {
            const real = row.slice();
            const imag = new Array(cols).fill(0);
            const out = rowFFT.createComplexArray();
            rowFFT.realTransform(out, real);
            rowFFT.completeSpectrum(out);
            return out;
        });

        const colFFT = new FFT(rows);
        const colResultReal = Array.from({ length: cols }, () => new Array(rows));
        const colResultImag = Array.from({ length: cols }, () => new Array(rows));
        for (let col = 0; col < cols; col++) {
            const real = rowResult.map(row => row[col * 2]);
            const imag = rowResult.map(row => row[col * 2 + 1]);
            const out = colFFT.createComplexArray();
            colFFT.transform(out, colFFT.toComplexArray(real.concat(imag)));
            for (let row = 0; row < rows; row++) {
                colResultReal[col][row] = out[row * 2];
                colResultImag[col][row] = out[row * 2 + 1];
            }
        }

        const shiftedReal = fftshift(colResultReal);
        const shiftedImag = fftshift(colResultImag);

        const magnitude = shiftedReal.map((col, i) =>
            col.map((val, j) =>
                Math.log(Math.sqrt(val * val + shiftedImag[i][j] * shiftedImag[i][j]) + 1)
            )
        );
        const magnitudeFlat = new Float32Array(width * height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                magnitudeFlat[y * width + x] = magnitude[x][y];
            }
        }
        return magnitudeFlat;
    };


    const updateResultCanvas = () => {
        const sourceCanvas = canvasRef.current;
        const resultCanvas = resultCanvasRef.current;

        if (sourceCanvas && resultCanvas) {
            const ctxSource = sourceCanvas.getContext('2d', { willReadFrequently: true });
            const ctxResult = resultCanvas.getContext('2d', { willReadFrequently: true });

            const originalImageData = ctxSource.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);

            const magnitudeSpectrum = fft2d(originalImageData);
            const maxMagnitude = magnitudeSpectrum.reduce((max, val) => Math.max(max, val), -Infinity);
            const normalizedSpectrum = magnitudeSpectrum.map(value => (value / maxMagnitude) * 255);
            const resultImageData = floatArrayToImageData(normalizedSpectrum, originalImageData.width, originalImageData.height);
            ctxResult.putImageData(resultImageData, 0, 0);

        }
    };

    const loadImage = async (event) => {
        const file = event.target.files[0];
        const image = new Image();

        image.onload = function () {
            const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });

            // Clear the canvas
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            // Calculate scale to preserve aspect ratio
            let scale = Math.max(canvasWidth / image.width, canvasHeight / image.height);

            // Get the top left position of the image
            let x = (canvasWidth / 2) - (image.width / 2) * scale;
            let y = (canvasHeight / 2) - (image.height / 2) * scale;

            // Draw the image to canvas
            ctx.drawImage(image, x, y, image.width * scale, image.height * scale);

            // Update the secondary canvas
            updateResultCanvas();
        };

        // Read the file as URL and assign to the src of the image
        const reader = new FileReader();
        reader.onload = (e) => {
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        clearCanvas();
    }, []);

    return (
        <div className="flex flex-col items-center gap-y-5 mx-auto my-10 w-full max-w-[512px]">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Source
            </h3>
            <div className="w-full border border-white touch-none">
                <canvas
                    ref={canvasRef}
                    width={512}
                    height={512}
                    className="w-full border border-gray-400"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                    onMouseLeave={endDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={endDrawing}
                ></canvas>
            </div>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                FFT
            </h3>
            <div className="w-full border border-white">
                <canvas
                    ref={resultCanvasRef}
                    width={512}
                    height={512}
                    className="w-full border border-gray-400"
                ></canvas>
            </div>
            <div className="grid w-full max-w-sm px-2 items-center gap-1.5">
                <Button className="" variant="outline" onClick={clearCanvas}>clear</Button>
                <Label htmlFor="picture" className="text-gray-400">Draw or upload an image as source</Label>
                <Input id="picture" type="file" onChange={loadImage} />
            </div>
        </div>
    );
}