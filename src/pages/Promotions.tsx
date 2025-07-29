import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Gift, 
  Calendar, 
  Target, 
  TrendingUp,
  Timer,
  RefreshCw,
  BarChart3,
  Plus,
  DollarSign,
  Users,
  Package,
  Activity,
  CheckCircle,
  Clock,
  Star,
  MapPin,
  Zap,
  Award,
  ShoppingCart,
  Percent
} from "lucide-react";

export default function Promotions() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const campaigns = [
    { 
      id: 1, 
      name: "Winter Maintenance Campaign", 
      type: "Seasonal", 
      status: "Active",
      startDate: "2024-01-15",
      endDate: "2024-03-31",
      budget: 75000,
      spent: 45000,
      discountPercent: 15,
      partsIncluded: ["Oil Filters", "Brake Pads", "Antifreeze", "Winter Tires"],
      targetCustomers: "Service Centers & Distributors",
      participation: 285,
      expectedParticipation: 400,
      averageOrderValue: 850,
      totalRevenue: 242250,
      region: "Northeast & Midwest"
    },
    { 
      id: 2, 
      name: "Spring Tune-Up Special", 
      type: "Seasonal", 
      status: "Scheduled",
      startDate: "2024-03-01",
      endDate: "2024-05-31",
      budget: 50000,
      spent: 0,
      discountPercent: 20,
      partsIncluded: ["Air Filters", "Spark Plugs", "Belts", "Fluids"],
      targetCustomers: "Auto Repair Shops",
      participation: 0,
      expectedParticipation: 320,
      averageOrderValue: 650,
      totalRevenue: 0,
      region: "National"
    },
    { 
      id: 3, 
      name: "Fleet Maintenance Program", 
      type: "B2B Partnership", 
      status: "Active",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      budget: 120000,
      spent: 85000,
      discountPercent: 25,
      partsIncluded: ["Engine Parts", "Transmission", "Brake Systems", "Electrical"],
      targetCustomers: "Fleet Operators",
      participation: 45,
      expectedParticipation: 60,
      averageOrderValue: 2400,
      totalRevenue: 108000,
      region: "Commercial Accounts"
    },
    { 
      id: 4, 
      name: "DIY Enthusiast Bundle", 
      type: "Consumer Direct", 
      status: "Completed",
      startDate: "2024-01-10",
      endDate: "2024-01-31",
      budget: 35000,
      spent: 33500,
      discountPercent: 10,
      partsIncluded: ["Tools", "Maintenance Kits", "Accessories"],
      targetCustomers: "Individual Consumers",
      participation: 520,
      expectedParticipation: 500,
      averageOrderValue: 165,
      totalRevenue: 85800,
      region: "Online Sales"
    }
  ];

  const promotionalInventory = [
    { 
      id: 1, 
      name: "Winter Service Kit", 
      sku: "WSK-2024-001",
      contents: [
        "Mobil 1 5W-30 Synthetic Oil (5qt)",
        "ACDelco Oil Filter", 
        "NGK Spark Plugs (Set of 4)",
        "Prestone Antifreeze (1gal)"
      ], 
      stock: 1250, 
      allocated: 800, 
      available: 450,
      costPerKit: 85.50,
      retailValue: 145.00,
      discountPrice: 115.00
    },
    { 
      id: 2, 
      name: "Brake Service Bundle", 
      sku: "BSB-2024-002",
      contents: [
        "Brembo Brake Pads (Front Set)",
        "Monroe Brake Rotors (Pair)", 
        "DOT 3 Brake Fluid",
        "Brake Cleaner Spray"
      ], 
      stock: 650, 
      allocated: 600, 
      available: 50,
      costPerKit: 125.75,
      retailValue: 225.00,
      discountPrice: 180.00
    },
    { 
      id: 3, 
      name: "Maintenance Essentials", 
      sku: "MES-2024-003",
      contents: [
        "K&N Air Filter",
        "Bosch Wiper Blades (Pair)",
        "Gates Belt Set",
        "Castrol Power Steering Fluid"
      ], 
      stock: 320, 
      allocated: 280, 
      available: 40,
      costPerKit: 65.25,
      retailValue: 125.00,
      discountPrice: 95.00
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 shadow-sm">
            <Activity className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "Scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 shadow-sm">
            <Clock className="h-3 w-3 mr-1" />
            Scheduled
          </Badge>
        );
      case "Completed":
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-200 shadow-sm">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "Paused":
        return (
          <Badge className="bg-orange-100 text-orange-700 border-orange-200 shadow-sm">
            <Clock className="h-3 w-3 mr-1" />
            Paused
          </Badge>
        );
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

  const getParticipationPercentage = (actual: number, expected: number) => {
    return expected > 0 ? Math.round((actual / expected) * 100) : 0;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getActiveCampaigns = () => campaigns.filter(c => c.status === "Active").length;
  const getTotalBudget = () => campaigns.reduce((sum, c) => sum + c.budget, 0);
  const getTotalRevenue = () => campaigns.reduce((sum, c) => sum + c.totalRevenue, 0);
  const getTotalParticipation = () => campaigns.reduce((sum, c) => sum + c.participation, 0);

  return (
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Promotional Campaigns
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage automotive parts marketing campaigns and promotional bundles
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
            <Timer className="h-3 w-3 mr-1" />
            {currentTime.toLocaleTimeString('en-US', { hour12: false })}
          </Badge>
          <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
            <Calendar className="h-3 w-3 mr-1" />
            {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Badge>
          <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Active Campaigns</p>
                <p className="text-3xl font-bold">{getActiveCampaigns()}</p>
                <p className="text-blue-100 text-xs mt-1">
                  Of {campaigns.length} total campaigns
                </p>
              </div>
              <Activity className="h-10 w-10 text-blue-200" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +2 vs last quarter
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Budget</p>
                <p className="text-3xl font-bold">{formatCurrency(getTotalBudget())}</p>
                <p className="text-green-100 text-xs mt-1">Annual allocation</p>
              </div>
              <DollarSign className="h-10 w-10 text-green-200" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-green-100 text-sm">
                <Target className="h-4 w-4 mr-1" />
                82% budget utilized
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold">{formatCurrency(getTotalRevenue())}</p>
                <p className="text-purple-100 text-xs mt-1">Generated from campaigns</p>
              </div>
              <Award className="h-10 w-10 text-purple-200" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-purple-100 text-sm">
                <Zap className="h-4 w-4 mr-1" />
                3.2x ROI average
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Participation</p>
                <p className="text-3xl font-bold">{getTotalParticipation().toLocaleString()}</p>
                <p className="text-orange-100 text-xs mt-1">Customer responses</p>
              </div>
              <Users className="h-10 w-10 text-orange-200" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-orange-100 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +28% vs last year
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Overview */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="border-b border-gray-200/50">
          <CardTitle className="flex items-center text-xl">
            <Calendar className="h-6 w-6 mr-3 text-blue-500" />
            Marketing Campaigns
            <Badge variant="outline" className="ml-3 bg-blue-50 text-blue-600 border-blue-200">
              {campaigns.length} campaigns
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {campaigns.map((campaign) => {
              const budgetUsed = getBudgetPercentage(campaign.spent, campaign.budget);
              const participationRate = getParticipationPercentage(campaign.participation, campaign.expectedParticipation);
              
              return (
                <div key={campaign.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <Gift className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{campaign.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">{campaign.type}</Badge>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Percent className="h-3 w-3 mr-1" />
                              {campaign.discountPercent}% discount
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(campaign.status)}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-1" />
                          Target & Region
                        </div>
                        <p className="text-sm font-medium text-gray-900">{campaign.targetCustomers}</p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {campaign.region}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          Campaign Duration
                        </div>
                        <p className="text-sm font-medium text-gray-900">{new Date(campaign.startDate).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">Until: {new Date(campaign.endDate).toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Budget & Spend
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(campaign.spent)}</p>
                        <p className="text-xs text-gray-500">of {formatCurrency(campaign.budget)}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Performance
                        </div>
                        <p className="text-sm font-semibold text-green-600">{formatCurrency(campaign.totalRevenue)}</p>
                        <p className="text-xs text-gray-500">Revenue generated</p>
                      </div>
                    </div>

                    {/* Parts Included */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-500">
                        <Package className="h-4 w-4 mr-1" />
                        Promotional Parts Categories
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {campaign.partsIncluded.map((part, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {part}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Progress Bars */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Budget Utilization</span>
                          <span className="text-sm font-bold text-blue-600">{budgetUsed}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${
                              budgetUsed >= 90 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                              budgetUsed >= 70 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                              'bg-gradient-to-r from-green-500 to-green-600'
                            }`}
                            style={{ width: `${budgetUsed}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Customer Participation</span>
                          <span className="text-sm font-bold text-purple-600">{participationRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${participationRate}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{campaign.participation.toLocaleString()} participated</span>
                          <span>Target: {campaign.expectedParticipation.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Promotional Inventory */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="border-b border-gray-200/50">
          <CardTitle className="flex items-center text-xl">
            <Package className="h-6 w-6 mr-3 text-blue-500" />
            Promotional Bundle Inventory
            <Badge variant="outline" className="ml-3 bg-blue-50 text-blue-600 border-blue-200">
              {promotionalInventory.length} bundles
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {promotionalInventory.map((kit) => (
              <div key={kit.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{kit.name}</h3>
                        <p className="text-xs text-gray-500">{kit.sku}</p>
                      </div>
                    </div>
                    <Badge className={`text-xs ${
                      kit.available > 100 ? 'bg-green-100 text-green-700 border-green-200' :
                      kit.available > 50 ? 'bg-orange-100 text-orange-700 border-orange-200' :
                      'bg-red-100 text-red-700 border-red-200'
                    }`}>
                      {kit.available} Available
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Bundle Contents */}
                  <div className="space-y-3 mb-6">
                    <div className="text-sm font-medium text-gray-700">Bundle Contents:</div>
                    <div className="space-y-1">
                      {kit.contents.map((item, index) => (
                        <div key={index} className="text-xs text-gray-600 flex items-center">
                          <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Cost</p>
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(kit.costPerKit)}</p>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <p className="text-xs text-gray-500">Promo Price</p>
                      <p className="text-sm font-semibold text-blue-600">{formatCurrency(kit.discountPrice)}</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded-lg">
                      <p className="text-xs text-gray-500">Retail Value</p>
                      <p className="text-sm font-semibold text-green-600">{formatCurrency(kit.retailValue)}</p>
                    </div>
                  </div>
                  
                  {/* Stock Information */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <p className="font-medium text-gray-900">{kit.stock}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Allocated:</span>
                      <p className="font-medium text-orange-600">{kit.allocated}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Available:</span>
                      <p className="font-medium text-green-600">{kit.available}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}