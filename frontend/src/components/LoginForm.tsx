// X/frontend/src/components/LoginForm.tsx (CÓDIGO CORRIGIDO)
import React, { useState } from 'react';
import axios from 'axios';
import { Lock, User, RefreshCcw } from 'lucide-react'; // Ícones modernos

// URL do Backend FastAPI
const API_URL = 'http://localhost:8000/token';

// Interface de Propriedades (Props)
interface LoginFormProps {
    onForgotPassword: () => void;
    onLoginSuccess: () => void; // Callback de sucesso de login para ir ao Dashboard
    onNavigateToRegister: () => void; // Callback para navegar para registro
}

const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword, onLoginSuccess, onNavigateToRegister }) => {
    
    // Configurações de estado
    const [username, setUsername] = useState('admin'); // Valor inicial para teste
    const [password, setPassword] = useState('senha123'); // Valor inicial para teste
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // Removido: [isLoggedIn] não é mais necessário aqui, pois o App.tsx gerencia o estado global

    // --- Função de Autenticação ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(API_URL, {
                username: username,
                password: password,
            });

            // Se a autenticação for bem-sucedida
            const token = response.data.access_token;
            console.log('Login Sucedido! Token:', token);
            localStorage.setItem('accessToken', token); // Armazena o token

            // Chamada do callback para mudar o estado no App.tsx para 'dashboard'
            onLoginSuccess(); 
            
        } catch (err: any) {
            // Lida com erros (ex: 401 Unauthorized do FastAPI)
            const errorMessage = err.response?.data?.detail || 'Erro de conexão ou credenciais inválidas.';
            setError(errorMessage);
            console.error('Erro de Login:', err);
        } finally {
            setLoading(false);
        }
    };
    // --------------------------------

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
            <h2 className="text-3xl font-extrabold text-center text-gray-900">
                Bem-vindo de volta
            </h2>
            <div className="flex justify-center mb-4">
                {/* Foto do Usuário (Placeholder) */}
                <img
                    src="https://via.placeholder.com/100" 
                    alt="Avatar do Usuário"
                    className="w-24 h-24 rounded-full border-4 border-indigo-500 shadow-lg"
                />
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                
                {/* Campo Usuário/E-mail */}
                <div className="relative">
                    <User className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        placeholder="Nome de Usuário ou E-mail"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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

                {/* Links Adicionais (Esqueci minha senha) */}
                <div className="flex items-center justify-between text-sm">
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); onForgotPassword(); }} 
                        className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
                    >
                        <RefreshCcw size={14} className="mr-1" />
                        Esqueci minha senha
                    </a>
                </div>

                {/* Botão de Login */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white transition duration-200
                        ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`
                    }
                >
                    {loading ? 'Entrando...' : 'Entrar no X'}
                </button>
            </form>

            {/* Link para Registro */}
            <p className="text-sm text-center text-gray-600">
                Não possui conta?{' '}
                <button
                    onClick={onNavigateToRegister}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                    Criar uma conta aqui
                </button>
            </p>
        </div>
    );
};

export default LoginForm;
