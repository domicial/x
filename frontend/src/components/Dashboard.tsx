// X_project/frontend/src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LogOut, PlusCircle, Trash2, CheckCircle, XCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

// Interfaces de Dados
interface Item {
    id: number;
    title: string;
    description: string | null;
    owner_id: number;
}

interface User {
    id: number;
    username: string;
    email: string;
    avatar_url: string;
    items: Item[];
}

interface DashboardProps {
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
    const [user, setUser] = useState<User | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [newItemTitle, setNewItemTitle] = useState('');
    const [newItemDescription, setNewItemDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const token = localStorage.getItem('accessToken');

    // Configuração do Axios para rotas protegidas
    const api = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    // --- EFEITO 1: CARREGAR DADOS DO USUÁRIO E ITENS ---
    useEffect(() => {
        if (!token) {
            onLogout();
            return;
        }

        const fetchUserData = async () => {
            try {
                // 1. Buscar dados do usuário logado
                const userResponse = await api.get('/users/me');
                const fetchedUser: User = userResponse.data;
                setUser(fetchedUser);

                // 2. Buscar itens do usuário
                const itemsResponse = await api.get('/items/');
                setItems(itemsResponse.data);

            } catch (err: any) {
                setError('Falha ao carregar dados. Sua sessão pode ter expirado.');
                console.error('Erro de dashboard:', err);
                // Força logout se o token for inválido
                if (err.response?.status === 401) {
                    onLogout();
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [token, onLogout]); // Dependências do useEffect

    // --- FUNÇÕES CRUD DE ITENS ---
    
    // 1. CRIAR NOVO ITEM
    const handleCreateItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemTitle.trim()) return;

        setIsCreating(true);
        setError('');

        try {
            const response = await api.post('/items/', {
                title: newItemTitle,
                description: newItemDescription,
            });
            
            const createdItem: Item = response.data;
            setItems([createdItem, ...items]); // Adiciona o novo item ao topo da lista

            setNewItemTitle('');
            setNewItemDescription('');

        } catch (err) {
            setError('Falha ao criar item. Tente novamente.');
            console.error('Erro ao criar item:', err);
        } finally {
            setIsCreating(false);
        }
    };

    // 2. DELETAR ITEM
    const handleDeleteItem = async (itemId: number) => {
        if (!window.confirm("Tem certeza que deseja deletar este item?")) return;
        
        try {
            // O backend retorna 204 No Content, então não esperamos dados
            await api.delete(`/items/${itemId}`);
            
            // Filtra o item deletado da lista local
            setItems(items.filter(item => item.id !== itemId));

        } catch (err: any) {
            setError('Falha ao deletar item. Verifique a permissão.');
            console.error('Erro ao deletar item:', err);
        }
    };

    // --- RENDERIZAÇÃO DE ESTADOS ---
    if (loading) {
        return <div className="text-xl p-10">Carregando Dashboard...</div>;
    }

    if (error) {
        return (
            <div className="p-8 bg-red-100 rounded-lg shadow-xl border-t-4 border-red-500 max-w-lg w-full text-center">
                <XCircle size={32} className="mx-auto text-red-600 mb-3" />
                <h2 className="text-xl font-bold text-red-700">Erro de Sessão</h2>
                <p className="mt-2 text-gray-600">{error}</p>
                <button
                    onClick={onLogout}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                    Fazer Novo Login
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl p-8 space-y-8 bg-white rounded-xl shadow-2xl">
            {/* Header e Logout */}
            <header className="flex justify-between items-center border-b pb-4">
                <div className="flex items-center space-x-3">
                    <img src={user?.avatar_url || "https://via.placeholder.com/50"} 
                         alt="Avatar" 
                         className="w-12 h-12 rounded-full border-2 border-indigo-500" 
                    />
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard de {user?.username}</h1>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                </div>
                
                <button 
                    onClick={onLogout}
                    className="flex items-center text-sm font-medium text-red-600 hover:text-red-700 transition"
                >
                    <LogOut size={18} className="mr-1" />
                    Sair
                </button>
            </header>

            {/* Formulário de Novo Item */}
            <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
                <h3 className="text-lg font-semibold mb-3">Adicionar Nova Tarefa</h3>
                <form className="space-y-3" onSubmit={handleCreateItem}>
                    <input
                        type="text"
                        placeholder="Título da Tarefa (Obrigatório)"
                        value={newItemTitle}
                        onChange={(e) => setNewItemTitle(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <textarea
                        placeholder="Descrição (Opcional)"
                        value={newItemDescription}
                        onChange={(e) => setNewItemDescription(e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    />
                    <button
                        type="submit"
                        disabled={isCreating || !newItemTitle.trim()}
                        className={`w-full flex justify-center py-2 px-4 rounded-lg text-sm font-medium text-white transition 
                        ${isCreating || !newItemTitle.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        <PlusCircle size={18} className="mr-2" />
                        {isCreating ? 'Adicionando...' : 'Adicionar Tarefa'}
                    </button>
                </form>
            </div>

            {/* Lista de Itens */}
            <h3 className="text-xl font-bold pt-4 border-t mt-4">Suas Tarefas ({items.length})</h3>
            
            {items.length === 0 ? (
                <p className="text-gray-500 italic">Você não tem tarefas registradas. Adicione uma acima!</p>
            ) : (
                <ul className="space-y-3">
                    {items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
                            <div>
                                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                            </div>
                            <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="text-red-500 hover:text-red-700 p-2 rounded-full transition"
                                title="Deletar Tarefa"
                            >
                                <Trash2 size={20} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dashboard;