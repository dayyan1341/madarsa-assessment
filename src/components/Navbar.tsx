import { MapPinIcon } from '@phosphor-icons/react/dist/ssr';
import logo from '../assets/logo.png';

const Navbar = () => {
    return (
        <nav className="sticky min-w-full top-0 left-0 right-0 bg-white border-b border-gray-200 shadow px-4 py-2 flex justify-between ">
            {/* Logo */}
            <div className="flex items-center">
                <img src={logo} alt="Logo" className="h-8 w-16 mr-2" />
            </div>

            {/* Location */}
            <div className="flex items-center space-x-1 text-gray-600">
                <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">Select location</div>
                    <div className="text-xs text-blue-500 flex items-center gap-0.5"> <MapPinIcon weight='fill' className='inline' />  Get accurate namaz time</div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;