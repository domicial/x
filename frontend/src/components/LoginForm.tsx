import React, { useState } from 'react';
import axios from 'axios';
import { Lock, User, RefreshCcw, LogIn } from 'lucide-react';

const API_URL = 'http://localhost:8000/token';

interface LoginFormProps {
  onForgotPassword: () => void;
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword, onLoginSuccess, onNavigateToRegister }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('senha123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(API_URL, {
        username: username,
        password: password,
      });

      const token = response.data.access_token;
      console.log('Login Sucedido! Token:', token);
      localStorage.setItem('accessToken', token);

      onLoginSuccess();
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Erro de conexão ou credenciais inválidas.';
      setError(errorMessage);
      console.error('Erro de Login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Card Container */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        
        {/* Header Gradient */}
        <div className="h-40 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>
          <div className="relative h-full flex items-center justify-center">
            <div className="w-28 h-28 rounded-full border-4 border-white bg-gradient-to-br from-blue-300 to-indigo-300 flex items-center justify-center shadow-2xl hover:scale-105 transition duration-200">
              <User size={48} className="text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="px-8 py-10 space-y-7">
          
          {/* Title and Subtitle */}
          <div className="text-center space-y-3 pb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Bem-vindo de volta
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Digite suas credenciais para continuar
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-pulse">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Username Field */}
            <div className="space-y-2.5">
              <label className="block text-sm font-semibold text-gray-800">
                Usuário ou E-mail
              </label>
              <div className="relative group">
                <User className="absolute top-4 left-4 text-indigo-400 group-focus-within:text-indigo-600 transition" size={19} />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full pl-13 pr-5 py-3.5 border-2 border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-450 focus:border-indigo-500 focus:bg-indigo-50/30 focus:ring-2 focus:ring-indigo-200 transition duration-200 font-medium"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2.5">
              <label className="block text-sm font-semibold text-gray-800">
                Senha
              </label>
              <div className="relative group">
                <Lock className="absolute top-4 left-4 text-indigo-400 group-focus-within:text-indigo-600 transition" size={19} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full pl-13 pr-5 py-3.5 border-2 border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-450 focus:border-indigo-500 focus:bg-indigo-50/30 focus:ring-2 focus:ring-indigo-200 transition duration-200 font-medium"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); onForgotPassword(); }}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/50 px-3 py-1.5 rounded-md transition duration-200"
              >
                <RefreshCcw size={16} strokeWidth={2} />
                Esqueci minha senha
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 py-3.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2.5 text-base"
            >
              <LogIn size={20} strokeWidth={2} />
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-gray-500 text-sm font-medium">Novo por aqui?</span>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="w-full py-3.5 px-4 border-2 border-indigo-200 text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition duration-200 text-base"
          >
            Criar uma conta
          </button>
        </div>
      </div>

      {/* Footer Text */}
      <p className="text-center text-sm text-white/85 mt-10 font-medium">
        © 2024 X Project. Todos os direitos reservados.
      </p>
    </div>
  );
};

export default LoginForm;
