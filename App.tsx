
import React, { useState, useEffect } from 'react';
import { User, Invitation, EventType, RSVP } from './types';
import { storage } from './storage';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import CreateInvitation from './components/CreateInvitation';
import PublicInvitationView from './components/PublicInvitationView';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(storage.getCurrentUser());
  const [currentView, setCurrentView] = useState<string>('landing');
  const [activeInvitationId, setActiveInvitationId] = useState<string | undefined>();

  // Simple Router based on Hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/invite/')) {
        const id = hash.replace('#/invite/', '');
        setActiveInvitationId(id);
        setCurrentView('invite-view');
      } else if (hash === '#/login') {
        setCurrentView('login');
      } else if (hash === '#/register') {
        setCurrentView('register');
      } else if (hash === '#/dashboard' && currentUser) {
        setCurrentView('dashboard');
      } else if (hash === '#/create' && currentUser) {
        setCurrentView('create');
      } else {
        if (currentUser && hash === '') {
            window.location.hash = '#/dashboard';
        } else {
            setCurrentView('landing');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentUser]);

  const navigate = (to: string) => {
    window.location.hash = to;
  };

  const handleLogin = (user: User) => {
    storage.setCurrentUser(user);
    setCurrentUser(user);
    navigate('#/dashboard');
  };

  const handleLogout = () => {
    storage.setCurrentUser(null);
    setCurrentUser(null);
    navigate('#/login');
  };

  return (
    <div className="min-h-screen">
      {currentView === 'landing' && <LandingPage onNavigate={navigate} />}
      {currentView === 'login' && <LoginPage onLogin={handleLogin} onNavigate={navigate} />}
      {currentView === 'register' && <RegisterPage onNavigate={navigate} />}
      {currentView === 'dashboard' && currentUser && (
        <Dashboard 
          user={currentUser} 
          onLogout={handleLogout} 
          onNavigate={navigate} 
        />
      )}
      {currentView === 'create' && currentUser && (
        <CreateInvitation 
          user={currentUser} 
          onNavigate={navigate} 
        />
      )}
      {currentView === 'invite-view' && activeInvitationId && (
        <PublicInvitationView invitationId={activeInvitationId} onNavigate={navigate} />
      )}
    </div>
  );
};

export default App;
