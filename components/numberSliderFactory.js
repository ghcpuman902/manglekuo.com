import React, { useState, useEffect, useRef } from 'react';


const numberSliderFactory = (min, max, step, initialValue, unit = '') => {
    const NumberSlider = ({ onValueChange }) => {
        const [val, setVal] = useState(initialValue);
        const [isDragging, setIsDragging] = useState(false);
        const prevTouchX = useRef(null);
        const isTouchScreen = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
        const [tapCount, setTapCount] = useState(0);
        const tapTimeoutRef = useRef(null);

        const handleStart = () => setIsDragging(true);
        const handleEnd = () => {
            setIsDragging(false);
            prevTouchX.current = null;
        };
        const handleMove = (delta) => {
            setVal((val) => Math.min(Math.max(parseFloat(val) + delta * step, min), max));
        };
        const handleInputChange = (e) => {
            let num = e.target.value.endsWith(unit) ? e.target.value.slice(0, -unit.length) : e.target.value; // remove the unit if exists
            num = !isNaN(Number(num)) ? Number(num) : val; // check if the rest is number
            setVal(Math.min(Math.max(num, min), max)); // clip the value
        };
        const handleDoubleTap = () => {
            setTapCount((prevCount) => prevCount + 1);
            if (tapTimeoutRef.current) {
                clearTimeout(tapTimeoutRef.current);
            }
            tapTimeoutRef.current = setTimeout(() => {
                setTapCount(0);
            }, 300);

            if (tapCount === 1) {
                setVal(initialValue);
            }
        };


        useEffect(() => {
            const handleMouseMove = (event) => handleMove(event.movementX);
            const handleMouseUp = () => handleEnd();
            const handleTouchMove = (event) => {
                const currentTouchX = event.touches[0].clientX;
                if (prevTouchX.current !== null) handleMove(currentTouchX - prevTouchX.current);
                prevTouchX.current = currentTouchX;
            };
            const handleTouchEnd = () => handleEnd();

            if (isDragging) {
                if (isTouchScreen) {
                    window.addEventListener('touchmove', handleTouchMove);
                    window.addEventListener('touchend', handleTouchEnd);
                    window.addEventListener('touchcancel', handleTouchEnd);
                } else {
                    window.addEventListener('mousemove', handleMouseMove);
                    window.addEventListener('mouseup', handleMouseUp);
                }
            } else {
                if (isTouchScreen) {
                    window.removeEventListener('touchmove', handleTouchMove);
                    window.removeEventListener('touchend', handleTouchEnd);
                    window.removeEventListener('touchcancel', handleTouchEnd);
                } else {
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                }
            }

            return () => {
                if (isTouchScreen) {
                    window.removeEventListener('touchmove', handleTouchMove);
                    window.removeEventListener('touchend', handleTouchEnd);
                    window.removeEventListener('touchcancel', handleTouchEnd);
                } else {
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                }
            };
        }, [isDragging]);

        useEffect(() => {
            if (onValueChange) {
                onValueChange(val);
            }
        }, [val, onValueChange]);

        const sliderStyle = {
            position: 'relative',
            padding: '0',
            background: `linear-gradient(90deg, rgba(255,255,255,0.2) ${(val - min) / (max - min) * 100}%, rgba(0,0,0,0.2) ${(val - min) / (max - min) * 100}%)`,
            border: '1px solid #ddd',
            borderRadius: '0.5rem',
            cursor: 'text'
        };

        return (
            <div
                style={sliderStyle}
                onMouseDown={!isTouchScreen ? handleStart : undefined}
                onMouseUp={!isTouchScreen ? handleEnd : undefined}
                onDoubleClick={!isTouchScreen ? () => setVal(initialValue) : undefined}
                onTouchStart={isTouchScreen ? handleStart : undefined}
                onTouchEnd={isTouchScreen ? (e) => { handleEnd(e); handleDoubleTap(); } : undefined}
            >
                <input
                    type="text"
                    value={`${val}${unit}`}
                    onChange={handleInputChange}
                    style={{
                        position: 'relative', margin: '0', padding: '0.2rem', color: '#fff', textAlign: 'center', fontSize: '1.5rem', background: 'transparent', border: 'none', outline: 'none', width: '100%',
                    }}
                />
            </div>
        );
    };
    return NumberSlider;
};

export default numberSliderFactory;
