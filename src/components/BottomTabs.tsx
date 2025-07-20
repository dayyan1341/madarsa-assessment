import { BookIcon, GridFourIcon, HouseSimpleIcon, ListHeartIcon, MosqueIcon } from '@phosphor-icons/react/dist/ssr';
import { useState } from 'react';
import moreIcon from '../assets/More.png';
const BottomTabs = () => {
    const [activeTab, setActiveTab] = useState('Home');

    const tabs = [
        { id: 'Home', label: 'Home', icon: HouseSimpleIcon },
        { id: 'Quran', label: 'Quran', icon: BookIcon },
        { id: 'Apps', label: '', src: moreIcon, icon: GridFourIcon },
        { id: 'Maktab', label: 'Maktab', icon: MosqueIcon },
        { id: 'Dua', label: 'Dua', icon: ListHeartIcon },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
            <div className="flex justify-around items-center">
                {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    const isActive = activeTab === tab.id;
                    const isMiddle = tab.id === 'Apps';

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-center p-2 ${isMiddle ? 'relative' : ''}`}
                        >
                            {isMiddle ? (
                                <div className=" rounded-full -mt-3 shadow-lg">
                                    <img
                                        src={tab.src}
                                        alt="More"
                                        // size={24}
                                        className="text-white min-w-8"
                                    />
                                </div>
                            ) : (
                                <>
                                    <IconComponent
                                        // size={24}
                                        className={isActive ? 'text-purple-500' : 'text-gray-400'}
                                    />
                                    <span
                                        className={`text-xs mt-1 ${isActive ? 'text-purple-500' : 'text-gray-400'
                                            }`}
                                    >
                                        {tab.label}
                                    </span>
                                </>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomTabs;