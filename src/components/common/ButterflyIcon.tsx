import React from 'react';

interface ButterflyIconProps {
  className?: string;
  animated?: boolean;
}

export const ButterflyIcon: React.FC<ButterflyIconProps> = ({
  className = 'w-10 h-10',
  animated = true
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center relative select-none ${
        animated ? 'animate-butterfly-fly' : ''
      }`}
      style={{ perspective: '800px' }}
      aria-label="فراشة تالين الوردية الطائرة"
    >
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} overflow-visible drop-shadow-[0_3px_6px_rgba(225,29,72,0.28)] dark:drop-shadow-[0_0_12px_rgba(244,114,182,0.7)] transition-all duration-300`}
        aria-hidden="true"
      >
        <defs>
          {/* Upper Left Wing Pink Gradient */}
          <linearGradient id="taleenWingGradLeft" x1="40" y1="50" x2="120" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff1f5" />
            <stop offset="30%" stopColor="#f472b6" />
            <stop offset="70%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>

          {/* Upper Right Wing Pink Gradient */}
          <linearGradient id="taleenWingGradRight" x1="200" y1="50" x2="120" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff1f5" />
            <stop offset="30%" stopColor="#f472b6" />
            <stop offset="70%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>

          {/* Inner Highlights */}
          <linearGradient id="taleenInnerLeft" x1="50" y1="70" x2="110" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fbcfe8" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="taleenInnerRight" x1="190" y1="70" x2="130" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fbcfe8" stopOpacity="0.5" />
          </linearGradient>

          {/* Lower Wings Pink Gradients */}
          <linearGradient id="taleenLowerLeft" x1="50" y1="130" x2="115" y2="210" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fce7f3" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#9d174d" />
          </linearGradient>
          <linearGradient id="taleenLowerRight" x1="190" y1="130" x2="125" y2="210" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fce7f3" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#9d174d" />
          </linearGradient>

          {/* Center Body Gradient */}
          <linearGradient id="bodyGrad" x1="120" y1="80" x2="120" y2="175" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4a044e" />
            <stop offset="50%" stopColor="#3b0764" />
            <stop offset="100%" stopColor="#2e053a" />
          </linearGradient>
        </defs>

        {/* Left Wing Group (Flaps along Y-axis towards center) */}
        <g className={animated ? 'animate-wing-left' : ''}>
          {/* Upper Left Wing */}
          <path
            d="M116 96 C78 36, 18 60, 24 122 C30 156, 86 152, 116 122 Z"
            fill="url(#taleenWingGradLeft)"
            stroke="#fda4af"
            strokeWidth="1.2"
          />
          {/* Upper Left Wing Inner Petal Highlight */}
          <path
            d="M110 98 C78 52, 38 72, 42 118 C46 142, 88 138, 110 118 Z"
            fill="url(#taleenInnerLeft)"
          />
          {/* Luminous Pearl Spots along Upper Wing Edge */}
          <circle cx="34" cy="102" r="2.8" fill="#ffffff" />
          <circle cx="48" cy="80" r="2.4" fill="#ffffff" />
          <circle cx="72" cy="64" r="2.4" fill="#ffffff" />
          <circle cx="94" cy="60" r="2" fill="#fff1f5" />

          {/* Lower Left Wing */}
          <path
            d="M115 125 C72 138, 38 178, 65 204 C94 218, 115 174, 117 146 Z"
            fill="url(#taleenLowerLeft)"
            stroke="#fbcfe8"
            strokeWidth="1"
          />
          {/* Lower Left Wing Inner Highlight */}
          <path
            d="M112 134 C82 144, 60 172, 76 190 C96 200, 110 170, 112 152 Z"
            fill="#ffffff"
            fillOpacity="0.45"
          />
          <circle cx="64" cy="192" r="2.2" fill="#ffffff" />
          <circle cx="85" cy="204" r="2.2" fill="#ffffff" />
        </g>

        {/* Right Wing Group (Flaps along Y-axis towards center) */}
        <g className={animated ? 'animate-wing-right' : ''}>
          {/* Upper Right Wing */}
          <path
            d="M124 96 C162 36, 222 60, 216 122 C210 156, 154 152, 124 122 Z"
            fill="url(#taleenWingGradRight)"
            stroke="#fda4af"
            strokeWidth="1.2"
          />
          {/* Upper Right Wing Inner Petal Highlight */}
          <path
            d="M130 98 C162 52, 202 72, 198 118 C194 142, 152 138, 130 118 Z"
            fill="url(#taleenInnerRight)"
          />
          {/* Luminous Pearl Spots along Upper Wing Edge */}
          <circle cx="206" cy="102" r="2.8" fill="#ffffff" />
          <circle cx="192" cy="80" r="2.4" fill="#ffffff" />
          <circle cx="168" cy="64" r="2.4" fill="#ffffff" />
          <circle cx="146" cy="60" r="2" fill="#fff1f5" />

          {/* Lower Right Wing */}
          <path
            d="M125 125 C168 138, 202 178, 175 204 C146 218, 125 174, 123 146 Z"
            fill="url(#taleenLowerRight)"
            stroke="#fbcfe8"
            strokeWidth="1"
          />
          {/* Lower Right Wing Inner Highlight */}
          <path
            d="M128 134 C158 144, 180 172, 164 190 C144 200, 130 170, 128 152 Z"
            fill="#ffffff"
            fillOpacity="0.45"
          />
          <circle cx="176" cy="192" r="2.2" fill="#ffffff" />
          <circle cx="155" cy="204" r="2.2" fill="#ffffff" />
        </g>

        {/* Center Butterfly Body & Golden Antennae (Stable center) */}
        <g>
          {/* Left Antenna with Golden Glowing Tip */}
          <path
            d="M116 82 C110 56, 88 44, 76 54"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <circle cx="74" cy="54" r="3.5" fill="#fef08a" stroke="#f59e0b" strokeWidth="1.5" />

          {/* Right Antenna with Golden Glowing Tip */}
          <path
            d="M124 82 C130 56, 152 44, 164 54"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <circle cx="166" cy="54" r="3.5" fill="#fef08a" stroke="#f59e0b" strokeWidth="1.5" />

          {/* Slender Abdomen */}
          <ellipse cx="120" cy="136" rx="5.5" ry="34" fill="url(#bodyGrad)" />
          {/* Segments highlights */}
          <ellipse cx="120" cy="120" rx="4.5" ry="1.2" fill="#f472b6" fillOpacity="0.4" />
          <ellipse cx="120" cy="132" rx="4.5" ry="1.2" fill="#f472b6" fillOpacity="0.4" />
          <ellipse cx="120" cy="144" rx="4" ry="1.2" fill="#f472b6" fillOpacity="0.4" />

          {/* Thorax */}
          <ellipse cx="120" cy="100" rx="7.2" ry="11" fill="url(#bodyGrad)" />
          <ellipse cx="120" cy="100" rx="4" ry="7" fill="#be123c" fillOpacity="0.3" />

          {/* Head & Crown */}
          <circle cx="120" cy="85" r="6" fill="#3b0764" />
          <circle cx="120" cy="83" r="2" fill="#fbbf24" />
        </g>

        {/* Tiny Golden Sparkle Stars */}
        <path
          d="M42 54 L44 60 L50 62 L44 64 L42 70 L40 64 L34 62 L40 60 Z"
          fill="#fef08a"
          className="animate-twinkle"
          filter="drop-shadow(0 0 3px #f59e0b)"
        />
        <path
          d="M198 54 L200 60 L206 62 L200 64 L198 70 L196 64 L190 62 L196 60 Z"
          fill="#fef08a"
          className="animate-twinkle"
          filter="drop-shadow(0 0 3px #f59e0b)"
        />
      </svg>
    </div>
  );
};
