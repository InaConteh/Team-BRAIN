import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Copy, RefreshCw, Save, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface AISummaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ideas: any[];
}

type Status = 'processing' | 'completed';

export function AISummaryModal({ open, onOpenChange, ideas }: AISummaryModalProps) {
  const [status, setStatus] = useState<Status>('processing');
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setStatus('processing');
      setProgress(0);
      
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStatus('completed'), 300);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [open]);

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryContent);
    setCopied(true);
    toast.success('Summary copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setStatus('processing');
    setProgress(0);
    toast.info('Regenerating summary...');
  };

  const handleSave = () => {
    toast.success('Summary saved as note!');
    onOpenChange(false);
  };

  const summaryContent = `# Project Summary

## Overview
This project contains ${ideas.length} ideas across ${new Set(ideas.map(i => i.category)).size} categories. The team has been actively collaborating with a total of ${ideas.reduce((sum, i) => sum + i.votes, 0)} votes and ${ideas.reduce((sum, i) => sum + i.comments, 0)} comments.

## Key Insights
- **Most Popular**: "${ideas.sort((a, b) => b.votes - a.votes)[0]?.title}" with ${ideas[0]?.votes || 0} votes
- **Active Discussion**: "${ideas.sort((a, b) => b.comments - a.comments)[0]?.title}" with ${ideas[0]?.comments || 0} comments
- **Top Categories**: Research (${ideas.filter(i => i.category === 'Research').length}), Solutions (${ideas.filter(i => i.category === 'Solutions').length}), Feedback (${ideas.filter(i => i.category === 'Feedback').length})

## Recommendations
1. Prioritize high-voted ideas for implementation
2. Address feedback items to improve user experience
3. Continue research on emerging topics
4. Consider combining similar ideas to reduce duplication

## Next Steps
- Schedule review meeting to discuss top 5 ideas
- Assign owners to highest priority items
- Set timeline for implementation
- Gather additional user feedback if needed`;

  const tags = ['Strategy', 'User Experience', 'Technical', 'High Priority'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Auto Summarize
          </DialogTitle>
          <DialogDescription>
            AI-generated summary of your project ideas
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {status === 'processing' ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 space-y-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-16 h-16 text-purple-600" />
                </motion.div>
                
                <div className="w-full max-w-md space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Processing...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Analyzing {ideas.length} ideas and generating insights
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="completed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* Success Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="flex items-center justify-center mb-4"
                >
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                </motion.div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Summary Content */}
                <ScrollArea className="h-[320px] border rounded-lg p-4">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                      {summaryContent}
                    </pre>
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="flex-row gap-2 sm:gap-2">
          {status === 'completed' && (
            <>
              <Button
                variant="outline"
                onClick={handleCopy}
                disabled={copied}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleRegenerate}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save as Note
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
