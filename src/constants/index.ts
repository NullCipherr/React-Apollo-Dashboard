import type { EstadoNave } from '@/types';
import { EstadoMissao } from '@/types';

export const UPDATE_INTERVAL_MS = 50;

export const G_CONST = 6.67430e-11;
export const EARTH_MASS = 5.972e24; // kg
export const EARTH_RADIUS = 6371000; // meters
export const G0 = 9.80665; // Standard gravity for Isp calculation

// Rotational speed of Earth at Kennedy Space Center latitude (~28.5 deg N)
const EARTH_ROTATION_SPEED_KSC = 407.0; // m/s in the prograde direction (east)


export enum RocketStage {
    PRE_LAUNCH,
    S_IC,
    S_II,
    S_IVB_ORBIT,
    TRANS_LUNAR_INJECTION,
    CSM_TRANSIT,
    LUNAR_ORBIT,
    LANDING,
    LUNAR_SURFACE,
    ASCENT,
    EARTH_RETURN,
    RE_ENTRY,
    SPLASHDOWN,
}

export const SATURN_V_STAGES = {
    [RocketStage.S_IC]: {
        name: "S-IC (Stage 1)",
        motors: "5 x F-1",
        fuelType: "RP-1 + LOX",
        dryMass: 131000,
        fuelMass: 2200000,
        thrust: 34000000, // N
        burnTime: 168, // s
        isp: 264.6, // s (sea level) - Recalculated for consistency
    },
    [RocketStage.S_II]: {
        name: "S-II (Stage 2)",
        motors: "5 x J-2",
        fuelType: "LH2 + LOX",
        dryMass: 36000,
        fuelMass: 450000,
        thrust: 5000000, // N
        burnTime: 384, // s
        isp: 435.6, // s (vacuum) - Recalculated for consistency
    },
    [RocketStage.S_IVB_ORBIT]: {
        name: "S-IVB (Orbit Insertion)",
        motors: "1 x J-2",
        fuelType: "LH2 + LOX",
        dryMass: 10000,
        fuelMass: 109000,
        thrust: 1033100, // N
        burnTime: 147, // s for orbit insertion
        isp: 421, // s (vacuum)
    },
};

// FIX: Moved CSM_LM_MASS out of SATURN_V_STAGES to ensure the object has a consistent shape.
// This resolves type errors in App.tsx where stageData was inferred as `Stage | number`.
// Simplified Apollo spacecraft mass
export const CSM_LM_MASS = 45000;

const STAGE_1_FUEL = SATURN_V_STAGES[RocketStage.S_IC].fuelMass;
const STAGE_2_FUEL = SATURN_V_STAGES[RocketStage.S_II].fuelMass;
const STAGE_3_FUEL = SATURN_V_STAGES[RocketStage.S_IVB_ORBIT].fuelMass;
const TOTAL_LAUNCH_FUEL = STAGE_1_FUEL + STAGE_2_FUEL + STAGE_3_FUEL;

const INITIAL_TOTAL_MASS =
    SATURN_V_STAGES[RocketStage.S_IC].dryMass +
    SATURN_V_STAGES[RocketStage.S_II].dryMass +
    SATURN_V_STAGES[RocketStage.S_IVB_ORBIT].dryMass +
    CSM_LM_MASS +
    TOTAL_LAUNCH_FUEL;

export const INITIAL_SHIP_STATE: EstadoNave = {
    posicao: { x: 0.0, y: EARTH_RADIUS, z: 0.0 },
    velocidade: { x: EARTH_ROTATION_SPEED_KSC, y: 0.0, z: 0.0 },
    aceleracao: { x: 0.0, y: 0.0, z: 0.0 },
    orientacao: { x: 0.0, y: 0.0, z: 0.0 },

    estado_missao: EstadoMissao.PREPARACAO,
    tempo_missao: 0.0,
    stage: RocketStage.PRE_LAUNCH,
    total_mass: INITIAL_TOTAL_MASS,

    combustivel_principal: TOTAL_LAUNCH_FUEL,
    combustivel_rcs: 500.0,
    empuxo_principal: 0.0,
    empuxo_rcs: 0.0,

    energia_principal: 10000.0,
    energia_reserva: 5000.0,
    consumo_energia: 100.0,

    temperatura_interna: 22.0,
    pressao_interna: 101.3,
    radiacao: 0.1,

    comunicacao_ativa: true,
    forca_sinal: 100.0,

    sistema_ativo: true,
    emergencia: false,
    simulacao_acelerada: 1,
};

export const MISSION_STATE_NAMES: Record<EstadoMissao, string> = {
    [EstadoMissao.PREPARACAO]: "PREPARATION",
    [EstadoMissao.LANCAMENTO]: "LAUNCH",
    [EstadoMissao.ORBITA_TERRESTRE]: "EARTH ORBIT",
    [EstadoMissao.TRANSITO_LUNAR]: "LUNAR TRANSIT",
    [EstadoMissao.ORBITA_LUNAR]: "LUNAR ORBIT",
    [EstadoMissao.ALUNISSAGEM]: "LANDING",
    [EstadoMissao.SUPERFICIE_LUNAR]: "LUNAR SURFACE",
    [EstadoMissao.RETORNO_TERRA]: "EARTH RETURN",
    [EstadoMissao.REENTRADA]: "RE-ENTRY",
    [EstadoMissao.AMERISSAGEM]: "SPLASHDOWN",
    [EstadoMissao.FINALIZACAO]: "MISSION COMPLETE",
    [EstadoMissao.EMERGENCIA]: "EMERGENCY",
};

export const MISSION_PHASE_DURATIONS: Record<EstadoMissao, number> = {
    [EstadoMissao.PREPARACAO]: 10,
    // The rest are now event-driven or for post-launch phases
    [EstadoMissao.LANCAMENTO]: SATURN_V_STAGES[RocketStage.S_IC].burnTime + SATURN_V_STAGES[RocketStage.S_II].burnTime + SATURN_V_STAGES[RocketStage.S_IVB_ORBIT].burnTime,
    [EstadoMissao.ORBITA_TERRESTRE]: 300,
    [EstadoMissao.TRANSITO_LUNAR]: 600,
    [EstadoMissao.ORBITA_LUNAR]: 120,
    [EstadoMissao.ALUNISSAGEM]: 90,
    // FIX: Corrected typo from SUPERFICie_LUNAR to SUPERFICIE_LUNAR
    [EstadoMissao.SUPERFICIE_LUNAR]: 180,
    [EstadoMissao.RETORNO_TERRA]: 600,
    [EstadoMissao.REENTRADA]: 60,
    [EstadoMissao.AMERISSAGEM]: 30,
    [EstadoMissao.FINALIZACAO]: Infinity,
    [EstadoMissao.EMERGENCIA]: Infinity,
};

export const CUMULATIVE_MISSION_PHASE_DURATIONS: Record<EstadoMissao, number> = (() => {
    const cumulative: Record<number, number> = {};
    let total = 0;
    const stages = Object.values(EstadoMissao).filter(v => typeof v === 'number') as EstadoMissao[];
    
    for (const stage of stages) {
        if (MISSION_PHASE_DURATIONS[stage] !== undefined) {
            cumulative[stage] = total;
            if (isFinite(MISSION_PHASE_DURATIONS[stage])) {
                 total += MISSION_PHASE_DURATIONS[stage];
            }
        }
    }
    return cumulative as Record<EstadoMissao, number>;
})();


export const ROCKET_STAGE_NAMES: Record<RocketStage, string> = {
    [RocketStage.PRE_LAUNCH]: "Pre-Launch",
    [RocketStage.S_IC]: "S-IC (Stage 1)",
    [RocketStage.S_II]: "S-II (Stage 2)",
    [RocketStage.S_IVB_ORBIT]: "S-IVB (Orbit Burn)",
    [RocketStage.TRANS_LUNAR_INJECTION]: "Trans-Lunar Injection",
    [RocketStage.CSM_TRANSIT]: "CSM (Coasting)",
    [RocketStage.LUNAR_ORBIT]: "Lunar Orbit",
    [RocketStage.LANDING]: "Eagle Landing",
    [RocketStage.LUNAR_SURFACE]: "On the Moon",
    [RocketStage.ASCENT]: "Lunar Ascent",
    [RocketStage.EARTH_RETURN]: "Earth Return",
    [RocketStage.RE_ENTRY]: "Re-entry",
    [RocketStage.SPLASHDOWN]: "Splashdown",
};