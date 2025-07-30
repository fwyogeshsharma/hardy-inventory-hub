import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  Legend,
  Pie,
  RadialBarChart,
  RadialBar
} from 'recharts';
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
  TrendingDown,
  ShoppingCart
} from "lucide-react";

export default function Analytics() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Chart color palette
  const CHART_COLORS = ['#3997cd', '#2d7aad', '#1e5f8a', '#4a90e2', '#2b5aa0', '#6bb6ff', '#5c85d6', '#7b96dc'];
  
  // Enhanced analytics data for charts
  const monthlyRevenueData = [
    { month: 'Jan', revenue: 2400000, orders: 234, customers: 89, profit: 720000 },
    { month: 'Feb', revenue: 2650000, orders: 267, customers: 94, profit: 795000 },
    { month: 'Mar', revenue: 2780000, orders: 289, customers: 102, profit: 834000 },
    { month: 'Apr', revenue: 2820000, orders: 301, customers: 108, profit: 846000 },
    { month: 'May', revenue: 2800000, orders: 324, customers: 115, profit: 840000 },
    { month: 'Jun', revenue: 2950000, orders: 342, customers: 121, profit: 885000 }
  ];

  const categoryDistributionData = [
    { name: 'Engine Parts', value: 1245000, percentage: 35.5, count: 4521 },
    { name: 'Brake Systems', value: 890000, percentage: 25.4, count: 3240 },
    { name: 'Electrical', value: 675000, percentage: 19.3, count: 2890 },
    { name: 'Filters', value: 423000, percentage: 12.1, count: 2156 },
    { name: 'Suspension', value: 267000, percentage: 7.6, count: 1200 }
  ];

  const performanceScoreData = [
    { name: 'Revenue Growth', score: 85, target: 90, fill: '#3997cd' },
    { name: 'Customer Satisfaction', score: 92, target: 95, fill: '#2d7aad' },
    { name: 'Inventory Efficiency', score: 78, target: 85, fill: '#1e5f8a' },
    { name: 'Order Fulfillment', score: 96, target: 98, fill: '#4a90e2' }
  ];

  const inventoryTurnoverData = [
    { category: 'Engine Parts', turnover: 4.2, value: 985420, optimal: 4.5 },
    { category: 'Brake Components', turnover: 3.8, value: 675890, optimal: 4.0 },
    { category: 'Electrical', turnover: 3.4, value: 534210, optimal: 3.5 },
    { category: 'Filters', turnover: 5.1, value: 298750, optimal: 5.0 },
    { category: 'Suspension', turnover: 2.9, value: 166250, optimal: 3.2 }
  ];

  const customerGrowthData = [
    { month: 'Jan', newCustomers: 23, totalCustomers: 891, retention: 87.2 },
    { month: 'Feb', newCustomers: 31, totalCustomers: 922, retention: 88.1 },
    { month: 'Mar', newCustomers: 28, totalCustomers: 950, retention: 87.8 },
    { month: 'Apr', newCustomers: 35, totalCustomers: 985, retention: 89.2 },
    { month: 'May', newCustomers: 42, totalCustomers: 1027, retention: 88.9 },
    { month: 'Jun', newCustomers: 38, totalCustomers: 1065, retention: 89.5 }
  ];

  const kpiMetrics = [
    {
      title: "Total Revenue",
      value: "$2.95M",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "from-[#3997cd] to-[#2d7aad]",
      description: "Monthly automotive parts revenue"
    },
    {
      title: "Inventory Turnover",
      value: "4.2x",
      change: "+0.3x",
      trend: "up", 
      icon: Package,
      color: "from-[#3997cd] to-[#2d7aad]",
      description: "Parts moving through inventory"
    },
    {
      title: "Customer Satisfaction",
      value: "94.8%",
      change: "+2.1%",
      trend: "up",
      icon: Star,
      color: "from-[#3997cd] to-[#2d7aad]",
      description: "Overall customer rating"
    },
    {
      title: "Order Fulfillment",
      value: "96.2%",
      change: "-1.2%",
      trend: "down",
      icon: Truck,
      color: "from-[#3997cd] to-[#2d7aad]",
      description: "On-time delivery performance"
    }
  ];

  const analyticsCategories = [
    {
      title: "Sales Analytics",
      icon: TrendingUp,
      color: "from-[#3997cd] to-[#2d7aad]",
      metrics: [
        { name: "Daily Sales Avg", value: "$48,280", change: "+8.2%", trend: "up" },
        { name: "Top Part Category", value: "Engine Parts", change: "35% of sales", trend: "neutral" },
        { name: "Conversion Rate", value: "68.4%", change: "+3.1%", trend: "up" },
        { name: "Average Order Value", value: "$1,247", change: "+5.7%", trend: "up" }
      ]
    },
    {
      title: "Inventory Analytics", 
      icon: Package,
      color: "from-[#3997cd] to-[#2d7aad]",
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
      color: "from-[#3997cd] to-[#2d7aad]", 
      metrics: [
        { name: "Active Customers", value: "1,065", change: "+156", trend: "up" },
        { name: "Customer Retention", value: "89.5%", change: "+2.8%", trend: "up" },
        { name: "New Acquisitions", value: "38", change: "+12", trend: "up" },
        { name: "Churn Rate", value: "2.1%", change: "-0.4%", trend: "up" }
      ]
    },
    {
      title: "Operational Analytics",
      icon: Activity,
      color: "from-[#3997cd] to-[#2d7aad]",
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
    <div className="flex-1 space-y-6 p-6 min-h-screen" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e6f2fa 100%)'}}>
      {/* Header Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold" style={{color: '#3997cd'}}>
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
          <Button className="text-white shadow-lg" style={{backgroundColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3997cd'}>
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
                  <Badge variant="outline" className="ml-3" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#3997cd] to-[#2d7aad] flex items-center justify-center mr-3">
              <Star className="h-5 w-5 text-white" />
            </div>
            Top Performing Parts
            <Badge variant="outline" className="ml-3" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
              This Month
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {topPerformingParts.map((part, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#3997cd] to-[#2d7aad] flex items-center justify-center text-white font-bold text-sm">
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

      {/* Interactive Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend Chart */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
              6-Month Revenue & Orders Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis yAxisId="revenue" stroke="#666" />
                <YAxis yAxisId="orders" orientation="right" stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #3997cd',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name) => [
                    name === 'revenue' ? `$${(value/1000000).toFixed(2)}M` : 
                    name === 'profit' ? `$${(value/1000000).toFixed(2)}M` : value,
                    name === 'revenue' ? 'Revenue' : name === 'profit' ? 'Profit' : 'Orders'
                  ]}
                />
                <Bar yAxisId="revenue" dataKey="revenue" fill="#3997cd" radius={[4, 4, 0, 0]} />
                <Line 
                  yAxisId="orders" 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#2d7aad" 
                  strokeWidth={3}
                  dot={{ fill: '#2d7aad', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  yAxisId="revenue" 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#1e5f8a" 
                  strokeWidth={2}
                  dot={{ fill: '#1e5f8a', strokeWidth: 2, r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution Pie Chart */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
              Sales by Category Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RechartsPieChart>
                <Pie
                  data={categoryDistributionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                >
                  {categoryDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${(value/1000000).toFixed(2)}M`, 'Revenue']} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Customer Growth Chart */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
              Customer Growth & Retention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={customerGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis yAxisId="customers" stroke="#666" />
                <YAxis yAxisId="retention" orientation="right" stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #3997cd',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name) => [
                    name === 'retention' ? `${value}%` : value,
                    name === 'newCustomers' ? 'New Customers' : 
                    name === 'totalCustomers' ? 'Total Customers' : 'Retention Rate'
                  ]}
                />
                <Bar yAxisId="customers" dataKey="newCustomers" fill="#3997cd" radius={[4, 4, 0, 0]} />
                <Line 
                  yAxisId="customers" 
                  type="monotone" 
                  dataKey="totalCustomers" 
                  stroke="#2d7aad" 
                  strokeWidth={3}
                  dot={{ fill: '#2d7aad', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  yAxisId="retention" 
                  type="monotone" 
                  dataKey="retention" 
                  stroke="#1e5f8a" 
                  strokeWidth={2}
                  dot={{ fill: '#1e5f8a', strokeWidth: 2, r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inventory Turnover Chart */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
              Inventory Turnover Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryTurnoverData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#666" />
                <YAxis dataKey="category" type="category" stroke="#666" width={120} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #3997cd',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name) => [
                    name === 'turnover' ? `${value}x` : 
                    name === 'optimal' ? `${value}x` : `$${value.toLocaleString()}`,
                    name === 'turnover' ? 'Current Turnover' : 
                    name === 'optimal' ? 'Optimal Target' : 'Inventory Value'
                  ]}
                />
                <Bar dataKey="turnover" fill="#3997cd" radius={[0, 4, 4, 0]} />
                <Bar dataKey="optimal" fill="#2d7aad" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Scores Radial Chart */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gauge className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
            Performance Score Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={performanceScoreData}>
              <RadialBar
                dataKey="score"
                cornerRadius={10}
                fill="#3997cd"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #3997cd',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [`${value}%`, 'Current Score']}
              />
              <Legend 
                iconSize={12}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}