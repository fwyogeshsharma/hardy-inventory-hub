import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { initializeData } from '@/lib/initializeData';

export const InitializeDataButton = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInitialize = async () => {
    setLoading(true);
    try {
      const result = await initializeData();
      
      if (result) {
        toast({
          title: "Database Initialized! 🎉",
          description: "System now contains 100+ automotive parts with realistic inventory levels",
        });
        
        // Trigger page refreshes
        window.location.reload();
      } else {
        throw new Error('Initialization failed');
      }
    } catch (error) {
      console.error('Initialization error:', error);
      toast({
        title: "Initialization Failed",
        description: "Please check the console for error details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleInitialize}
      disabled={loading}
      variant="outline"
      size="sm"
      className="bg-white/50 backdrop-blur-sm"
      style={{borderColor: '#3997cd', color: '#3997cd'}}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6f2fa'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.5)'}
    >
      {loading ? (
        <RefreshCw className="h-4 w-4 mr-2 animate-spin" style={{color: '#3997cd'}} />
      ) : (
        <Database className="h-4 w-4 mr-2" style={{color: '#3997cd'}} />
      )}
      {loading ? 'Initializing...' : 'Load Sample Data'}
    </Button>
  );
};