import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormModal } from "@/components/forms/FormModal";
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
  Pie
} from 'recharts';
import { 
  FileText, 
  Download, 
  Calendar, 
  Timer,
  TrendingUp,
  BarChart3,
  PieChart,
  Package,
  Users,
  DollarSign,
  Truck,
  Activity,
  Clock,
  RefreshCw,
  Filter,
  Eye,
  FileBarChart,
  FileSpreadsheet,
  Settings,
  CheckCircle,
  AlertTriangle,
  Building2,
  Wrench,
  X,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Minus,
  ShoppingCart
} from "lucide-react";

export default function Reports() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Chart color palette
  const CHART_COLORS = ['#3997cd', '#2d7aad', '#1e5f8a', '#4a90e2', '#2b5aa0', '#6bb6ff', '#1a472a', '#ff8c42'];
  
  // Helper component for trend indicators
  const TrendIndicator = ({ value, isPercentage = false }) => {
    const isPositive = value > 0;
    const isNegative = value < 0;
    const isNeutral = value === 0;
    
    return (
      <div className={`flex items-center text-sm ${
        isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500'
      }`}>
        {isPositive && <ArrowUp className="h-3 w-3 mr-1" />}
        {isNegative && <ArrowDown className="h-3 w-3 mr-1" />}
        {isNeutral && <Minus className="h-3 w-3 mr-1" />}
        {isPositive ? '+' : ''}{value}{isPercentage ? '%' : ''}
      </div>
    );
  };

  // Fake data for reports
  const fakeReportData = {
    1: { // Stock Ledger Report
      title: "Stock Ledger Report",
      data: {
        totalItems: 15847,
        totalValue: 2847950,
        categories: [
          { name: "Engine Parts", items: 4521, value: 985420, change: +8.2 },
          { name: "Brake Components", items: 3240, value: 675890, change: +12.5 },
          { name: "Electrical Systems", items: 2890, value: 534210, change: -3.1 },
          { name: "Filters", items: 2156, value: 298750, change: +15.8 },
          { name: "Fluids & Lubricants", items: 1840, value: 187430, change: +5.2 },
          { name: "Suspension Parts", items: 1200, value: 166250, change: -1.8 }
        ],
        monthlyTrend: [
          { month: 'Jan', items: 14200, value: 2650000 },
          { month: 'Feb', items: 14800, value: 2720000 },
          { month: 'Mar', items: 15200, value: 2780000 },
          { month: 'Apr', items: 15600, value: 2820000 },
          { month: 'May', items: 15847, value: 2847950 },
        ],
        topMovers: [
          { sku: "BRK-PAD-001", name: "Ceramic Brake Pads", movement: 245, type: "out" },
          { sku: "ENG-FIL-023", name: "Oil Filter Premium", movement: 189, type: "out" },
          { sku: "ELE-BAT-012", name: "Car Battery 12V", movement: 156, type: "in" },
          { sku: "SUS-SHK-008", name: "Shock Absorber", movement: 134, type: "out" }
        ]
      }
    },
    2: { // Low Stock Alert
      title: "Low Stock Alert Report",
      data: {
        criticalItems: 23,
        lowStockItems: 67,
        totalAffectedValue: 145750,
        urgentItems: [
          { sku: "BRK-PAD-045", name: "Ceramic Brake Pads - Honda", current: 5, minimum: 25, reorderQty: 100, supplier: "ACDelco", leadTime: "3-5 days" },
          { sku: "ENG-OIL-012", name: "Synthetic Motor Oil 5W-30", current: 12, minimum: 50, reorderQty: 200, supplier: "Mobil1", leadTime: "2-3 days" },
          { sku: "FIL-AIR-087", name: "Air Filter - Toyota Camry", current: 8, minimum: 30, reorderQty: 150, supplier: "Mann Filter", leadTime: "4-6 days" },
          { sku: "ELE-SPK-019", name: "Iridium Spark Plugs", current: 15, minimum: 40, reorderQty: 120, supplier: "NGK", leadTime: "5-7 days" },
          { sku: "SUS-STR-024", name: "Front Strut Assembly", current: 3, minimum: 15, reorderQty: 50, supplier: "Monroe", leadTime: "7-10 days" }
        ]
      }
    },
    3: { // ABC Analysis (was renamed to Inventory Performance)
      title: "Inventory Performance Report",
      data: {
        totalSKUs: 8945,
        categoryA: { count: 895, value: 1847500, percentage: 65 },
        categoryB: { count: 1789, value: 854200, percentage: 30 },
        categoryC: { count: 6261, value: 142100, percentage: 5 },
        topPerformers: [
          { sku: "ENG-OIL-001", name: "Premium Motor Oil", revenue: 89450, margin: 32.5, turnover: 24.8 },
          { sku: "BRK-PAD-002", name: "Brake Pad Set", revenue: 67890, margin: 28.9, turnover: 18.2 },
          { sku: "FIL-OIL-003", name: "Oil Filter", revenue: 54320, margin: 35.1, turnover: 32.1 },
          { sku: "ELE-BAT-001", name: "Car Battery", revenue: 45670, margin: 22.8, turnover: 12.4 }
        ]
      }
    },
    4: { // Sales Performance
      title: "Sales Performance Report",
      data: {
        totalRevenue: 1245750,
        monthlyGrowth: 12.8,
        revenueByMonth: [
          { month: 'Jan', revenue: 945000, orders: 234, customers: 89 },
          { month: 'Feb', revenue: 1020000, orders: 267, customers: 94 },
          { month: 'Mar', revenue: 1150000, orders: 289, customers: 102 },
          { month: 'Apr', revenue: 1180000, orders: 301, customers: 108 },
          { month: 'May', revenue: 1245750, orders: 324, customers: 115 }
        ],
        topCustomers: [
          { name: "AutoZone Distribution", revenue: 245680, orders: 89, growth: +15.2 },
          { name: "NAPA Auto Parts", revenue: 189420, orders: 67, growth: +8.9 },
          { name: "O'Reilly Auto Parts", revenue: 156780, orders: 54, growth: +22.1 },
          { name: "Advance Auto Parts", revenue: 134560, orders: 43, growth: +6.7 }
        ],
        categoryPerformance: [
          { category: "Engine Parts", revenue: 387450, growth: +18.5, margin: 31.2 },
          { category: "Brake Systems", revenue: 298760, growth: +12.1, margin: 28.7 },
          { category: "Electrical", revenue: 234890, growth: +9.8, margin: 25.3 },
          { category: "Filters", revenue: 189650, growth: +25.4, margin: 38.9 }
        ]
      }
    },
    5: { // Customer Analysis
      title: "Customer Analysis Report",
      data: {
        totalCustomers: 1247,
        activeCustomers: 892,
        averageOrderValue: 1847,
        customerSegments: [
          { segment: "Large Distributors", count: 28, revenue: 687450, avgOrder: 3892 },
          { segment: "Regional Retailers", count: 156, revenue: 445670, avgOrder: 1654 },
          { segment: "Service Centers", count: 234, revenue: 298450, avgOrder: 987 },
          { segment: "Independent Shops", count: 474, revenue: 189340, avgOrder: 456 }
        ],
        retentionMetrics: {
          newCustomers: 45,
          returningCustomers: 847,
          churnRate: 3.2,
          lifetimeValue: 8945
        }
      }
    },
    6: { // Profit Margin Analysis
      title: "Profit Margin Analysis Report",
      data: {
        overallMargin: 29.8,
        totalProfit: 724580,
        marginByCategory: [
          { category: "Filters", margin: 42.5, profit: 126780, trend: +2.8 },
          { category: "Fluids", margin: 38.9, profit: 89450, trend: +1.2 },
          { category: "Engine Parts", margin: 31.2, profit: 198760, trend: -0.5 },
          { category: "Electrical", margin: 28.7, profit: 156890, trend: +3.1 },
          { category: "Brake Systems", margin: 25.3, profit: 134560, trend: +1.8 },
          { category: "Suspension", margin: 22.1, profit: 87430, trend: -1.2 }
        ],
        topProfitableSKUs: [
          { sku: "FIL-AIR-001", name: "Premium Air Filter", margin: 48.5, profit: 12450 },
          { sku: "FLD-OIL-002", name: "Synthetic Oil", margin: 45.2, profit: 15670 },
          { sku: "ENG-SPK-003", name: "Platinum Spark Plugs", margin: 41.8, profit: 9890 }
        ]
      }
    },
    7: { // Vendor Performance
      title: "Vendor Performance Report",
      data: {
        totalVendors: 48,
        activeVendors: 32,
        averageRating: 4.2,
        topVendors: [
          { name: "ACDelco Supply Chain", rating: 4.8, onTime: 96, orders: 145, value: 245670 },
          { name: "Bosch Automotive", rating: 4.9, onTime: 98, orders: 123, value: 198450 },
          { name: "Monroe Ride Solutions", rating: 4.6, onTime: 94, orders: 89, value: 156780 },
          { name: "NGK Spark Plug Supply", rating: 4.7, onTime: 92, orders: 67, value: 134560 }
        ],
        performanceMetrics: {
          avgDeliveryTime: 4.2,
          qualityRating: 4.1,
          priceCompetitiveness: 3.8,
          totalPurchaseValue: 1547890
        }
      }
    },
    8: { // Order Fulfillment
      title: "Order Fulfillment Report",
      data: {
        totalOrders: 2847,
        fulfilledOrders: 2634,
        fulfillmentRate: 92.5,
        avgProcessingTime: 2.3,
        orderMetrics: [
          { status: "Delivered", count: 2456, percentage: 86.3 },
          { status: "In Transit", count: 178, percentage: 6.2 },
          { status: "Processing", count: 124, percentage: 4.4 },
          { status: "Pending", count: 89, percentage: 3.1 }
        ],
        performanceByRegion: [
          { region: "Northeast", orders: 847, onTime: 94.2, avgTime: 2.1 },
          { region: "Southeast", orders: 692, onTime: 91.8, avgTime: 2.4 },
          { region: "Midwest", orders: 578, onTime: 93.5, avgTime: 2.2 },
          { region: "West Coast", orders: 730, onTime: 89.7, avgTime: 2.6 }
        ]
      }
    },
    9: { // Production Efficiency
      title: "Production Efficiency Report",
      data: {
        overallEfficiency: 87.4,
        totalOutput: 15670,
        defectRate: 0.8,
        efficiencyMetrics: [
          { department: "Engine Assembly", efficiency: 91.2, output: 4567, defects: 12 },
          { department: "Brake Manufacturing", efficiency: 88.9, output: 3890, defects: 18 },
          { department: "Electrical Components", efficiency: 85.1, output: 2890, defects: 15 },
          { department: "Filter Production", efficiency: 92.8, output: 2456, defects: 8 },
          { department: "Quality Control", efficiency: 94.5, throughput: 1867, rejections: 23 }
        ],
        resourceUtilization: {
          machinery: 84.2,
          labor: 89.1,
          materials: 91.7,
          energy: 76.8
        }
      }
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setReportModalOpen(true);
  };

  const handleExportReport = async (report) => {
    // Create a fake PDF blob for download
    const fakeData = fakeReportData[report.id];
    const reportContent = `
${fakeData.title}
Generated on: ${new Date().toLocaleDateString()}

Report Summary:
${JSON.stringify(fakeData.data, null, 2)}

This is a demonstration report with realistic automotive parts inventory data.
Generated by Hardy Inventory Hub - Automotive Parts Management System.
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const reportCategories = [
    {
      category: "Inventory Reports",
      icon: Package,
      color: "from-[#3997cd] to-[#2d7aad]",
      reports: [
        {
          id: 1,
          name: "Stock Ledger Report",
          description: "Comprehensive inventory movements and current balances",
          lastGenerated: "2 hours ago",
          status: "Ready",
          frequency: "Daily",
          format: "PDF, Excel",
          icon: FileSpreadsheet
        },
        {
          id: 2,
          name: "Low Stock Alert",
          description: "Parts below minimum threshold levels",
          lastGenerated: "30 minutes ago",
          status: "Alert",
          frequency: "Real-time",
          format: "PDF, Email",
          icon: AlertTriangle
        },
        {
          id: 3,
          name: " Inventory performance report",
          description: "Parts categorized by value and movement frequency",
          lastGenerated: "1 day ago",
          status: "Scheduled",
          frequency: "Weekly",
          format: "Excel, CSV",
          icon: BarChart3
        }
      ]
    },
    {
      category: "Sales & Financial Reports",
      icon: DollarSign,
      color: "from-[#3997cd] to-[#2d7aad]",
      reports: [
        {
          id: 4,
          name: "Sales Performance",
          description: "Revenue analysis by parts category and customer segment",
          lastGenerated: "1 hour ago",
          status: "Ready",
          frequency: "Daily",
          format: "PDF, Excel",
          icon: TrendingUp
        },
        {
          id: 5,
          name: "Customer Analysis",
          description: "Top customers, purchase patterns, and payment history",
          lastGenerated: "4 hours ago",
          status: "Ready",
          frequency: "Weekly",
          format: "PDF, Excel",
          icon: Users
        },
        {
          id: 6,
          name: "Profit Margin Analysis",
          description: "Cost vs. selling price analysis by part category",
          lastGenerated: "6 hours ago",
          status: "Processing",
          frequency: "Monthly",
          format: "Excel, PDF",
          icon: PieChart
        }
      ]
    },
    {
      category: "Operations Reports",
      icon: Activity,
      color: "from-[#3997cd] to-[#2d7aad]",
      reports: [
        {
          id: 7,
          name: "Vendor Performance",
          description: "Supplier delivery times, quality ratings, and costs",
          lastGenerated: "3 hours ago",
          status: "Ready",
          frequency: "Weekly",
          format: "PDF, Excel",
          icon: Building2
        },
        {
          id: 8,
          name: "Order Fulfillment",
          description: "Order processing times and delivery performance",
          lastGenerated: "1 hour ago",
          status: "Ready",
          frequency: "Daily",
          format: "PDF, CSV",
          icon: Truck
        },
        {
          id: 9,
          name: "Production Efficiency",
          description: "Manufacturing output and resource utilization",
          lastGenerated: "45 minutes ago",
          status: "Ready",
          frequency: "Shift-based",
          format: "Excel, PDF",
          icon: Wrench
        }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Ready":
        return (
          <Badge className="shadow-sm" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
            <CheckCircle className="h-3 w-3 mr-1" />
            Ready
          </Badge>
        );
      case "Processing":
        return (
          <Badge className="shadow-sm" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        );
      case "Alert":
        return (
          <Badge className="shadow-sm" style={{backgroundColor: '#fff3cd', color: '#856404', borderColor: '#ffeaa7'}}>
            <AlertTriangle className="h-3 w-3 mr-1" />
            Alert
          </Badge>
        );
      case "Scheduled":
        return (
          <Badge className="shadow-sm" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
            <Calendar className="h-3 w-3 mr-1" />
            Scheduled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTotalReports = () => reportCategories.reduce((sum, cat) => sum + cat.reports.length, 0);
  const getReadyReports = () => reportCategories.reduce((sum, cat) => sum + cat.reports.filter(r => r.status === "Ready").length, 0);
  const getAlertReports = () => reportCategories.reduce((sum, cat) => sum + cat.reports.filter(r => r.status === "Alert").length, 0);

  return (
    <div className="flex-1 space-y-6 p-6 min-h-screen" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e6f2fa 100%)'}}>
      {/* Header Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold" style={{color: '#3997cd'}}>
            Automotive Reports Hub
          </h1>
          <p className="text-lg text-muted-foreground">
            Generate and analyze comprehensive automotive parts business intelligence
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
            Export All
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Reports</p>
                <p className="text-3xl font-bold">{getTotalReports()}</p>
                <p className="text-blue-100 text-xs mt-1">Available report types</p>
              </div>
              <FileText className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +3 new reports this month
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Ready Reports</p>
                <p className="text-3xl font-bold">{getReadyReports()}</p>
                <p className="text-blue-100 text-xs mt-1">Available for download</p>
              </div>
              <CheckCircle className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                Last updated: 30 min ago
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Alert Reports</p>
                <p className="text-3xl font-bold">{getAlertReports()}</p>
                <p className="text-blue-100 text-xs mt-1">Require attention</p>
              </div>
              <AlertTriangle className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <Activity className="h-4 w-4 mr-1" />
                Critical thresholds exceeded
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Categories */}
      {reportCategories.map((category, categoryIndex) => {
        const IconComponent = category.icon;
        return (
          <Card key={categoryIndex} className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="border-b border-gray-200/50">
              <CardTitle className="flex items-center text-xl">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center mr-3`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                {category.category}
                <Badge variant="outline" className="ml-3" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
                  {category.reports.length} reports
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {category.reports.map((report) => {
                  const ReportIcon = report.icon;
                  return (
                    <div key={report.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer">
                      {/* Header */}
                      <div className="p-6 border-b border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
                              <ReportIcon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{report.name}</h3>
                              <p className="text-xs text-gray-500">Updated: {report.lastGenerated}</p>
                            </div>
                          </div>
                          {getStatusBadge(report.status)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Frequency:</span>
                            <span className="font-medium text-gray-900">{report.frequency}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Formats:</span>
                            <span className="font-medium text-gray-900">{report.format}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1" 
                            style={{backgroundColor: '#e6f2fa', borderColor: '#3997cd', color: '#3997cd'}} 
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d1e7dd'} 
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e6f2fa'}
                            onClick={() => handleViewReport(report)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1 text-white" 
                            style={{backgroundColor: '#3997cd'}} 
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d7aad'} 
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3997cd'}
                            onClick={() => handleExportReport(report)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Report View Modal */}
      <FormModal
        isOpen={reportModalOpen}
        onClose={() => {
          setReportModalOpen(false);
          setSelectedReport(null);
        }}
        title={selectedReport ? fakeReportData[selectedReport.id]?.title : "Report Details"}
        maxWidth="max-w-6xl"
      >
        {selectedReport && fakeReportData[selectedReport.id] && (
          <div className="space-y-6">
            {/* Report Header */}
            <div className="bg-gradient-to-r from-[#3997cd] to-[#2d7aad] text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{fakeReportData[selectedReport.id].title}</h2>
                  <p className="text-blue-100 mt-1">Generated on {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-sm">Report ID: {selectedReport.id}</p>
                  <p className="text-blue-100 text-sm">Last Updated: {selectedReport.lastGenerated}</p>
                </div>
              </div>
            </div>

            {/* Report Content */}
            <div className="grid gap-6">
              {/* Render different content based on report type */}
              {selectedReport.id === 1 && ( // Stock Ledger Report
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-700">Total Items</p>
                            <p className="text-2xl font-bold text-[#3997cd]">{fakeReportData[1].data.totalItems.toLocaleString()}</p>
                          </div>
                          <Package className="h-8 w-8 text-blue-400" />
                        </div>
                        <TrendIndicator value={8.5} isPercentage={true} />
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-700">Total Value</p>
                            <p className="text-2xl font-bold text-green-600">${(fakeReportData[1].data.totalValue / 1000000).toFixed(2)}M</p>
                          </div>
                          <DollarSign className="h-8 w-8 text-green-400" />
                        </div>
                        <TrendIndicator value={12.3} isPercentage={true} />
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-700">Categories</p>
                            <p className="text-2xl font-bold text-purple-600">{fakeReportData[1].data.categories.length}</p>
                          </div>
                          <BarChart3 className="h-8 w-8 text-purple-400" />
                        </div>
                        <TrendIndicator value={2} isPercentage={false} />
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-orange-700">Avg Value/Item</p>
                            <p className="text-2xl font-bold text-orange-600">${Math.round(fakeReportData[1].data.totalValue / fakeReportData[1].data.totalItems)}</p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-orange-400" />
                        </div>
                        <TrendIndicator value={3.8} isPercentage={true} />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Inventory Trend Chart */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <TrendingUp className="h-5 w-5 mr-2 text-[#3997cd]" />
                          5-Month Inventory Trend
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={fakeReportData[1].data.monthlyTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#fff', 
                                border: '1px solid #3997cd',
                                borderRadius: '8px'
                              }}
                              formatter={(value, name) => [
                                name === 'items' ? value.toLocaleString() : `$${value.toLocaleString()}`,
                                name === 'items' ? 'Items' : 'Value'
                              ]}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="items" 
                              stroke="#3997cd" 
                              strokeWidth={3}
                              dot={{ fill: '#3997cd', strokeWidth: 2, r: 4 }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#2d7aad" 
                              strokeWidth={2}
                              dot={{ fill: '#2d7aad', strokeWidth: 2, r: 3 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Category Distribution Pie Chart */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <PieChart className="h-5 w-5 mr-2 text-[#3997cd]" />
                          Inventory by Category
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <RechartsPieChart>
                            <Pie
                              data={fakeReportData[1].data.categories}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {fakeReportData[1].data.categories.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Category Performance Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2 text-[#3997cd]" />
                        Category Performance Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-700">Items</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-700">Value</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-700">Avg/Item</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-700">Trend</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-700">% of Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fakeReportData[1].data.categories.map((cat, idx) => (
                              <tr key={idx} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">
                                  <div className="flex items-center">
                                    <div 
                                      className="w-3 h-3 rounded-full mr-3" 
                                      style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                                    ></div>
                                    <span className="font-medium">{cat.name}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right font-mono">{cat.items.toLocaleString()}</td>
                                <td className="py-3 px-4 text-right font-mono font-semibold text-[#3997cd]">${cat.value.toLocaleString()}</td>
                                <td className="py-3 px-4 text-right font-mono">${Math.round(cat.value / cat.items)}</td>
                                <td className="py-3 px-4 text-right">
                                  <TrendIndicator value={cat.change} isPercentage={true} />
                                </td>
                                <td className="py-3 px-4 text-right font-medium">
                                  {((cat.value / fakeReportData[1].data.totalValue) * 100).toFixed(1)}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {selectedReport.id === 2 && ( // Low Stock Alert
                <div className="space-y-6">
                  {/* Alert KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-red-700">Critical Items</p>
                            <p className="text-2xl font-bold text-red-600">{fakeReportData[2].data.criticalItems}</p>
                          </div>
                          <AlertTriangle className="h-8 w-8 text-red-400" />
                        </div>
                        <p className="text-xs text-red-600 mt-1">Immediate action required</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-orange-700">Low Stock Items</p>
                            <p className="text-2xl font-bold text-orange-600">{fakeReportData[2].data.lowStockItems}</p>
                          </div>
                          <Package className="h-8 w-8 text-orange-400" />
                        </div>
                        <p className="text-xs text-orange-600 mt-1">Below recommended levels</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-700">Affected Value</p>
                            <p className="text-2xl font-bold text-[#3997cd]">${(fakeReportData[2].data.totalAffectedValue / 1000).toFixed(0)}K</p>
                          </div>
                          <DollarSign className="h-8 w-8 text-blue-400" />
                        </div>
                        <p className="text-xs text-blue-600 mt-1">Total inventory at risk</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-700">Avg Lead Time</p>
                            <p className="text-2xl font-bold text-purple-600">4.8</p>
                          </div>
                          <Clock className="h-8 w-8 text-purple-400" />
                        </div>
                        <p className="text-xs text-purple-600 mt-1">Days until restock</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Stock Level Visualization */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                        Critical Stock Levels
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={fakeReportData[2].data.urgentItems}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="sku" 
                            stroke="#666" 
                            angle={-45} 
                            textAnchor="end" 
                            height={100}
                            interval={0}
                          />
                          <YAxis stroke="#666" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              border: '1px solid #dc2626',
                              borderRadius: '8px'
                            }}
                            formatter={(value, name) => [
                              value,
                              name === 'current' ? 'Current Stock' : name === 'minimum' ? 'Minimum Required' : 'Reorder Quantity'
                            ]}
                          />
                          <Bar dataKey="minimum" fill="#fbbf24" name="minimum" />
                          <Bar dataKey="current" fill="#dc2626" name="current" />
                          <Bar dataKey="reorderQty" fill="#3997cd" name="reorderQty" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  {/* Urgent Action Items */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Package className="h-5 w-5 mr-2 text-[#3997cd]" />
                        Urgent Reorder Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {fakeReportData[2].data.urgentItems.map((item, idx) => (
                          <div key={idx} className={`rounded-lg p-4 border-l-4 ${
                            item.current <= 5 ? 'border-red-500 bg-red-50' : 
                            item.current <= 15 ? 'border-orange-500 bg-orange-50' : 
                            'border-yellow-500 bg-yellow-50'
                          }`}>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                  <Badge className={`${
                                    item.current <= 5 ? 'bg-red-100 text-red-700 border-red-200' : 
                                    item.current <= 15 ? 'bg-orange-100 text-orange-700 border-orange-200' : 
                                    'bg-yellow-100 text-yellow-700 border-yellow-200'
                                  }`}>
                                    {item.current <= 5 ? 'CRITICAL' : item.current <= 15 ? 'LOW' : 'WARNING'}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-600">SKU</p>
                                    <p className="font-mono font-medium">{item.sku}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Supplier</p>
                                    <p className="font-medium">{item.supplier}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Lead Time</p>
                                    <p className="font-medium">{item.leadTime}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Stock Status</p>
                                    <div className="flex items-center space-x-2">
                                      <span className="font-bold text-red-600">{item.current}</span>
                                      <span className="text-gray-400">/</span>
                                      <span className="text-gray-600">{item.minimum}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Stock Level Progress Bar */}
                                <div className="mt-3">
                                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>Stock Level</span>
                                    <span>{Math.round((item.current / item.minimum) * 100)}% of minimum</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full transition-all duration-300 ${
                                        item.current <= 5 ? 'bg-red-500' : 
                                        item.current <= 15 ? 'bg-orange-500' : 
                                        'bg-yellow-500'
                                      }`}
                                      style={{ width: `${Math.min((item.current / item.minimum) * 100, 100)}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              <div className="ml-4 text-right">
                                <Button 
                                  size="sm" 
                                  className="bg-[#3997cd] hover:bg-[#2d7aad] text-white"
                                >
                                  Order {item.reorderQty}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {selectedReport.id === 4 && ( // Sales Performance
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-emerald-700">Total Revenue</p>
                            <p className="text-2xl font-bold text-emerald-600">${(fakeReportData[4].data.totalRevenue / 1000000).toFixed(2)}M</p>
                          </div>
                          <DollarSign className="h-8 w-8 text-emerald-400" />
                        </div>
                        <TrendIndicator value={fakeReportData[4].data.monthlyGrowth} isPercentage={true} />
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-700">Total Orders</p>
                            <p className="text-2xl font-bold text-[#3997cd]">{fakeReportData[4].data.revenueByMonth[4].orders}</p>
                          </div>
                          <ShoppingCart className="h-8 w-8 text-blue-400" />
                        </div>
                        <TrendIndicator value={15.8} isPercentage={true} />
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-700">Active Customers</p>
                            <p className="text-2xl font-bold text-purple-600">{fakeReportData[4].data.revenueByMonth[4].customers}</p>
                          </div>
                          <Users className="h-8 w-8 text-purple-400" />
                        </div>
                        <TrendIndicator value={8.7} isPercentage={true} />
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-orange-700">Avg Order Value</p>
                            <p className="text-2xl font-bold text-orange-600">${Math.round(fakeReportData[4].data.totalRevenue / fakeReportData[4].data.revenueByMonth[4].orders)}</p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-orange-400" />
                        </div>
                        <TrendIndicator value={-2.1} isPercentage={true} />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Trend Chart */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <TrendingUp className="h-5 w-5 mr-2 text-[#3997cd]" />
                          5-Month Revenue Trend
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <ComposedChart data={fakeReportData[4].data.revenueByMonth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#fff', 
                                border: '1px solid #3997cd',
                                borderRadius: '8px'
                              }}
                              formatter={(value, name) => [
                                name === 'revenue' ? `$${value.toLocaleString()}` : value,
                                name === 'revenue' ? 'Revenue' : name === 'orders' ? 'Orders' : 'Customers'
                              ]}
                            />
                            <Bar dataKey="revenue" fill="#3997cd" radius={[4, 4, 0, 0]} />
                            <Line 
                              type="monotone" 
                              dataKey="orders" 
                              stroke="#ff6b35" 
                              strokeWidth={3}
                              dot={{ fill: '#ff6b35', strokeWidth: 2, r: 4 }}
                            />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Category Performance */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <BarChart3 className="h-5 w-5 mr-2 text-[#3997cd]" />
                          Category Performance
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={fakeReportData[4].data.categoryPerformance} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis type="number" stroke="#666" />
                            <YAxis dataKey="category" type="category" stroke="#666" width={100} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#fff', 
                                border: '1px solid #3997cd',
                                borderRadius: '8px'
                              }}
                              formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                            />
                            <Bar dataKey="revenue" fill="#3997cd" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Customer Performance Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-[#3997cd]" />
                        Top Customer Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-700">Orders</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-700">Avg Order</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-700">Growth</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-700">Share</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fakeReportData[4].data.topCustomers.map((customer, idx) => (
                              <tr key={idx} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm mr-3">
                                      {customer.name.charAt(0)}
                                    </div>
                                    <span className="font-medium">{customer.name}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right font-mono font-semibold text-[#3997cd]">${customer.revenue.toLocaleString()}</td>
                                <td className="py-3 px-4 text-right font-mono">{customer.orders}</td>
                                <td className="py-3 px-4 text-right font-mono">${Math.round(customer.revenue / customer.orders).toLocaleString()}</td>
                                <td className="py-3 px-4 text-right">
                                  <TrendIndicator value={customer.growth} isPercentage={true} />
                                </td>
                                <td className="py-3 px-4 text-right font-medium">
                                  {((customer.revenue / fakeReportData[4].data.totalRevenue) * 100).toFixed(1)}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Generic data display for other reports */}
              {![1, 2, 4].includes(selectedReport.id) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Report Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap">
                        {JSON.stringify(fakeReportData[selectedReport.id].data, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => handleExportReport(selectedReport)}
                className="bg-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button 
                onClick={() => setReportModalOpen(false)}
                style={{backgroundColor: '#3997cd'}} 
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d7aad'} 
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3997cd'}
                className="text-white"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </FormModal>
    </div>
  );
}