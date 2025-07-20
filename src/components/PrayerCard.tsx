import { CloudMoonIcon, CloudSunIcon, MoonStarsIcon, SunHorizonIcon, SunIcon } from '@phosphor-icons/react/dist/ssr';
import React from 'react';
import LiquidTubeProgress from './ui/LiquidTubeProgress';

interface PrayerTime {
    name: string;
    time: string;
    icon: React.ReactNode;
}

interface PrayerTimeCardProps {
    title: string;
    subtitle?: string;
    dayLabel?: string;
    backgroundGradient?: string;
    prayerTimes?: PrayerTime[];
    currentPrayer?: string;
    currentTime?: string; // Current time in "HH:MM" format
}

const defaultPrayerTimes: PrayerTime[] = [
    { name: 'Fajr', time: '5:51', icon: <CloudMoonIcon className="w-4 h-4" /> },
    { name: 'Dhuhr', time: '12:27', icon: <SunIcon className="w-4 h-4" /> },
    { name: 'Asr', time: '3:21', icon: <CloudSunIcon className="w-4 h-4" /> },
    { name: 'Maghrib', time: '5:40', icon: <SunHorizonIcon className="w-4 h-4" /> },
    { name: 'Isha', time: '7:04', icon: <MoonStarsIcon className="w-4 h-4" /> },
];

// Helper function to convert time string to minutes since midnight
const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};

// Helper function to calculate fill percentage
const calculateFillPercentage = (
    currentTime: string,
    currentPrayer: string,
    prayerTimes: PrayerTime[]
): number => {
    const currentMinutes = timeToMinutes(currentTime);
    const currentPrayerIndex = prayerTimes.findIndex(p => p.name === currentPrayer);

    if (currentPrayerIndex === -1) return 0;

    const currentPrayerStart = timeToMinutes(prayerTimes[currentPrayerIndex].time);
    const nextPrayerIndex = (currentPrayerIndex + 1) % prayerTimes.length;
    let nextPrayerStart = timeToMinutes(prayerTimes[nextPrayerIndex].time);

    // Handle case where next prayer is next day (like Isha to Fajr)
    if (nextPrayerStart <= currentPrayerStart) {
        nextPrayerStart += 24 * 60; // Add 24 hours
    }

    let adjustedCurrentTime = currentMinutes;
    // Handle case where current time is past midnight
    if (currentMinutes < currentPrayerStart && currentPrayerIndex === 4) { // Isha prayer
        adjustedCurrentTime += 24 * 60;
    }

    const totalDuration = nextPrayerStart - currentPrayerStart;
    const elapsed = adjustedCurrentTime - currentPrayerStart;

    return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
};

export const PrayerCard: React.FC<PrayerTimeCardProps> = ({
    title,
    subtitle = "Next prayer in 1h 29m",
    dayLabel = "Sunday",
    backgroundGradient,
    prayerTimes = defaultPrayerTimes,
    currentPrayer = "Isha",
    currentTime = "8:30" // Default current time
}) => {
    const bgClass = backgroundGradient || "bg-gradient-to-br from-prayer-gradient-start to-prayer-gradient-end";

    // Calculate fill percentage automatically
    const fillPercentage = calculateFillPercentage(currentTime, currentPrayer, prayerTimes);

    // Create prayer segments for the tube with proper end times
    const prayerSegments = prayerTimes.map((prayer, index) => {
        const nextIndex = (index + 1) % prayerTimes.length;
        const nextPrayerTime = prayerTimes[nextIndex].time;

        return {
            name: prayer.name,
            startTime: prayer.time,
            endTime: nextPrayerTime,
        };
    });

    return (
        <div className="w-full max-w-sm mx-auto">
            <div className={`${bgClass} rounded-2xl p-5 pb-0 text-prayer-text-primary relative overflow-hidden`}>
                {/* Top Row */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex-col items-center gap-3">
                        <div className='flex gap-1 items-center'>
                            <MoonStarsIcon className="w-6 h-6" />
                            <h1 className="text-2xl font-semibold">{title}</h1>
                        </div>
                        <p className="text-white text-sm">{subtitle}</p>
                    </div>
                    <div className="bg-white/20 px-4 py-0.5 flex items-center rounded-full">
                        <span className="text-sm font-medium">{dayLabel}</span>
                    </div>
                </div>

                {/* Prayer Times */}
                <div className="flex justify-around items-center mb-4">
                    {prayerTimes.map((prayer, index) => (
                        <div
                            key={prayer.name}
                            className={`text-center ${prayer.name === currentPrayer
                                ? 'text-white'
                                : 'text-gray-400'
                                }`}
                        >
                            <div className="mb-1 flex justify-center">
                                {prayer.icon}
                            </div>
                            <div className={`text-sm font-medium ${prayer.name === currentPrayer
                                ? 'text-white'
                                : 'text-gray-400'
                                }`}>
                                {prayer.name}
                            </div>
                            <div className={`text-xs ${prayer.name === currentPrayer
                                ? 'text-white font-semibold'
                                : 'text-gray-400'
                                }`}>
                                {prayer.time}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Debug info */}
                {/* <div className="text-xs text-white/60 mb-2 text-center">
                    Current: {currentTime} | Fill: {fillPercentage.toFixed(1)}%
                </div> */}

                {/* Progress Indicator */}
                <LiquidTubeProgress
                    fillPercentage={fillPercentage}
                    currentPrayer={currentPrayer}
                    prayerSegments={prayerSegments}
                />
            </div>
        </div>
    );
};