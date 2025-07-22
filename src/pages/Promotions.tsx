import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Calendar, Target, TrendingUp } from "lucide-react";

export default function Promotions() {
  const campaigns = [
    { 
      id: 1, 
      name: "Summer Hydration Campaign", 
      type: "Seasonal", 
      status: "Active",
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      budget: 50000,
      spent: 32000,
      kitsAllocated: 5000,
      kitsUsed: 3200,
      targetAudience: "18-35 Athletes"
    },
    { 
      id: 2, 
      name: "Back to School Promo", 
      type: "Event", 
      status: "Scheduled",
      startDate: "2024-08-15",
      endDate: "2024-09-15",
      budget: 25000,
      spent: 0,
      kitsAllocated: 2500,
      kitsUsed: 0,
      targetAudience: "Students & Parents"
    },
    { 
      id: 3, 
      name: "NYC Marathon Sponsorship", 
      type: "Sports Event", 
      status: "Completed",
      startDate: "2024-11-01",
      endDate: "2024-11-03",
      budget: 75000,
      spent: 73500,
      kitsAllocated: 10000,
      kitsUsed: 9800,
      targetAudience: "Marathon Runners"
    },
  ];

  const kitInventory = [
    { id: 1, name: "HTWO Variety Pack", contents: ["HTWO Lime 330ml x4", "HTWO Peach 330ml x2"], stock: 1250, allocated: 800, available: 450 },
    { id: 2, name: "Skhy Sampler Kit", contents: ["Skhy Berry 500ml x2", "Skhy Mixed 330ml x4"], stock: 650, allocated: 600, available: 50 },
    { id: 3, name: "Premium Mixed Box", contents: ["HTWO Lime 330ml x2", "Skhy Berry 500ml x2", "Rallie Peach 1L x1"], stock: 320, allocated: 280, available: 40 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "Scheduled":
        return <Badge className="bg-accent text-accent-foreground">Scheduled</Badge>;
      case "Completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "Paused":
        return <Badge className="bg-warning text-warning-foreground">Paused</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getUtilizationPercentage = (used: number, allocated: number) => {
    return allocated > 0 ? Math.round((used / allocated) * 100) : 0;
  };

  const getBudgetPercentage = (spent: number, budget: number) => {
    return budget > 0 ? Math.round((spent / budget) * 100) : 0;
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Promotional Campaigns</h2>
          <p className="text-muted-foreground">Manage marketing campaigns and promotional inventory</p>
        </div>
        <Button>
          <Gift className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$150K</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Kits Distributed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">13K</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4x</div>
            <p className="text-xs text-muted-foreground">Average return</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Campaign Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.map((campaign) => {
                const budgetUsed = getBudgetPercentage(campaign.spent, campaign.budget);
                const kitUtilization = getUtilizationPercentage(campaign.kitsUsed, campaign.kitsAllocated);
                
                return (
                  <div key={campaign.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{campaign.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                          <Badge variant="outline">{campaign.type}</Badge>
                          <Target className="h-3 w-3" />
                          <span>{campaign.targetAudience}</span>
                        </div>
                      </div>
                      {getStatusBadge(campaign.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <p className="font-medium">{campaign.startDate} - {campaign.endDate}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Budget Used:</span>
                        <p className="font-medium">${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Budget Utilization</span>
                          <span>{budgetUsed}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${budgetUsed}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Kit Distribution</span>
                          <span>{kitUtilization}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-accent h-2 rounded-full transition-all duration-300"
                            style={{ width: `${kitUtilization}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gift className="h-5 w-5 mr-2" />
              Promotional Kit Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {kitInventory.map((kit) => (
                <div key={kit.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{kit.name}</h3>
                      <div className="text-sm text-muted-foreground mt-1">
                        {kit.contents.map((item, index) => (
                          <div key={index}>• {item}</div>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{kit.available}</div>
                      <div className="text-xs text-muted-foreground">Available</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total:</span>
                      <p className="font-medium">{kit.stock}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Allocated:</span>
                      <p className="font-medium">{kit.allocated}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Available:</span>
                      <p className="font-medium text-success">{kit.available}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}