'use client';
import React, { useState, useEffect, useRef } from 'react';
import createSunHeightCalculator from './SunHeightCalculator';
import { SVG } from '@svgdotjs/svg.js';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/ui/table"

const oneHour = 60 * 60 * 1000; // in milliseconds
const defaultLocation = {
    latitude: 51.5072, // London's coordinates
    longitude: -0.1276
};

const SunTrackerSVG = () => {
    const [location, setLocation] = useState(defaultLocation);
    const [times, setTimes] = useState(null);
    const svgContainerRef = useRef(null);
    const drawRef = useRef(null);
    const sunRef = useRef(null);
    const backgroundRef = useRef(null);

    const getLocation = () => {
        return new Promise((resolve, reject) => {
            const cachedLocation = localStorage.getItem('location');
            const cachedLocationExpiry = localStorage.getItem('location-expiry');
            
            if (cachedLocation && cachedLocationExpiry && Date.now() < Number(cachedLocationExpiry)) {
                resolve(JSON.parse(cachedLocation));
            } else if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const { latitude, longitude } = position.coords;
                        // cache the location and expiry time
                        localStorage.setItem('location', JSON.stringify({ latitude, longitude }));
                        localStorage.setItem('location-expiry', String(Date.now() + oneHour));
                        resolve({ latitude, longitude });
                    },
                    error => {
                        // Resolve promise with default location if error occurs while getting geolocation
                        console.error(error);
                        resolve(defaultLocation);
                    }
                );
            } else {
                // Resolve promise with default location if geolocation is not supported
                console.error('Geolocation is not supported by this browser.');
                resolve(defaultLocation);
            }
        });
    };

    useEffect(() => {
        getLocation().then(newLocation => {
            setLocation(newLocation);

            const calculator = createSunHeightCalculator({
                latitude: newLocation.latitude,
                longitude: newLocation.longitude,
                date: new Date(),
            });

            const sunTimes = calculator.getTimes();
            setTimes(sunTimes);
            console.table(sunTimes);
    
            drawRef.current = SVG().addTo(svgContainerRef.current).size('100%', '300');
            backgroundRef.current = drawRef.current.rect('100%', '300').fill('#000');
            sunRef.current = drawRef.current.circle(20).fill('yellow');
    
            updateBackgroundAndSunPosition(calculator);
            drawSunPath(calculator);
    
            const intervalId = setInterval(() => {
                updateBackgroundAndSunPosition(calculator);
            }, 60000);
    
            return () => {
                clearInterval(intervalId);
                if (drawRef.current) {
                    drawRef.current.clear();
                    drawRef.current = null;
                }
            }
        });


    }, []);

    const defineGradient = (sunriseTime, sunsetTime, currentTime) => {
        const nightColor = '#000033';
        const dayColor = '#87CEEB';
        const sunriseColor = '#ffcc00';
        const sunsetColor = '#ffcc00';
        const gradient = drawRef.current.gradient('linear').from(0, 0).to(0, 1);
        gradient.stop(0, nightColor);

        const dayLength = sunsetTime - sunriseTime;
        const timeSinceSunrise = currentTime - sunriseTime;
        const position = timeSinceSunrise / dayLength;

        if (currentTime < sunriseTime) {
            gradient.stop(position, nightColor);
        } else if (currentTime > sunsetTime) {
            gradient.stop(position, nightColor);
        } else {
            gradient.stop(position - 0.1, sunriseColor);
            gradient.stop(position, dayColor);
            gradient.stop(position + 0.1, sunsetColor);
        }

        gradient.stop(1, nightColor);

        return gradient;
    };

    const updateBackgroundAndSunPosition = (calculator) => {
        if (!drawRef.current) {
            console.log('no drawRef');
            return;
        }
        const now = new Date();
        const currentSunHeight = calculator.calculateSunHeight(now.getHours(), now.getMinutes());
        const currentX = (now.getHours() * 60 + now.getMinutes()) / 1440 * drawRef.current.bbox().width;
        const currentY = (1 - (currentSunHeight + 90) / 180) * drawRef.current.bbox().height;

        sunRef.current.center(currentX, currentY);

        const gradient = defineGradient(calculator.getTimes().sunrise.getTime(), calculator.getTimes().sunset.getTime(), now.getTime());
        backgroundRef.current.fill(gradient);
    };

    const drawSunPath = (calculator) => {
        if (!drawRef.current) {
            console.log('no drawRef');
            return;
        }

        const width = drawRef.current.bbox().width;
        const height = drawRef.current.bbox().height;

        // Grid
        for (let i = 1; i < 6; i++) {
            if(i == 3){ next; }
            drawRef.current.line(0, height / 6 * i, width, height  / 6 * i).stroke({ width: 1, opacity: 0.2, color: '#fff' });
        }
        for (let i = 0; i < 4; i++) {
            drawRef.current.line(width / 4 * i, 0, width  / 4 * i, height).stroke({ width: 1, opacity: 0.2, color: '#fff' });
        }

        let dPath = '';
        for (let minute = 0; minute <= 1440; minute++) {
            const hour = Math.floor(minute / 60);
            const min = minute % 60;
            const sunHeight = calculator.calculateSunHeight(hour, min);
            const x = minute / 1440 * width; // Convert to pixel coordinate
            const y = (1 - (sunHeight + 90) / 180) * height; // Normalize to SVG height

            dPath += `${minute === 0 ? 'M' : 'L'} ${x},${y} `;
        }
        drawRef.current.path(dPath).fill('none').stroke({ width: 5, color: '#eeeeff' });


        const now = new Date();
        const currentSunHeight = calculator.calculateSunHeight(now.getHours(), now.getMinutes());
        const currentX = (now.getHours() * 60 + now.getMinutes()) / 1440 * width;
        const currentY = (1 - (currentSunHeight + 90) / 180) * height;
        drawRef.current.circle(20).center(currentX, currentY).fill('yellow');

        // Horizon
        drawRef.current.line(0, height / 2, width, height / 2).stroke({ width: 4, color: '#777777' });
    };

    return (
        <div>
            <div ref={svgContainerRef} className='[&>svg:nth-child(1)]:hidden'></div>
            {times && (
                <Table>
                    <TableCaption>Day stages with their solar times.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px]">Stage</TableHead>
                            <TableHead>Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">Night End</TableCell>
                            <TableCell>{times.nightEnd.toLocaleTimeString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Nautical Dawn</TableCell>
                            <TableCell>{times.nauticalDawn.toLocaleTimeString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Dawn</TableCell>
                            <TableCell>{times.dawn.toLocaleTimeString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Sunrise Start</TableCell>
                            <TableCell>{times.sunrise.toLocaleTimeString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Sunrise End</TableCell>
                            <TableCell>{times.sunriseEnd.toLocaleTimeString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Morning Golden Hour</TableCell>
                            <TableCell>{times.goldenHourEnd.toLocaleTimeString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Solar Noon</TableCell>
                            <TableCell>{times.solarNoon.toLocaleTimeString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Afternoon Golden Hour</TableCell>
                            <TableCell>{times.goldenHour.toLocaleTimeString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Sunset Start</TableCell>
                            <TableCell>{times.sunsetStart.toLocaleTimeString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Sunset End</TableCell>
                            <TableCell>{times.sunset.toLocaleTimeString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Dusk</TableCell>
                            <TableCell>{times.dusk.toLocaleTimeString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Nautical Dusk</TableCell>
                            <TableCell>{times.nauticalDusk.toLocaleTimeString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Night Start</TableCell>
                            <TableCell>{times.night.toLocaleTimeString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Nadir</TableCell>
                            <TableCell>{times.nadir.toLocaleTimeString()}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            )}
        </div>
    );
};

export { SunTrackerSVG };