import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, User, ArrowLeft, UserPlus } from 'lucide-react';

const API_URL = 'http://localhost:8000/register';

interface RegisterFormProps {
  onSuccess: () => void;
  onBackToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onBackToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(API_URL, {
        username,
        email,
        password,
      });

      setMessage('Registro bem-sucedido! Redirecionando para login...');
      console.log('Registro Sucedido:', response.data);
      
      setTimeout(() => {
        onSuccess();
      }, 1500);

    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Erro ao registrar. Tente novamente.';
      setError(errorMessage);
      console.error('Erro de Registro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Card Container */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        
        {/* Header Gradient */}
        <div className="h-32 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-2 right-10 w-20 h-20 bg-white rounded-full mix-blend-multiply filter blur-xl"></div>
            <div className="absolute bottom-0 left-20 w-20 h-20 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl"></div>
          </div>
          <div className="relative h-full flex items-end justify-center pb-4">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-cyan-300 to-blue-300 flex items-center justify-center shadow-lg">
              <UserPlus size={40} className="text-white" />
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="px-8 py-8 space-y-6">
          
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Criar Conta
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                Junte-se à nossa comunidade hoje
              </p>
            </div>
            <button
              onClick={onBackToLogin}
              className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600 hover:text-gray-900"
              title="Voltar para login"
            >
              <ArrowLeft size={20} />
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}
          {message && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
              <p className="text-green-700 text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Username Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome de Usuário
              </label>
              <div className="relative">
                <User className="absolute top-3.5 left-4 text-cyan-400" size={18} />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-200 transition duration-200"
                  placeholder="Seu nome de usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute top-3.5 left-4 text-cyan-400" size={18} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-200 transition duration-200"
                  placeholder="seu.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute top-3.5 left-4 text-cyan-400" size={18} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-200 transition duration-200"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute top-3.5 left-4 text-cyan-400" size={18} />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-200 transition duration-200"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-cyan-200 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />
              {loading ? 'Registrando...' : 'Criar Conta'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white/95 text-gray-500">Já tem uma conta?</span>
            </div>
          </div>

          {/* Login Link */}
          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full py-3 px-4 border-2 border-cyan-200 text-cyan-600 font-semibold rounded-lg hover:bg-cyan-50 transition duration-200"
          >
            Fazer login
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

export default RegisterForm;
