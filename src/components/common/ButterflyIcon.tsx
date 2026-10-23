import React, { useState } from 'react';

interface ButterflyIconProps {
  className?: string;
  variant?: 'image' | 'vector';
}

export const ButterflyIcon: React.FC<ButterflyIconProps> = ({
  className = 'w-6 h-6',
  variant = 'image'
}) => {
  const [hasError, setHasError] = useState(false);

  if (variant === 'image' && !hasError) {
    return (
      <img
        src="/assets/aistudio/TALEEN_e527ebcb.jpeg"
        alt="Taleen Butterfly"
        className={`${className} object-cover rounded-full`}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
    {/* Antennas */}
    <path
      d="M10.5 4.5C10.5 3.67 9.83 3 9 3C8.17 3 7.5 3.67 7.5 4.5C7.5 5.5 9 6.5 11 7"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M13.5 4.5C13.5 3.67 14.17 3 15 3C15.83 3 16.5 3.67 16.5 4.5C16.5 5.5 15 6.5 13 7"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    {/* Center Body */}
    <ellipse cx="12" cy="13" rx="1.2" ry="5.2" fill="currentColor" />
    {/* Upper Wings */}
    <path
      d="M11 9.5C8 6 3.5 7.5 3.5 11.5C3.5 14.5 7.5 15.5 11 13"
      fill="currentColor"
      fillOpacity="0.85"
    />
    <path
      d="M13 9.5C16 6 20.5 7.5 20.5 11.5C20.5 14.5 16.5 15.5 13 13"
      fill="currentColor"
      fillOpacity="0.85"
    />
    {/* Lower Wings */}
    <path
      d="M11 13.5C8 14 5 16 5.5 18.5C6 20.5 9 19.5 11 16.5"
      fill="currentColor"
      fillOpacity="0.65"
    />
    <path
      d="M13 13.5C16 14 19 16 18.5 18.5C18 20.5 15 19.5 13 16.5"
      fill="currentColor"
      fillOpacity="0.65"
    />
    </svg>
  );
};
