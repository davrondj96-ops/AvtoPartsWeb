import React from 'react';
import { CompatibilityStatus } from '../types/garage';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface CompatibilityHintProps {
  status: CompatibilityStatus;
  label: string;
  className?: string;
}

// Однострочный индикатор совместимости: иконка + текст в цвете статуса
export const CompatibilityHint: React.FC<CompatibilityHintProps> = ({
  status,
  label,
  className = '',
}) => {
  const [Icon, iconColor, textColor] =
    status === 'compatible'
      ? [CheckCircle2, 'text-emerald-400', 'text-emerald-300']
      : status === 'incompatible'
      ? [XCircle, 'text-rose-400', 'text-rose-300']
      : [AlertTriangle, 'text-amber-400', 'text-amber-300'];

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Icon className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
      <span className={`truncate ${textColor}`}>{label}</span>
    </div>
  );
};
