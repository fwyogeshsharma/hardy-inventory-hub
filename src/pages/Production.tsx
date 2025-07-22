import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Factory, Play, Pause, CheckCircle } from "lucide-react";

export default function Production() {
  const productionRuns = [
    { id: 1, sku: "HTWO-LM-330", name: "HTWO Lime 330ml", quantity: 5000, completed: 3500, status: "In Progress", startDate: "2024-01-15", estimatedCompletion: "2024-01-18" },
    { id: 2, sku: "SKHY-BR-500", name: "Skhy Berry 500ml", quantity: 2000, completed: 2000, status: "Completed", startDate: "2024-01-10", estimatedCompletion: "2024-01-12" },
    { id: 3, sku: "RLLIE-PC-1L", name: "Rallie Peach 1L", quantity: 3000, completed: 0, status: "Scheduled", startDate: "2024-01-20", estimatedCompletion: "2024-01-23" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case "In Progress":
        return <Badge className="bg-warning text-warning-foreground">In Progress</Badge>;
      case "Scheduled":
        return <Badge variant="secondary">Scheduled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getProgress = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Production Management</h2>
          <p className="text-muted-foreground">Monitor and manage production runs</p>
        </div>
        <Button>
          <Play className="h-4 w-4 mr-2" />
          Start New Production
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Runs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">2000</div>
            <p className="text-xs text-muted-foreground">Units produced</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Upcoming runs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Factory className="h-5 w-5 mr-2" />
            Production Runs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {productionRuns.map((run) => (
              <div key={run.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{run.name}</h3>
                    <p className="text-sm text-muted-foreground">SKU: {run.sku}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(run.status)}
                    {run.status === "In Progress" && (
                      <Button size="sm" variant="outline">
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}
                    {run.status === "Completed" && (
                      <CheckCircle className="h-4 w-4 text-success" />
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Quantity:</span>
                    <p className="font-medium">{run.quantity.toLocaleString()} units</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Completed:</span>
                    <p className="font-medium">{run.completed.toLocaleString()} units</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Start Date:</span>
                    <p className="font-medium">{run.startDate}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Est. Completion:</span>
                    <p className="font-medium">{run.estimatedCompletion}</p>
                  </div>
                </div>
                
                {run.status === "In Progress" && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{getProgress(run.completed, run.quantity)}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgress(run.completed, run.quantity)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}