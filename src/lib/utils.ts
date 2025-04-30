
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

// This is a placeholder function - in a real app you would have
// a more sophisticated way to handle admin panel functionality
export function adminPanel(action: string, data: any): Promise<any> {
  return new Promise((resolve) => {
    console.log(`Admin action: ${action}`, data);
    setTimeout(() => resolve({ success: true }), 1000);
  });
}
