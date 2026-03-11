import React from 'react';
import type { EstadoNave } from '@/types';
import { INITIAL_SHIP_STATE, ROCKET_STAGE_NAMES, SATURN_V_STAGES, RocketStage, G0, EARTH_RADIUS } from '@/constants';
import DataCard from '@/components/DataCard';
import ProgressBar from '@/components/ProgressBar';
import { RocketIcon, ZapIcon, ThermometerIcon, WifiIcon, GlobeIcon } from '@/components/Icons';
import MissionTimeline from '@/components/MissionTimeline';
import OrbitDisplay from '@/components/OrbitDisplay';

interface DashboardProps {
    state: EstadoNave;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
    const totalVelocity = Math.sqrt(
        Math.pow(state.velocidade.x, 2) +
        Math.pow(state.velocidade.y, 2) +
        Math.pow(state.velocidade.z, 2)
    );
    
    const altitude = Math.sqrt(state.posicao.x ** 2 + state.posicao.y ** 2 + state.posicao.z ** 2) - EARTH_RADIUS;


    const currentStageKey = state.stage;
    const isLaunchStageActive = [RocketStage.S_IC, RocketStage.S_II, RocketStage.S_IVB_ORBIT].includes(currentStageKey);
    const stageData = isLaunchStageActive ? SATURN_V_STAGES[currentStageKey as keyof typeof SATURN_V_STAGES] : null;

    // Calculate real-time consumption for debugging
    const realTimeConsumption = stageData ? (stageData.thrust / (stageData.isp * G0)) : 0;


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4 flex-grow">
            <DataCard title="Orbital Status" icon={<GlobeIcon />}>
                <OrbitDisplay altitude={altitude} velocity={totalVelocity} />
            </DataCard>

            <DataCard title="Propulsion" icon={<RocketIcon />}>
                <DataItem label="Stage" value={ROCKET_STAGE_NAMES[state.stage]} />
                <DataItem label="Main Thrust" value={`${(state.empuxo_principal / 1000000).toFixed(2)} MN`} />
                 <DataItem 
                    label="RT Consumption" 
                    value={`${realTimeConsumption.toLocaleString(undefined, {maximumFractionDigits: 0})} kg/s`} 
                    className="text-yellow-400"
                />
                <DataItem label="RCS Thrust" value={`${state.empuxo_rcs.toFixed(2)} N`} />
                
                {stageData && (
                    <div className="mt-3 pt-2 border-t border-gray-700/50 text-xs space-y-1">
                        <h4 className="text-gray-400 font-bold tracking-wider pb-1">Active Stage Details</h4>
                        <DataItem label="Motors" value={stageData.motors} />
                        <DataItem label="Fuel" value={stageData.fuelType} />
                        <DataItem label="Est. Burn Time" value={`${stageData.burnTime} s`} />
                    </div>
                )}

                <div className="mt-2">
                    <ProgressBar label="Main Fuel" value={state.combustivel_principal} max={INITIAL_SHIP_STATE.combustivel_principal} unit="kg" />
                    <ProgressBar label="RCS Fuel" value={state.combustivel_rcs} max={500.0} unit="kg" />
                </div>
            </DataCard>

            <DataCard title="Energy" icon={<ZapIcon />}>
                <DataItem label="Consumption" value={`${state.consumo_energia.toFixed(2)} W`} />
                <div className="mt-2">
                    <ProgressBar label="Main Power" value={state.energia_principal} max={10000.0} unit="Wh" color="bg-green-500" />
                    <ProgressBar label="Reserve Power" value={state.energia_reserva} max={5000.0} unit="Wh" color="bg-yellow-500" />
                </div>
            </DataCard>

            <DataCard title="Environment" icon={<ThermometerIcon />}>
                <DataItem label="Internal Temp." value={`${state.temperatura_interna.toFixed(1)} °C`} />
                <DataItem label="Internal Pressure" value={`${state.pressao_interna.toFixed(1)} kPa`} />
                <DataItem label="Radiation" value={`${state.radiacao.toFixed(2)} mSv/h`} />
            </DataCard>

            <DataCard title="Communication" icon={<WifiIcon />}>
                 <DataItem label="Status" value={state.comunicacao_ativa ? 'ACTIVE' : 'INACTIVE'} className={state.comunicacao_ativa ? 'text-green-400' : 'text-red-400'} />
                 <DataItem label="Signal Strength" value={`${state.forca_sinal.toFixed(1)} dB`} />
            </DataCard>

            <MissionTimeline currentStage={state.estado_missao} missionTime={state.tempo_missao} />
        </div>
    );
};

const DataItem: React.FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className }) => (
    <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}:</span>
        <span className={`font-semibold ${className || 'text-cyan-300'}`}>{value}</span>
    </div>
);


export default Dashboard;