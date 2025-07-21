import { CloudMoonIcon, CloudSunIcon, MoonStarsIcon, SunHorizonIcon, SunIcon } from '@phosphor-icons/react/dist/ssr';
import { format, parse } from 'date-fns';
import React, { useEffect, useState } from 'react';
import LiquidTubeProgress from './ui/LiquidTubeProgress';
import { getPrayerInfo } from '../utils/utils';
import { usePrayerStore } from '../store/prayerStore';

const PRAYER_ICONS = {
    Fajr: <CloudMoonIcon className="w-4 h-4" />,
    Dhuhr: <SunIcon className="w-4 h-4" />,
    Asr: <CloudSunIcon className="w-4 h-4" />,
    Maghrib: <SunHorizonIcon className="w-4 h-4" />,
    Isha: <MoonStarsIcon className="w-4 h-4" />,
} as const;

// const PRAYER_GRADIENTS = {
//     Fajr: 'bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700',
//     Dhuhr: 'bg-gradient-to-br from-yellow-400 via-orange-400 to-amber-500',
//     Asr: 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600',
//     Maghrib: 'bg-gradient-to-br from-orange-400 via-red-400 to-pink-500',
//     Isha: 'bg-gradient-to-br from-purple-600 via-indigo-700 to-violet-800',
// } as const;

const PRAYER_GRADIENTS = {
    Fajr: 'bg-gradient-to-b from-[#3f7ce6] to-[#d6bdff]',      // Blue to purple
    Dhuhr: 'bg-gradient-to-b from-[#e77715] to-[#ffe392]',     // Bright yellow to orange
    Asr: 'bg-gradient-to-b from-[#006c5e]  to-[#c9f3b3]',       // Emerald to teal to cyan
    Maghrib: 'bg-gradient-to-t from-[#ff88a8] to-[#ff9452]',   // Orange to red to pink
    Isha: 'bg-gradient-to-t from-[#811dec] to-[#381079]',      // Purple to indigo
} as const;

const TEST_DATES = {
    Fajr: new Date('2025-07-21T05:30:00'),
    Dhuhr: new Date('2025-07-21T14:15:00'),
    Asr: new Date('2025-07-21T16:30:00'),
    Maghrib: new Date('2025-07-21T19:50:00'),
    Isha: new Date('2025-07-21T23:15:00'),
} as const;

export const PrayerCard: React.FC = () => {
    const { prayerTimes, address } = usePrayerStore();
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    if (!prayerTimes) return null;

    const { currentPrayerName, fillPercentage, subtitle, currentPrayerIndex } = getPrayerInfo(now, prayerTimes);
    const bgClass = PRAYER_GRADIENTS[currentPrayerName as keyof typeof PRAYER_GRADIENTS];
    const currentDayLabel = format(now, 'EEEE');

    return (
        <div className="w-full max-w-sm mx-auto">
            <div className={`${bgClass} rounded-2xl p-5 pb-0 text-white relative overflow-hidden transition-all duration-1000 ease-in-out`}>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-col items-start gap-3">
                        <div className='flex gap-1 items-center'>
                            <MoonStarsIcon className="w-6 h-6" />
                            <h1 className="text-2xl font-semibold text-white">{currentPrayerName}</h1>
                        </div>
                        <p className="text-white text-sm">{subtitle}</p>
                        {address && <p className="text-xs text-white/70 mt-1 max-w-xs truncate">{address}</p>}
                    </div>
                    <div className="bg-white/20 px-4 py-0.5 flex items-center rounded-full backdrop-blur-sm">
                        <span className="text-sm font-medium text-white">{currentDayLabel}</span>
                    </div>
                </div>

                <div className="flex justify-around items-center mb-4">
                    {Object.entries(prayerTimes).map(([prayerName, time]) => (
                        <div
                            key={prayerName}
                            className={`text-center transition-all duration-300 ${prayerName === currentPrayerName
                                ? 'text-white scale-105'
                                : 'text-white/60 hover:text-white/80'
                                }`}
                        >
                            <div className="mb-1 flex justify-center">
                                {PRAYER_ICONS[prayerName as keyof typeof PRAYER_ICONS]}
                            </div>
                            <div className={`text-sm font-medium ${prayerName === currentPrayerName ? 'text-white' : 'text-white/60'
                                }`}>
                                {prayerName}
                            </div>
                            <div className={`text-xs ${prayerName === currentPrayerName
                                ? 'text-white font-semibold'
                                : 'text-white/60'
                                }`}>
                                {format(parse(time, 'HH:mm', new Date()), 'h:mm a')}
                            </div>
                        </div>
                    ))}
                </div>

                <LiquidTubeProgress
                    fillPercentage={fillPercentage}
                    currentPrayerIndex={currentPrayerIndex}
                />
            </div>
        </div>
    );
};