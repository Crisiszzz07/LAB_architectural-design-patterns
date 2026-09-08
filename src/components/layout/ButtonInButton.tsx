import React from 'react';

interface ButtonInButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Nested CTA & "Island" Button Architecture
 * Cumple con la sección 4.B y 5.B de SKILL.md:
 * - Estructura pill redondeada (rounded-full) con padding generoso
 * - Icono anidado en wrapper circular independiente (Button-in-Button)
 * - Micro-cinemática activa y escalado táctil
 */
export const ButtonInButton: React.FC<ButtonInButtonProps> = ({
  children,
  icon,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#B57DDA] to-[#8E44AD] hover:from-[#A866CE] hover:to-[#7D389C] text-white shadow-md shadow-[#B57DDA]/30 border border-[#B57DDA]/40',
    secondary: 'bg-[#FFFFF6] hover:bg-[#E8E2D4]/60 text-[#41478B] border border-[#E8E2D4] shadow-sm',
    accent: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-500/20 border border-emerald-400/30',
    danger: 'bg-gradient-to-r from-rose-500 to-rose-700 hover:from-rose-400 hover:to-rose-600 text-white shadow-md shadow-rose-500/20 border border-rose-400/30',
  };

  const sizeStyles = {
    sm: 'pl-4 pr-1.5 py-1.5 text-xs',
    md: 'pl-5 pr-2 py-2 text-sm',
    lg: 'pl-6 pr-2.5 py-2.5 text-base',
  };

  const iconSizeStyles = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-8 h-8',
  };

  return (
    <button
      disabled={disabled}
      className={`group relative inline-flex items-center justify-between gap-3 rounded-full font-medium transition-all duration-300 ease-spring active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer ${
        variantStyles[variant]
      } ${sizeStyles[size]} ${className}`}
      {...props}
    >
      <span className="font-bold tracking-wide whitespace-nowrap">{children}</span>
      {icon && (
        <span
          className={`flex items-center justify-center rounded-full bg-black/10 border border-white/20 backdrop-blur-sm transition-transform duration-300 ease-spring group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105 shrink-0 ${
            iconSizeStyles[size]
          }`}
        >
          {icon}
        </span>
      )}
    </button>
  );
};
