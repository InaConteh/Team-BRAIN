import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Brain, ChevronRight, Sparkles, Users, Check, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { toast } from 'sonner';

interface OnboardingFlowProps {
  onComplete: () => void;
}

type Step = 1 | 2 | 3 | 4;

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<Step>(1);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [inviteEmails, setInviteEmails] = useState('');

  const progress = (step / 4) * 100;

  const handleNext = () => {
    if (step === 1 && !projectName) {
      toast.error('Please enter a project name');
      return;
    }
    
    if (step < 4) {
      setStep((prev) => (prev + 1) as Step);
    }
  };

  const handleSkip = () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as Step);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    // Show celebration
    toast.success('🎉 Welcome to TeamBrain!');
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle>Welcome to TeamBrain</CardTitle>
          <CardDescription>Let's get you started in just a few steps</CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>

        <CardContent className="min-h-[320px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <Badge className="mb-3">Step 1 of 3</Badge>
                  <h3 className="mb-2">Create Your First Project</h3>
                  <p className="text-muted-foreground">
                    Give your brainstorming project a name and description
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Project Name *</Label>
                    <Input
                      id="project-name"
                      placeholder="e.g., Product Redesign Sprint"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea
                      id="project-description"
                      placeholder="What will you brainstorm about?"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <Badge className="mb-3">Step 2 of 3</Badge>
                  <h3 className="mb-2">Invite Your Team</h3>
                  <p className="text-muted-foreground">
                    Collaboration is better together. Add team members to your project.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-6 border-2 border-dashed border-slate-200 rounded-lg text-center">
                    <Users className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                    <Label htmlFor="invite-emails">Email Addresses</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Enter email addresses separated by commas
                    </p>
                    <Textarea
                      id="invite-emails"
                      placeholder="colleague1@example.com, colleague2@example.com"
                      value={inviteEmails}
                      onChange={(e) => setInviteEmails(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      💡 <strong>Tip:</strong> You can always invite more people later from the project settings.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <Badge className="mb-3">Step 3 of 3</Badge>
                  <h3 className="mb-2">Learn AI Summarize</h3>
                  <p className="text-muted-foreground">
                    Discover how AI can help organize and summarize your ideas
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="relative rounded-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-6">
                    <Sparkles className="w-8 h-8 text-purple-600 mb-4" />
                    <h3 className="mb-2">AI-Powered Insights</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      The Auto Summarize feature analyzes your team's ideas and generates:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-purple-600 flex-shrink-0" />
                        <span>Key themes and patterns across all ideas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-purple-600 flex-shrink-0" />
                        <span>Recommendations for next steps</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-purple-600 flex-shrink-0" />
                        <span>Priority rankings based on team feedback</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 text-purple-600 flex-shrink-0" />
                        <span>Automatic tagging and categorization</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border">
                    <p className="text-sm">
                      <strong>Try it out:</strong> Once you've added a few ideas to your project, 
                      click the "Auto Summarize" button to see the magic happen! ✨
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="inline-block mb-6"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                    <PartyPopper className="w-12 h-12 text-white" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="mb-3">You're All Set!</h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Your project "{projectName}" is ready. Start adding ideas and collaborating with your team.
                  </p>

                  <div className="grid gap-4 max-w-sm mx-auto text-left">
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm">Project created</p>
                        <p className="text-xs text-muted-foreground">{projectName}</p>
                      </div>
                    </div>
                    {inviteEmails && (
                      <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm">Team invites sent</p>
                          <p className="text-xs text-muted-foreground">
                            {inviteEmails.split(',').length} member(s)
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm">AI features enabled</p>
                        <p className="text-xs text-muted-foreground">Ready to use</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        <CardFooter className="flex justify-between">
          {step < 4 ? (
            <>
              <Button variant="ghost" onClick={handleSkip}>
                Skip for now
              </Button>
              <Button onClick={handleNext}>
                {step === 3 ? 'Finish' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </>
          ) : (
            <Button className="w-full" size="lg" onClick={handleComplete}>
              Go to Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
