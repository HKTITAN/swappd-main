
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PlaceholderTabProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const PlaceholderTab = ({ title, description, icon: Icon }: PlaceholderTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12">
          <Icon className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-monochrome-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};
