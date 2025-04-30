
import { Button } from "@/components/ui/button";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  isMobile: boolean;
}

export const MobileMenuButton = ({ isOpen, onClick, isMobile }: MobileMenuButtonProps) => {
  if (!isMobile) return null;

  return (
    <Button 
      variant="ghost" 
      className="md:hidden" 
      onClick={onClick}
      aria-label="Toggle menu"
    >
      <div className="flex flex-col space-y-1.5">
        <span className={`block h-0.5 w-6 bg-foreground transition-transform ${isOpen ? 'translate-y-2 rotate-45' : ''}`} />
        <span className={`block h-0.5 w-6 bg-foreground transition-opacity ${isOpen ? 'opacity-0' : ''}`} />
        <span className={`block h-0.5 w-6 bg-foreground transition-transform ${isOpen ? '-translate-y-2 -rotate-45' : ''}`} />
      </div>
    </Button>
  );
};
