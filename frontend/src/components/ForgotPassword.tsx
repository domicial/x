// X_project/frontend/src/components/ForgotPassword.tsx (CÓDIGO CORRIGIDO)
import React, { useState } from 'react';
import axios from 'axios';
import { Mail, ArrowLeft } from 'lucide-react'; // Ícones necessários para este componente

const API_URL = 'http://localhost:8000/forgot-password';

// 1. Interface de Propriedades CORRETA para este componente
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
      
      // Mensagem genérica para segurança (com base na resposta do backend)
      setMessage(response.data.message || 'Verifique seu e-mail para o link de redefinição.');
      
    } catch (err: any) {
      // O backend deve retornar 200 OK mesmo que o email não exista, 
      // mas este catch lida com erros de rede (porta 8000 desligada, etc.)
      setError('Ocorreu um erro ao processar sua solicitação. Verifique sua conexão.');
      console.error('Erro ao solicitar reset:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-extrabold text-gray-900">
          Esqueceu a Senha?
        </h2>
        {/* Botão Voltar para Login */}
        <button 
            onClick={onBackToLogin}
            className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
        >
            <ArrowLeft size={16} className="mr-1" />
            Voltar
        </button>
      </div>
      
      <p className="text-sm text-gray-600">
        Insira seu e-mail para que possamos enviar um link para redefinir sua senha.
      </p>

      {message && <p className="text-green-600 font-medium">{message}</p>}
      {error && <p className="text-red-500 font-medium">{error}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        
        {/* Campo E-mail */}
        <div className="relative">
          <Mail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            placeholder="Seu E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Botão de Envio */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white transition duration-200 
            ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`
          }
        >
          {loading ? 'Enviando...' : 'Enviar Link de Redefinição'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;