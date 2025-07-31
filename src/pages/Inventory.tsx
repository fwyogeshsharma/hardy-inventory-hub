import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp, TrendingDown, AlertTriangle, DollarSign, Calendar, Download, RefreshCw, Target, Loader2, Trash2, ShoppingCart, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { dataService, SKU, Inventory as InventoryRecord } from "@/lib/database";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { AddSKUDrawer } from "@/components/AddSKUDrawer";
import { FormModal } from "@/components/forms/FormModal";
import { initializeData } from "@/lib/initializeData";
import { workflowManager } from "@/lib/workflowExtensions";
import { useToast } from "@/hooks/use-toast";

export default function Inventory() {
  const { toast } = useToast();
  const [skus, setSKUs] = useState<SKU[]>([]);
  const [inventory, setInventory] = useState<InventoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [reorderingItems, setReorderingItems] = useState<Set<number>>(new Set());
  const [deletingItems, setDeletingItems] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await dataService.initialize();
      
      // Check if we have any SKUs, if not, initialize sample data
      const existingSKUs = await dataService.getSKUs();
      if (existingSKUs.length === 0) {
        console.log('No SKUs found, initializing comprehensive automotive data...');
        await initializeData();
      }
      
      const [skusData, inventoryData] = await Promise.all([
        dataService.getSKUs(),
        dataService.getInventory()
      ]);
      // Sort SKUs by creation date (newest first)
      const sortedSKUs = skusData.sort((a, b) => {
        const dateA = new Date(a.created_at || '1970-01-01').getTime();
        const dateB = new Date(b.created_at || '1970-01-01').getTime();
        return dateB - dateA;
      });
      setSKUs(sortedSKUs);
      setInventory(inventoryData);
      // Reset to first page when data is loaded
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSKUAdded = (newSKU: SKU) => {
    setSKUs(prev => [newSKU, ...prev]);
    // Reload inventory data to get the new SKU's inventory record
    loadData();
    setModalOpen(false);
  };

  const handleModalSKUAdded = () => {
    setModalOpen(false);
    loadData();
  };


  // Helper functions
  const getStockData = (sku: SKU) => {
    // Get inventory data for this SKU
    const skuInventory = inventory.find(inv => inv.sku_id === sku.id);
    
    if (skuInventory) {
      return {
        stock: skuInventory.quantity_on_hand,
        safetyStock: skuInventory.safety_stock_level,
        reorderPoint: skuInventory.reorder_point,
        maxStock: skuInventory.max_stock_level || 1000,
        unitCost: skuInventory.unit_cost || sku.unit_cost || 2.50,
        totalValue: skuInventory.quantity_on_hand * (skuInventory.unit_cost || sku.unit_cost || 2.50),
        fillLevel: skuInventory.max_stock_level 
          ? (skuInventory.quantity_on_hand / skuInventory.max_stock_level) * 100 
          : 50
      };
    }
    
    // Fallback for SKUs without inventory records
    const seed = sku.id;
    const baseStock = 100 + (seed % 900);
    const variance = (seed % 200) - 100;
    const stock = Math.max(0, baseStock + variance);
    const safetyStock = Math.floor(stock * 0.2);
    const unitCost = sku.unit_cost || 2.50;
    
    return { 
      stock, 
      safetyStock, 
      reorderPoint: Math.floor(stock * 0.35),
      maxStock: Math.floor(stock * 2.5),
      unitCost, 
      totalValue: stock * unitCost,
      fillLevel: (stock / (stock * 2.5)) * 100
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateTotalInventoryValue = () => {
    return skus.reduce((total, sku) => {
      const stockData = getStockData(sku);
      return total + stockData.totalValue;
    }, 0);
  };

  const getLowStockCount = () => {
    return skus.filter(sku => {
      const stockData = getStockData(sku);
      return stockData.stock <= stockData.safetyStock && stockData.stock > 0;
    }).length;
  };

  const getOutOfStockCount = () => {
    return skus.filter(sku => {
      const stockData = getStockData(sku);
      return stockData.stock === 0;
    }).length;
  };

  // Handle reorder request
  const handleReorderRequest = async (sku: SKU) => {
    try {
      setReorderingItems(prev => new Set(prev).add(sku.id));
      
      const stockData = getStockData(sku);
      const inventoryRecord = inventory.find(inv => inv.sku_id === sku.id);
      const warehouseId = inventoryRecord?.warehouse_id || 1; // Default to main warehouse
      
      const reason = stockData.stock === 0 ? 'out_of_stock' : 'low_stock';
      const priority = stockData.stock === 0 ? 'high' : 'medium';
      
      await workflowManager.createReorderRequest({
        sku_id: sku.id,
        warehouse_id: warehouseId,
        quantity_requested: stockData.maxStock - stockData.stock,
        reason,
        priority,
        notes: `Reorder requested from inventory page. Current stock: ${stockData.stock}, Safety stock: ${stockData.safetyStock}`
      });
      
      toast({
        title: "Reorder Request Created",
        description: `Reorder request created for ${sku.sku_name}. The item will appear on the Purchase Order page.`,
        variant: "default",
      });
      
      // Auto-approve the reorder request for demonstration
      setTimeout(async () => {
        const reorderRequests = await workflowManager.getReorderRequests();
        const latestRequest = reorderRequests[reorderRequests.length - 1];
        if (latestRequest) {
          await workflowManager.updateReorderRequestStatus(latestRequest.id, 'approved');
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error creating reorder request:', error);
      toast({
        title: "Error",
        description: "Failed to create reorder request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setReorderingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(sku.id);
        return newSet;
      });
    }
  };

  // Handle delete SKU
  const handleDeleteSKU = async (sku: SKU) => {
    if (window.confirm(`Are you sure you want to delete "${sku.sku_name}" (${sku.sku_code})? This action cannot be undone and will remove all associated inventory data.`)) {
      try {
        setDeletingItems(prev => new Set(prev).add(sku.id));
        
        await dataService.deleteSKU(sku.id);
        
        // Remove from local state
        setSKUs(prev => prev.filter(s => s.id !== sku.id));
        setInventory(prev => prev.filter(inv => inv.sku_id !== sku.id));
        
        // Adjust pagination if current page becomes empty
        const remainingSKUs = skus.filter(s => s.id !== sku.id);
        const newTotalPages = Math.ceil(remainingSKUs.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
        
        toast({
          title: "SKU Deleted",
          description: `${sku.sku_name} has been successfully deleted from inventory.`,
          variant: "default",
        });
        
      } catch (error) {
        console.error('Error deleting SKU:', error);
        toast({
          title: "Error",
          description: "Failed to delete SKU. Please try again.",
          variant: "destructive",
        });
      } finally {
        setDeletingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(sku.id);
          return newSet;
        });
      }
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = skus.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(skus.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex-1 space-y-6 p-6 min-h-screen" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e6f2fa 100%)'}}>
      {/* Header Section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold" style={{color: '#3997cd'}}>
            Auto Parts Inventory
          </h1>
          <p className="text-lg text-muted-foreground">
            Track and manage all automotive parts, components, and accessories
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
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={() => setModalOpen(true)}
            className="text-white shadow-lg" style={{backgroundColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3997cd'}
          >
            <Package className="h-4 w-4 mr-2" />
            Add New SKU
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total SKUs</p>
                <p className="text-3xl font-bold">{skus.length}</p>
                <p className="text-blue-100 text-xs mt-1">
                  Active auto parts
                </p>
              </div>
              <Package className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12% from last month
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Low Stock</p>
                <p className="text-3xl font-bold">{getLowStockCount()}</p>
                <p className="text-blue-100 text-xs mt-1">Below safety levels</p>
              </div>
              <AlertTriangle className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <TrendingDown className="h-4 w-4 mr-1" />
                -8% improvement
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Out of Stock</p>
                <p className="text-3xl font-bold">{getOutOfStockCount()}</p>
                <p className="text-blue-100 text-xs mt-1">Requires attention</p>
              </div>
              <Target className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Critical priority
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #3997cd 0%, #2d7aad 100%)'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Value</p>
                <p className="text-3xl font-bold">{formatCurrency(calculateTotalInventoryValue())}</p>
                <p className="text-blue-100 text-xs mt-1">Current inventory</p>
              </div>
              <DollarSign className="h-10 w-10" style={{color: 'rgba(255,255,255,0.7)'}} />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-100 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +15% value growth
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Content */}
      {loading ? (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-12">
            <div className="text-center">
              <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin" style={{color: '#3997cd'}} />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                Loading inventory...
              </h3>
              <p className="text-gray-500">
                Please wait while we fetch your inventory data.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : skus.length === 0 ? (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-12">
            <div className="text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No Auto Parts Found
              </h3>
              <p className="text-gray-500 mb-6">
                Add your first automotive part to get started with inventory management.
              </p>
              <Button 
                onClick={() => setModalOpen(true)}
                className="text-white shadow-lg" style={{backgroundColor: '#3997cd'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d7aad'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3997cd'}
              >
                <Package className="h-4 w-4 mr-2" />
                Add New SKU
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="border-b border-gray-200/50">
            <CardTitle className="flex items-center text-xl">
              <Package className="h-6 w-6 mr-3" style={{color: '#3997cd'}} />
              Auto Parts Inventory
              <Badge variant="outline" className="ml-3" style={{backgroundColor: '#e6f2fa', color: '#3997cd', borderColor: '#3997cd'}}>
                {skus.length} items
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {currentItems.map((sku) => {
                const stockData = getStockData(sku);
                return (
                  <div key={sku.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#3997cd'}}>
                          <span className="text-white font-bold text-sm">{sku.brand?.name?.charAt(0) || 'S'}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{sku.sku_name}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">{sku.sku_code}</Badge>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">{sku.sku_type === 'kit' ? 'Kit SKU' : 'Single SKU'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-13">
                        <p className="text-sm text-gray-600">
                          {sku.brand?.name} • {sku.category?.name} • {sku.part_type?.name}
                        </p>
                        <p className="text-xs text-gray-500">Barcode: {sku.barcode || 'N/A'}</p>
                        <p className="text-xs text-gray-500">Launch Date: {sku.launch_date ? new Date(sku.launch_date).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-2 min-w-[200px]">
                      <div className="flex items-center justify-end space-x-2">
                        <Badge variant={sku.status === 'active' ? 'default' : sku.status === 'upcoming' ? 'secondary' : 'outline'}>
                          {sku.status.charAt(0).toUpperCase() + sku.status.slice(1)}
                        </Badge>
                        {stockData.stock <= stockData.safetyStock && stockData.stock > 0 && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            Low Stock
                          </Badge>
                        )}
                        {stockData.stock === 0 && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                          Stock: {stockData.stock.toLocaleString()} {sku.unit_of_measure}
                        </p>
                        <p className="text-xs text-gray-500">
                          Safety: {stockData.safetyStock} • Reorder: {stockData.reorderPoint}
                        </p>
                        <p className="text-sm font-semibold text-green-600">
                          {formatCurrency(stockData.totalValue)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Unit: {formatCurrency(stockData.unitCost)}
                        </p>
                      </div>
                      
                      {/* Reorder Button - Show for out of stock or low stock items */}
                      {(stockData.stock === 0 || stockData.stock <= stockData.safetyStock) && (
                        <div className="mt-3">
                          <Button
                            size="sm"
                            variant={stockData.stock === 0 ? "destructive" : "outline"}
                            className={stockData.stock === 0 
                              ? "w-full bg-red-600 hover:bg-red-700 text-white" 
                              : "w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                            }
                            onClick={() => handleReorderRequest(sku)}
                            disabled={reorderingItems.has(sku.id)}
                          >
                            {reorderingItems.has(sku.id) ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                {stockData.stock === 0 ? (
                                  <>
                                    <ShoppingCart className="h-3 w-3 mr-1" />
                                    Reorder Now
                                  </>
                                ) : (
                                  <>
                                    <RotateCcw className="h-3 w-3 mr-1" />
                                    Reorder
                                  </>
                                )}
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                      
                      {/* Delete Button - Always visible */}
                      <div className="mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                          onClick={() => handleDeleteSKU(sku)}
                          disabled={deletingItems.has(sku.id)}
                        >
                          {deletingItems.has(sku.id) ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 border-t border-gray-200/50 pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <span>
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, skus.length)} of {skus.length} items
                    </span>
                  </div>
                  
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={handlePreviousPage}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-gray-100'}
                        />
                      </PaginationItem>
                      
                      {getPageNumbers().map((pageNumber) => (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNumber)}
                            isActive={currentPage === pageNumber}
                            className="cursor-pointer hover:bg-gray-100"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={handleNextPage}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-gray-100'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add SKU Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New SKU"
        maxWidth="max-w-5xl"
      >
        <AddSKUDrawer onSKUAdded={handleSKUAdded} />
      </FormModal>
    </div>
  );
}
