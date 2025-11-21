import { Button } from './ui/button';
import { Card } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import { FolderOpen, WifiOff, AlertCircle, Sparkles, Plus } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type EmptyStateType = 'no-projects' | 'connection-lost' | 'ai-unavailable' | 'loading';

interface EmptyStateProps {
  type: EmptyStateType;
  onAction?: () => void;
}

export function EmptyState({ type, onAction }: EmptyStateProps) {
  if (type === 'loading') {
    return (
      <div className="space-y-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="p-6 space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2 pt-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'connection-lost') {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <WifiOff className="h-4 w-4" />
        <AlertTitle>Connection Lost</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-3">
            Unable to sync with the server. Your changes are saved locally and will sync once connection is restored.
          </p>
          <Button variant="outline" size="sm" onClick={onAction}>
            Retry Connection
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (type === 'ai-unavailable') {
    return (
      <Alert className="max-w-2xl mx-auto border-orange-200 bg-orange-50">
        <AlertCircle className="h-4 w-4 text-orange-600" />
        <AlertTitle className="text-orange-900">AI Service Unavailable</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-3 text-orange-800">
            The AI summarization service is temporarily unavailable. Please try again in a few moments.
          </p>
          <Button variant="outline" size="sm" onClick={onAction}>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // no-projects
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative w-64 h-64 mx-auto mb-6">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1751712698725-88d05e1e797a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMHN0YXRlJTIwaWxsdXN0cmF0aW9ufGVufDF8fHx8MTc2MjI3NzU1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="No projects"
            className="w-full h-full object-cover rounded-2xl opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center">
              <FolderOpen className="w-12 h-12 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2>No projects yet</h2>
          <p className="text-muted-foreground">
            Nothing here yet — ready to brainstorm? Create your first project and start collaborating with your team.
          </p>
        </div>

        <Button size="lg" onClick={onAction} className="mt-6">
          <Plus className="w-5 h-5 mr-2" />
          Create New Project
        </Button>

        <div className="pt-6 border-t">
          <p className="text-sm text-muted-foreground mb-3">
            Quick tips to get started:
          </p>
          <ul className="text-sm text-muted-foreground space-y-2 text-left">
            <li className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />
              <span>Use AI Summarize to get insights from your ideas</span>
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />
              <span>Invite team members to collaborate in real-time</span>
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />
              <span>Organize ideas with categories and tags</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
