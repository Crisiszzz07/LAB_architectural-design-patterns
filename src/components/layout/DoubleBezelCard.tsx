import React from 'react';

interface DoubleBezelCardProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  glowEffect?: 'cyan' | 'lavender' | 'emerald' | 'amber' | 'rose' | 'none';
}

// Tarjeta con doble borde para darle profundidad al diseño
export const DoubleBezelCard: React.FC<DoubleBezelCardProps> = ({
  children,
  className = '',
  innerClassName = '',
  glowEffect = 'none',
}) => {
  const glowStyles = {
    none: '',
    cyan: 'shadow-[0_0_25px_-5px_rgba(181,125,218,0.35)] ring-[#B57DDA]/60',
    lavender: 'shadow-[0_0_25px_-5px_rgba(181,125,218,0.35)] ring-[#B57DDA]/60',
    emerald: 'shadow-[0_0_25px_-5px_rgba(16,185,129,0.3)] ring-emerald-500/50',
    amber: 'shadow-[0_0_25px_-5px_rgba(245,158,11,0.3)] ring-amber-500/50',
    rose: 'shadow-[0_0_25px_-5px_rgba(244,63,94,0.3)] ring-rose-500/50',
  };

  return (
    <div
      className={`relative bg-[#E8E2D4]/50 ring-1 ring-[#AAA0BB]/40 p-1.5 rounded-[2rem] transition-all duration-500 ease-spring ${
        glowStyles[glowEffect]
      } ${className}`}
    >
      <div
        className={`relative bg-[#FFFFF6] shadow-[0_2px_14px_rgba(65,71,139,0.05),inset_0_1px_0_rgba(255,255,255,0.95)] rounded-[calc(2rem-0.375rem)] overflow-hidden ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
};
