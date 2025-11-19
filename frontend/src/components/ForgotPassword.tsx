import React, { useState } from 'react';
import axios from 'axios';
import { Mail, ArrowLeft, MailCheck } from 'lucide-react';

const API_URL = 'http://localhost:8000/forgot-password';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(API_URL, { email });
      
      setMessage(response.data.message || 'Verifique seu e-mail para o link de redefinição.');
      
    } catch (err: any) {
      setError('Ocorreu um erro ao processar sua solicitação. Verifique sua conexão.');
      console.error('Erro ao solicitar reset:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Card Container */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        
        {/* Header Gradient */}
        <div className="h-32 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-2 right-10 w-20 h-20 bg-white rounded-full mix-blend-multiply filter blur-xl"></div>
            <div className="absolute bottom-0 left-20 w-20 h-20 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl"></div>
          </div>
          <div className="relative h-full flex items-end justify-center pb-4">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-amber-300 to-orange-300 flex items-center justify-center shadow-lg">
              <MailCheck size={40} className="text-white" />
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="px-8 py-8 space-y-6">
          
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Recuperar Senha
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                Enviaremos um link para seu e-mail
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

          {/* Descriptive Text */}
          <p className="text-gray-600 text-sm leading-relaxed">
            Digite o e-mail associado à sua conta e enviaremos um link para redefinir sua senha.
          </p>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute top-3.5 left-4 text-amber-400" size={18} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-200 transition duration-200"
                  placeholder="seu.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-amber-200 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar Link de Redefinição'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white/95 text-gray-500">Lembrou da senha?</span>
            </div>
          </div>

          {/* Back to Login Link */}
          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full py-3 px-4 border-2 border-amber-200 text-amber-600 font-semibold rounded-lg hover:bg-amber-50 transition duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Voltar para Login
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

export default ForgotPassword;
