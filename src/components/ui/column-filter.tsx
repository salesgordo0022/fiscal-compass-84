import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ColumnFilterInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const ColumnFilterInput: React.FC<ColumnFilterInputProps> = ({ 
  value, 
  onChange, 
  placeholder = 'Filtrar...', 
  className 
}) => {
  return (
    <div className={cn("relative", className)}>
      <Filter className="absolute left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-6 text-xs pl-6 pr-6 py-0 bg-background/50 border-border/50 focus-visible:ring-1 focus-visible:ring-primary/30"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

// Hook for managing column filters
export function useColumnFilters<T extends string>(columns: T[]) {
  const [filters, setFilters] = useState<Record<T, string>>(
    () => columns.reduce((acc, col) => ({ ...acc, [col]: '' }), {} as Record<T, string>)
  );

  const setFilter = (column: T, value: string) => {
    setFilters(prev => ({ ...prev, [column]: value }));
  };

  const hasActiveFilters = Object.values(filters).some((v) => (v as string) !== '');

  const clearFilters = () => {
    setFilters(columns.reduce((acc, col) => ({ ...acc, [col]: '' }), {} as Record<T, string>));
  };

  const matchesFilter = (value: string | undefined | null, column: T): boolean => {
    const filterValue = filters[column];
    if (!filterValue) return true;
    return (value || '').toLowerCase().includes(filterValue.toLowerCase());
  };

  return { filters, setFilter, hasActiveFilters, clearFilters, matchesFilter };
}
