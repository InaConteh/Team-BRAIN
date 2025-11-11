import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { Brain, Plus, Settings, LogOut, Users, Clock, MoreVertical, Folder, Share2 } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { cn } from './ui/utils';

interface DashboardProps {
  user: any;
  onLogout: () => void;
  onOpenProject: (projectId: string) => void;
  onOpenSettings: () => void;
}

const mockProjects = [
  {
    id: '1',
    title: 'Product Redesign Sprint',
    description: 'Q1 2025 product redesign brainstorming',
    members: [
      { name: 'Sarah Chen', avatar: '' },
      { name: 'Mike Johnson', avatar: '' },
      { name: 'Emma Davis', avatar: '' },
    ],
    lastUpdated: '2 hours ago',
    ideasCount: 24,
    status: 'active',
  },
  {
    id: '2',
    title: 'Marketing Campaign Ideas',
    description: 'Summer campaign creative concepts',
    members: [
      { name: 'Alex Rivera', avatar: '' },
      { name: 'Jamie Lee', avatar: '' },
    ],
    lastUpdated: '1 day ago',
    ideasCount: 15,
    status: 'active',
  },
  {
    id: '3',
    title: 'Engineering Roadmap',
    description: 'H2 technical priorities and architecture',
    members: [
      { name: 'Chris Park', avatar: '' },
      { name: 'Taylor Swift', avatar: '' },
      { name: 'Jordan White', avatar: '' },
      { name: 'Sam Brown', avatar: '' },
    ],
    lastUpdated: '3 days ago',
    ideasCount: 42,
    status: 'archived',
  },
];

export function Dashboard({ user, onLogout, onOpenProject, onOpenSettings }: DashboardProps) {
  const [selectedTab, setSelectedTab] = useState<'my-projects' | 'shared'>('my-projects');
  const [projects] = useState(mockProjects);

  const filteredProjects = selectedTab === 'my-projects' 
    ? projects.filter(p => p.status === 'active')
    : projects.filter(p => p.members.length > 1);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl">TeamBrain</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src="" alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.name || 'User'}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onOpenSettings}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-white border-r min-h-[calc(100vh-4rem)] p-4">
          <nav className="space-y-1">
            <Button
              variant={selectedTab === 'my-projects' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedTab('my-projects')}
            >
              <Folder className="w-4 h-4 mr-2" />
              My Projects
            </Button>
            <Button
              variant={selectedTab === 'shared' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setSelectedTab('shared')}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Shared with Me
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="mb-2">
                {selectedTab === 'my-projects' ? 'My Projects' : 'Shared with Me'}
              </h1>
              <p className="text-muted-foreground">
                {selectedTab === 'my-projects'
                  ? 'Your active brainstorming projects'
                  : 'Projects shared by your team'}
              </p>
            </div>

            {filteredProjects.length === 0 ? (
              <EmptyState type="no-projects" />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => onOpenProject(project.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="group-hover:text-purple-600 transition-colors">
                            {project.title}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {project.description}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem>Archive</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {project.members.slice(0, 3).map((member, idx) => (
                            <Avatar key={idx} className="w-8 h-8 border-2 border-white">
                              <AvatarFallback className="text-xs">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {project.members.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs">
                              +{project.members.length - 3}
                            </div>
                          )}
                        </div>
                        <Badge variant="secondary" className="ml-auto">
                          {project.ideasCount} ideas
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      Updated {project.lastUpdated}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating Action Button */}
      <Button
        size="lg"
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg"
        onClick={() => onOpenProject('new')}
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed bottom-6 left-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="lg" className="rounded-full shadow-lg">
              <Folder className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onClick={() => setSelectedTab('my-projects')}>
              <Folder className="w-4 h-4 mr-2" />
              My Projects
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedTab('shared')}>
              <Share2 className="w-4 h-4 mr-2" />
              Shared with Me
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
