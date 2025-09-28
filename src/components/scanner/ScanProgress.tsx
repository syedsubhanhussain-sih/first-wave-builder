import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Activity, CheckCircle } from 'lucide-react';

interface ScanProgressProps {
  progress: number;
  isScanning: boolean;
}

export const ScanProgress: React.FC<ScanProgressProps> = ({
  progress,
  isScanning
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isScanning ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Activity className="h-5 w-5 text-primary" />
            </motion.div>
          ) : (
            <CheckCircle className="h-5 w-5 text-accent" />
          )}
          <span className="font-semibold">
            {isScanning ? 'Scanning in progress...' : 'Scan completed'}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="relative">
        <Progress 
          value={progress} 
          className="h-3 bg-secondary"
        />
        {isScanning && (
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
            style={{ width: `${progress}%` }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        {isScanning 
          ? 'Running comprehensive security analysis...' 
          : 'Security analysis complete. Results ready for review.'
        }
      </div>
    </div>
  );
};