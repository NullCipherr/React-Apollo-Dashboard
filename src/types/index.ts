import { RocketStage } from '@/constants';

export enum EstadoMissao {
    PREPARACAO,
    LANCAMENTO,
    ORBITA_TERRESTRE,
    TRANSITO_LUNAR,
    ORBITA_LUNAR,
    ALUNISSAGEM,
    SUPERFICIE_LUNAR,
    RETORNO_TERRA,
    REENTRADA,
    AMERISSAGEM,
    FINALIZACAO,
    EMERGENCIA
}

export interface Vetor3D {
    x: number;
    y: number;
    z: number;
}

export interface EstadoNave {
    // Posição e movimento
    posicao: Vetor3D;
    velocidade: Vetor3D;
    aceleracao: Vetor3D;
    orientacao: Vetor3D;

    // Estado da missão
    estado_missao: EstadoMissao;
    tempo_missao: number; // em segundos
    stage: RocketStage;
    total_mass: number; // kg

    // Propulsão
    combustivel_principal: number; // kg
    combustivel_rcs: number; // kg
    empuxo_principal: number; // N
    empuxo_rcs: number; // N

    // Energia
    energia_principal: number; // Wh
    energia_reserva: number; // Wh
    consumo_energia: number; // W

    // Ambiente
    temperatura_interna: number; // C
    pressao_interna: number; // kPa
    radiacao: number; // mSv/h

    // Comunicação
    comunicacao_ativa: boolean;
    forca_sinal: number; // dB

    // Flags de controle
    sistema_ativo: boolean;
    emergencia: boolean;
    motivo_emergencia?: string;
    simulacao_acelerada: number;
}