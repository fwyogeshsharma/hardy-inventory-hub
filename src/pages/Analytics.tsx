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
  RadialBar,
  Scatter,
  ScatterChart,
  ZAxis,
  ReferenceLine,
  Treemap
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
    { month: 'Jan', revenue: 2400000, orders: 234, customers: 89, profit: 720000, profitMargin: 30.0, growth: 5.2 },
    { month: 'Feb', revenue: 2650000, orders: 267, customers: 94, profit: 795000, profitMargin: 30.0, growth: 10.4 },
    { month: 'Mar', revenue: 2780000, orders: 289, customers: 102, profit: 834000, profitMargin: 30.0, growth: 4.9 },
    { month: 'Apr', revenue: 2820000, orders: 301, customers: 108, profit: 846000, profitMargin: 30.0, growth: 1.4 },
    { month: 'May', revenue: 2800000, orders: 324, customers: 115, profit: 840000, profitMargin: 30.0, growth: -0.7 },
    { month: 'Jun', revenue: 2950000, orders: 342, customers: 121, profit: 885000, profitMargin: 30.0, growth: 5.4 },
    { month: 'Jul', revenue: 3100000, orders: 356, customers: 128, profit: 930000, profitMargin: 30.0, growth: 5.1 },
    { month: 'Aug', revenue: 3250000, orders: 378, customers: 135, profit: 975000, profitMargin: 30.0, growth: 4.8 }
  ];

  const categoryDistributionData = [
    { name: 'Engine Parts', value: 1245000, percentage: 35.5, count: 4521 },
    { name: 'Brake Systems', value: 890000, percentage: 25.4, count: 3240 },
    { name: 'Electrical', value: 675000, percentage: 19.3, count: 2890 },
    { name: 'Filters', value: 423000, percentage: 12.1, count: 2156 },
    { name: 'Suspension', value: 267000, percentage: 7.6, count: 1200 }
  ];

  const performanceScoreData = [
    { name: 'Revenue Growth', score: 85, target: 90, fill: '#3997cd', angle: 306, fullMark: 100 },
    { name: 'Customer Satisfaction', score: 92, target: 95, fill: '#2d7aad', angle: 331.2, fullMark: 100 },
    { name: 'Inventory Efficiency', score: 78, target: 85, fill: '#1e5f8a', angle: 280.8, fullMark: 100 },
    { name: 'Order Fulfillment', score: 96, target: 98, fill: '#4a90e2', angle: 345.6, fullMark: 100 },
    { name: 'Quality Score', score: 94, target: 96, fill: '#6bb6ff', angle: 338.4, fullMark: 100 },
    { name: 'Vendor Performance', score: 88, target: 92, fill: '#5c85d6', angle: 316.8, fullMark: 100 }
  ];

  const inventoryTurnoverData = [
    { category: 'Engine Parts', turnover: 4.2, value: 985420, optimal: 4.5, velocity: 'High', stockDays: 87 },
    { category: 'Brake Components', turnover: 3.8, value: 675890, optimal: 4.0, velocity: 'Medium', stockDays: 96 },
    { category: 'Electrical', turnover: 3.4, value: 534210, optimal: 3.5, velocity: 'Medium', stockDays: 107 },
    { category: 'Filters', turnover: 5.1, value: 298750, optimal: 5.0, velocity: 'High', stockDays: 72 },
    { category: 'Suspension', turnover: 2.9, value: 166250, optimal: 3.2, velocity: 'Low', stockDays: 126 },
    { category: 'Fluids', turnover: 6.2, value: 145000, optimal: 6.0, velocity: 'Very High', stockDays: 59 }
  ];

  const customerGrowthData = [
    { month: 'Jan', newCustomers: 23, totalCustomers: 891, retention: 87.2, churn: 12.8, revenue: 2400000 },
    { month: 'Feb', newCustomers: 31, totalCustomers: 922, retention: 88.1, churn: 11.9, revenue: 2650000 },
    { month: 'Mar', newCustomers: 28, totalCustomers: 950, retention: 87.8, churn: 12.2, revenue: 2780000 },
    { month: 'Apr', newCustomers: 35, totalCustomers: 985, retention: 89.2, churn: 10.8, revenue: 2820000 },
    { month: 'May', newCustomers: 42, totalCustomers: 1027, retention: 88.9, churn: 11.1, revenue: 2800000 },
    { month: 'Jun', newCustomers: 38, totalCustomers: 1065, retention: 89.5, churn: 10.5, revenue: 2950000 },
    { month: 'Jul', newCustomers: 45, totalCustomers: 1110, retention: 90.1, churn: 9.9, revenue: 3100000 },
    { month: 'Aug', newCustomers: 52, totalCustomers: 1162, retention: 90.8, churn: 9.2, revenue: 3250000 }
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

  // Custom Treemap Content Component
  const CustomTreemapContent = (props: any) => {
    const { root, depth, x, y, width, height, index, payload, colors, rank, name } = props;
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: CHART_COLORS[index % CHART_COLORS.length],
            stroke: '#fff',
            strokeWidth: 2,
            strokeOpacity: 1,
          }}
        />
        {width > 60 && height > 40 && (
          <text x={x + width / 2} y={y + height / 2} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
            {name}
          </text>
        )}
        {width > 60 && height > 60 && (
            <text x={x + width / 2} y={y + height / 2 + 16} textAnchor="middle" fill="white" fontSize="10">
              {(payload?.value / 1000000)?.toFixed(1) ?? '0.0'}M
            </text>
        )}
        {width > 60 && height > 80 && (
            <text x={x + width / 2} y={y + height / 2 + 30} textAnchor="middle" fill="white" fontSize="10">
              {payload?.percentage ?? 0}%
            </text>
        )}
      </g>
    );
  };

  return (
      <div className="flex-1 space-y-6 p-6 min-h-screen"
           style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e6f2fa 100%)'}}>
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
          <Badge variant="outline" className="bg-white">
            <Timer className="h-3 w-3 mr-1" />
            {currentTime.toLocaleTimeString('en-US', { hour12: false })}
          </Badge>
          <Badge variant="outline" className="bg-white">
            <Calendar className="h-3 w-3 mr-1" />
            {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Badge>
          <Button variant="outline" size="sm" className="bg-white">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="bg-white">
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
            <Card key={categoryIndex} className="bg-white border-0 shadow-lg">
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
      <Card className="bg-white border-0 shadow-lg">
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
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
              6-Month Revenue & Orders Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={monthlyRevenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3997cd" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3997cd" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2d7aad" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2d7aad" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #3997cd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => [
                    name === 'revenue' ? `$${(value/1000000).toFixed(2)}M` : 
                    name === 'profit' ? `$${(value/1000000).toFixed(2)}M` : 
                    name === 'growth' ? `${value}%` : value,
                    name === 'revenue' ? 'Revenue' : 
                    name === 'profit' ? 'Profit' : 
                    name === 'growth' ? 'Growth Rate' : name
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3997cd" 
                  fillOpacity={1} 
                  fill="url(#revenueGradient)" 
                  strokeWidth={3}
                />
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#2d7aad" 
                  fillOpacity={1} 
                  fill="url(#profitGradient)" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="growth" 
                  stroke="#1e5f8a" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#1e5f8a', strokeWidth: 2, r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Enhanced Category Treemap */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
              Category Performance Treemap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
  <Treemap
    data={
      categoryDistributionData && categoryDistributionData.length > 0
        ? categoryDistributionData
        : [
            { name: 'Engine Parts', value: Math.floor(Math.random() * 6000000) + 1500000, percentage: Math.random() * 35 },
            { name: 'Suspension', value: Math.floor(Math.random() * 4000000) + 1000000, percentage: Math.random() * 25 },
            { name: 'Brakes', value: Math.floor(Math.random() * 3000000) + 800000, percentage: Math.random() * 20 },
            { name: 'Electrical', value: Math.floor(Math.random() * 2500000) + 600000, percentage: Math.random() * 15 },
            { name: 'Transmission', value: Math.floor(Math.random() * 2000000) + 500000, percentage: Math.random() * 10 },
          ]
    }
    dataKey="value"
    stroke="#fff"
    strokeWidth={2}
    content={<CustomTreemapContent />}
  >
    <Tooltip
      formatter={(value) => [`$${(value / 1000000).toFixed(2)}M`, 'Revenue']}
      labelFormatter={(label) => `Category: ${label}`}
      contentStyle={{
        backgroundColor: '#fff',
        border: '1px solid #3997cd',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    />
  </Treemap>
</ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Enhanced Customer Analytics Chart */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
              Customer Analytics Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={customerGrowthData}>
                <defs>
                  <linearGradient id="customerGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3997cd" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3997cd" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis yAxisId="customers" stroke="#666" />
                <YAxis yAxisId="retention" orientation="right" stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #3997cd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => [
                    name === 'retention' || name === 'churn' ? `${value}%` : value,
                    name === 'newCustomers' ? 'New Customers' : 
                    name === 'totalCustomers' ? 'Total Customers' : 
                    name === 'retention' ? 'Retention Rate' : 'Churn Rate'
                  ]}
                />
                <ReferenceLine yAxisId="retention" y={90} stroke="#ff6b6b" strokeDasharray="8 8" label={{ value: "Target 90%", position: "topRight" }} />
                <Area 
                  yAxisId="customers"
                  type="monotone" 
                  dataKey="newCustomers" 
                  stroke="#3997cd" 
                  fillOpacity={1} 
                  fill="url(#customerGradient)" 
                  strokeWidth={2}
                />
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
                  strokeWidth={3}
                  dot={{ fill: '#1e5f8a', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  yAxisId="retention" 
                  type="monotone" 
                  dataKey="churn" 
                  stroke="#ff6b6b" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={{ fill: '#ff6b6b', strokeWidth: 2, r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Advanced Inventory Scatter Plot */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
              Inventory Performance Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart data={inventoryTurnoverData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  type="number" 
                  dataKey="turnover" 
                  name="Turnover Rate" 
                  stroke="#666"
                  label={{ value: 'Turnover Rate (x)', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="stockDays" 
                  name="Days in Stock" 
                  stroke="#666"
                  label={{ value: 'Days in Stock', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis type="number" dataKey="value" range={[50, 400]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #3997cd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name, props) => [
                    name === 'turnover' ? `${value}x` : 
                    name === 'stockDays' ? `${value} days` :
                    name === 'value' ? `$${value.toLocaleString()}` : value,
                    name === 'turnover' ? 'Turnover Rate' : 
                    name === 'stockDays' ? 'Days in Stock' :
                    name === 'value' ? 'Inventory Value' : name
                  ]}
                  labelFormatter={(label) => `Category: ${inventoryTurnoverData[label]?.category || 'Unknown'}`}
                />
                <Scatter name="Categories" dataKey="stockDays" fill="#3997cd">
                  {inventoryTurnoverData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Scatter>
                <ReferenceLine x={4} stroke="#ff6b6b" strokeDasharray="5 5" label={{ value: "Target Turnover", position: "topRight" }} />
                <ReferenceLine y={90} stroke="#ff6b6b" strokeDasharray="5 5" label={{ value: "Target Days", position: "topLeft" }} />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Performance Dashboard */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Performance Scores Radial Chart */}
        <Card className="lg:col-span-2 bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gauge className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
              Performance Score Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={performanceScoreData}>
                <RadialBar
                  dataKey="score"
                  cornerRadius={8}
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {performanceScoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </RadialBar>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #3997cd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name, props) => [
                    `${value}% (Target: ${props.payload.target}%)`,
                    'Performance Score'
                  ]}
                  labelFormatter={(label) => `${performanceScoreData[label]?.name || 'Metric'}`}
                />
                <Legend 
                  iconSize={12}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ paddingLeft: '20px' }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Metrics Summary */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" style={{color: '#3997cd'}} />
              Score Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {performanceScoreData.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: metric.fill }}
                  ></div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{metric.name}</p>
                    <p className="text-xs text-gray-500">Target: {metric.target}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold" style={{ color: metric.fill }}>{metric.score}%</p>
                  <p className={`text-xs ${
                    metric.score >= metric.target ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.score >= metric.target ? '✓ On Target' : '⚠ Below Target'}
                  </p>
                </div>
              </div>
            ))}
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-700">Overall Score</span>
                <span className="text-xl font-bold text-blue-600">
                  {Math.round(performanceScoreData.reduce((acc, curr) => acc + curr.score, 0) / performanceScoreData.length)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Add any types needed for TypeScript
interface TreemapContentProps {
  root?: any;
  depth?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  payload?: any;
  colors?: string[];
  rank?: number;
  name?: string;
}