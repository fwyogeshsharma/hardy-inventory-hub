import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  BarChart3, 
  PieChart,
  Calendar,
  Timer,
  Package,
  DollarSign,
  Users,
  Activity,
  Target,
  Zap,
  RefreshCw,
  Download,
  Filter,
  ArrowUp,
  ArrowDown,
  Minus,
  Truck,
  Building2,
  AlertTriangle,
  CheckCircle,
  Star,
  Gauge,
  TrendingDown
} from "lucide-react";

export default function Analytics() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const kpiMetrics = [
    {
      title: "Total Revenue",
      value: "$2.8M",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "from-green-500 to-green-600",
      description: "Monthly automotive parts revenue"
    },
    {
      title: "Inventory Turnover",
      value: "4.2x",
      change: "+0.3x",
      trend: "up", 
      icon: Package,
      color: "from-blue-500 to-blue-600",
      description: "Parts moving through inventory"
    },
    {
      title: "Customer Satisfaction",
      value: "94.8%",
      change: "+2.1%",
      trend: "up",
      icon: Star,
      color: "from-orange-500 to-orange-600",
      description: "Overall customer rating"
    },
    {
      title: "Order Fulfillment",
      value: "96.2%",
      change: "-1.2%",
      trend: "down",
      icon: Truck,
      color: "from-purple-500 to-purple-600",
      description: "On-time delivery performance"
    }
  ];

  const analyticsCategories = [
    {
      title: "Sales Analytics",
      icon: TrendingUp,
      color: "from-blue-500 to-blue-600",
      metrics: [
        { name: "Daily Sales Avg", value: "$45,280", change: "+8.2%", trend: "up" },
        { name: "Top Part Category", value: "Brake Systems", change: "28% of sales", trend: "neutral" },
        { name: "Conversion Rate", value: "68.4%", change: "+3.1%", trend: "up" },
        { name: "Average Order Value", value: "$847", change: "+5.7%", trend: "up" }
      ]
    },
    {
      title: "Inventory Analytics", 
      icon: Package,
      color: "from-green-500 to-green-600",
      metrics: [
        { name: "Stock Accuracy", value: "99.2%", change: "+0.5%", trend: "up" },
        { name: "Low Stock Items", value: "23", change: "-5 items", trend: "up" },
        { name: "Dead Stock Value", value: "$12,450", change: "-8.3%", trend: "up" },
        { name: "Reorder Frequency", value: "2.1/week", change: "+0.2", trend: "up" }
      ]
    },
    {
      title: "Customer Analytics",
      icon: Users,
      color: "from-purple-500 to-purple-600", 
      metrics: [
        { name: "Active Customers", value: "1,247", change: "+156", trend: "up" },
        { name: "Customer Retention", value: "87.3%", change: "+2.8%", trend: "up" },
        { name: "New Acquisitions", value: "89", change: "+12", trend: "up" },
        { name: "Churn Rate", value: "2.1%", change: "-0.4%", trend: "up" }
      ]
    },
    {
      title: "Operational Analytics",
      icon: Activity,
      color: "from-red-500 to-red-600",
      metrics: [
        { name: "Processing Time", value: "1.8 hrs", change: "-0.3 hrs", trend: "up" },
        { name: "Quality Score", value: "98.7%", change: "+1.2%", trend: "up" },
        { name: "Vendor Performance", value: "94.5%", change: "+0.8%", trend: "up" },
        { name: "Return Rate", value: "1.3%", change: "-0.2%", trend: "up" }
      ]
    }
  ];

  const topPerformingParts = [
    { name: "Brake Pads - Premium", sales: "$125,480", growth: "+15.2%", trend: "up" },
    { name: "Oil Filters - Standard", sales: "$98,760", growth: "+8.7%", trend: "up" },
    { name: "Spark Plugs - Performance", sales: "$87,320", growth: "+12.1%", trend: "up" },
    { name: "Air Filters - Heavy Duty", sales: "$76,590", growth: "+6.4%", trend: "up" },
    { name: "Transmission Fluid", sales: "$65,430", growth: "-2.1%", trend: "down" }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUp className="h-3 w-3 text-green-500" />;
      case "down":
        return <ArrowDown className="h-3 w-3 text-red-500" />;
      default:
        return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const formatCurrency = (amount: string) => {
    return amount;
  };

  return (
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Automotive Analytics Hub
          </h1>
          <p className="text-lg text-muted-foreground">
            Advanced business intelligence and performance insights for automotive parts operations
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
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
            <Download className="h-4 w-4 mr-2" />
            Export Analytics
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className={`bg-gradient-to-br ${metric.color} text-white border-0 shadow-lg`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">{metric.title}</p>
                    <p className="text-3xl font-bold">{metric.value}</p>
                    <p className="text-white/80 text-xs mt-1">{metric.description}</p>
                  </div>
                  <IconComponent className="h-10 w-10 text-white/70" />
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-white/90 text-sm">
                    {getTrendIcon(metric.trend)}
                    <span className="ml-1">{metric.change} vs last period</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Categories */}
      <div className="grid gap-6 lg:grid-cols-2">
        {analyticsCategories.map((category, categoryIndex) => {
          const IconComponent = category.icon;
          return (
            <Card key={categoryIndex} className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="border-b border-gray-200/50">
                <CardTitle className="flex items-center text-xl">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center mr-3`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  {category.title}
                  <Badge variant="outline" className="ml-3 bg-blue-50 text-blue-600 border-blue-200">
                    {category.metrics.length} metrics
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {category.metrics.map((metric, metricIndex) => (
                    <div key={metricIndex} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-all duration-200">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{metric.name}</h4>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`flex items-center ${getTrendColor(metric.trend)} text-sm font-medium`}>
                          {getTrendIcon(metric.trend)}
                          <span className="ml-1">{metric.change}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Top Performing Parts */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="border-b border-gray-200/50">
          <CardTitle className="flex items-center text-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center mr-3">
              <Star className="h-5 w-5 text-white" />
            </div>
            Top Performing Parts
            <Badge variant="outline" className="ml-3 bg-blue-50 text-blue-600 border-blue-200">
              This Month
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {topPerformingParts.map((part, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{part.name}</h4>
                    <p className="text-lg font-bold text-green-600">{part.sales}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center ${getTrendColor(part.trend)} text-sm font-medium`}>
                    {getTrendIcon(part.trend)}
                    <span className="ml-1">{part.growth}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Placeholder Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
              Operational Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-muted-foreground border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Revenue trend chart</p>
                <p className="text-xs text-gray-500">Interactive visualization would appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-green-500" />
              Category Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-muted-foreground border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
              <div className="text-center">
                <PieChart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Parts category breakdown</p>
                <p className="text-xs text-gray-500">Pie chart visualization would appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gauge className="h-5 w-5 mr-2 text-purple-500" />
              Performance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-muted-foreground border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
              <div className="text-center">
                <Gauge className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Overall performance gauge</p>
                <p className="text-xs text-gray-500">Gauge chart would appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}