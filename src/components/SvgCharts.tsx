'use client';

import React from 'react';

// --- 1. Success Probability Gauge (Circular Ring) ---
interface SuccessGaugeProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  showDetails?: boolean;
}

export const SuccessGauge: React.FC<SuccessGaugeProps> = ({
  value,
  size = 130,
  strokeWidth = 10,
  showDetails = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  let label = 'Stable';
  let textColor = 'text-zinc-400';

  if (value < 40) {
    label = 'Critical';
    textColor = 'text-mos-coral';
  } else if (value < 70) {
    label = 'At Risk';
    textColor = 'text-mos-amber';
  } else if (value >= 85) {
    label = 'Optimal';
    textColor = 'text-mos-emerald';
  }

  return (
    <div className="flex flex-col items-center justify-center select-none font-sans">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          {/* Track */}
          <circle
            className="stroke-zinc-900"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress */}
          <circle
            className="stroke-mos-blue transition-all duration-1000 ease-out"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-white font-mono tracking-tighter">
            {value}%
          </span>
          {showDetails && (
            <span className={`text-[8px] uppercase font-bold tracking-widest font-mono ${textColor} mt-0.5`}>
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// --- 2. Burnout Risk Area Line Chart ---
interface BurnoutChartProps {
  data?: number[];
  labels?: string[];
  height?: number;
}

export const BurnoutChart: React.FC<BurnoutChartProps> = ({
  data = [30, 45, 65, 78, 55, 40, 30],
  labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  height = 130,
}) => {
  const maxVal = 100;
  const padding = 15;
  const chartHeight = height - padding * 2;
  const width = 280;
  
  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
    const y = padding + chartHeight - (val / maxVal) * chartHeight;
    return { x, y, val };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
        {/* Grids */}
        {[25, 50, 75, 100].map((gl) => {
          const y = padding + chartHeight - (gl / maxVal) * chartHeight;
          return (
            <line
              key={gl}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              className="stroke-zinc-900/60"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
          );
        })}

        {/* Path Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#a855f7"
          strokeWidth="2"
          className="transition-all duration-1000 ease-out"
        />

        {/* Points */}
        {points.map((p, idx) => (
          <g key={idx}>
            <circle
              cx={p.x}
              cy={p.y}
              r="3"
              className="fill-mos-purple stroke-zinc-950"
              strokeWidth="1"
            />
            <text
              x={p.x}
              y={height - 2}
              className="text-[7px] fill-zinc-600 font-mono"
              textAnchor="middle"
            >
              {labels[idx]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// --- 3. Workload Threat Radar (Spider Chart) ---
interface WorkloadRadarProps {
  metrics?: {
    label: string;
    value: number; // 0 to 10
  }[];
  size?: number;
}

export const WorkloadRadar: React.FC<WorkloadRadarProps> = ({
  metrics = [
    { label: 'Workload', value: 8 },
    { label: 'Collisions', value: 6 },
    { label: 'Complexity', value: 7 },
    { label: 'Stress Index', value: 9 },
    { label: 'Buffer Margin', value: 3 },
  ],
  size = 150,
}) => {
  const center = size / 2;
  const radius = size * 0.35;
  const totalAxes = metrics.length;

  const getCoordinates = (index: number, val: number) => {
    const angle = (Math.PI * 2 * index) / totalAxes - Math.PI / 2;
    const distance = (val / 10) * radius;
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle),
    };
  };

  const gridPath = Array.from({ length: totalAxes }).map((_, idx) => {
    const coords = getCoordinates(idx, 10);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  const midPath = Array.from({ length: totalAxes }).map((_, idx) => {
    const coords = getCoordinates(idx, 5);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  const valuePoints = metrics.map((m, idx) => getCoordinates(idx, m.value));
  const valuePath = valuePoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex justify-center items-center select-none">
      <svg width={size} height={size} className="overflow-visible">
        <polygon points={gridPath} className="fill-transparent stroke-zinc-800" strokeWidth="1" />
        <polygon points={midPath} className="fill-transparent stroke-zinc-800/50" strokeWidth="0.5" strokeDasharray="1,1" />

        {Array.from({ length: totalAxes }).map((_, idx) => {
          const coords = getCoordinates(idx, 10);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={coords.x}
              y2={coords.y}
              className="stroke-zinc-800"
              strokeWidth="0.5"
            />
          );
        })}

        <polygon
          points={valuePath}
          className="fill-blue-500/10 stroke-mos-blue"
          strokeWidth="1.5"
        />

        {metrics.map((m, idx) => {
          const labelCoords = getCoordinates(idx, 12);
          let textAnchor: 'middle' | 'end' | 'start' = 'middle';
          if (labelCoords.x < center - 10) textAnchor = 'end';
          else if (labelCoords.x > center + 10) textAnchor = 'start';

          return (
            <text
              key={idx}
              x={labelCoords.x}
              y={labelCoords.y + 3}
              className="text-[8px] font-mono fill-zinc-500 font-bold"
              textAnchor={textAnchor}
            >
              {m.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// --- 4. Mission Compass (Stakes Breakdown Vector) ---
interface MissionCompassProps {
  safeCount: number;
  warningCount: number;
  criticalCount: number;
}

export const MissionCompass: React.FC<MissionCompassProps> = ({
  safeCount,
  warningCount,
  criticalCount,
}) => {
  const total = safeCount + warningCount + criticalCount || 1;
  const safeAng = (safeCount / total) * 360;
  const warnAng = (warningCount / total) * 360;

  return (
    <div className="flex items-center gap-4 py-2 font-mono text-[9px]">
      <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
        {/* Simple geometric compass */}
        <div className="absolute inset-0 rounded-full border border-zinc-800" />
        <div className="absolute w-0.5 h-6 bg-mos-coral transform -rotate-45 origin-center animate-pulse" />
        <div className="absolute w-6 h-0.5 bg-zinc-800" />
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 border border-zinc-600 z-10" />
      </div>
      <div className="space-y-1 text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-mos-emerald" />
          <span>Safe: {safeCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-mos-amber" />
          <span>Warning: {warningCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-mos-coral" />
          <span>Critical: {criticalCount}</span>
        </div>
      </div>
    </div>
  );
};

// --- 5. Recovery Ring (Compressed Buffer Index) ---
interface RecoveryRingProps {
  recoveredHours: number;
  totalHours: number;
}

export const RecoveryRing: React.FC<RecoveryRingProps> = ({
  recoveredHours,
  totalHours = 8,
}) => {
  const size = 90;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const value = Math.min(100, Math.round((recoveredHours / totalHours) * 100));
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex items-center gap-4 py-1">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="stroke-zinc-900"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="stroke-mos-coral transition-all duration-700"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <span className="text-xs font-bold text-white font-mono">{recoveredHours}h</span>
        </div>
      </div>
      <div className="text-[10px] text-zinc-500 leading-normal max-w-[120px]">
        <p className="font-bold text-zinc-300 font-sans">Time Decompressed</p>
        <p className="font-mono mt-0.5">Recovered {recoveredHours} hours out of {totalHours}h required deficit.</p>
      </div>
    </div>
  );
};

// --- 6. AI Thinking Flow (Deconstruction pulses) ---
interface AIThinkingFlowProps {
  step: number;
}

export const AIThinkingFlow: React.FC<AIThinkingFlowProps> = ({
  step,
}) => {
  const nodes = [
    { label: 'Sniffing Overlaps', val: 1 },
    { label: 'Querying Milestones', val: 2 },
    { label: 'Evaluating Sacrifices', val: 3 },
    { label: 'Stabilizing Timeline', val: 4 }
  ];

  return (
    <div className="space-y-3 font-mono text-[9px]">
      {nodes.map((node) => {
        const isCurrent = step === node.val;
        const isCompleted = step > node.val;
        return (
          <div 
            key={node.val} 
            className={`flex items-center gap-3 p-2 rounded border transition-all ${
              isCurrent ? 'bg-zinc-900/60 border-zinc-800 text-white font-bold' :
              isCompleted ? 'border-transparent text-zinc-600' : 'border-transparent text-zinc-700'
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border font-bold ${
              isCurrent ? 'bg-mos-blue border-mos-blue text-white animate-pulse' :
              isCompleted ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-transparent border-zinc-900 text-zinc-700'
            }`}>
              {isCompleted ? '✓' : node.val}
            </div>
            <span>{node.label}</span>
          </div>
        );
      })}
    </div>
  );
};
