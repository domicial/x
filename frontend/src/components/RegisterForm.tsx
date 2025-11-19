import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';

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
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Criar Conta
        </h2>
        <button 
          onClick={onBackToLogin}
          className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
        >
          <ArrowLeft size={16} className="mr-1" />
          Voltar
        </button>
      </div>

      <p className="text-sm text-gray-600">
        Preencha os campos abaixo para criar sua conta.
      </p>

      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
      {message && <p className="text-green-600 text-sm font-medium">{message}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        
        {/* Campo Nome de Usuário */}
        <div className="relative">
          <User className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            id="username"
            name="username"
            type="text"
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            placeholder="Nome de Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Campo E-mail */}
        <div className="relative">
          <Mail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Campo Senha */}
        <div className="relative">
          <Lock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Campo Confirmar Senha */}
        <div className="relative">
          <Lock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            placeholder="Confirmar Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Botão de Registro */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white transition duration-200 
            ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`
          }
        >
          {loading ? 'Registrando...' : 'Criar Conta'}
        </button>
      </form>

      <p className="text-sm text-center text-gray-600">
        Já possui conta?{' '}
        <button
          onClick={onBackToLogin}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Faça login aqui
        </button>
      </p>
    </div>
  );
};

export default RegisterForm;
