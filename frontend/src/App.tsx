// X_project/frontend/src/App.tsx (CÓDIGO COMPLETO E FINAL)
import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import ForgotPassword from './components/ForgotPassword';
import ResetPasswordForm from './components/ResetPasswordForm';
import Dashboard from './components/Dashboard'; 
import RegisterForm from './components/RegisterForm'; // Novo Componente de Registro
import './App.css'; 

// Definindo todos os possíveis estados de tela do aplicativo
type AppState = 'login' | 'forgot' | 'reset' | 'dashboard' | 'register';

function App() {
  const [appState, setAppState] = useState<AppState>('login');
  
  // --- Efeito para Manter a Sessão e Lidar com o Reset de URL ---
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const params = new URLSearchParams(window.location.search);

    if (token) {
      // Se houver um token de acesso, vá direto para o Dashboard
      setAppState('dashboard');
    } else if (params.get('token')) {
      // Se houver um token de redefinição na URL, vá para a tela de reset
      setAppState('reset');
    }
    // Caso contrário, permanece em 'login' (estado inicial)
  }, []);

  // --- Handlers de Navegação e Estado ---

  // Função para fazer logout
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setAppState('login');
    // Limpa a URL de qualquer token de reset que possa ter ficado
    window.history.pushState({}, document.title, window.location.pathname); 
  };

  // Função chamada no sucesso do login
  const handleLoginSuccess = () => {
    setAppState('dashboard');
  }

  // Função para voltar para o login (usada em ForgotPassword e RegisterForm)
  const handleBackToLogin = () => {
      setAppState('login');
  }

  // Função para renderizar o componente baseado no estado atual
  const renderContent = () => {
    switch (appState) {
      
      case 'dashboard':
        return <Dashboard 
                 onLogout={handleLogout} 
               />;
        
      case 'forgot':
        return <ForgotPassword 
                 onBackToLogin={handleBackToLogin} 
               />;
      
      case 'register':
        return <RegisterForm 
                 onSuccess={handleBackToLogin} // Sucesso no registro volta para Login
                 onBackToLogin={handleBackToLogin} 
               />;

      case 'reset':
        return <ResetPasswordForm 
                 onSuccess={() => {
                     // Ao redefinir com sucesso, limpa a URL e volta para o login
                     window.history.pushState({}, document.title, window.location.pathname);
                     setAppState('login');
                 }} 
               />;

      case 'login':
      default:
        return <LoginForm 
                 onForgotPassword={() => setAppState('forgot')} 
                 onLoginSuccess={handleLoginSuccess}
                 onNavigateToRegister={() => setAppState('register')}
               />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {renderContent()}
    </div>
  );
}

export default App;