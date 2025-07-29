import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FormModal } from "@/components/forms/FormModal";
import { ProductionOrderForm } from "@/components/forms/ProductionOrderForm";
import { 
  Factory, 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  Settings, 
  TrendingUp, 
  AlertTriangle, 
  Calendar,
  Package,
  Zap,
  Target,
  Activity,
  BarChart3,
  RefreshCw,
  Plus,
  Timer,
  Wrench
} from "lucide-react";

export default function Production() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFormSubmit = () => {
    setModalOpen(false);
  };

  const productionRuns = [
    { 
      id: 1, 
      sku: "ACDelco-BRK-001", 
      name: "Ceramic Brake Pads - Front Set", 
      brand: "ACDelco",
      category: "Brake System",
      quantity: 5000, 
      completed: 3500, 
      status: "In Progress", 
      startDate: "2024-01-15", 
      estimatedCompletion: "2024-01-18",
      priority: "High",
      operator: "John Smith",
      line: "Production Line A",
      efficiency: 87,
      defectRate: 0.5
    },
    { 
      id: 2, 
      sku: "Bosch-ENG-012", 
      name: "Premium Motor Oil 5W-30 - 1Qt", 
      brand: "Bosch",
      category: "Fluids",
      quantity: 2000, 
      completed: 2000, 
      status: "Completed", 
      startDate: "2024-01-10", 
      estimatedCompletion: "2024-01-12",
      priority: "Medium",
      operator: "Maria Garcia",
      line: "Production Line B",
      efficiency: 94,
      defectRate: 0.2
    },
    { 
      id: 3, 
      sku: "NGK-IGN-008", 
      name: "Iridium Spark Plugs - Set of 4", 
      brand: "NGK",
      category: "Electrical",
      quantity: 3000, 
      completed: 0, 
      status: "Scheduled", 
      startDate: "2024-01-20", 
      estimatedCompletion: "2024-01-23",
      priority: "Low",
      operator: "David Chen",
      line: "Production Line C",
      efficiency: 0,
      defectRate: 0
    },
    { 
      id: 4, 
      sku: "Monroe-SUS-015", 
      name: "Premium Shock Absorbers - Pair", 
      brand: "Monroe",
      category: "Suspension",
      quantity: 1500, 
      completed: 450, 
      status: "In Progress", 
      startDate: "2024-01-16", 
      estimatedCompletion: "2024-01-19",
      priority: "High",
      operator: "Sarah Johnson",
      line: "Production Line A",
      efficiency: 91,
      defectRate: 0.3
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 shadow-sm">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "In Progress":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 shadow-sm">
            <Activity className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case "Scheduled":
        return (
          <Badge className="bg-orange-100 text-orange-700 border-orange-200 shadow-sm">
            <Clock className="h-3 w-3 mr-1" />
            Scheduled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge className="bg-red-100 text-red-700 border-red-200">High</Badge>;
      case "Medium":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Medium</Badge>;
      case "Low":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getProgress = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  const getActiveRuns = () => productionRuns.filter(run => run.status === "In Progress").length;
  const getCompletedToday = () => productionRuns.filter(run => run.status === "Completed").reduce((sum, run) => sum + run.completed, 0);
  const getScheduledRuns = () => productionRuns.filter(run => run.status === "Scheduled").length;
  const getAverageEfficiency = () => {
    const activeRuns = productionRuns.filter(run => run.status === "In Progress" || run.status === "Completed");
    return activeRuns.length > 0 ? Math.round(activeRuns.reduce((sum, run) => sum + run.efficiency, 0) / activeRuns.length) : 0;
  };

  return (
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Production Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Monitor and manage automotive parts production runs
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
            <Clock className="h-3 w-3 mr-1" />
            {currentTime.toLocaleTimeString('en-US', { hour12: false })}
          </Badge>
          <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
            <Calendar className="h-3 w-3 mr-1" />
            {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Badge>
          <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={() => setModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Production Run
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Active Runs</p>
                <p className="text-3xl font-bold">{getActiveRuns()}</p>
                <p className="text-blue-100 text-xs mt-1">
                  Currently in progress
                </p>
              </div>
              <Activity className="h-10 w-10 text-blue-200" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +2 from yesterday
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Completed Today</p>
                <p className="text-3xl font-bold">{getCompletedToday().toLocaleString()}</p>
                <p className="text-green-100 text-xs mt-1">Units produced</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-200" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-green-100 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12% vs target
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Scheduled</p>
                <p className="text-3xl font-bold">{getScheduledRuns()}</p>
                <p className="text-orange-100 text-xs mt-1">Upcoming runs</p>
              </div>
              <Timer className="h-10 w-10 text-orange-200" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-orange-100 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                Next: Tomorrow 8AM
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Avg Efficiency</p>
                <p className="text-3xl font-bold">{getAverageEfficiency()}%</p>
                <p className="text-purple-100 text-xs mt-1">This week</p>
              </div>
              <Target className="h-10 w-10 text-purple-200" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-purple-100 text-sm">
                <Zap className="h-4 w-4 mr-1" />
                Above 85% target
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Production Runs */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="border-b border-gray-200/50">
          <CardTitle className="flex items-center text-xl">
            <Factory className="h-6 w-6 mr-3 text-blue-500" />
            Production Runs
            <Badge variant="outline" className="ml-3 bg-blue-50 text-blue-600 border-blue-200">
              {productionRuns.length} runs
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {productionRuns.map((run) => (
              <div key={run.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{run.brand.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{run.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{run.sku}</Badge>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{run.brand}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{run.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(run.status)}
                      {getPriorityBadge(run.priority)}
                      {run.status === "In Progress" && (
                        <Button size="sm" variant="outline" className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100">
                          <Pause className="h-4 w-4" />
                        </Button>
                      )}
                      {run.status === "Scheduled" && (
                        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Package className="h-4 w-4 mr-1" />
                        Total Quantity
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{run.quantity.toLocaleString()} units</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completed
                      </div>
                      <p className="text-lg font-semibold text-green-600">{run.completed.toLocaleString()} units</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Wrench className="h-4 w-4 mr-1" />
                        Operator
                      </div>
                      <p className="text-sm font-medium text-gray-900">{run.operator}</p>
                      <p className="text-xs text-gray-500">{run.line}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Target className="h-4 w-4 mr-1" />
                        Performance
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{run.efficiency}% Efficiency</span>
                        {run.defectRate > 0 && (
                          <Badge className="bg-red-100 text-red-700 text-xs">{run.defectRate}% Defect</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        Start Date
                      </div>
                      <p className="text-sm font-medium text-gray-900">{new Date(run.startDate).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        Expected Completion
                      </div>
                      <p className="text-sm font-medium text-gray-900">{new Date(run.estimatedCompletion).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  {(run.status === "In Progress" || run.status === "Completed") && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Production Progress</span>
                        <span className="text-sm font-bold text-blue-600">{getProgress(run.completed, run.quantity)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            run.status === "Completed" 
                              ? "bg-gradient-to-r from-green-500 to-green-600" 
                              : "bg-gradient-to-r from-blue-500 to-purple-600"
                          }`}
                          style={{ width: `${getProgress(run.completed, run.quantity)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0</span>
                        <span>{run.quantity.toLocaleString()} units</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Production Order Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Production Order"
        maxWidth="max-w-6xl"
      >
        <ProductionOrderForm 
          onSubmit={handleFormSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </FormModal>
    </div>
  );
}