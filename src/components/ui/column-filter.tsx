import React, { useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ColumnFilterTextProps {
  type?: 'text';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface ColumnFilterSelectProps {
  type: 'select';
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

type ColumnFilterInputProps = ColumnFilterTextProps | ColumnFilterSelectProps;

export const ColumnFilterInput: React.FC<ColumnFilterInputProps> = (props) => {
  if (props.type === 'select') {
    return (
      <div className={cn("relative", props.className)}>
        <Select
          value={props.value || '__all__'}
          onValueChange={(v) => props.onChange(v === '__all__' ? '' : v)}
        >
          <SelectTrigger className="h-7 text-xs border-border/50 bg-background/50 focus:ring-1 focus:ring-primary/30 [&>span]:truncate">
            <SelectValue placeholder={props.placeholder || 'Todos'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__" className="text-xs">Todos</SelectItem>
            {props.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className={cn("relative", props.className)}>
      <Search className="absolute left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
      <Input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder || 'Buscar...'}
        className="h-7 text-xs pl-6 pr-6 py-0 bg-background/50 border-border/50 focus-visible:ring-1 focus-visible:ring-primary/30"
      />
      {props.value && (
        <button
          onClick={() => props.onChange('')}
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

  // Exact match for select filters
  const matchesSelectFilter = (value: string | undefined | null, column: T): boolean => {
    const filterValue = filters[column];
    if (!filterValue) return true;
    return (value || '') === filterValue;
  };

  return { filters, setFilter, hasActiveFilters, clearFilters, matchesFilter, matchesSelectFilter };
}
