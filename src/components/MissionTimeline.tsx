import React from 'react';
import { EstadoMissao } from '@/types';
import { MISSION_STATE_NAMES, MISSION_PHASE_DURATIONS, CUMULATIVE_MISSION_PHASE_DURATIONS } from '@/constants';
import DataCard from '@/components/DataCard';
import { ListChecksIcon, CheckCircle2, CircleDot, CircleIcon } from '@/components/Icons';

interface MissionTimelineProps {
    currentStage: EstadoMissao;
    missionTime: number;
}

const formatDuration = (totalSeconds: number): string => {
    if (!isFinite(totalSeconds) || totalSeconds < 0) return "--:--";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};


const MissionTimeline: React.FC<MissionTimelineProps> = ({ currentStage, missionTime }) => {
    // Filter out states that aren't part of the main mission sequence for the timeline view
    const stages = Object.values(EstadoMissao)
        .filter(v => typeof v === 'number' && v !== EstadoMissao.EMERGENCIA && v !== EstadoMissao.FINALIZACAO) as EstadoMissao[];

    return (
        <DataCard title="Mission Timeline" icon={<ListChecksIcon />}>
            <div className="flex flex-col space-y-1 overflow-y-auto h-full pr-2">
                {stages.map((stage) => {
                    const isCompleted = stage < currentStage;
                    const isCurrent = stage === currentStage;

                    let IconComponent = CircleIcon;
                    let iconClass = 'text-gray-600';
                    let textClass = 'text-gray-500';

                    if (isCompleted) {
                        IconComponent = CheckCircle2;
                        iconClass = 'text-green-500';
                        textClass = 'text-gray-400 line-through';
                    } else if (isCurrent) {
                        IconComponent = CircleDot;
                        iconClass = 'text-cyan-400 animate-pulse';
                        textClass = 'font-bold text-cyan-300';
                    }
                    
                    const stageTotalDuration = MISSION_PHASE_DURATIONS[stage];
                    const stageStartTime = CUMULATIVE_MISSION_PHASE_DURATIONS[stage];
                    const stageElapsedTime = missionTime - stageStartTime;

                    return (
                        <div key={stage} className="flex items-center text-sm transition-colors duration-300">
                            <IconComponent className={`w-4 h-4 mr-2 flex-shrink-0 ${iconClass}`} />
                            <span className={textClass}>{MISSION_STATE_NAMES[stage]}</span>
                            <div className="ml-auto text-xs font-mono pl-2">
                                {isCurrent ? (
                                    <span className="text-cyan-300 font-semibold">
                                        {formatDuration(stageElapsedTime)} / {formatDuration(stageTotalDuration)}
                                    </span>
                                ) : (
                                    <span className={isCompleted ? 'text-gray-400' : 'text-gray-500'}>
                                       {formatDuration(stageTotalDuration)}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </DataCard>
    );
};

export default MissionTimeline;