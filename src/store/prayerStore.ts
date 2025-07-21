import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import type { Location, PrayerTimes } from '../types/types';

interface PrayerState {
    location: Location | null;
    address: string | null;
    prayerTimes: PrayerTimes | null;
    loading: boolean;
    error: string | null;
    locationPermissionGranted: boolean;
    setLocation: (location: Location) => void;
    // fetchPrayerTimesFromLocation: (location: Location) => Promise<void>;
    fetchAddress: (location: Location) => Promise<void>;
    fetchPrayerTimes: (location: Location) => Promise<void>;
    fetchPrayerTimesByAddress: (address: string) => Promise<void>;
    clearError: () => void;
}


const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
    try {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
                timeout: 10000 // 10 second timeout
            }
        );
        console.log('Reverse Geocode Response:', response.data);
        return response.data.display_name || 'Unknown Location';
    } catch (error) {
        console.error('Reverse geocoding failed:', error);
        throw new Error('Failed to get address from coordinates');
    }
};

const fetchPrayerTimesAPI = async (location?: Location, address?: string): Promise<PrayerTimes> => {
    try {
        const latitude = location ? location.latitude : 0; // Default to 0 if no location provided
        const longitude = location ? location.longitude : 0; // Default to 0 if no
        const date = new Date();
        const timestamp = Math.floor(date.getTime() / 1000);
        let response;
        if (location && !address) {
            response = await axios.get(
                `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}`,
                {
                    timeout: 10000 // 10 second timeout
                }
            );
        }
        else if (address) {
            response = await axios.get(
                `https://api.aladhan.com/v1/timingsByAddress?address=${encodeURIComponent(address)}&timestamp=${timestamp}`,
                {
                    timeout: 10000 // 10 second timeout
                }
            );
        } else {
            throw new Error('Either location or address must be provided');
        }

        console.log('Prayer API Response:', response.data);

        const times = response.data.data.timings;
        return {
            Fajr: times.Fajr,
            Dhuhr: times.Dhuhr,
            Asr: times.Asr,
            Maghrib: times.Maghrib,
            Isha: times.Isha
        };
    } catch (error) {
        console.error('Prayer times API failed:', error);
        throw new Error('Failed to fetch prayer times');
    }
};

export const usePrayerStore = create<PrayerState>()(
    persist(
        (set, get) => ({
            location: null,
            address: null,
            prayerTimes: null,
            loading: false,
            error: null,
            locationPermissionGranted: false,

            setLocation: (location: Location) => {
                set({ location, locationPermissionGranted: true });
                // Automatically fetch prayer times when location is set
                get().fetchPrayerTimes(location);
            },

            fetchAddress: async (location: Location) => {
                try {
                    set({ loading: true, error: null });
                    const { latitude, longitude } = location;

                    const address = await reverseGeocode(latitude, longitude);
                    set({ address });
                } catch (error) {
                    console.error('Address fetch failed:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to get address',
                        loading: false
                    });
                    throw error;
                }
            },

            fetchPrayerTimes: async (location: Location) => {
                try {
                    set({ loading: true, error: null });
                    // const { latitude, longitude } = location;


                    const prayerTimes = await fetchPrayerTimesAPI(location);
                    set({ prayerTimes, loading: false });
                } catch (error) {
                    console.error('Prayer times fetch failed:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch prayer times',
                        loading: false
                    });
                    throw error;
                }
            },

            fetchPrayerTimesByAddress: async (address: string) => {
                try {
                    set({ loading: true, error: null });


                    const prayerTimes = await fetchPrayerTimesAPI(undefined, address);

                    set({ prayerTimes, loading: false });
                } catch (error) {
                    console.error('Prayer times fetch failed:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch prayer times',
                        loading: false
                    });
                    throw error;
                }
            },

            // fetchPrayerTimesFromLocation: async (location: Location) => {
            //     set({ loading: true, error: null });

            //     try {
            //         const { latitude, longitude } = location;

            //         // 1. Fetch address (reverse geocoding)
            //         const address = await reverseGeocode(latitude, longitude);
            //         set({ address });

            //         // 2. Fetch prayer times
            //         const prayerTimes = await fetchPrayerTimesAPI(latitude, longitude);
            //         set({ prayerTimes, loading: false });

            //     } catch (error) {
            //         console.error('Failed to fetch location data:', error);
            //         const errorMessage = error instanceof Error
            //             ? error.message
            //             : 'Failed to fetch prayer times or location data. Please try again.';

            //         set({
            //             loading: false,
            //             error: errorMessage
            //         });
            //     }
            // },

            clearError: () => set({ error: null })
        }),
        {
            name: 'prayer-storage',
            partialize: (state) => ({
                prayerTimes: state.prayerTimes,
                address: state.address,
                location: state.location,
                locationPermissionGranted: state.locationPermissionGranted
            }),
        }
    )
);