import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: 'indigo' | 'emerald' | 'amber' | 'red' | 'none';
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glowColor = 'none',
  hoverEffect = true,
  ...props
}) => {
  const borderStyles = {
    none: 'border-[rgba(0,0,0,0.04)] border-t-[rgba(255,255,255,0.7)] shadow-[0_8px_30px_rgba(0,0,0,0.04)]',
    indigo: 'border-blue-500/10 border-t-blue-500/25 hover:border-blue-500/20 shadow-[0_8px_30px_rgba(37,99,235,0.03)]',
    emerald: 'border-emerald-500/10 border-t-emerald-500/25 hover:border-emerald-500/20 shadow-[0_8px_30px_rgba(5,150,105,0.03)]',
    amber: 'border-amber-500/10 border-t-amber-500/25 hover:border-amber-500/20 shadow-[0_8px_30px_rgba(217,119,6,0.03)]',
    red: 'border-red-500/15 border-t-red-500/25 hover:border-red-500/20 shadow-[0_8px_30px_rgba(225,29,72,0.04)]',
  };

  return (
    <div
      className={`
        mos-panel p-6
        ${borderStyles[glowColor]}
        ${hoverEffect ? 'mos-panel-hover' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
export default GlassCard;
