// X_project/frontend/src/components/ResetPasswordForm.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Lock, CheckCircle, AlertTriangle } from 'lucide-react';

const API_URL = 'http://localhost:8000/reset-password';

interface ResetPasswordFormProps {
    onSuccess: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  // 1. Pega o token da URL ao carregar o componente
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
      setError('Token de redefinição não encontrado na URL.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    if (!token) {
        setError('O token de redefinição está faltando ou inválido.');
        setLoading(false);
        return;
    }

    try {
      const response = await axios.post(API_URL, {
        token: token,
        new_password: newPassword,
      });

      setMessage(response.data.message || 'Senha redefinida com sucesso.');
      onSuccess(); // Volta para a tela de login
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Token inválido ou expirado. Tente solicitar um novo.';
      setError(errorMessage);
      console.error('Erro ao redefinir senha:', err);
    } finally {
      setLoading(false);
    }
  };

  if (error && error.includes('Token inválido ou expirado')) {
    return (
        <div className="text-center p-8 bg-yellow-100 rounded-lg shadow-xl border-t-4 border-yellow-500 max-w-md w-full">
            <AlertTriangle size={48} className="mx-auto text-yellow-600 mb-4"/>
            <h2 className="text-2xl font-bold text-yellow-700">Token Inválido</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <button
                onClick={() => window.location.href = '/'} // Redireciona para o login ou tela de forgot
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
                Voltar à tela inicial
            </button>
        </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
      <h2 className="text-3xl font-extrabold text-center text-gray-900">
        Nova Senha
      </h2>

      {message && (
        <div className="flex items-center p-3 text-sm text-green-700 bg-green-100 rounded-lg">
            <CheckCircle size={20} className="mr-2"/> {message}
        </div>
      )}
      {error && !message && <p className="text-red-500 font-medium">{error}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        
        {/* Nova Senha */}
        <div className="relative">
          <Lock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            id="new-password"
            name="new-password"
            type="password"
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            placeholder="Nova Senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        {/* Confirmação de Senha */}
        <div className="relative">
          <Lock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            placeholder="Confirme a Nova Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Botão de Redefinição */}
        <button
          type="submit"
          disabled={loading || !token}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white transition duration-200 
            ${loading || !token ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`
          }
        >
          {loading ? 'Redefinindo...' : 'Redefinir Senha'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;