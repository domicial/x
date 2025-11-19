import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Lock, CheckCircle, AlertTriangle, KeyRound } from 'lucide-react';

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

    if (newPassword.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
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
      setTimeout(() => {
        onSuccess();
      }, 1500);
      
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
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          
          {/* Header Gradient */}
          <div className="h-40 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
            </div>
            <div className="relative h-full flex items-center justify-center">
              <div className="w-28 h-28 rounded-full border-4 border-white bg-gradient-to-br from-red-300 to-pink-300 flex items-center justify-center shadow-2xl">
                <AlertTriangle size={48} className="text-white" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-10 space-y-7 text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Token Inválido
            </h2>
            <p className="text-gray-600">
              {error}
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg hover:from-red-600 hover:to-pink-600 transition duration-200 shadow-lg hover:shadow-xl text-base"
            >
              Voltar à tela inicial
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Card Container */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        
        {/* Header Gradient */}
        <div className="h-40 bg-gradient-to-r from-teal-500 via-green-500 to-emerald-500 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>
          <div className="relative h-full flex items-center justify-center">
            <div className="w-28 h-28 rounded-full border-4 border-white bg-gradient-to-br from-teal-300 to-green-300 flex items-center justify-center shadow-2xl hover:scale-105 transition duration-200">
              <KeyRound size={48} className="text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="px-8 py-10 space-y-7">
          
          {/* Title */}
          <div className="text-center space-y-3 pb-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">
              Redefinir Senha
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Digite sua nova senha
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-pulse">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}
          {message && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-center gap-3">
              <CheckCircle size={20} className="text-green-600 flex-shrink-0" strokeWidth={2} />
              <p className="text-green-700 text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* New Password Field */}
            <div className="space-y-2.5">
              <label className="block text-sm font-semibold text-gray-800">
                Nova Senha
              </label>
              <div className="relative group">
                <Lock className="absolute top-4 left-4 text-teal-400 group-focus-within:text-teal-600 transition" size={19} />
                <input
                  id="new-password"
                  name="new-password"
                  type="password"
                  required
                  className="w-full pl-13 pr-5 py-3.5 border-2 border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-450 focus:border-teal-500 focus:bg-teal-50/30 focus:ring-2 focus:ring-teal-200 transition duration-200 font-medium"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2.5">
              <label className="block text-sm font-semibold text-gray-800">
                Confirmar Senha
              </label>
              <div className="relative group">
                <Lock className="absolute top-4 left-4 text-teal-400 group-focus-within:text-teal-600 transition" size={19} />
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  className="w-full pl-13 pr-5 py-3.5 border-2 border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-450 focus:border-teal-500 focus:bg-teal-50/30 focus:ring-2 focus:ring-teal-200 transition duration-200 font-medium"
                  placeholder="Confirme sua nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !token}
              className="w-full mt-8 py-3.5 px-4 bg-gradient-to-r from-teal-500 to-green-500 text-white font-bold rounded-lg hover:from-teal-600 hover:to-green-600 focus:outline-none focus:ring-4 focus:ring-teal-200 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-base"
            >
              {loading ? 'Redefinindo...' : 'Redefinir Senha'}
            </button>
          </form>
        </div>
      </div>

      {/* Footer Text */}
      <p className="text-center text-sm text-white/85 mt-10 font-medium">
        © 2024 X Project. Todos os direitos reservados.
      </p>
    </div>
  );
};

export default ResetPasswordForm;
