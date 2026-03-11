import React from 'react';
import { PlayIcon, PauseIcon, FastForwardIcon, RewindIcon, ForwardIcon, AlertTriangleIcon, RefreshCwIcon } from '@/components/Icons';

interface ControlPanelProps {
    isRunning: boolean;
    isLaunchSequenceActive: boolean;
    onToggle: () => void;
    onAccelerate: () => void;
    onDecelerate: () => void;
    onNextState: () => void;
    onEmergency: () => void;
    onReset: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ isRunning, isLaunchSequenceActive, onToggle, onAccelerate, onDecelerate, onNextState, onEmergency, onReset }) => {
    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 p-2 rounded-t-lg sticky bottom-0">
            <div className="flex items-center justify-center space-x-2 flex-wrap">
                <ControlButton onClick={onDecelerate} label="Decelerate"><RewindIcon /></ControlButton>
                <ControlButton onClick={onToggle} label={isRunning ? 'Pause' : 'Play'}>
                    {isRunning ? <PauseIcon /> : <PlayIcon />}
                </ControlButton>
                <ControlButton onClick={onAccelerate} label="Accelerate"><FastForwardIcon /></ControlButton>
                <ControlButton 
                    onClick={onNextState} 
                    label="Next State" 
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 disabled:text-gray-500"
                    disabled={isLaunchSequenceActive}
                >
                    <ForwardIcon />
                </ControlButton>
                <ControlButton onClick={onEmergency} label="Emergency" className="bg-red-600 hover:bg-red-500"><AlertTriangleIcon /></ControlButton>
                <ControlButton onClick={onReset} label="Reset Sim" className="bg-yellow-600 hover:bg-yellow-500"><RefreshCwIcon /></ControlButton>
            </div>
        </div>
    );
};

const ControlButton: React.FC<{ onClick: () => void; label: string; className?: string; children: React.ReactNode, disabled?: boolean }> = ({ onClick, label, className = 'bg-gray-600 hover:bg-gray-500', children, disabled = false }) => (
    <button
        onClick={onClick}
        aria-label={label}
        title={label}
        disabled={disabled}
        className={`p-3 rounded-full text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${className}`}
    >
        {children}
    </button>
);

export default ControlPanel;