import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormModal } from "@/components/forms/FormModal";
import { reportsService, ReportData } from "@/lib/reportsService";
import { pdfExportService } from "@/lib/pdfExport";
import { toast } from "sonner";
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
  ShoppingCart,
  Star,
  Target,
  Award,
  Percent,
  BarChart2,
  MessageSquare,
  ThumbsUp
} from "lucide-react";

export default function Reports() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState<Record<number, ReportData>>({});
  const [loadingReports, setLoadingReports] = useState<Record<number, boolean>>({});

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

  // Real data is now loaded dynamically from reportsService

  const handleViewReport = async (report) => {
    if (!reportData[report.id] && !loadingReports[report.id]) {
      setLoadingReports(prev => ({ ...prev, [report.id]: true }));
      
      try {
        const data = await reportsService.getReport(report.id);
        setReportData(prev => ({ ...prev, [report.id]: data }));
      } catch (error) {
        console.error('Error loading report data:', error);
        toast.error('Failed to load report data');
      } finally {
        setLoadingReports(prev => ({ ...prev, [report.id]: false }));
      }
    }
    
    setSelectedReport(report);
    setReportModalOpen(true);
  };

  const handleExportReport = async (report) => {
    try {
      toast.info('Generating PDF report...');
      
      // Get or load report data
      let data = reportData[report.id];
      if (!data) {
        data = await reportsService.getReport(report.id);
        setReportData(prev => ({ ...prev, [report.id]: data }));
      }
      
      // Export using PDF service
      await pdfExportService.exportReportToPDF(data, {
        filename: `${report.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
        includeHeader: true,
        includeFooter: true
      });
      
      toast.success('Report exported successfully!');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    }
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
          name: "Inventory Performance Report",
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
        title={selectedReport ? (reportData[selectedReport.id]?.title || selectedReport.name) : "Report Details"}
        maxWidth="max-w-6xl"
      >
        {selectedReport && (reportData[selectedReport.id] || loadingReports[selectedReport.id]) && (
          <div className="space-y-6">
            {/* Report Header */}
            <div className="bg-gradient-to-r from-[#3997cd] to-[#2d7aad] text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{reportData[selectedReport.id]?.title || selectedReport.name}</h2>
                  <p className="text-blue-100 mt-1">Generated on {reportData[selectedReport.id]?.generatedAt ? new Date(reportData[selectedReport.id].generatedAt).toLocaleDateString() : new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-sm">Report ID: {selectedReport.id}</p>
                  <p className="text-blue-100 text-sm">Last Updated: {selectedReport.lastGenerated}</p>
                </div>
              </div>
            </div>

            {/* Report Content */}
            <div className="grid gap-6">
              {loadingReports[selectedReport.id] && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-[#3997cd] mx-auto mb-4" />
                    <p className="text-gray-600">Loading report data...</p>
                  </div>
                </div>
              )}
              
              {/* Render different content based on report type */}
              {!loadingReports[selectedReport.id] && reportData[selectedReport.id] && selectedReport.id === 1 && ( // Stock Ledger Report
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-700">Total Items</p>
                            <p className="text-2xl font-bold text-[#3997cd]">{reportData[1]?.data.totalItems?.toLocaleString() || '0'}</p>
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
                            <p className="text-2xl font-bold text-green-600">${((reportData[1]?.data.totalValue || 0) / 1000000).toFixed(2)}M</p>
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
                            <p className="text-2xl font-bold text-purple-600">{reportData[1]?.data.categories?.length || 0}</p>
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
                            <p className="text-2xl font-bold text-orange-600">${Math.round((reportData[1]?.data.totalValue || 0) / (reportData[1]?.data.totalItems || 1))}</p>
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
                          <LineChart data={reportData[1]?.data.monthlyTrend || []}>
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
                              data={reportData[1]?.data.categories || []}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {(reportData[1]?.data.categories || []).map((entry, index) => (
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
                            {(reportData[1]?.data.categories || []).map((cat, idx) => (
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
                                  {(((cat.value || 0) / (reportData[1]?.data.totalValue || 1)) * 100).toFixed(1)}%
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
                            <p className="text-2xl font-bold text-red-600">{reportData[2]?.data.criticalItems || 0}</p>
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
                            <p className="text-2xl font-bold text-orange-600">{reportData[2]?.data.lowStockItems || 0}</p>
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
                            <p className="text-2xl font-bold text-[#3997cd]">${((reportData[2]?.data.totalAffectedValue || 0) / 1000).toFixed(0)}K</p>
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
                        <BarChart data={reportData[2]?.data.urgentItems || []}>
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
                        {(reportData[2]?.data.urgentItems || []).map((item, idx) => (
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

              {selectedReport.id === 3 && reportData[3] && ( // Inventory Performance (ABC Analysis)
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-700">Total SKUs</p>
                            <p className="text-2xl font-bold text-[#3997cd]">{reportData[3]?.data.totalSKUs || 0}</p>
                          </div>
                          <Package className="h-8 w-8 text-blue-400" />
                        </div>
                        <p className="text-xs text-blue-600 mt-1">Active products</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-700">Category A</p>
                            <p className="text-2xl font-bold text-green-600">{reportData[3]?.data.categoryA?.percentage || 0}%</p>
                          </div>
                          <Star className="h-8 w-8 text-green-400" />
                        </div>
                        <p className="text-xs text-green-600 mt-1">{reportData[3]?.data.categoryA?.count || 0} high-value items</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-orange-700">Category B</p>
                            <p className="text-2xl font-bold text-orange-600">{reportData[3]?.data.categoryB?.percentage || 0}%</p>
                          </div>
                          <Target className="h-8 w-8 text-orange-400" />
                        </div>
                        <p className="text-xs text-orange-600 mt-1">{reportData[3]?.data.categoryB?.count || 0} medium-value items</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Category C</p>
                            <p className="text-2xl font-bold text-gray-600">{reportData[3]?.data.categoryC?.percentage || 0}%</p>
                          </div>
                          <Minus className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{reportData[3]?.data.categoryC?.count || 0} low-value items</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* ABC Analysis Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <PieChart className="h-5 w-5 mr-2 text-[#3997cd]" />
                        ABC Classification Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Pie
                            data={[
                              { name: 'Category A (High Value)', value: reportData[3]?.data.categoryA?.value || 0, count: reportData[3]?.data.categoryA?.count || 0 },
                              { name: 'Category B (Medium Value)', value: reportData[3]?.data.categoryB?.value || 0, count: reportData[3]?.data.categoryB?.count || 0 },
                              { name: 'Category C (Low Value)', value: reportData[3]?.data.categoryC?.value || 0, count: reportData[3]?.data.categoryC?.count || 0 }
                            ]}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={({ name, percent }) => `${name.split(' ')[1]} ${(percent * 100).toFixed(0)}%`}
                          >
                            <Cell fill="#22c55e" />
                            <Cell fill="#f97316" />
                            <Cell fill="#6b7280" />
                          </Pie>
                          <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name]} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Top Performers Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-[#3997cd]" />
                        Top Performing SKUs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">SKU</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-700">Margin %</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-700">Turnover</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(reportData[3]?.data.topPerformers || []).map((performer, idx) => (
                              <tr key={idx} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">
                                  <Badge variant="outline" className="text-xs">{performer.sku}</Badge>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="font-medium">{performer.name}</span>
                                </td>
                                <td className="py-3 px-4 text-right font-mono font-semibold text-[#3997cd]">${performer.revenue.toLocaleString()}</td>
                                <td className="py-3 px-4 text-right">
                                  <span className={`font-medium ${performer.margin > 30 ? 'text-green-600' : performer.margin > 20 ? 'text-orange-600' : 'text-red-600'}`}>
                                    {performer.margin.toFixed(1)}%
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right font-medium">{performer.turnover.toFixed(1)}x</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
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
                            <p className="text-2xl font-bold text-emerald-600">${((reportData[4]?.data.totalRevenue || 0) / 1000000).toFixed(2)}M</p>
                          </div>
                          <DollarSign className="h-8 w-8 text-emerald-400" />
                        </div>
                        <TrendIndicator value={reportData[4]?.data.monthlyGrowth || 0} isPercentage={true} />
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-700">Total Orders</p>
                            <p className="text-2xl font-bold text-[#3997cd]">{reportData[4]?.data.revenueByMonth?.[4]?.orders || 0}</p>
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
                            <p className="text-2xl font-bold text-purple-600">{reportData[4]?.data.revenueByMonth?.[4]?.customers || 0}</p>
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
                            <p className="text-2xl font-bold text-orange-600">${Math.round((reportData[4]?.data.totalRevenue || 0) / (reportData[4]?.data.revenueByMonth?.[4]?.orders || 1))}</p>
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
                          <ComposedChart data={reportData[4]?.data.revenueByMonth || []}>
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
                          <BarChart data={reportData[4]?.data.categoryPerformance || []} layout="horizontal">
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
                            {(reportData[4]?.data.topCustomers || []).map((customer, idx) => (
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
                                  {(((customer.revenue || 0) / (reportData[4]?.data.totalRevenue || 1)) * 100).toFixed(1)}%
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

              {selectedReport.id === 5 && ( // Customer Analysis Report
                <div className="space-y-6">
                  {/* Customer KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-700">Total Customers</p>
                            <p className="text-2xl font-bold text-[#3997cd]">{reportData[5]?.data.totalCustomers || 0}</p>
                          </div>
                          <Users className="h-8 w-8 text-blue-400" />
                        </div>
                        <TrendIndicator value={reportData[5]?.data.customerGrowth || 0} isPercentage={true} />
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-700">Total Revenue</p>
                            <p className="text-2xl font-bold text-green-600">${((reportData[5]?.data.totalRevenue || 0) / 1000000).toFixed(2)}M</p>
                          </div>
                          <DollarSign className="h-8 w-8 text-green-400" />
                        </div>
                        <TrendIndicator value={15.2} isPercentage={true} />
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-700">Avg Order Value</p>
                            <p className="text-2xl font-bold text-purple-600">${Math.round(reportData[5]?.data.avgOrderValue || 0)}</p>
                          </div>
                          <ShoppingCart className="h-8 w-8 text-purple-400" />
                        </div>
                        <TrendIndicator value={-2.4} isPercentage={true} />
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-orange-700">Active Rate</p>
                            <p className="text-2xl font-bold text-orange-600">87%</p>
                          </div>
                          <Activity className="h-8 w-8 text-orange-400" />
                        </div>
                        <TrendIndicator value={4.1} isPercentage={true} />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Customer Performance Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Award className="h-5 w-5 mr-2 text-[#3997cd]" />
                        Top Customer Analysis
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
                              <th className="text-right py-3 px-4 font-semibold text-gray-700">Last Order</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(reportData[5]?.data.topCustomers || []).slice(0, 8).map((customer, idx) => (
                              <tr key={idx} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm mr-3">
                                      {customer.name?.charAt(0) || 'U'}
                                    </div>
                                    <span className="font-medium">{customer.name || 'Unknown Customer'}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right font-mono font-semibold text-[#3997cd]">${(customer.revenue || 0).toLocaleString()}</td>
                                <td className="py-3 px-4 text-right font-mono">{customer.orders || 0}</td>
                                <td className="py-3 px-4 text-right font-mono">${Math.round((customer.revenue || 0) / Math.max(customer.orders || 1, 1)).toLocaleString()}</td>
                                <td className="py-3 px-4 text-right text-sm text-gray-600">{customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString() : 'N/A'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {selectedReport.id === 6 && ( // Profit Margin Analysis
                <div className="space-y-6">
                  {/* Profit KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-emerald-700">Overall Margin</p>
                            <p className="text-2xl font-bold text-emerald-600">{(reportData[6]?.data.overallMargin || 0).toFixed(1)}%</p>
                          </div>
                          <Percent className="h-8 w-8 text-emerald-400" />
                        </div>
                        <TrendIndicator value={2.8} isPercentage={true} />
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-700">Total Profit</p>
                            <p className="text-2xl font-bold text-[#3997cd]">${((reportData[6]?.data.totalProfit || 0) / 1000000).toFixed(2)}M</p>
                          </div>
                          <DollarSign className="h-8 w-8 text-blue-400" />
                        </div>
                        <TrendIndicator value={18.5} isPercentage={true} />
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-700">Total Revenue</p>
                            <p className="text-2xl font-bold text-purple-600">${((reportData[6]?.data.totalRevenue || 0) / 1000000).toFixed(2)}M</p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-purple-400" />
                        </div>
                        <TrendIndicator value={12.4} isPercentage={true} />
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-orange-700">Categories</p>
                            <p className="text-2xl font-bold text-orange-600">{(reportData[6]?.data.categoryMargins || []).length}</p>
                          </div>
                          <BarChart3 className="h-8 w-8 text-orange-400" />
                        </div>
                        <TrendIndicator value={1} isPercentage={false} />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Margin Analysis Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart2 className="h-5 w-5 mr-2 text-[#3997cd]" />
                        Profit Margin by Category
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={reportData[6]?.data.categoryMargins || []}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="category" stroke="#666" angle={-45} textAnchor="end" height={100} />
                          <YAxis stroke="#666" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              border: '1px solid #3997cd',
                              borderRadius: '8px'
                            }}
                            formatter={(value, name) => [
                              name === 'margin' ? `${value.toFixed(1)}%` : `$${value.toLocaleString()}`,
                              name === 'margin' ? 'Margin %' : name === 'revenue' ? 'Revenue' : 'Profit'
                            ]}
                          />
                          <Bar dataKey="margin" fill="#22c55e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Category Performance Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="h-5 w-5 mr-2 text-[#3997cd]" />
                        Category Profit Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-700">Cost</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-700">Profit</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-700">Margin %</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(reportData[6]?.data.categoryMargins || []).map((cat, idx) => (
                              <tr key={idx} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">
                                  <span className="font-medium">{cat.category}</span>
                                </td>
                                <td className="py-3 px-4 text-right font-mono font-semibold text-[#3997cd]">${(cat.revenue || 0).toLocaleString()}</td>
                                <td className="py-3 px-4 text-right font-mono text-red-600">${(cat.cost || 0).toLocaleString()}</td>
                                <td className="py-3 px-4 text-right font-mono text-green-600 font-semibold">${(cat.profit || 0).toLocaleString()}</td>
                                <td className="py-3 px-4 text-right">
                                  <span className={`font-medium ${
                                    (cat.margin || 0) > 30 ? 'text-green-600' : 
                                    (cat.margin || 0) > 20 ? 'text-orange-600' : 'text-red-600'
                                  }`}>
                                    {(cat.margin || 0).toFixed(1)}%
                                  </span>
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

              {selectedReport.id === 7 && ( // Vendor Performance Report
                <div className="space-y-6">
                  {/* Vendor KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-700">Total Vendors</p>
                            <p className="text-2xl font-bold text-[#3997cd]">{reportData[7]?.data.totalVendors || 0}</p>
                          </div>
                          <Building2 className="h-8 w-8 text-blue-400" />
                        </div>
                        <p className="text-xs text-blue-600 mt-1">{reportData[7]?.data.activeVendors || 0} active</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-700">Quality Rating</p>
                            <p className="text-2xl font-bold text-green-600">{(reportData[7]?.data.avgQualityRating || 0).toFixed(1)}</p>
                          </div>
                          <Star className="h-8 w-8 text-green-400" />
                        </div>
                        <TrendIndicator value={0.3} isPercentage={false} />
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-700">Delivery Rating</p>
                            <p className="text-2xl font-bold text-purple-600">{(reportData[7]?.data.avgDeliveryRating || 0).toFixed(1)}</p>
                          </div>
                          <Truck className="h-8 w-8 text-purple-400" />
                        </div>
                        <TrendIndicator value={0.5} isPercentage={false} />
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-orange-700">Performance</p>
                            <p className="text-2xl font-bold text-orange-600">92%</p>
                          </div>
                          <ThumbsUp className="h-8 w-8 text-orange-400" />
                        </div>
                        <TrendIndicator value={3.2} isPercentage={true} />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Vendor Performance Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2 text-[#3997cd]" />
                        Vendor Performance Ratings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={reportData[7]?.data.vendorPerformance || []}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="name" stroke="#666" angle={-45} textAnchor="end" height={100} />
                          <YAxis stroke="#666" domain={[0, 5]} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              border: '1px solid #3997cd',
                              borderRadius: '8px'
                            }}
                            formatter={(value, name) => [
                              value.toFixed(1),
                              name === 'qualityRating' ? 'Quality' : name === 'deliveryRating' ? 'Delivery' : name === 'priceRating' ? 'Price' : 'Overall Score'
                            ]}
                          />
                          <Bar dataKey="qualityRating" fill="#22c55e" radius={[2, 2, 0, 0]} />
                          <Bar dataKey="deliveryRating" fill="#3997cd" radius={[2, 2, 0, 0]} />
                          <Bar dataKey="priceRating" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Vendor Details Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Building2 className="h-5 w-5 mr-2 text-[#3997cd]" />
                        Vendor Performance Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Vendor</th>
                              <th className="text-center py-3 px-4 font-semibold text-gray-700">Quality</th>
                              <th className="text-center py-3 px-4 font-semibold text-gray-700">Delivery</th>
                              <th className="text-center py-3 px-4 font-semibold text-gray-700">Price</th>
                              <th className="text-center py-3 px-4 font-semibold text-gray-700">Lead Time</th>
                              <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-700">Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(reportData[7]?.data.vendorPerformance || []).map((vendor, idx) => (
                              <tr key={idx} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">
                                  <span className="font-medium">{vendor.name}</span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <div className="flex items-center justify-center">
                                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                    <span>{vendor.qualityRating?.toFixed(1) || '0.0'}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <div className="flex items-center justify-center">
                                    <Truck className="h-4 w-4 text-blue-400 mr-1" />
                                    <span>{vendor.deliveryRating?.toFixed(1) || '0.0'}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <div className="flex items-center justify-center">
                                    <DollarSign className="h-4 w-4 text-green-400 mr-1" />
                                    <span>{vendor.priceRating?.toFixed(1) || '0.0'}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-center font-mono">{vendor.leadTime || 0} days</td>
                                <td className="py-3 px-4 text-center">
                                  <Badge className={`${
                                    vendor.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
                                  }`}>
                                    {vendor.status}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <span className={`font-bold ${
                                    (vendor.overallScore || 0) >= 4.0 ? 'text-green-600' : 
                                    (vendor.overallScore || 0) >= 3.0 ? 'text-orange-600' : 'text-red-600'
                                  }`}>
                                    {vendor.overallScore?.toFixed(1) || '0.0'}
                                  </span>
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

              {selectedReport.id === 8 && ( // Order Fulfillment Report
                <div className="space-y-6">
                  {/* Fulfillment KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-700">Total Orders</p>
                            <p className="text-2xl font-bold text-[#3997cd]">{reportData[8]?.data.totalOrders || 0}</p>
                          </div>
                          <ShoppingCart className="h-8 w-8 text-blue-400" />
                        </div>
                        <p className="text-xs text-blue-600 mt-1">{reportData[8]?.data.completedOrders || 0} completed</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-700">On-Time Rate</p>
                            <p className="text-2xl font-bold text-green-600">{(reportData[8]?.data.onTimeDeliveryRate || 0).toFixed(1)}%</p>
                          </div>
                          <CheckCircle className="h-8 w-8 text-green-400" />
                        </div>
                        <TrendIndicator value={2.8} isPercentage={true} />
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-700">Avg Fulfillment</p>
                            <p className="text-2xl font-bold text-purple-600">{(reportData[8]?.data.avgFulfillmentTime || 0).toFixed(1)}d</p>
                          </div>
                          <Clock className="h-8 w-8 text-purple-400" />
                        </div>
                        <TrendIndicator value={-0.4} isPercentage={false} />
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-orange-700">Pending Orders</p>
                            <p className="text-2xl font-bold text-orange-600">{reportData[8]?.data.pendingOrders || 0}</p>
                          </div>
                          <Timer className="h-8 w-8 text-orange-400" />
                        </div>
                        <TrendIndicator value={-5.2} isPercentage={true} />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Fulfillment Trend Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-[#3997cd]" />
                        Monthly Fulfillment Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={reportData[8]?.data.monthlyFulfillment || []}>
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
                              name === 'avgTime' ? `${value} days` : value,
                              name === 'orders' ? 'Orders' : name === 'onTime' ? 'On-Time Deliveries' : 'Avg Time'
                            ]}
                          />
                          <Bar dataKey="orders" fill="#3997cd" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="onTime" fill="#22c55e" radius={[4, 4, 0, 0]} />
                          <Line 
                            type="monotone" 
                            dataKey="avgTime" 
                            stroke="#f59e0b" 
                            strokeWidth={3}
                            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              )}

              {selectedReport.id === 9 && ( // Production Efficiency Report
                <div className="space-y-6">
                  {/* Production KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-700">Units Produced</p>
                            <p className="text-2xl font-bold text-[#3997cd]">{(reportData[9]?.data.totalUnitsProduced || 0).toLocaleString()}</p>
                          </div>
                          <Package className="h-8 w-8 text-blue-400" />
                        </div>
                        <p className="text-xs text-blue-600 mt-1">Target: {(reportData[9]?.data.targetUnits || 0).toLocaleString()}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-700">Efficiency</p>
                            <p className="text-2xl font-bold text-green-600">{(reportData[9]?.data.efficiency || 0).toFixed(1)}%</p>
                          </div>
                          <Activity className="h-8 w-8 text-green-400" />
                        </div>
                        <TrendIndicator value={3.2} isPercentage={true} />
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-red-700">Defect Rate</p>
                            <p className="text-2xl font-bold text-red-600">{(reportData[9]?.data.defectRate || 0).toFixed(1)}%</p>
                          </div>
                          <AlertTriangle className="h-8 w-8 text-red-400" />
                        </div>
                        <TrendIndicator value={-0.3} isPercentage={true} />
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-orange-700">Cycle Time</p>
                            <p className="text-2xl font-bold text-orange-600">{(reportData[9]?.data.avgCycleTime || 0).toFixed(1)}h</p>
                          </div>
                          <Clock className="h-8 w-8 text-orange-400" />
                        </div>
                        <TrendIndicator value={-1.2} isPercentage={false} />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Production Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Weekly Production Trend */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <TrendingUp className="h-5 w-5 mr-2 text-[#3997cd]" />
                          Weekly Production Trend
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={reportData[9]?.data.weeklyTrend || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="week" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#fff', 
                                border: '1px solid #3997cd',
                                borderRadius: '8px'
                              }}
                              formatter={(value, name) => [
                                name === 'efficiency' ? `${value}%` : value,
                                name === 'units' ? 'Units Produced' : name === 'target' ? 'Target' : 'Efficiency'
                              ]}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="units" 
                              stroke="#3997cd" 
                              fill="#3997cd" 
                              fillOpacity={0.3}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="target" 
                              stroke="#f59e0b" 
                              fill="#f59e0b" 
                              fillOpacity={0.1}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Shift Performance */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Wrench className="h-5 w-5 mr-2 text-[#3997cd]" />
                          Production by Shift
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={reportData[9]?.data.productionByShift || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="shift" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#fff', 
                                border: '1px solid #3997cd',
                                borderRadius: '8px'
                              }}
                              formatter={(value, name) => [
                                name === 'efficiency' || name === 'quality' ? `${value}%` : value,
                                name === 'units' ? 'Units' : name === 'efficiency' ? 'Efficiency' : 'Quality'
                              ]}
                            />
                            <Bar dataKey="units" fill="#3997cd" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="efficiency" fill="#22c55e" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="quality" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Production Summary Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2 text-[#3997cd]" />
                        Shift Performance Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Shift</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-700">Units Produced</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-700">Efficiency %</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-700">Quality %</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-700">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(reportData[9]?.data.productionByShift || []).map((shift, idx) => (
                              <tr key={idx} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">
                                  <span className="font-medium">{shift.shift} Shift</span>
                                </td>
                                <td className="py-3 px-4 text-right font-mono font-semibold text-[#3997cd]">{(shift.units || 0).toLocaleString()}</td>
                                <td className="py-3 px-4 text-right">
                                  <span className={`font-medium ${
                                    (shift.efficiency || 0) >= 90 ? 'text-green-600' : 
                                    (shift.efficiency || 0) >= 80 ? 'text-orange-600' : 'text-red-600'
                                  }`}>
                                    {(shift.efficiency || 0).toFixed(1)}%
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <span className={`font-medium ${
                                    (shift.quality || 0) >= 98 ? 'text-green-600' : 
                                    (shift.quality || 0) >= 95 ? 'text-orange-600' : 'text-red-600'
                                  }`}>
                                    {(shift.quality || 0).toFixed(1)}%
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <Badge className={`${
                                    (shift.efficiency || 0) >= 90 && (shift.quality || 0) >= 98 ? 'bg-green-100 text-green-700 border-green-200' : 
                                    (shift.efficiency || 0) >= 80 && (shift.quality || 0) >= 95 ? 'bg-orange-100 text-orange-700 border-orange-200' : 
                                    'bg-red-100 text-red-700 border-red-200'
                                  }`}>
                                    {
                                      (shift.efficiency || 0) >= 90 && (shift.quality || 0) >= 98 ? 'Excellent' : 
                                      (shift.efficiency || 0) >= 80 && (shift.quality || 0) >= 95 ? 'Good' : 'Needs Improvement'
                                    }
                                  </Badge>
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
              {!loadingReports[selectedReport.id] && reportData[selectedReport.id] && ![1, 2, 3, 4, 5, 6, 7, 8, 9].includes(selectedReport.id) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Report Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap">
                        {JSON.stringify(reportData[selectedReport.id]?.data || {}, null, 2)}
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