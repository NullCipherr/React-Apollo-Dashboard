
import React from 'react';
import type { EstadoNave } from '@/types';
import { EstadoMissao } from '@/types';
import { MISSION_STATE_NAMES } from '@/constants';

interface StatusBarProps {
    state: EstadoNave;
}

const StatusBar: React.FC<StatusBarProps> = ({ state }) => {
    const missionTimeHours = state.tempo_missao / 3600;
    const missionStateName = MISSION_STATE_NAMES[state.estado_missao];

    let statusColorClass = 'bg-blue-600 text-blue-100';
    if (state.estado_missao === EstadoMissao.EMERGENCIA) {
        statusColorClass = 'bg-red-600 text-red-100 animate-pulse';
    } else if (state.estado_missao === EstadoMissao.FINALIZACAO) {
        statusColorClass = 'bg-green-600 text-green-100';
    }

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 text-center">
            <div className="w-full md:w-1/3">
                <span className="text-sm text-gray-400">Mission Time: </span>
                <span className="font-bold text-lg text-white">{missionTimeHours.toFixed(2)} hours</span>
            </div>
            <div className={`w-full md:w-1/3 px-4 py-2 rounded-md ${statusColorClass} transition-colors`}>
                <span className="text-sm">STATUS: </span>
                <span className="font-bold text-lg tracking-widest">{missionStateName}</span>
                {state.estado_missao === EstadoMissao.EMERGENCIA && (
                    <span className="block text-xs">({state.motivo_emergencia})</span>
                )}
            </div>
            <div className="w-full md:w-1/3">
                <span className="text-sm text-gray-400">Simulation Speed: </span>
                <span className="font-bold text-lg text-white">{state.simulacao_acelerada}x</span>
            </div>
        </div>
    );
};

export default StatusBar;
