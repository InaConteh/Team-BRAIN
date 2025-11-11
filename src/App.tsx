import { useState } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';
import { ProjectBoard } from './components/ProjectBoard';
import { TeamSettings } from './components/TeamSettings';
import { OnboardingFlow } from './components/OnboardingFlow';
import { Toaster } from './components/ui/sonner';

type Screen = 'auth' | 'onboarding' | 'dashboard' | 'project' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = () => {
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('auth');
  };

  const handleOpenProject = (projectId: string) => {
    setCurrentProjectId(projectId);
    setCurrentScreen('project');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
    setCurrentProjectId(null);
  };

  const handleOpenSettings = () => {
    setCurrentScreen('settings');
  };

  return (
    <>
      {currentScreen === 'auth' && <AuthScreen onLogin={handleLogin} />}
      {currentScreen === 'onboarding' && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}
      {currentScreen === 'dashboard' && (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          onOpenProject={handleOpenProject}
          onOpenSettings={handleOpenSettings}
        />
      )}
      {currentScreen === 'project' && (
        <ProjectBoard
          projectId={currentProjectId}
          onBack={handleBackToDashboard}
          user={user}
        />
      )}
      {currentScreen === 'settings' && (
        <TeamSettings onBack={handleBackToDashboard} />
      )}
      <Toaster />
    </>
  );
}
