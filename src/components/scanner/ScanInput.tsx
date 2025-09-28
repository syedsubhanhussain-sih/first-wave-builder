import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Scan, Shield } from 'lucide-react';

interface ScanInputProps {
  targetUrl: string;
  setTargetUrl: (url: string) => void;
  onScan: () => void;
  isScanning: boolean;
}

export const ScanInput: React.FC<ScanInputProps> = ({
  targetUrl,
  setTargetUrl,
  onScan,
  isScanning
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetUrl.trim() && !isScanning) {
      onScan();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Vulnerability Scanner</h2>
        <p className="text-muted-foreground">
          Enter a URL to begin comprehensive security analysis
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type="url"
            placeholder="https://example.com"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            className="pl-12 h-14 text-lg glass border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
            disabled={isScanning}
          />
          <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="submit"
            size="lg"
            disabled={!targetUrl.trim() || isScanning}
            className="w-full h-14 text-lg gradient-scan hover:opacity-90 transition-all duration-300 neon-glow"
          >
            {isScanning ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Scan className="h-5 w-5" />
                </motion.div>
                Scanning...
              </>
            ) : (
              <>
                <Scan className="mr-2 h-5 w-5" />
                Start Full Scan
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
};