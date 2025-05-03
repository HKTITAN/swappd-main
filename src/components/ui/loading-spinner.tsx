import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export function LoadingSpinner({ size = "medium", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    medium: "h-8 w-8 border-2",
    large: "h-12 w-12 border-3",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-t-transparent border-primary",
        sizeClasses[size],
        className
      )}
    />
  );
}