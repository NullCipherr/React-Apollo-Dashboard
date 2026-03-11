import React from 'react';

interface OrbitDisplayProps {
    altitude: number; // in meters
    velocity: number; // in m/s
}

const SVG_WIDTH = 300;
const SVG_HEIGHT = 180;
const CX = SVG_WIDTH / 2;
const CY = SVG_HEIGHT + 100; // Position earth's center below the viewbox
const EARTH_RADIUS_PX = 120;
const MAX_ALTITUDE_KM = 40000; // A bit beyond GEO for scale

const ORBITAL_LAYERS = [
    { name: 'Atmosphere', alt_km: 100, color: '#3b82f6' }, // blue-500
    { name: 'LEO', alt_km: 2000, color: '#22c55e' }, // green-500
    { name: 'MEO', alt_km: 20000, color: '#eab308' }, // yellow-500
    { name: 'GEO', alt_km: 35786, color: '#ef4444' }, // red-500
];

// Use a logarithmic scale for better visualization of vast distances
const altitudeToY = (alt_km: number): number => {
    if (alt_km <= 0) return CY - EARTH_RADIUS_PX;
    const logAlt = Math.log10(alt_km + 1);
    const logMaxAlt = Math.log10(MAX_ALTITUDE_KM + 1);
    const scale = (SVG_HEIGHT - 10) / logMaxAlt;
    const y_pos = (CY - EARTH_RADIUS_PX) - logAlt * scale;
    return Math.max(5, y_pos); // Clamp to top of view
};


const OrbitDisplay: React.FC<OrbitDisplayProps> = ({ altitude, velocity }) => {
    const altitudeKm = altitude / 1000;
    const shipY = altitudeToY(altitudeKm);

    return (
        <div className="flex flex-col h-full">
            <div className="relative w-full flex-grow">
                <svg width="100%" height="100%" viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
                    {/* Earth */}
                    <defs>
                        <radialGradient id="earthGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                            <stop offset="0%" style={{ stopColor: '#60a5fa' }} />
                            <stop offset="100%" style={{ stopColor: '#1e3a8a' }} />
                        </radialGradient>
                    </defs>
                    <circle cx={CX} cy={CY} r={EARTH_RADIUS_PX} fill="url(#earthGradient)" />
                    <text x={CX} y={SVG_HEIGHT - 5} textAnchor="middle" fill="#bfdbfe" fontSize="10">Earth (Surface)</text>

                    {/* Orbital Layers */}
                    {ORBITAL_LAYERS.map(layer => {
                        const y = altitudeToY(layer.alt_km);
                        const radius = CY - y;
                        return (
                            <g key={layer.name}>
                                <circle cx={CX} cy={CY} r={radius} fill="none" stroke={layer.color} strokeWidth="1" strokeDasharray="4 2" opacity="0.6" />
                                <text x={CX + radius + 5} y={y + 3} fill={layer.color} fontSize="8">{layer.name}</text>
                                <text x={CX - radius - 5} y={y + 3} fill={layer.color} fontSize="8" textAnchor="end">{layer.alt_km.toLocaleString()} km</text>
                            </g>
                        );
                    })}
                    
                    {/* Ship */}
                    <g>
                       <line x1={0} y1={shipY} x2={SVG_WIDTH} y2={shipY} stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="2 2" />
                       <circle cx={CX} cy={shipY} r="3" fill="#06b6d4" stroke="white" strokeWidth="1" />
                       <text x={CX + 8} y={shipY + 3} fill="white" fontSize="9" className="font-bold">{`${altitudeKm.toFixed(0)} km`}</text>
                    </g>
                </svg>
            </div>
            <div className="border-t border-gray-700/50 pt-2 mt-2 space-y-1">
                 <DataItem label="Altitude" value={`${(altitude / 1000).toFixed(2)} km`} />
                 <DataItem label="Velocity" value={`${velocity.toFixed(2)} m/s`} />
            </div>
        </div>
    );
};

const DataItem: React.FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className }) => (
    <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}:</span>
        <span className={`font-semibold ${className || 'text-cyan-300'}`}>{value}</span>
    </div>
);

export default OrbitDisplay;