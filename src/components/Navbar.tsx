import { MapPinIcon } from '@phosphor-icons/react/dist/ssr';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { usePrayerStore } from '../store/prayerStore';

const Navbar = () => {
    const {
        address,
        locationPermissionGranted,
        setLocation,
        loading,
        clearError
    } = usePrayerStore();

    const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');

    useEffect(() => {
        if (!address && !locationPermissionGranted) {
            requestLocation();
        } else if (address) {
            setLocationStatus('granted');

        }
    }, [])


    useEffect(() => {
        if (locationPermissionGranted && address) {
            setLocationStatus('granted');
        }
    }, [locationPermissionGranted, address]);

    const requestLocation = () => {

        clearError();

        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        setLocationStatus('requesting');


        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log('Location obtained:', { latitude, longitude });

                setLocation({ latitude, longitude });
                setLocationStatus('granted');
            },
            (error) => {
                console.error('Geolocation error:', error);
                setLocationStatus('denied');

                let errorMessage = 'Unable to retrieve your location. ';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Location access was denied. Please enable location services and try again.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable. Please check your GPS and try again.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out. Please try again.';
                        break;
                    default:
                        errorMessage += 'An unknown error occurred. Please try again.';
                        break;
                }
                alert(errorMessage);
            },

        );
    };

    const getLocationText = () => {
        if (loading) return 'Getting location...';
        if (locationStatus === 'requesting') return 'Requesting location...';
        if (address) {
            const maxLength = window.innerWidth < 768 ? 25 : 40;
            return address.length > maxLength ? `${address.substring(0, maxLength)}...` : address;
        }
        if (locationStatus === 'denied') return 'Location access denied';
        return 'Select location';
    };

    const getSubText = () => {
        if (loading) return 'Please wait...';
        if (locationStatus === 'requesting') return 'Please allow location access';
        if (address) return 'Accurate namaz times';
        return 'Get accurate namaz time';
    };

    return (
        <nav className="sticky min-w-full top-0 left-0 right-0 bg-white border-b border-gray-200 shadow px-4 py-2 flex justify-between z-50">

            <div className="flex items-center">
                <img src={logo} alt="Logo" className="h-8 w-16 mr-2" />
            </div>


            <div
                className="flex items-center space-x-1 text-gray-600 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={requestLocation}
            >
                <div className="text-right">
                    <div className={`text-sm font-bold ${address ? 'text-green-700' : 'text-gray-900'} max-w-xs truncate`}>
                        {getLocationText()}
                    </div>
                    <div className={`text-xs flex items-center gap-0.5 ${address ? 'text-green-600' : 'text-blue-500'}`}>
                        <MapPinIcon
                            weight='fill'
                            className={`inline ${loading || locationStatus === 'requesting' ? 'animate-pulse' : ''}`}
                        />
                        {getSubText()}
                    </div>
                </div>
            </div>


        </nav>
    );
};

export default Navbar;