import './App.css';
import BottomTabs from './components/BottomTabs';
import Navbar from './components/Navbar';
import { PrayerCard } from './components/PrayerCard';
import { usePrayerStore } from './store/prayerStore';

function App() {
  const { prayerTimes, loading, error, locationPermissionGranted } = usePrayerStore();

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <Navbar />

      <div className='grow w-full max-w-4xl p-4'>
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
            <p>Loading prayer times for your location...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Please try again or check your internet connection</p>
          </div>
        )}

        {!locationPermissionGranted && !loading && !error && (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Please allow location access to get accurate prayer times</p>
            <p className="text-sm text-gray-500">Click on "Select location" in the top right corner</p>
          </div>
        )}


        {prayerTimes && <PrayerCard />}
      </div>

      <BottomTabs />
    </div>
  );
}

export default App;
