import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, Target, AlertTriangle } from 'lucide-react';

interface AttackPath {
  description: string;
  steps: string[];
}

interface AttackPathDiagramProps {
  attackPaths: AttackPath[];
}

export const AttackPathDiagram: React.FC<AttackPathDiagramProps> = ({
  attackPaths
}) => {
  return (
    <div className="space-y-6">
      {attackPaths.map((path, pathIndex) => (
        <motion.div
          key={pathIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: pathIndex * 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-destructive" />
                Attack Path {pathIndex + 1}
              </CardTitle>
              <p className="text-muted-foreground">{path.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {path.steps.map((step, stepIndex) => (
                  <motion.div
                    key={stepIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (pathIndex * 0.1) + (stepIndex * 0.05) }}
                    className="relative"
                  >
                    {/* Step Card */}
                    <div className="flex items-start gap-4 p-4 bg-secondary/20 rounded-lg border border-border/50">
                      <div className="flex-shrink-0">
                        <Badge 
                          variant="destructive" 
                          className="w-8 h-8 rounded-full flex items-center justify-center p-0"
                        >
                          {stepIndex + 1}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-warning mt-1 flex-shrink-0" />
                          <p className="text-sm font-medium">{step}</p>
                        </div>
                      </div>
                    </div>

                    {/* Arrow connector (except for last step) */}
                    {stepIndex < path.steps.length - 1 && (
                      <div className="flex justify-center my-2">
                        <motion.div
                          animate={{ y: [0, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <ArrowDown className="h-5 w-5 text-primary" />
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Risk Assessment */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (pathIndex * 0.1) + (path.steps.length * 0.05) }}
                className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="font-semibold text-destructive">Risk Assessment</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This attack path represents a significant security risk. The combination of vulnerabilities 
                  creates multiple entry points that could lead to system compromise. Immediate remediation 
                  of the identified vulnerabilities is strongly recommended.
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: attackPaths.length * 0.1 }}
      >
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary">Attack Path Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-foreground">{attackPaths.length}</div>
                <div className="text-sm text-muted-foreground">Attack Paths</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-destructive">High</div>
                <div className="text-sm text-muted-foreground">Risk Level</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {attackPaths.reduce((sum, path) => sum + path.steps.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Steps</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              These attack paths demonstrate how identified vulnerabilities can be chained together 
              to achieve system compromise. Prioritize fixing vulnerabilities that appear in multiple attack paths.
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};