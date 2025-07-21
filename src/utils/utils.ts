import { addDays, differenceInMinutes, parse } from 'date-fns';
import type { PrayerTimes } from '../types/types';


export const getPrayerInfo = (now: Date, prayerTimes: PrayerTimes) => {
    const today = now;
    const tomorrow = addDays(today, 1);

    const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

    // Create Date objects for today's prayers
    const prayerDateTimes = prayerNames.map(name =>
        parse(prayerTimes[name], 'HH:mm', today)
    );

    let nextPrayerIndex = prayerDateTimes.findIndex(prayerDate => prayerDate > now);
    let currentPrayerIndex: number;
    let nextPrayerTime: Date;

    if (nextPrayerIndex == 0 && prayerDateTimes[0] > now) {
        currentPrayerIndex = 4; // Isha
        nextPrayerTime = prayerDateTimes[0];
    } else if (nextPrayerIndex === -1) {
        currentPrayerIndex = 4; // Isha
        nextPrayerTime = parse(prayerTimes.Fajr, 'HH:mm', tomorrow);
    } else {
        currentPrayerIndex = nextPrayerIndex === 0 ? 0 : nextPrayerIndex - 1;
        nextPrayerTime = prayerDateTimes[nextPrayerIndex];
    }

    const currentPrayerName = prayerNames[currentPrayerIndex];
    const currentPrayerTime = prayerDateTimes[currentPrayerIndex];

    const timeSinceCurrentPrayer = differenceInMinutes(now, currentPrayerTime);
    const totalDuration = differenceInMinutes(nextPrayerTime, currentPrayerTime);
    const fillPercentage = Math.max(0, Math.min(100, (timeSinceCurrentPrayer / totalDuration) * 100));

    const minutesToNextPrayer = differenceInMinutes(nextPrayerTime, now);
    const hours = Math.floor(minutesToNextPrayer / 60);
    const minutes = minutesToNextPrayer % 60;
    const subtitle = `Next prayer in ${hours}h ${minutes}m`;

    return {
        currentPrayerName,
        fillPercentage,
        subtitle,
        currentPrayerIndex,
    };
};