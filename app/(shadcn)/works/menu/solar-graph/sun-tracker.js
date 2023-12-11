'use client'
import React, { useState, useEffect, useRef } from 'react';
import createSunHeightCalculator from './SunHeightCalculator';
import { SVG } from '@svgdotjs/svg.js';

const SunTrackerSVG = () => {
    'use client'
    const [location, setLocation] = useState(null);
    const [times, setTimes] = useState(null);
    const svgContainerRef = useRef(null);
    const drawRef = useRef(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });

                    const calculator = createSunHeightCalculator({
                        latitude,
                        longitude,
                        date: new Date(),
                    });

                    const sunTimes = calculator.getTimes();
                    setTimes(sunTimes);

                    drawSunPath(calculator);
                },
                (error) => {
                    console.error(error);
                }
            );
        }

        return () => {
            // Clear the SVG upon component unmount
            if (drawRef.current) {
                drawRef.current.clear();
            }
        };
    }, []);

    const drawSunPath = (calculator) => {
        const draw = SVG().addTo(svgContainerRef.current).size('100%', '300px');
        drawRef.current = draw;

        const width = svgContainerRef.current.clientWidth;
        const height = svgContainerRef.current.clientHeight;

        // Draw the horizon line
        draw.line(0, height / 2, width, height / 2).stroke({ width: 2, color: 'white' });

        // Draw the sun's path
        let dPath = '';
        for (let minute = 0; minute <= 1440; minute++) {
            const hour = Math.floor(minute / 60);
            const min = minute % 60;
            const sunHeight = calculator.calculateSunHeight(hour, min);
            const x = minute / 1440 * width; // Convert to pixel coordinate
            const y = (1 - (sunHeight + 90) / 180) * height; // Normalize to SVG height

            dPath += `${minute === 0 ? 'M' : 'L'} ${x},${y} `;
        }
        // dPath += 'Z'; // Close the path
        draw.path(dPath).fill('none').stroke({ width: 1, color: 'white' });

        // Draw the current position of the sun
        const now = new Date();
        const currentSunHeight = calculator.calculateSunHeight(now.getHours(), now.getMinutes());
        const currentX = (now.getHours() * 60 + now.getMinutes()) / 1440 * width;
        const currentY = (1 - (currentSunHeight + 90) / 180) * height;
        draw.circle(20).center(currentX, currentY).fill('yellow');
    };

    return (
        <div>
            <div ref={svgContainerRef} className='[&>svg:nth-child(2)]:hidden'></div>
            {times && (
                <div>
                    <p>Sunrise: {times.sunrise.toLocaleTimeString()}</p>
                    <p>Sunset: {times.sunset.toLocaleTimeString()}</p>
                    {/* ...display other astronomical times */}
                </div>
            )}
        </div>
    );
};

export { SunTrackerSVG };