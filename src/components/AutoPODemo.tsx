import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap,
  ShoppingCart, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  Play,
  Clock,
  Factory
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AutoPODemoProps {
  onDemoComplete?: () => void;
}

export default function AutoPODemo({ onDemoComplete }: AutoPODemoProps) {
  const { toast } = useToast();
  const [demoStep, setDemoStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const demoSteps = [
    {
      title: "Sales Order Created",
      description: "Sales order SO-2024-0001 created with BOM template selection",
      icon: ShoppingCart,
      color: "blue",
      details: "Customer: AutoZone Distribution\nBOM: Engine Kit Assembly v2.1\nRequired Date: 2024-01-15"
    },
    {
      title: "Production Plan Generated",
      description: "Production plan PP-2024-0001 automatically created from sales order",
      icon: Factory,
      color: "purple",
      details: "Plan ID: PP-2024-0001\nBOM Components: 15 items\nStatus: Pending Verification"
    },
    {
      title: "Inventory Verification",
      description: "Checking inventory levels against BOM requirements...",
      icon: Package,
      color: "orange",
      details: "✓ Oil Filter: 50 available (need 25)\n✗ Air Filter: 5 available (need 25) - Shortage: 20\n✗ Spark Plugs: 0 available (need 8) - Shortage: 8"
    },
    {
      title: "Purchase Orders Generated",
      description: "Automatically generated 2 purchase orders for missing materials",
      icon: Zap,
      color: "green",
      details: "PO-2024-0156: Air Filter x20 ($15.50 each)\nPO-2024-0157: Spark Plugs x8 ($8.75 each)\nTotal Value: $380.00"
    },
    {
      title: "Production Status Updated",
      description: "Production plan status updated to 'Awaiting Materials'",
      icon: Clock,
      color: "yellow",
      details: "Status: Awaiting Materials\nPurchase Orders: 2 generated\nExpected Delivery: 7-10 business days"
    }
  ];

  const runDemo = async () => {
    setIsRunning(true);
    setDemoStep(0);

    for (let i = 0; i < demoSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setDemoStep(i + 1);
      
      const step = demoSteps[i];
      toast({
        title: step.title,
        description: step.description,
        variant: "default",
      });
    }

    setIsRunning(false);
    
    if (onDemoComplete) {
      onDemoComplete();
    }
  };

  const resetDemo = () => {
    setDemoStep(0);
    setIsRunning(false);
  };

  const getStepColor = (index: number) => {
    const colors = {
      blue: "bg-blue-100 text-blue-700 border-blue-200",
      purple: "bg-purple-100 text-purple-700 border-purple-200",
      orange: "bg-orange-100 text-orange-700 border-orange-200",
      green: "bg-green-100 text-green-700 border-green-200",
      yellow: "bg-yellow-100 text-yellow-700 border-yellow-200"
    };
    
    return colors[demoSteps[index]?.color as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="border-b border-gray-200/50">
        <CardTitle className="flex items-center text-xl">
          <Zap className="h-6 w-6 mr-3 text-yellow-600" />
          Automated Purchase Order Generation Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Demo Controls */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Sales-Driven Production Workflow
              </h3>
              <p className="text-sm text-gray-600">
                See how purchase orders are automatically generated when inventory is insufficient for production
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={runDemo}
                disabled={isRunning}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                {isRunning ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Running Demo...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Demo
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={resetDemo} disabled={isRunning}>
                Reset
              </Button>
            </div>
          </div>

          {/* Demo Steps */}
          <div className="space-y-4">
            {demoSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = demoStep > index;
              const isCurrent = demoStep === index + 1;
              
              return (
                <div
                  key={index}
                  className={`flex items-start space-x-4 p-4 rounded-lg border transition-all duration-500 ${
                    isActive 
                      ? 'bg-green-50 border-green-200' 
                      : isCurrent && isRunning
                        ? 'bg-blue-50 border-blue-200 animate-pulse'
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {/* Step Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive 
                      ? 'bg-green-100 border-2 border-green-400' 
                      : isCurrent && isRunning
                        ? 'bg-blue-100 border-2 border-blue-400'
                        : 'bg-gray-200'
                  }`}>
                    {isActive ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : isCurrent && isRunning ? (
                      <Clock className="h-5 w-5 text-blue-600 animate-spin" />
                    ) : (
                      <Icon className="h-5 w-5 text-gray-500" />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className={`font-semibold ${
                        isActive ? 'text-green-800' : isCurrent && isRunning ? 'text-blue-800' : 'text-gray-700'
                      }`}>
                        {step.title}
                      </h4>
                      <Badge variant="outline" className={`text-xs ${getStepColor(index)}`}>
                        Step {index + 1}
                      </Badge>
                    </div>
                    <p className={`text-sm mb-2 ${
                      isActive ? 'text-green-700' : isCurrent && isRunning ? 'text-blue-700' : 'text-gray-600'
                    }`}>
                      {step.description}
                    </p>
                    {(isActive || (isCurrent && isRunning)) && (
                      <div className="text-xs text-gray-600 bg-white/50 p-2 rounded border whitespace-pre-line">
                        {step.details}
                      </div>
                    )}
                  </div>

                  {/* Arrow */}
                  {index < demoSteps.length - 1 && (
                    <div className="flex items-center">
                      <ArrowRight className={`h-4 w-4 ${
                        isActive ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Demo Summary */}
          {demoStep === demoSteps.length && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-800">Demo Complete!</h4>
              </div>
              <p className="text-sm text-green-700 mb-3">
                The automated purchase order generation system successfully:
              </p>
              <ul className="text-sm text-green-700 space-y-1 ml-4">
                <li>• Detected inventory shortages for production requirements</li>
                <li>• Automatically generated 2 purchase orders for missing materials</li>
                <li>• Updated production status to 'Awaiting Materials'</li>
                <li>• Calculated total procurement value: $380.00</li>
                <li>• Set expected delivery timeline: 7-10 business days</li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}