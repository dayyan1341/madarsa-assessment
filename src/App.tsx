
import './App.css'
import BottomTabs from './components/BottomTabs'
import Navbar from './components/Navbar'
import { PrayerCard } from './components/PrayerCard'

function App() {

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <Navbar />

      <div className='grow w-full max-w-4xl p-4'>

        <PrayerCard title='Isha' />
      </div>
      <BottomTabs />
    </div>
  )
}

export default App
