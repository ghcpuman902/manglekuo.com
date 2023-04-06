import React, { useState, useEffect, useRef } from 'react';

const numberSliderFactory = (min, max, step, initialValue, unit = '') => {
    const NumberSlider = ({ onValueChange }) => {
        const [val, setVal] = useState(initialValue);
        const [isDragging, setIsDragging] = useState(false);
        const prevTouchX = useRef(null);
        const isTouchScreen = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

        const handleStart = () => setIsDragging(true);
        const handleEnd = () => {
            setIsDragging(false);
            prevTouchX.current = null;
        };
        const handleMove = (delta) => {
            setVal((val) => Math.min(Math.max(parseFloat(val) + delta * step, min), max));
        };
        const handleInputChange = (e) => {
            setVal(Math.min(Math.max(e.target.value, min), max));
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
            cursor: isDragging ? 'grabbing' : 'grab',
          };

        return (
            <div
                style={sliderStyle}
                onMouseDown={!isTouchScreen ? handleStart : undefined}
                onMouseUp={!isTouchScreen ? handleEnd : undefined}
                onTouchStart={isTouchScreen ? handleStart : undefined}
                onTouchEnd={isTouchScreen ? handleEnd : undefined}
            >
                <input
                    type="text"
                    value={`${val}${unit}`}
                    onChange={handleInputChange}
                    style={{
                        position: 'relative', margin: '0', padding: '0.2rem', color: '#fff', textAlign: 'center', fontSize: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', width: '100%', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'textfield',
                    }}
                />
            </div>
        );
    };
    return NumberSlider;
};

export default numberSliderFactory;
