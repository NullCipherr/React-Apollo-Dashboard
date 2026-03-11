
import React from 'react';

interface DataCardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const DataCard: React.FC<DataCardProps> = ({ title, icon, children }) => {
    return (
        <div className="bg-gray-800/60 backdrop-blur-sm p-4 rounded-lg border border-gray-700 h-full flex flex-col">
            <div className="flex items-center mb-2">
                <div className="text-cyan-400 mr-2">{icon}</div>
                <h3 className="font-bold text-md text-gray-300 tracking-wider">{title}</h3>
            </div>
            <div className="flex-grow space-y-1">
                {children}
            </div>
        </div>
    );
};

export default DataCard;
