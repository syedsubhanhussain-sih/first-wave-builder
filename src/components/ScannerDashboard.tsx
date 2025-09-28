import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ScanInput } from './scanner/ScanInput';
import { ToolButtons } from './scanner/ToolButtons';
import { ScanProgress } from './scanner/ScanProgress';
import { VulnerabilityReport } from './scanner/VulnerabilityReport';
import { ChatBot } from './scanner/ChatBot';
import { Shield, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

export interface ScanTool {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'idle' | 'scanning' | 'complete' | 'error';
  description: string;
}

export interface Vulnerability {
  cveId: string;
  cvssScore: number;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedComponents: string[];
  toolUsed: string;
  exploitSource?: string;
  remediationGuidance?: string;
}

export interface ScanResults {
  scanId: string;
  targetUrl: string;
  timestamp: Date;
  status: 'in-progress' | 'completed' | 'error';
  vulnerabilities: Vulnerability[];
  attackPaths: {
    description: string;
    steps: string[];
  }[];
}

const SCAN_TOOLS: ScanTool[] = [
  {
    id: 'nmap',
    name: 'Nmap',
    icon: <Shield className="h-5 w-5" />,
    status: 'idle',
    description: 'Network Discovery & Security Auditing'
  },
  {
    id: 'nikto',
    name: 'Nikto',
    icon: <Activity className="h-5 w-5" />,
    status: 'idle',
    description: 'Web Server Scanner'
  },
  {
    id: 'nuclei',
    name: 'Nuclei',
    icon: <AlertTriangle className="h-5 w-5" />,
    status: 'idle',
    description: 'Vulnerability Scanner'
  },
  {
    id: 'openvas',
    name: 'OpenVAS',
    icon: <CheckCircle className="h-5 w-5" />,
    status: 'idle',
    description: 'Vulnerability Assessment'
  },
  {
    id: 'nessus',
    name: 'Nessus',
    icon: <Shield className="h-5 w-5" />,
    status: 'idle',
    description: 'Comprehensive Vulnerability Scanner'
  }
];

export const ScannerDashboard: React.FC = () => {
  const [targetUrl, setTargetUrl] = useState('');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [tools, setTools] = useState<ScanTool[]>(SCAN_TOOLS);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState<ScanResults | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleScan = async (toolId?: string) => {
    if (!targetUrl.trim()) return;

    setIsScanning(true);
    setScanProgress(0);
    setShowResults(false);

    // Determine which tools to run
    const toolsToRun = toolId ? tools.filter(t => t.id === toolId) : tools;
    
    // Reset all tool statuses
    setTools(prev => prev.map(tool => ({
      ...tool,
      status: toolsToRun.find(t => t.id === tool.id) ? 'idle' : 'idle'
    })));

    // Simulate scanning process
    for (let i = 0; i < toolsToRun.length; i++) {
      const currentTool = toolsToRun[i];
      
      // Set current tool to scanning
      setTools(prev => prev.map(tool => ({
        ...tool,
        status: tool.id === currentTool.id ? 'scanning' : tool.status
      })));

      // Simulate scan time (2-4 seconds per tool)
      const scanTime = 2000 + Math.random() * 2000;
      await new Promise(resolve => setTimeout(resolve, scanTime));

      // Set tool to complete
      setTools(prev => prev.map(tool => ({
        ...tool,
        status: tool.id === currentTool.id ? 'complete' : tool.status
      })));

      // Update progress
      setScanProgress((i + 1) / toolsToRun.length * 100);
    }

    // Generate mock results
    const mockResults = generateMockResults(targetUrl, toolsToRun);
    setScanResults(mockResults);
    setIsScanning(false);
    setShowResults(true);
  };

  const generateMockResults = (url: string, toolsUsed: ScanTool[]): ScanResults => {
    const vulnerabilities: Vulnerability[] = [
      {
        cveId: 'CVE-2023-1234',
        cvssScore: 8.5,
        description: 'SQL Injection vulnerability in login form',
        severity: 'high',
        affectedComponents: ['Login Form', 'User Authentication'],
        toolUsed: 'Nikto',
        exploitSource: 'ExploitDB',
        remediationGuidance: 'Implement parameterized queries and input validation'
      },
      {
        cveId: 'CVE-2023-5678',
        cvssScore: 6.2,
        description: 'Cross-Site Scripting (XSS) in search functionality',
        severity: 'medium',
        affectedComponents: ['Search Bar', 'User Input'],
        toolUsed: 'Nuclei',
        remediationGuidance: 'Sanitize user input and implement Content Security Policy'
      },
      {
        cveId: 'CVE-2023-9999',
        cvssScore: 9.1,
        description: 'Remote Code Execution via file upload',
        severity: 'critical',
        affectedComponents: ['File Upload', 'Server Processing'],
        toolUsed: 'OpenVAS',
        exploitSource: 'Metasploit',
        remediationGuidance: 'Restrict file types and implement server-side validation'
      }
    ];

    const attackPaths = [
      {
        description: 'Multi-stage attack exploiting SQL injection and privilege escalation',
        steps: [
          'Identify SQL injection point in login form',
          'Extract database credentials',
          'Escalate privileges using weak configuration',
          'Access sensitive data and establish persistence'
        ]
      }
    ];

    return {
      scanId: `scan_${Date.now()}`,
      targetUrl: url,
      timestamp: new Date(),
      status: 'completed',
      vulnerabilities,
      attackPaths
    };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/50 glass border-b border-border/50 sticky top-0 z-10"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CyberSec Scanner
              </h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Professional Vulnerability Intelligence Platform
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Scanner Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scan Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 glass">
                <ScanInput
                  targetUrl={targetUrl}
                  setTargetUrl={setTargetUrl}
                  onScan={() => handleScan()}
                  isScanning={isScanning}
                />
              </Card>
            </motion.div>

            {/* Progress Bar */}
            {(isScanning || scanProgress > 0) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 glass">
                  <ScanProgress progress={scanProgress} isScanning={isScanning} />
                </Card>
              </motion.div>
            )}

            {/* Tool Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 glass">
                <ToolButtons
                  tools={tools}
                  onToolClick={(toolId) => handleScan(toolId)}
                  isScanning={isScanning}
                />
              </Card>
            </motion.div>

            {/* Results */}
            {showResults && scanResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <VulnerabilityReport results={scanResults} />
              </motion.div>
            )}
          </div>

          {/* Chatbot Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ChatBot scanResults={scanResults} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};