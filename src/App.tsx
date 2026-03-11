import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { EstadoNave } from '@/types';
import { EstadoMissao } from '@/types';
import {
    INITIAL_SHIP_STATE,
    MISSION_STATE_NAMES,
    UPDATE_INTERVAL_MS,
    MISSION_PHASE_DURATIONS,
    SATURN_V_STAGES,
    RocketStage,
    G0,
    EARTH_MASS,
    G_CONST,
    EARTH_RADIUS
} from '@/constants';
import Dashboard from '@/components/Dashboard';
import ControlPanel from '@/components/ControlPanel';
import StatusBar from '@/components/StatusBar';

const App: React.FC = () => {
    const [shipState, setShipState] = useState<EstadoNave>(INITIAL_SHIP_STATE);
    const [isRunning, setIsRunning] = useState<boolean>(true);
    const loopCounterRef = useRef<number>(0);
    const missionTimerRef = useRef<number>(0);

    const acionarEmergencia = useCallback((motivo: string) => {
        setShipState(prevState => {
            if (prevState.estado_missao !== EstadoMissao.EMERGENCIA) {
                console.log(`*** EMERGENCIA: ${motivo} ***`);
                return {
                    ...prevState,
                    estado_missao: EstadoMissao.EMERGENCIA,
                    emergencia: true,
                    motivo_emergencia: motivo,
                };
            }
            return prevState;
        });
    }, []);
    
    // Manual state advancement for post-launch phases
    const avancarEstadoMissao = useCallback(() => {
        setShipState(prevState => {
            if (prevState.estado_missao === EstadoMissao.LANCAMENTO || prevState.estado_missao === EstadoMissao.FINALIZACAO || prevState.estado_missao === EstadoMissao.EMERGENCIA) {
                return prevState;
            }
            const nextState = prevState.estado_missao + 1;
            console.log(`Mudança de estado: ${MISSION_STATE_NAMES[prevState.estado_missao]} -> ${MISSION_STATE_NAMES[nextState]}`);
            
            if (nextState === EstadoMissao.FINALIZACAO) {
                setIsRunning(false);
            }

            return { ...prevState, estado_missao: nextState };
        });
    }, []);

    const simulationLoop = useCallback(() => {
        const delta_tempo_base_s = UPDATE_INTERVAL_MS / 1000.0;

        setShipState(prevState => {
            if (!prevState.sistema_ativo) {
                setIsRunning(false);
                return prevState;
            }

            let newState = { ...prevState };
            const sim_speed = newState.simulacao_acelerada;

            const updateTime = delta_tempo_base_s * sim_speed;
            missionTimerRef.current += updateTime;
            newState.tempo_missao = missionTimerRef.current;


            // --- Propulsion & Staging ---
            let thrust_accel = { x: 0, y: 0, z: 0 };
            
            if (newState.estado_missao === EstadoMissao.LANCAMENTO) {
                const missionTime = newState.tempo_missao - MISSION_PHASE_DURATIONS[EstadoMissao.PREPARACAO];
                
                // Determine current stage and handle staging events
                if (missionTime > 0 && newState.stage === RocketStage.PRE_LAUNCH) {
                    newState.stage = RocketStage.S_IC;
                } else if (missionTime > SATURN_V_STAGES[RocketStage.S_IC].burnTime && newState.stage === RocketStage.S_IC) {
                    newState.total_mass -= SATURN_V_STAGES[RocketStage.S_IC].dryMass; // Jettison S-IC
                    newState.stage = RocketStage.S_II;
                } else if (missionTime > (SATURN_V_STAGES[RocketStage.S_IC].burnTime + SATURN_V_STAGES[RocketStage.S_II].burnTime) && newState.stage === RocketStage.S_II) {
                    newState.total_mass -= SATURN_V_STAGES[RocketStage.S_II].dryMass; // Jettison S-II
                    newState.stage = RocketStage.S_IVB_ORBIT;
                } else if (missionTime > (SATURN_V_STAGES[RocketStage.S_IC].burnTime + SATURN_V_STAGES[RocketStage.S_II].burnTime + SATURN_V_STAGES[RocketStage.S_IVB_ORBIT].burnTime) && newState.stage === RocketStage.S_IVB_ORBIT) {
                     newState.total_mass -= SATURN_V_STAGES[RocketStage.S_IVB_ORBIT].dryMass; // Jettison S-IVB
                     newState.stage = RocketStage.CSM_TRANSIT;
                     newState.empuxo_principal = 0;
                }
                
                const stageWithThrust = [RocketStage.S_IC, RocketStage.S_II, RocketStage.S_IVB_ORBIT].includes(newState.stage);

                if (stageWithThrust) {
                    const stageData = SATURN_V_STAGES[newState.stage as keyof typeof SATURN_V_STAGES];
                    const massFlowRate = stageData.thrust / (stageData.isp * G0);
                    
                    const fuelConsumed = massFlowRate * updateTime;
                    newState.combustivel_principal -= fuelConsumed;
                    newState.total_mass -= fuelConsumed;
                    newState.empuxo_principal = stageData.thrust;

                    const thrust_accel_magnitude = newState.total_mass > 0 ? newState.empuxo_principal / newState.total_mass : 0;
                    
                    // A more gradual pitch-over maneuver. A real gravity turn is more complex,
                    // but this is a better approximation than a very fast turn.
                    const pitch_duration = 500.0; // Time to complete 90-degree pitch
                    const pitch_progress = Math.min(missionTime, pitch_duration) / pitch_duration;
                    const pitch_angle_rad = pitch_progress * (Math.PI / 2);

                    thrust_accel.y = Math.cos(pitch_angle_rad) * thrust_accel_magnitude;
                    thrust_accel.x = Math.sin(pitch_angle_rad) * thrust_accel_magnitude;
                } else {
                    newState.empuxo_principal = 0;
                }

            } else { // Handle other mission phases (simplified)
                newState.empuxo_principal = 0;
                newState.empuxo_rcs = 0;
            }
             if (newState.combustivel_principal < 0) newState.combustivel_principal = 0;

            // --- Physics & Flight Control ---
            // Gravitational acceleration
            const pos = newState.posicao;
            const dist_sq = pos.x ** 2 + pos.y ** 2 + pos.z ** 2;
            const dist = Math.sqrt(dist_sq);

            let grav_accel = { x: 0, y: 0, z: 0 };
            if (dist > 0) {
                const grav_mag = G_CONST * EARTH_MASS / dist_sq;
                grav_accel.x = -pos.x / dist * grav_mag;
                grav_accel.y = -pos.y / dist * grav_mag;
                grav_accel.z = -pos.z / dist * grav_mag;
            }

            const total_accel = {
                x: thrust_accel.x + grav_accel.x,
                y: thrust_accel.y + grav_accel.y,
                z: thrust_accel.z + grav_accel.z,
            };
            newState.aceleracao = total_accel;

            newState.velocidade.x += total_accel.x * updateTime;
            newState.velocidade.y += total_accel.y * updateTime;
            newState.velocidade.z += total_accel.z * updateTime;

            newState.posicao.x += newState.velocidade.x * updateTime;
            newState.posicao.y += newState.velocidade.y * updateTime;
            newState.posicao.z += newState.velocidade.z * updateTime;
            
            // --- Mission State Logic ---
            if (newState.estado_missao === EstadoMissao.PREPARACAO && newState.tempo_missao >= MISSION_PHASE_DURATIONS[EstadoMissao.PREPARACAO]) {
                newState.estado_missao = EstadoMissao.LANCAMENTO;
            }
            if (newState.estado_missao === EstadoMissao.LANCAMENTO && newState.stage === RocketStage.CSM_TRANSIT) {
                // Check for orbit
                const altitude = dist - EARTH_RADIUS;
                const totalVelocity = Math.sqrt(newState.velocidade.x**2 + newState.velocidade.y**2 + newState.velocidade.z**2);
                if (altitude > 180000 && totalVelocity > 7700) { // 180km altitude, ~7.7km/s velocity for LEO
                    newState.estado_missao = EstadoMissao.ORBITA_TERRESTRE;
                }
            }
            
            // Safety checks
            if (newState.temperatura_interna > 50.0) acionarEmergencia("Temperatura interna crítica");
            if (newState.energia_reserva <= 0) acionarEmergencia("Energia esgotada");


            // --- Energy & Environment Control (run less frequently) ---
            loopCounterRef.current++;
            if (loopCounterRef.current % 4 === 0) {
                const delta_t_energia = updateTime * 4;
                
                const consumo_base = 80.0;
                const consumo_propulsao = newState.empuxo_principal > 0 ? 50.0 : 0.0;
                newState.consumo_energia = consumo_base + consumo_propulsao + 30.0 + 40.0;

                const energia_consumida = newState.consumo_energia * delta_t_energia / 3600.0;
                newState.energia_principal -= energia_consumida;

                if (newState.energia_principal <= 0) {
                    newState.energia_reserva += newState.energia_principal;
                    newState.energia_principal = 0;
                }

                const variacao_temp = (Math.random() - 0.5) / 2.5;
                newState.temperatura_interna += variacao_temp;
            }
            
            return newState;
        });
    }, [acionarEmergencia]);

    useEffect(() => {
        if (!isRunning) return;
        const intervalId = setInterval(simulationLoop, UPDATE_INTERVAL_MS);
        return () => clearInterval(intervalId);
    }, [isRunning, simulationLoop]);

    const handleToggleSimulation = () => setIsRunning(!isRunning);

    const handleAccelerate = () => {
        setShipState(prev => ({ ...prev, simulacao_acelerada: Math.min(prev.simulacao_acelerada * 2, 128) }));
    };

    const handleDecelerate = () => {
        setShipState(prev => ({ ...prev, simulacao_acelerada: Math.max(prev.simulacao_acelerada / 2, 1) }));
    };
    
    const handleReset = () => {
        setIsRunning(false);
        missionTimerRef.current = 0;
        setShipState(INITIAL_SHIP_STATE);
        loopCounterRef.current = 0;
        setTimeout(() => setIsRunning(true), 100);
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-mono p-4 flex flex-col">
            <header className="text-center mb-4">
                <h1 className="text-2xl md:text-4xl font-bold text-cyan-400 tracking-widest">
                    APOLLO 11 INTERACTIVE SIMULATOR
                </h1>
                <p className="text-sm text-gray-500">Mission Control Dashboard</p>
            </header>

            <main className="flex-grow flex flex-col">
                <StatusBar state={shipState} />
                <Dashboard state={shipState} />
            </main>
            
            <ControlPanel
                isRunning={isRunning}
                isLaunchSequenceActive={shipState.estado_missao === EstadoMissao.LANCAMENTO}
                onToggle={handleToggleSimulation}
                onAccelerate={handleAccelerate}
                onDecelerate={handleDecelerate}
                onNextState={avancarEstadoMissao}
                onEmergency={() => acionarEmergencia("Comando Manual")}
                onReset={handleReset}
            />
        </div>
    );
};

export default App;