import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  variant?: "default" | "success" | "warning" | "destructive";
}

export const MetricCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  trendValue,
  variant = "default"
}: MetricCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "bg-success text-success-foreground";
      case "down":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getCardVariant = () => {
    switch (variant) {
      case "success":
        return "border-success/20 bg-success/5";
      case "warning":
        return "border-warning/20 bg-warning/5";
      case "destructive":
        return "border-destructive/20 bg-destructive/5";
      default:
        return "";
    }
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${getCardVariant()}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <span>{description}</span>
          {trendValue && (
            <Badge variant="secondary" className={getTrendColor()}>
              {trendValue}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};