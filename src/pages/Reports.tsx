import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Wrench
} from "lucide-react";

export default function Reports() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const reportCategories = [
    {
      category: "Inventory Reports",
      icon: Package,
      color: "from-blue-500 to-blue-600",
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
          name: "ABC Analysis",
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
      color: "from-green-500 to-green-600",
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
      color: "from-purple-500 to-purple-600",
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
          <Badge className="bg-green-100 text-green-700 border-green-200 shadow-sm">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ready
          </Badge>
        );
      case "Processing":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 shadow-sm">
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        );
      case "Alert":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 shadow-sm">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Alert
          </Badge>
        );
      case "Scheduled":
        return (
          <Badge className="bg-orange-100 text-orange-700 border-orange-200 shadow-sm">
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
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Reports</p>
                <p className="text-3xl font-bold">{getTotalReports()}</p>
                <p className="text-blue-100 text-xs mt-1">Available report types</p>
              </div>
              <FileText className="h-10 w-10 text-blue-200" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +3 new reports this month
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Ready Reports</p>
                <p className="text-3xl font-bold">{getReadyReports()}</p>
                <p className="text-green-100 text-xs mt-1">Available for download</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-200" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-green-100 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                Last updated: 30 min ago
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Alert Reports</p>
                <p className="text-3xl font-bold">{getAlertReports()}</p>
                <p className="text-red-100 text-xs mt-1">Require attention</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-red-200" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-red-100 text-sm">
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
                <Badge variant="outline" className="ml-3 bg-blue-50 text-blue-600 border-blue-200">
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
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                              <ReportIcon className="h-5 w-5 text-gray-600" />
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
                          <Button size="sm" variant="outline" className="flex-1 bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
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
    </div>
  );
}