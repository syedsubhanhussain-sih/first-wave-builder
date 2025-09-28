import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Brain, MessageCircle } from 'lucide-react';
import { ScanResults } from '../ScannerDashboard';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  scanResults: ScanResults | null;
}

export const ChatBot: React.FC<ChatBotProps> = ({ scanResults }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your cybersecurity intelligence assistant. I can help you understand vulnerabilities, suggest remediation strategies, and answer questions about your scan results. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Mock RAG responses based on scan data
  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (!scanResults) {
      return "I don't have any scan results to analyze yet. Please run a scan first, and I'll be able to provide detailed insights about the vulnerabilities found.";
    }

    if (lowerQuery.includes('sql injection') || lowerQuery.includes('sql')) {
      const sqlVulns = scanResults.vulnerabilities.filter(v => 
        v.description.toLowerCase().includes('sql')
      );
      if (sqlVulns.length > 0) {
        return `I found ${sqlVulns.length} SQL injection vulnerability in your scan results. This is a critical security issue with a CVSS score of ${sqlVulns[0].cvssScore}. To remediate this:

1. **Immediate Action**: Implement parameterized queries/prepared statements
2. **Input Validation**: Sanitize all user inputs
3. **Least Privilege**: Use database accounts with minimal permissions
4. **Web Application Firewall**: Deploy WAF rules to filter malicious requests

The vulnerability was detected by ${sqlVulns[0].toolUsed} and affects: ${sqlVulns[0].affectedComponents.join(', ')}`;
      }
    }

    if (lowerQuery.includes('xss') || lowerQuery.includes('cross-site')) {
      const xssVulns = scanResults.vulnerabilities.filter(v => 
        v.description.toLowerCase().includes('xss') || v.description.toLowerCase().includes('cross-site')
      );
      if (xssVulns.length > 0) {
        return `I detected ${xssVulns.length} Cross-Site Scripting (XSS) vulnerability. This allows attackers to inject malicious scripts. Here's how to fix it:

1. **Content Security Policy**: Implement strict CSP headers
2. **Output Encoding**: Encode all user-generated content
3. **Input Validation**: Validate and sanitize inputs
4. **HttpOnly Cookies**: Prevent script access to cookies

CVSS Score: ${xssVulns[0].cvssScore} | Detected by: ${xssVulns[0].toolUsed}`;
      }
    }

    if (lowerQuery.includes('critical') || lowerQuery.includes('high priority')) {
      const criticalVulns = scanResults.vulnerabilities.filter(v => v.severity === 'critical');
      if (criticalVulns.length > 0) {
        return `⚠️ **CRITICAL VULNERABILITIES DETECTED** ⚠️

Found ${criticalVulns.length} critical vulnerabilities that require immediate attention:

${criticalVulns.map((v, i) => `${i + 1}. **${v.cveId}**: ${v.description} (CVSS: ${v.cvssScore})`).join('\n')}

**Immediate Actions Required:**
- Patch or mitigate these vulnerabilities within 24-48 hours
- Monitor for active exploitation attempts
- Consider taking affected systems offline if patches aren't available
- Implement compensating controls as temporary measures`;
      }
    }

    if (lowerQuery.includes('attack path') || lowerQuery.includes('exploit')) {
      if (scanResults.attackPaths.length > 0) {
        return `I've analyzed ${scanResults.attackPaths.length} potential attack paths from your scan results:

**Primary Attack Vector:**
${scanResults.attackPaths[0].description}

**Attack Sequence:**
${scanResults.attackPaths[0].steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

This attack path demonstrates how multiple vulnerabilities can be chained together. I recommend prioritizing the remediation of vulnerabilities that appear early in this sequence to break the attack chain.`;
      }
    }

    if (lowerQuery.includes('remediation') || lowerQuery.includes('fix') || lowerQuery.includes('patch')) {
      const vulnCount = scanResults.vulnerabilities.length;
      const criticalCount = scanResults.vulnerabilities.filter(v => v.severity === 'critical').length;
      
      return `**Remediation Strategy for ${vulnCount} vulnerabilities:**

**Priority 1 - Critical (${criticalCount} items):**
- Address within 24-48 hours
- Consider emergency patching procedures

**Priority 2 - High Severity:**
- Remediate within 1 week
- Implement monitoring for exploitation attempts

**Priority 3 - Medium/Low:**
- Address within monthly patch cycle
- Bundle with regular maintenance

**Best Practices:**
1. Test patches in staging environment first
2. Maintain asset inventory for tracking
3. Implement vulnerability scanning automation
4. Establish incident response procedures`;
    }

    // Default response with scan statistics
    const totalVulns = scanResults.vulnerabilities.length;
    const criticalCount = scanResults.vulnerabilities.filter(v => v.severity === 'critical').length;
    const highCount = scanResults.vulnerabilities.filter(v => v.severity === 'high').length;

    return `Based on your scan results for ${scanResults.targetUrl}, I found:

📊 **Scan Summary:**
- Total Vulnerabilities: ${totalVulns}
- Critical: ${criticalCount}
- High: ${highCount}
- Medium: ${scanResults.vulnerabilities.filter(v => v.severity === 'medium').length}
- Low: ${scanResults.vulnerabilities.filter(v => v.severity === 'low').length}

You can ask me specific questions about:
- Individual vulnerabilities (e.g., "Tell me about SQL injection")
- Remediation strategies
- Attack paths and exploitation scenarios
- Risk prioritization

What would you like to know more about?`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    scrollAreaRef.current?.scrollTo({
      top: scrollAreaRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages]);

  return (
    <Card className="h-[600px] flex flex-col glass">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Security Assistant
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <MessageCircle className="h-3 w-3 mr-1" />
            RAG-Powered
          </Badge>
          <Badge variant={scanResults ? "default" : "secondary"} className="text-xs">
            {scanResults ? "Context Available" : "No Scan Data"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
          <div className="space-y-4 py-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-accent text-accent-foreground'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div className={`flex-1 max-w-[80%] ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    <div className={`inline-block p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-accent text-accent-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-secondary text-secondary-foreground p-3 rounded-lg">
                  <div className="flex gap-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-primary rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-primary rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-primary rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about vulnerabilities, remediation, or security recommendations..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              size="icon"
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};