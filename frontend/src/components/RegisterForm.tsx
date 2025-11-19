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
    <div className="w-full max-w-md mx-auto">
      {/* Card Container */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        
        {/* Header Gradient */}
        <div className="h-40 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>
          <div className="relative h-full flex items-center justify-center">
            <div className="w-28 h-28 rounded-full border-4 border-white bg-gradient-to-br from-cyan-300 to-blue-300 flex items-center justify-center shadow-2xl hover:scale-105 transition duration-200">
              <UserPlus size={48} className="text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="px-8 py-10 space-y-7">
          
          {/* Header with Back Button */}
          <div className="flex justify-between items-start gap-4 pb-2">
            <div className="space-y-2 flex-1">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Criar Conta
              </h2>
              <p className="text-gray-600 text-sm">
                Junte-se à nossa comunidade hoje
              </p>
            </div>
            <button
              onClick={onBackToLogin}
              className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600 hover:text-gray-900 flex-shrink-0"
              title="Voltar para login"
            >
              <ArrowLeft size={20} strokeWidth={2} />
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-pulse">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}
          {message && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
              <p className="text-green-700 text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Username Field */}
            <div className="space-y-2.5">
              <label className="block text-sm font-semibold text-gray-800">
                Nome de Usuário
              </label>
              <div className="relative group">
                <User className="absolute top-4 left-4 text-cyan-400 group-focus-within:text-cyan-600 transition" size={19} />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full pl-13 pr-5 py-3.5 border-2 border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-450 focus:border-cyan-500 focus:bg-cyan-50/30 focus:ring-2 focus:ring-cyan-200 transition duration-200 font-medium"
                  placeholder="Seu nome de usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2.5">
              <label className="block text-sm font-semibold text-gray-800">
                E-mail
              </label>
              <div className="relative group">
                <Mail className="absolute top-4 left-4 text-cyan-400 group-focus-within:text-cyan-600 transition" size={19} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full pl-13 pr-5 py-3.5 border-2 border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-450 focus:border-cyan-500 focus:bg-cyan-50/30 focus:ring-2 focus:ring-cyan-200 transition duration-200 font-medium"
                  placeholder="seu.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2.5">
              <label className="block text-sm font-semibold text-gray-800">
                Senha
              </label>
              <div className="relative group">
                <Lock className="absolute top-4 left-4 text-cyan-400 group-focus-within:text-cyan-600 transition" size={19} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full pl-13 pr-5 py-3.5 border-2 border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-450 focus:border-cyan-500 focus:bg-cyan-50/30 focus:ring-2 focus:ring-cyan-200 transition duration-200 font-medium"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2.5">
              <label className="block text-sm font-semibold text-gray-800">
                Confirmar Senha
              </label>
              <div className="relative group">
                <Lock className="absolute top-4 left-4 text-cyan-400 group-focus-within:text-cyan-600 transition" size={19} />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full pl-13 pr-5 py-3.5 border-2 border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-450 focus:border-cyan-500 focus:bg-cyan-50/30 focus:ring-2 focus:ring-cyan-200 transition duration-200 font-medium"
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
              className="w-full mt-8 py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-cyan-200 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2.5 text-base"
            >
              <UserPlus size={20} strokeWidth={2} />
              {loading ? 'Registrando...' : 'Criar Conta'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-gray-500 text-sm font-medium">Já tem uma conta?</span>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full py-3.5 px-4 border-2 border-cyan-200 text-cyan-600 font-bold rounded-lg hover:bg-cyan-50 hover:border-cyan-300 transition duration-200 text-base"
          >
            Fazer login
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

export default RegisterForm;
