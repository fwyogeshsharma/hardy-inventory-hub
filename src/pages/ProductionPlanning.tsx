import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Factory, 
  Calendar, 
  Download, 
  RefreshCw,
  ShoppingCart,
  Package,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import ProductionPlanningManager from "@/components/ProductionPlanningManager";
import AutoPODemo from "@/components/AutoPODemo";
import POTestButton from "@/components/POTestButton";

export default function ProductionPlanning() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleProductionStarted = () => {
    // Refresh the component when production is started
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex-1 space-y-6 p-6 min-h-screen" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e6f2fa 100%)'}}>
      {/* Header Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold" style={{color: '#3997cd'}}>
            Production Planning
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage sales-driven production workflow with BOM templates and inventory verification
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Badge>
          <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/50 backdrop-blur-sm"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <POTestButton />
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Active Plans</p>
                <p className="text-3xl font-bold">-</p>
                <p className="text-blue-100 text-xs mt-1">In planning</p>
              </div>
              <Factory className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Ready to Produce</p>
                <p className="text-3xl font-bold">-</p>
                <p className="text-blue-100 text-xs mt-1">Materials available</p>
              </div>
              <CheckCircle className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Awaiting Materials</p>
                <p className="text-3xl font-bold">-</p>
                <p className="text-blue-100 text-xs mt-1">POs generated</p>
              </div>
              <AlertTriangle className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">In Production</p>
                <p className="text-3xl font-bold">-</p>
                <p className="text-blue-100 text-xs mt-1">Currently active</p>
              </div>
              <Package className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="planning" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="planning" className="flex items-center space-x-2">
            <Factory className="h-4 w-4" />
            <span>Production Planning</span>
          </TabsTrigger>
          <TabsTrigger value="demo" className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Auto PO Demo</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center space-x-2">
            <ShoppingCart className="h-4 w-4" />
            <span>Sales Orders</span>
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>Workflow Status</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="planning" key={refreshKey}>
          <ProductionPlanningManager onProductionStarted={handleProductionStarted} />
        </TabsContent>

        <TabsContent value="demo">
          <AutoPODemo onDemoComplete={handleRefresh} />
        </TabsContent>

        <TabsContent value="orders">
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-6 w-6 mr-3" style={{color: '#3997cd'}} />
                BOM-Based Sales Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  Sales Orders with BOM Templates
                </h3>
                <p className="text-gray-500">
                  Sales orders that require BOM-based production will be shown here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflow">
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-6 w-6 mr-3" style={{color: '#3997cd'}} />
                Workflow Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Workflow Status Cards */}
                <Card className="border border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <h4 className="font-medium text-gray-900">Sales → BOM Selection</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Sales orders created with BOM template selection
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <h4 className="font-medium text-gray-900">Inventory Verification</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Automated inventory checking against BOM requirements
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <h4 className="font-medium text-gray-900">Purchase Orders</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Auto-generated POs for missing materials
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <h4 className="font-medium text-gray-900">Production Control</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Production hold/release based on material availability
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-indigo-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                      <h4 className="font-medium text-gray-900">Kit Production</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      BOM-based kit manufacturing and assembly
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-teal-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                      <h4 className="font-medium text-gray-900">Fulfillment</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Completed production ready for shipment
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}