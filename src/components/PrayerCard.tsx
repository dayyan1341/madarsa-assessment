import { CloudMoonIcon, CloudSunIcon, MoonStarsIcon, SunHorizonIcon, SunIcon } from '@phosphor-icons/react/dist/ssr';
import { addDays, differenceInMinutes, format, parse } from 'date-fns';
import React, { useEffect, useState } from 'react';
import LiquidTubeProgress from './ui/LiquidTubeProgress';

interface PrayerTime {
    name: string;
    time: string; // "HH:mm" format
    icon: React.ReactNode;
}

interface PrayerTimeCardProps {
    dayLabel?: string;
    backgroundGradient?: string;
}

const defaultPrayerTimes: PrayerTime[] = [
    { name: 'Fajr', time: '05:51', icon: <CloudMoonIcon className="w-4 h-4" /> },
    { name: 'Dhuhr', time: '12:27', icon: <SunIcon className="w-4 h-4" /> },
    { name: 'Asr', time: '15:21', icon: <CloudSunIcon className="w-4 h-4" /> },
    { name: 'Maghrib', time: '17:40', icon: <SunHorizonIcon className="w-4 h-4" /> },
    { name: 'Isha', time: '19:04', icon: <MoonStarsIcon className="w-4 h-4" /> },
];

// Helper to get prayer info based on the current time
const getPrayerInfo = (now: Date) => {
    const today = now;
    const tomorrow = addDays(today, 1);

    // Create Date objects for today's prayers
    const prayerDateTimes = defaultPrayerTimes.map(p => parse(p.time, 'HH:mm', today));

    // Find the index of the next prayer
    let nextPrayerIndex = prayerDateTimes.findIndex(prayerDate => prayerDate > now);

    let currentPrayerIndex;
    let nextPrayerTime;

    if (nextPrayerIndex === -1) {
        // After Isha, next prayer is Fajr tomorrow
        currentPrayerIndex = 4; // Isha
        nextPrayerIndex = 0;
        nextPrayerTime = parse(defaultPrayerTimes[0].time, 'HH:mm', tomorrow);
    } else {
        currentPrayerIndex = (nextPrayerIndex + defaultPrayerTimes.length - 1) % defaultPrayerTimes.length;
        nextPrayerTime = prayerDateTimes[nextPrayerIndex];
    }

    const currentPrayer = defaultPrayerTimes[currentPrayerIndex];
    const currentPrayerTime = prayerDateTimes[currentPrayerIndex];

    // Calculate fill percentage
    const timeSinceCurrentPrayer = differenceInMinutes(now, currentPrayerTime);
    const totalDuration = differenceInMinutes(nextPrayerTime, currentPrayerTime);
    const fillPercentage = Math.max(0, Math.min(100, (timeSinceCurrentPrayer / totalDuration) * 100));

    // Calculate time remaining for subtitle
    const minutesToNextPrayer = differenceInMinutes(nextPrayerTime, now);
    const hours = Math.floor(minutesToNextPrayer / 60);
    const minutes = minutesToNextPrayer % 60;
    const subtitle = `Next prayer in ${hours}h ${minutes}m`;

    return {
        currentPrayerName: currentPrayer.name,
        fillPercentage,
        subtitle,
    };
};

export const PrayerCard: React.FC<PrayerTimeCardProps> = ({
    dayLabel,
    backgroundGradient,
}) => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const { currentPrayerName, fillPercentage, subtitle } = getPrayerInfo(now);
    const bgClass = backgroundGradient || "bg-gradient-to-br from-prayer-gradient-start to-prayer-gradient-end";
    const currentDayLabel = dayLabel || format(now, 'EEEE');

    const prayerSegments = defaultPrayerTimes.map(p => ({ ...p, endTime: p.time }));

    return (
        <div className="w-full max-w-sm mx-auto">
            <div className={`${bgClass} rounded-2xl p-5 pb-0 text-prayer-text-primary relative overflow-hidden`}>
                {/* Top Row */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex-col items-center gap-3">
                        <div className='flex gap-1 items-center'>
                            <MoonStarsIcon className="w-6 h-6" />
                            <h1 className="text-2xl font-semibold">{currentPrayerName}</h1>
                        </div>
                        <p className="text-white text-sm">{subtitle}</p>
                    </div>
                    <div className="bg-white/20 px-4 py-0.5 flex items-center rounded-full">
                        <span className="text-sm font-medium">{currentDayLabel}</span>
                    </div>
                </div>

                {/* Prayer Times */}
                <div className="flex justify-around items-center mb-4">
                    {defaultPrayerTimes.map((prayer) => (
                        <div
                            key={prayer.name}
                            className={`text-center ${prayer.name === currentPrayerName ? 'text-white' : 'text-gray-400'}`}
                        >
                            <div className="mb-1 flex justify-center">{prayer.icon}</div>
                            <div className={`text-sm font-medium ${prayer.name === currentPrayerName ? 'text-white' : 'text-gray-400'}`}>
                                {prayer.name}
                            </div>
                            <div className={`text-xs ${prayer.name === currentPrayerName ? 'text-white font-semibold' : 'text-gray-400'}`}>
                                {format(parse(prayer.time, 'HH:mm', new Date()), 'h:mm a')}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Progress Indicator */}
                <LiquidTubeProgress
                    fillPercentage={fillPercentage}
                    currentPrayer={currentPrayerName}
                    prayerSegments={prayerSegments}
                />
            </div>
        </div>
    );
};