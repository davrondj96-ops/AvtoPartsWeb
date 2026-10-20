import React from 'react';
import { SystemCategory, SystemCategoryId, SelectedVehicle } from '../types/garage';
import { GARAGE_SYSTEMS } from '../data/vehicles';

interface VehicleSchematic2DProps {
  vehicle: SelectedVehicle;
  selectedSystemId: SystemCategoryId | null;
  hoveredSystemId: SystemCategoryId | null;
  onSelectSystem: (systemId: SystemCategoryId) => void;
  onHoverSystem: (systemId: SystemCategoryId | null) => void;
}

export const VehicleSchematic2D: React.FC<VehicleSchematic2DProps> = ({
  vehicle,
  selectedSystemId,
  hoveredSystemId,
  onSelectSystem,
  onHoverSystem,
}) => {
  const activeSystemId = hoveredSystemId || selectedSystemId;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#0B0D11] overflow-hidden select-none px-4 py-8">
      {/* Studio atmospheric radial light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 54%, rgba(249, 115, 22, 0.12) 0%, rgba(14, 165, 233, 0.06) 38%, rgba(11, 13, 17, 0.98) 78%)',
        }}
      />

      {/* Interactive 2D Blueprint Vector Container */}
      <div className="relative w-full max-w-4xl aspect-[16/9] max-h-[68vh] flex items-center justify-center">
        <svg
          viewBox="0 0 1000 520"
          className="w-full h-full drop-shadow-[0_18px_40px_rgba(0,0,0,0.85)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="carBodyGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="50%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#090D14" />
            </linearGradient>
            <linearGradient id="floorGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(14,165,233,0)" />
              <stop offset="25%" stopColor="rgba(14,165,233,0.45)" />
              <stop offset="75%" stopColor="rgba(249,115,22,0.55)" />
              <stop offset="100%" stopColor="rgba(249,115,22,0)" />
            </linearGradient>
          </defs>

          {/* Garage floor reflection line */}
          <ellipse cx="500" cy="400" rx="430" ry="26" fill="#090C10" />
          <line x1="80" y1="396" x2="920" y2="396" stroke="url(#floorGlow)" strokeWidth="3" />

          {/* Main Vehicle Silhouette (Sedan / SUV adaptive) */}
          {vehicle.bodyStyle === 'suv' ? (
            <path
              d="M95 320 L108 242 C115 224 135 215 168 208 L295 192 L390 124 C412 110 442 105 480 105 L780 108 C818 110 842 125 858 158 L892 232 L905 325 L870 355 L130 355 Z"
              fill="url(#carBodyGrad)"
              stroke={activeSystemId === 'body' ? '#F97316' : '#475569'}
              strokeWidth={activeSystemId === 'body' ? '3.5' : '2'}
            />
          ) : (
            <path
              d="M88 325 L105 256 C114 238 140 226 185 218 L320 202 L435 138 C462 124 495 118 540 118 L735 122 C775 126 810 144 848 188 L902 225 L916 320 L882 355 L122 355 Z"
              fill="url(#carBodyGrad)"
              stroke={activeSystemId === 'body' ? '#F97316' : '#475569'}
              strokeWidth={activeSystemId === 'body' ? '3.5' : '2'}
            />
          )}

          {/* Cabin Windows / Interior */}
          <path
            d="M345 198 L442 144 C465 132 492 128 530 128 L725 132 C760 135 790 152 820 198 Z"
            fill={activeSystemId === 'interior' ? 'rgba(249, 115, 22, 0.25)' : '#0B111E'}
            stroke={activeSystemId === 'interior' ? '#F97316' : '#38BDF8'}
            strokeWidth="2"
          />

          {/* Engine Bay Internal Block */}
          <rect
            x="175"
            y="218"
            width="125"
            height="84"
            rx="10"
            fill={
              activeSystemId === 'engine' || activeSystemId === 'maintenance'
                ? 'rgba(249, 115, 22, 0.28)'
                : 'rgba(30, 41, 59, 0.7)'
            }
            stroke={
              activeSystemId === 'engine' || activeSystemId === 'maintenance'
                ? '#F97316'
                : '#64748B'
            }
            strokeWidth="2"
          />

          {/* Front Radiator / Cooling */}
          <rect
            x="116"
            y="246"
            width="36"
            height="72"
            rx="4"
            fill={activeSystemId === 'cooling' ? 'rgba(56, 189, 248, 0.35)' : '#1E293B'}
            stroke={activeSystemId === 'cooling' ? '#38BDF8' : '#475569'}
            strokeWidth="2"
          />

          {/* Headlights / Electrical */}
          <path
            d="M104 252 L152 242 L144 268 L102 272 Z"
            fill={activeSystemId === 'electrical' ? '#38BDF8' : '#E2E8F0'}
            stroke="#38BDF8"
            strokeWidth="2"
          />

          {/* Steering Column & Rack */}
          <line
            x1="265"
            y1="335"
            x2="395"
            y2="215"
            stroke={activeSystemId === 'steering' ? '#F97316' : '#475569'}
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Transmission & Drivetrain */}
          <path
            d="M305 285 L495 315 L735 335"
            stroke={activeSystemId === 'transmission' ? '#F97316' : '#475569'}
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Exhaust System */}
          <path
            d="M285 336 L865 344 L895 338"
            stroke={activeSystemId === 'exhaust' ? '#F97316' : '#64748B'}
            strokeWidth="6"
            strokeDasharray="12 4"
            strokeLinecap="round"
          />

          {/* Front Suspension Strut */}
          <line
            x1="248"
            y1="215"
            x2="248"
            y2="345"
            stroke={activeSystemId === 'suspension' ? '#F97316' : '#94A3B8'}
            strokeWidth="8"
          />
          {/* Rear Suspension Strut */}
          <line
            x1="752"
            y1="215"
            x2="752"
            y2="345"
            stroke={activeSystemId === 'suspension' ? '#F97316' : '#94A3B8'}
            strokeWidth="8"
          />

          {/* Front Wheel & Brake Assembly */}
          <g>
            <circle
              cx="248"
              cy="345"
              r="56"
              fill="#0F172A"
              stroke={
                activeSystemId === 'wheels' || activeSystemId === 'suspension'
                  ? '#F97316'
                  : '#64748B'
              }
              strokeWidth="8"
            />
            <circle
              cx="248"
              cy="345"
              r="34"
              fill="none"
              stroke={activeSystemId === 'brakes' ? '#F97316' : '#94A3B8'}
              strokeWidth="5"
              strokeDasharray="8 4"
            />
            <path
              d="M272 322 A28 28 0 0 1 278 362"
              stroke="#F97316"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </g>

          {/* Rear Wheel & Brake Assembly */}
          <g>
            <circle
              cx="752"
              cy="345"
              r="56"
              fill="#0F172A"
              stroke={
                activeSystemId === 'wheels' || activeSystemId === 'suspension'
                  ? '#F97316'
                  : '#64748B'
              }
              strokeWidth="8"
            />
            <circle
              cx="752"
              cy="345"
              r="34"
              fill="none"
              stroke={activeSystemId === 'brakes' ? '#F97316' : '#94A3B8'}
              strokeWidth="5"
              strokeDasharray="8 4"
            />
          </g>
        </svg>

        {/* Interactive Hotspot Pins over 2D Schematic */}
        {GARAGE_SYSTEMS.map((sys: SystemCategory) => {
          const isSelected = selectedSystemId === sys.id;
          const isHovered = hoveredSystemId === sys.id;
          const isActive = isSelected || isHovered;

          return (
            <button
              key={sys.id}
              type="button"
              onClick={() => onSelectSystem(sys.id)}
              onMouseEnter={() => onHoverSystem(sys.id)}
              onMouseLeave={() => onHoverSystem(null)}
              style={{
                left: `${sys.svgCoords.x}%`,
                top: `${sys.svgCoords.y}%`,
              }}
              aria-label={`Выбрать узел: ${sys.name}`}
              className={`group absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] rounded-full transition-transform duration-150 ${
                isActive ? 'scale-110 z-30' : 'hover:scale-105'
              }`}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-colors ${
                  isActive
                    ? 'bg-[#F97316] text-white border-white shadow-[0_0_16px_rgba(249,115,22,0.8)]'
                    : 'bg-[#12161F]/90 text-slate-200 border-[#38BDF8]/70 hover:border-[#F97316]'
                }`}
              >
                +
              </span>
              <span
                className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-opacity pointer-events-none ${
                  isActive
                    ? 'opacity-100 bg-[#12161F] text-white border border-[#F97316]'
                    : 'opacity-0 group-hover:opacity-100 bg-[#12161F]/95 text-slate-200 border border-white/15'
                }`}
              >
                {sys.shortName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
