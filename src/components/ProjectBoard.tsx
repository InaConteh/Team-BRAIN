import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { ArrowLeft, Sparkles, MessageSquare, ThumbsUp, Plus, MoreVertical } from 'lucide-react';
import { AISummaryModal } from './AISummaryModal';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ProjectBoardProps {
  projectId: string | null;
  onBack: () => void;
  user: any;
}

interface Idea {
  id: string;
  title: string;
  content: string;
  votes: number;
  comments: number;
  owner: { name: string; avatar: string };
  category: string;
}

const mockIdeas: Idea[] = [
  { id: '1', title: 'AI-powered search', content: 'Implement semantic search using embeddings', votes: 12, comments: 5, owner: { name: 'Sarah Chen', avatar: '' }, category: 'Solutions' },
  { id: '2', title: 'Dark mode support', content: 'Add theme toggle and persist preference', votes: 8, comments: 3, owner: { name: 'Mike Johnson', avatar: '' }, category: 'Solutions' },
  { id: '3', title: 'User feedback analysis', content: 'What are users saying about onboarding?', votes: 15, comments: 7, owner: { name: 'Emma Davis', avatar: '' }, category: 'Research' },
  { id: '4', title: 'Mobile app consideration', content: 'Should we build native mobile apps?', votes: 6, comments: 9, owner: { name: 'Alex Rivera', avatar: '' }, category: 'Research' },
  { id: '5', title: 'Improve loading speed', content: 'Dashboard loads slowly with many projects', votes: 18, comments: 4, owner: { name: 'Chris Park', avatar: '' }, category: 'Feedback' },
];

const categories = ['Research', 'Solutions', 'Feedback'];

const activeUsers = [
  { name: 'Sarah Chen', status: 'active' },
  { name: 'Mike Johnson', status: 'active' },
  { name: 'Emma Davis', status: 'typing' },
];

export function ProjectBoard({ onBack }: ProjectBoardProps) {
  const [ideas, setIdeas] = useState(mockIdeas);
  const [showAISummary, setShowAISummary] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleVote = (id: string) => {
    setIdeas(ideas.map(idea => 
      idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea
    ));
    toast.success('Vote added!');
  };

  const handleStartEdit = (idea: Idea) => {
    setEditingId(idea.id);
    setEditValue(idea.title);
  };

  const handleSaveEdit = (id: string) => {
    setIdeas(ideas.map(idea => 
      idea.id === id ? { ...idea, title: editValue } : idea
    ));
    setEditingId(null);
    toast.success('Idea updated!');
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleSaveEdit(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const filteredIdeas = selectedCategory
    ? ideas.filter(idea => idea.category === selectedCategory)
    : ideas;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="truncate">Product Redesign Sprint</h2>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Active Users */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex -space-x-2">
                {activeUsers.map((u, idx) => (
                  <div key={idx} className="relative">
                    <Avatar className="w-8 h-8 border-2 border-white">
                      <AvatarFallback className="text-xs">
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {u.status === 'active' && (
                      <motion.div
                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                    )}
                    {u.status === 'typing' && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-blue-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {activeUsers.length} online
              </span>
            </div>

            <Button onClick={() => setShowAISummary(true)}>
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Auto Summarize</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Categories */}
        <aside className="hidden md:block w-64 bg-white border-r p-4">
          <div className="mb-4">
            <h3 className="mb-3">Categories</h3>
            <div className="space-y-1">
              <Button
                variant={selectedCategory === null ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedCategory(null)}
              >
                All Ideas ({ideas.length})
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category} ({ideas.filter(i => i.category === category).length})
                </Button>
              ))}
            </div>
          </div>
          
          <Button className="w-full mt-4">
            <Plus className="w-4 h-4 mr-2" />
            New Category
          </Button>
        </aside>

        {/* Main Board */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-5xl mx-auto">
            {/* Mobile category selector */}
            <div className="md:hidden mb-4 flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredIdeas.map((idea) => (
                <motion.div
                  key={idea.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {idea.category}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                      {editingId === idea.id ? (
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, idea.id)}
                          onBlur={() => handleSaveEdit(idea.id)}
                          autoFocus
                          className="h-auto p-1 text-base"
                        />
                      ) : (
                        <h3
                          className="cursor-pointer hover:text-purple-600"
                          onClick={() => handleStartEdit(idea)}
                        >
                          {idea.title}
                        </h3>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {idea.content}
                      </p>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => handleVote(idea.id)}
                          >
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {idea.votes}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {idea.comments}
                          </Button>
                        </div>
                        
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {idea.owner.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Add New Idea Card */}
              <Card className="border-dashed border-2 hover:border-purple-400 transition-colors cursor-pointer group">
                <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] p-6">
                  <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-purple-100 flex items-center justify-center mb-3 transition-colors">
                    <Plus className="w-6 h-6 text-slate-400 group-hover:text-purple-600" />
                  </div>
                  <p className="text-muted-foreground text-center">Add new idea</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Right Panel - AI Assistant (Optional) */}
        <aside className="hidden xl:block w-80 bg-white border-l p-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3>AI Assistant</h3>
          </div>
          
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-4 pr-4">
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4">
                  <p className="text-sm">
                    💡 Most voted idea: "Improve loading speed" with 18 votes
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <p className="text-sm">
                    🔍 3 ideas in Research need categorization
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <p className="text-sm">
                    ✨ Emma is typing a new idea...
                  </p>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
          
          <Button className="w-full mt-4" variant="outline">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Insights
          </Button>
        </aside>
      </div>

      <AISummaryModal
        open={showAISummary}
        onOpenChange={setShowAISummary}
        ideas={ideas}
      />
    </div>
  );
}
