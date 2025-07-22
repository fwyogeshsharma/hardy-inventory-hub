import { MetricCard } from "./MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Factory, 
  ShoppingCart, 
  AlertTriangle,
  TrendingUp,
  Users,
  Clock,
  CheckCircle
} from "lucide-react";

export const Dashboard = () => {
  const recentAlerts = [
    { id: 1, type: "Low Stock", message: "HTWO Lime 330ml - 45 units remaining", priority: "high", time: "2 hours ago" },
    { id: 2, type: "Expiry Alert", message: "Batch #B2024-001 expires in 7 days", priority: "medium", time: "4 hours ago" },
    { id: 3, type: "Production", message: "Skhy Berry 500ml production completed", priority: "low", time: "6 hours ago" },
    { id: 4, type: "Vendor", message: "Vendor ABC confirmed PO #PO-2024-156", priority: "low", time: "8 hours ago" },
  ];

  const upcomingTasks = [
    { id: 1, task: "Inventory Audit - Zone A", due: "Today", status: "pending" },
    { id: 2, task: "BOM Review - HTWO Products", due: "Tomorrow", status: "pending" },
    { id: 3, task: "Vendor SLA Review", due: "This Week", status: "in-progress" },
    { id: 4, task: "Q1 Inventory Report", due: "Next Week", status: "completed" },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success text-success-foreground";
      case "in-progress":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">Production Manager</Badge>
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total SKUs"
          value="247"
          description="Active products"
          icon={Package}
          trend="up"
          trendValue="+12%"
          variant="success"
        />
        <MetricCard
          title="Low Stock Items"
          value="23"
          description="Below safety stock"
          icon={AlertTriangle}
          trend="down"
          trendValue="-8%"
          variant="warning"
        />
        <MetricCard
          title="Active Orders"
          value="156"
          description="In progress"
          icon={ShoppingCart}
          trend="up"
          trendValue="+5%"
        />
        <MetricCard
          title="Production Runs"
          value="42"
          description="This month"
          icon={Factory}
          trend="stable"
          trendValue="0%"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(alert.priority)}>
                        {alert.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                    <p className="text-sm text-foreground mt-1">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{task.due}</span>
                    </div>
                    <p className="text-sm text-foreground mt-1">{task.task}</p>
                  </div>
                  {task.status === "completed" && (
                    <CheckCircle className="h-4 w-4 text-success" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            <Button variant="outline" className="h-20 flex-col">
              <Package className="h-6 w-6 mb-2" />
              <span className="text-xs">Add SKU</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Factory className="h-6 w-6 mb-2" />
              <span className="text-xs">Start Production</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <ShoppingCart className="h-6 w-6 mb-2" />
              <span className="text-xs">Create Order</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              <span className="text-xs">Manage Vendors</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span className="text-xs">View Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              <span className="text-xs">View Alerts</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};