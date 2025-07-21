export interface PrayerInfo {
    name: string;
    time: string; // "HH:mm" format
    icon: React.ReactNode;
}

export interface Location {
    latitude: number;
    longitude: number;
}

export interface PrayerTimes {
    Fajr: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
}