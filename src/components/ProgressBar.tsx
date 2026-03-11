
import React from 'react';

interface ProgressBarProps {
    value: number;
    max: number;
    label: string;
    unit: string;
    color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, label, unit, color = 'bg-cyan-500' }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    const displayValue = value.toLocaleString(undefined, { maximumFractionDigits: 0 });

    return (
        <div className="w-full my-2">
            <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-gray-400">{label}</span>
                <span className="font-semibold text-gray-300">{displayValue} {unit} ({percentage.toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                    className={`${color} h-2.5 rounded-full transition-all duration-300 ease-in-out`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;
