import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusType =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'completed'
  | 'in-progress'
  | 'failed'
  | 'success'
  | 'warning'
  | 'info';

interface StatusBadgeProps {
  status: StatusType;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

const statusConfig = {
  active: {
    label: 'Ativo',
    className: 'bg-green-100 text-green-800 hover:bg-green-200',
    variant: 'secondary' as const
  },
  inactive: {
    label: 'Inativo',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    variant: 'secondary' as const
  },
  pending: {
    label: 'Pendente',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    variant: 'secondary' as const
  },
  completed: {
    label: 'Concluído',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    variant: 'secondary' as const
  },
  'in-progress': {
    label: 'Em Progresso',
    className: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    variant: 'secondary' as const
  },
  failed: {
    label: 'Falhou',
    className: 'bg-red-100 text-red-800 hover:bg-red-200',
    variant: 'destructive' as const
  },
  success: {
    label: 'Sucesso',
    className: 'bg-green-100 text-green-800 hover:bg-green-200',
    variant: 'secondary' as const
  },
  warning: {
    label: 'Atenção',
    className: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
    variant: 'secondary' as const
  },
  info: {
    label: 'Info',
    className: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200',
    variant: 'secondary' as const
  }
};

export default function StatusBadge({
  status,
  children,
  className,
  variant
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const displayText = children || config.label;

  return (
    <Badge
      variant={variant || config.variant}
      className={cn(
        config.className,
        className
      )}
    >
      {displayText}
    </Badge>
  );
}

// Helper function to get status from user progress
export function getUserProgressStatus(percentage: number): StatusType {
  if (percentage === 0) return 'inactive';
  if (percentage > 0 && percentage < 100) return 'in-progress';
  if (percentage === 100) return 'completed';
  return 'pending';
}

// Helper function to get status from course enrollment
export function getCourseEnrollmentStatus(isActive: boolean, progress: number): StatusType {
  if (!isActive) return 'inactive';
  if (progress === 0) return 'pending';
  if (progress > 0 && progress < 100) return 'in-progress';
  return 'completed';
}