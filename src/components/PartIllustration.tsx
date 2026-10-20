import React from 'react';
import { AutoPart } from '../types/garage';

interface PartIllustrationProps {
  type: AutoPart['illustrationType'];
  className?: string;
  viewAngle?: 'main' | 'blueprint' | 'detail';
}

export const PartIllustration: React.FC<PartIllustrationProps> = ({
  type,
  className = 'w-full h-full',
  viewAngle = 'main',
}) => {
  return (
    <div
      className={`relative overflow-hidden bg-[#11151C] flex items-center justify-center select-none ${className}`}
    >
      {/* Subtle studio floor reflection & technical grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 35%, rgba(249, 115, 22, 0.16), transparent 65%), linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 24px 24px, 24px 24px',
        }}
      />

      <svg
        viewBox="0 0 260 195"
        className="w-full h-full max-h-[190px] p-4 relative z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="metalBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="45%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
          <linearGradient id="chromeRod" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="50%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
          <linearGradient id="orangeAccent" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="cyanAccent" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>

        {/* Shadow ellipse */}
        <ellipse cx="130" cy="172" rx="68" ry="8" fill="#000000" fillOpacity="0.45" />

        {type === 'shock_absorber' && (
          <g transform={viewAngle === 'blueprint' ? 'rotate(-15 130 97)' : 'rotate(18 130 97)'}>
            {/* Top mount thread */}
            <rect x="125" y="14" width="10" height="14" rx="2" fill="url(#chromeRod)" />
            <rect x="112" y="26" width="36" height="8" rx="3" fill="#334155" stroke="#64748B" strokeWidth="1.2" />
            {/* Chrome piston rod */}
            <rect x="124" y="34" width="12" height="46" fill="url(#chromeRod)" />
            {/* Coilover spring */}
            <path
              d="M104 42 L156 50 L104 60 L156 68 L104 78 L156 86 L104 96 L156 104"
              stroke="url(#orangeAccent)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Spring perch */}
            <rect x="102" y="102" width="56" height="7" rx="2" fill="#0EA5E9" />
            {/* Main damper cylinder */}
            <rect
              x="113"
              y="78"
              width="34"
              height="74"
              rx="4"
              fill="url(#metalBody)"
              stroke="#94A3B8"
              strokeWidth="1.2"
            />
            {/* Technical label band */}
            <rect x="113" y="116" width="34" height="14" fill="#F97316" fillOpacity="0.85" />
            {/* Lower clevis eye */}
            <circle cx="130" cy="160" r="10" fill="#1E293B" stroke="#94A3B8" strokeWidth="4" />
            <circle cx="130" cy="160" r="4" fill="#0B0D11" />
          </g>
        )}

        {type === 'brake_disc' && (
          <g>
            {/* Outer ventilated rotor disc */}
            <circle
              cx="126"
              cy="96"
              r="64"
              fill="url(#metalBody)"
              stroke="#CBD5E1"
              strokeWidth="2"
            />
            <circle cx="126" cy="96" r="46" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="6 4" />
            {/* Drilled slots */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 126 96)`}>
                <circle cx="126" cy="44" r="2.3" fill="#0B0D11" />
                <circle cx="132" cy="52" r="2.3" fill="#0B0D11" />
                <line x1="118" y1="42" x2="122" y2="56" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
              </g>
            ))}
            {/* Center hub hat */}
            <circle cx="126" cy="96" r="32" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
            <circle cx="126" cy="96" r="14" fill="#0B0D11" stroke="#475569" strokeWidth="2" />
            {/* 5 Lug holes */}
            {[0, 72, 144, 216, 288].map((deg) => (
              <circle
                key={deg}
                cx="126"
                cy="74"
                r="3.2"
                fill="#0B0D11"
                stroke="#94A3B8"
                strokeWidth="1"
                transform={`rotate(${deg} 126 96)`}
              />
            ))}
            {/* Performance Caliper on left */}
            <path
              d="M66 56 C52 76, 52 116, 66 136 L88 126 C78 108, 78 84, 88 66 Z"
              fill="url(#orangeAccent)"
              stroke="#FED7AA"
              strokeWidth="1.2"
            />
            <circle cx="72" cy="84" r="4" fill="#1E293B" />
            <circle cx="72" cy="108" r="4" fill="#1E293B" />
          </g>
        )}

        {type === 'brake_pads' && (
          <g>
            {/* Back pad */}
            <path
              d="M62 66 C98 48, 162 48, 198 66 L186 106 C154 92, 106 92, 74 106 Z"
              fill="#1E293B"
              stroke="#64748B"
              strokeWidth="2"
            />
            {/* Front pad with ceramic chamfer */}
            <path
              d="M54 92 C94 74, 166 74, 206 92 L192 138 C156 122, 104 122, 68 138 Z"
              fill="url(#metalBody)"
              stroke="#CBD5E1"
              strokeWidth="2"
            />
            <line x1="130" y1="81" x2="130" y2="127" stroke="#0B0D11" strokeWidth="3.5" />
            <rect x="114" y="100" width="32" height="10" rx="2" fill="#F97316" />
          </g>
        )}

        {(type === 'control_arm' || type === 'steering_rack') && (
          <g>
            {/* Forged aluminum A-arm */}
            <path
              d="M54 128 L128 52 L206 128 L178 138 L128 84 L82 138 Z"
              fill="url(#metalBody)"
              stroke="#CBD5E1"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Ball joint top */}
            <circle cx="128" cy="46" r="14" fill="#1E293B" stroke="#F97316" strokeWidth="3" />
            <rect x="124" y="24" width="8" height="14" rx="2" fill="url(#chromeRod)" />
            {/* Hydro bushings */}
            <circle cx="64" cy="134" r="14" fill="#1E293B" stroke="#94A3B8" strokeWidth="3" />
            <circle cx="64" cy="134" r="6" fill="#0EA5E9" />
            <circle cx="194" cy="134" r="14" fill="#1E293B" stroke="#94A3B8" strokeWidth="3" />
            <circle cx="194" cy="134" r="6" fill="#0EA5E9" />
          </g>
        )}

        {type === 'wheel_hub' && (
          <g>
            <circle cx="130" cy="96" r="54" fill="url(#metalBody)" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="130" cy="96" r="32" fill="#1E293B" stroke="#F97316" strokeWidth="3" />
            <circle cx="130" cy="96" r="18" fill="url(#chromeRod)" />
            {[0, 72, 144, 216, 288].map((deg) => (
              <circle
                key={deg}
                cx="130"
                cy="54"
                r="5"
                fill="#0B0D11"
                stroke="#94A3B8"
                strokeWidth="2"
                transform={`rotate(${deg} 130 96)`}
              />
            ))}
          </g>
        )}

        {type === 'timing_belt' && (
          <g>
            {/* Timing chain/belt loop */}
            <path
              d="M84 56 A32 32 0 1 1 176 56 L160 136 A26 26 0 1 1 100 136 Z"
              stroke="#F97316"
              strokeWidth="7"
              strokeDasharray="10 4"
              fill="none"
            />
            {/* Cam gears */}
            <circle cx="102" cy="64" r="22" fill="url(#metalBody)" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="102" cy="64" r="8" fill="#0B0D11" />
            <circle cx="158" cy="64" r="22" fill="url(#metalBody)" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="158" cy="64" r="8" fill="#0B0D11" />
            {/* Crank pulley */}
            <circle cx="130" cy="132" r="20" fill="#1E293B" stroke="#38BDF8" strokeWidth="3" />
            <circle cx="130" cy="132" r="7" fill="url(#chromeRod)" />
          </g>
        )}

        {type === 'oil_filter' && (
          <g>
            {/* Top cap O-ring */}
            <rect x="94" y="34" width="72" height="10" rx="4" fill="#F97316" />
            {/* Pleated filter cylinder */}
            <rect x="90" y="44" width="80" height="104" rx="6" fill="#EAB308" fillOpacity="0.2" stroke="#F59E0B" strokeWidth="2" />
            {[98, 108, 118, 128, 138, 148, 158].map((x) => (
              <line key={x} x1={x} y1="46" x2={x} y2="146" stroke="#F59E0B" strokeWidth="2.5" />
            ))}
            <rect x="86" y="42" width="88" height="12" rx="3" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
            <rect x="86" y="140" width="88" height="12" rx="3" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
          </g>
        )}

        {type === 'motor_oil' && (
          <g>
            {/* 5L Oil canister */}
            <path
              d="M86 58 L114 58 L122 40 L144 40 L144 58 L174 68 L174 156 C174 161 170 164 164 164 L96 164 C90 164 86 161 86 156 Z"
              fill="url(#metalBody)"
              stroke="#CBD5E1"
              strokeWidth="2"
            />
            {/* Cap */}
            <rect x="122" y="28" width="22" height="11" rx="2" fill="#F97316" />
            {/* Handle cutout */}
            <rect x="148" y="72" width="14" height="38" rx="6" fill="#0B0D11" stroke="#64748B" strokeWidth="1.5" />
            {/* Label */}
            <rect x="96" y="88" width="44" height="54" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
            <text x="103" y="112" fill="#F8FAFC" fontSize="11" fontWeight="700" fontFamily="monospace">
              5W-30
            </text>
            <text x="103" y="128" fill="#F97316" fontSize="9" fontWeight="600" fontFamily="sans-serif">
              SYNTH
            </text>
          </g>
        )}

        {type === 'spark_plug' && (
          <g>
            <rect x="124" y="22" width="12" height="14" rx="2" fill="url(#chromeRod)" />
            <rect x="116" y="36" width="28" height="54" rx="4" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="116" y1="48" x2="144" y2="48" stroke="#38BDF8" strokeWidth="3" />
            <line x1="116" y1="58" x2="144" y2="58" stroke="#38BDF8" strokeWidth="3" />
            <polygon points="110,90 150,90 144,114 116,114" fill="url(#metalBody)" stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="118" y="114" width="24" height="36" fill="#475569" stroke="#94A3B8" strokeWidth="1.5" />
            <path d="M126 150 L126 164 L136 164" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {type === 'radiator' && (
          <g>
            <rect x="52" y="42" width="156" height="108" rx="6" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />
            <rect x="66" y="52" width="128" height="88" fill="url(#metalBody)" />
            {[64, 76, 88, 100, 112, 124, 136].map((y) => (
              <line key={y} x1="66" y1={y} x2="194" y2={y} stroke="#0B0D11" strokeWidth="2" />
            ))}
            <circle cx="130" cy="96" r="34" stroke="#38BDF8" strokeWidth="2.5" fill="#0B0D11" fillOpacity="0.4" />
            <circle cx="130" cy="96" r="8" fill="#F97316" />
          </g>
        )}

        {(type === 'headlight' ||
          type === 'clutch_kit' ||
          type === 'bumper' ||
          type === 'cabin_mat' ||
          type === 'exhaust_muffler' ||
          type === 'alloy_wheel') && (
          <g>
            <circle cx="130" cy="96" r="56" fill="url(#metalBody)" stroke="#CBD5E1" strokeWidth="2.5" />
            <circle cx="130" cy="96" r="44" fill="#0B0D11" stroke="#334155" strokeWidth="2" />
            {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg) => (
              <line
                key={deg}
                x1="130"
                y1="96"
                x2="130"
                y2="52"
                stroke="url(#chromeRod)"
                strokeWidth="3.5"
                transform={`rotate(${deg} 130 96)`}
              />
            ))}
            <circle cx="130" cy="96" r="14" fill="#1E293B" stroke="#F97316" strokeWidth="3" />
          </g>
        )}
      </svg>

      {/* Subtle corner view badge */}
      <div className="absolute bottom-2.5 right-3 text-[11px] font-mono text-slate-400 tracking-wide">
        {viewAngle === 'main' && 'CAD · 3D РЕНДЕР'}
        {viewAngle === 'blueprint' && 'ЧЕРТЁЖ УЗЛА'}
        {viewAngle === 'detail' && 'СПЕЦИФИКАЦИЯ'}
      </div>
    </div>
  );
};
