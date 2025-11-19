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
    <div className="w-full max-w-md">
      {/* Card Container */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        
        {/* Header Gradient */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-2 right-10 w-20 h-20 bg-white rounded-full mix-blend-multiply filter blur-xl"></div>
            <div className="absolute bottom-0 left-20 w-20 h-20 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animation-float"></div>
          </div>
          <div className="relative h-full flex items-end justify-center pb-4">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-blue-300 to-indigo-300 flex items-center justify-center shadow-lg">
              <User size={40} className="text-white" />
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="px-8 py-8 space-y-6">
          
          {/* Title */}
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Bem-vindo de volta
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Digite suas credenciais para continuar
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Username Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Usuário ou E-mail
              </label>
              <div className="relative">
                <User className="absolute top-3.5 left-4 text-indigo-400" size={18} />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition duration-200"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute top-3.5 left-4 text-indigo-400" size={18} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition duration-200"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); onForgotPassword(); }}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1 transition"
              >
                <RefreshCcw size={14} />
                Esqueci minha senha
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white/95 text-gray-500">Novo por aqui?</span>
            </div>
          </div>

          {/* Register Link */}
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="w-full py-3 px-4 border-2 border-indigo-200 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition duration-200"
          >
            Criar uma conta
          </button>
        </div>
      </div>

      {/* Footer Text */}
      <p className="text-center text-sm text-white/80 mt-8">
        © 2024 X Project. Todos os direitos reservados.
      </p>
    </div>
  );
};

export default LoginForm;
