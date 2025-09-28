import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cog } from 'lucide-react';
import { ScanTool } from '../ScannerDashboard';

interface ToolButtonsProps {
  tools: ScanTool[];
  onToolClick: (toolId: string) => void;
  isScanning: boolean;
}

export const ToolButtons: React.FC<ToolButtonsProps> = ({
  tools,
  onToolClick,
  isScanning
}) => {
  const getButtonClass = (status: ScanTool['status']) => {
    switch (status) {
      case 'scanning':
        return 'tool-button-scanning neon-glow';
      case 'complete':
        return 'tool-button-complete success-glow';
      case 'error':
        return 'bg-destructive text-destructive-foreground border-2 border-destructive';
      default:
        return 'tool-button-idle hover:border-primary/50 hover:bg-primary/5';
    }
  };

  const getStatusBadge = (status: ScanTool['status']) => {
    switch (status) {
      case 'scanning':
        return <Badge variant="default" className="bg-primary">Scanning</Badge>;
      case 'complete':
        return <Badge variant="default" className="bg-accent">Complete</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Ready</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground">Security Tools</h3>
        <p className="text-muted-foreground">Click any tool to run individually</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              onClick={() => onToolClick(tool.id)}
              disabled={isScanning}
              className={`h-auto p-4 flex flex-col items-center gap-3 ${getButtonClass(tool.status)}`}
            >
              <div className="flex items-center gap-2">
                {tool.status === 'scanning' ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Cog className="h-5 w-5" />
                  </motion.div>
                ) : (
                  tool.icon
                )}
              </div>
              
              <div className="text-center">
                <div className="font-semibold text-sm">{tool.name}</div>
                <div className="text-xs opacity-75 mt-1">{tool.description}</div>
              </div>
              
              <div className="mt-2">
                {getStatusBadge(tool.status)}
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};