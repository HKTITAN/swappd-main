import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  onClick?: () => void;
  isLoading?: boolean;
  valuePrefix?: string;
  valueFormatter?: (value: number) => string;
  variant?: 'default' | 'warning' | 'destructive';
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
  onClick,
  isLoading = false,
  valuePrefix = '',
  valueFormatter,
  variant = 'default'
}: StatsCardProps) {
  const formattedValue = 
    typeof value === 'number' && valueFormatter ? 
    valueFormatter(value) : 
    value;

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all", 
        onClick && "cursor-pointer hover:border-primary/50",
        variant === 'warning' && "border-yellow-500/50",
        variant === 'destructive' && "border-red-500/50",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-9 w-2/3 animate-pulse rounded-md bg-muted"></div>
        ) : (
          <>
            <div className="text-2xl font-bold">{valuePrefix}{formattedValue}</div>
            {(description || trend) && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                {description}
                {trend && (
                  <span className={cn(
                    "ml-1 flex items-center",
                    trend.isPositive ? "text-green-500" : "text-red-500"
                  )}>
                    <span className={cn(
                      "inline-block h-4 w-4",
                      trend.isPositive ? "i-lucide-trending-up" : "i-lucide-trending-down"
                    )}></span>
                    {trend.value}%
                  </span>
                )}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
