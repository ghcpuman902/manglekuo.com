'use client'
import * as SunCalc from 'suncalc';

// Define a type for the calculator factory output
type SunHeightCalculator = {
  calculateSunHeight: (hour: number, minute: number) => number;
  getMaxHeight: () => number;
  getMinHeight: () => number;
  getTimes: () => SunCalc.GetTimesResult;
};

// Define a type for the input parameters
type CalculatorParams = {
  latitude: number;
  longitude: number;
  date: Date;
};

const createSunHeightCalculator = ({ latitude, longitude, date }: CalculatorParams): SunHeightCalculator => {
  // Use the SunCalc library to get times for sunrise and sunset
  const times = SunCalc.getTimes(date, latitude, longitude);

  const calculateSunHeight = (hour: number, minute: number): number => {
    const time = new Date(date);
    time.setHours(hour, minute, 0, 0);
    const sunPosition = SunCalc.getPosition(time, latitude, longitude);

    // SunCalc gives the altitude of the sun in radians; convert to degrees and normalize from -90 to 90
    const height = (sunPosition.altitude * 180) / Math.PI;
    return height;
  };

  const getMaxHeight = (): number => {
    const solarNoon = times.solarNoon;
    const sunPosition = SunCalc.getPosition(solarNoon, latitude, longitude);
    return (sunPosition.altitude * 180) / Math.PI;
  };

  const getMinHeight = (): number => -90; // The sun's minimum altitude when below the horizon

  const getTimes = (): SunCalc.GetTimesResult => times; // The sun's minimum altitude when below the horizon

  return { calculateSunHeight, getMaxHeight, getMinHeight, getTimes };
};

// Example usage:
// const calculator = createSunHeightCalculator({
//   latitude: 40.7128, // New York City
//   longitude: -74.0060,
//   date: new Date(),
// });
// const sunHeightAtNoon = calculator.calculateSunHeight(12, 0); // Height at 12:00 PM
// console.log(`Sun height at 12:00 PM: ${sunHeightAtNoon}`);
// console.log(`Max sun height today: ${calculator.getMaxHeight()}`);
// console.log(`Min sun height: ${calculator.getMinHeight()}`);

export default createSunHeightCalculator;
