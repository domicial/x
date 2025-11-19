import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LogOut, Plus, Trash2, AlertCircle, CheckCircle, MoreVertical } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

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

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    if (!token) {
      onLogout();
      return;
    }

    const fetchUserData = async () => {
      try {
        const userResponse = await api.get('/users/me');
        const fetchedUser: User = userResponse.data;
        setUser(fetchedUser);

        const itemsResponse = await api.get('/items/');
        setItems(itemsResponse.data);

      } catch (err: any) {
        setError('Falha ao carregar dados. Sua sessão pode ter expirado.');
        console.error('Erro de dashboard:', err);
        if (err.response?.status === 401) {
          onLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, onLogout]);

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
      setItems([createdItem, ...items]);

      setNewItemTitle('');
      setNewItemDescription('');

    } catch (err) {
      setError('Falha ao criar item. Tente novamente.');
      console.error('Erro ao criar item:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!window.confirm("Tem certeza que deseja deletar este item?")) return;
    
    try {
      await api.delete(`/items/${itemId}`);
      setItems(items.filter(item => item.id !== itemId));

    } catch (err: any) {
      setError('Falha ao deletar item. Verifique a permissão.');
      console.error('Erro ao deletar item:', err);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-5xl">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-12 text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 text-lg">Carregando Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && error.includes('Falha ao carregar')) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          
          <div className="h-32 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-2 right-10 w-20 h-20 bg-white rounded-full mix-blend-multiply filter blur-xl"></div>
              <div className="absolute bottom-0 left-20 w-20 h-20 bg-red-200 rounded-full mix-blend-multiply filter blur-xl"></div>
            </div>
            <div className="relative h-full flex items-end justify-center pb-4">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-red-300 to-pink-300 flex items-center justify-center shadow-lg">
                <AlertCircle size={40} className="text-white" />
              </div>
            </div>
          </div>

          <div className="px-8 py-8 space-y-6 text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Erro de Sessão
            </h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={onLogout}
              className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-pink-600 transition"
            >
              Fazer Novo Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl space-y-8">
      {/* Header Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        
        {/* Header Gradient */}
        <div className="h-40 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>
        </div>

        {/* User Info */}
        <div className="px-8 py-6 flex justify-between items-center -mt-20 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-32 h-32 rounded-2xl border-4 border-white bg-gradient-to-br from-violet-300 to-purple-300 flex items-center justify-center shadow-lg overflow-hidden">
              <img 
                src={user?.avatar_url || "https://via.placeholder.com/100"} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Olá, {user?.username}! 👋
              </h1>
              <p className="text-gray-600 mt-1">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-2">
                Você tem <span className="font-semibold text-indigo-600">{items.length}</span> tarefa{items.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-pink-600 transition duration-200 shadow-lg"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </div>

      {/* Add Item Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Plus size={24} className="text-indigo-600" />
          Adicionar Nova Tarefa
        </h2>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleCreateItem}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título da Tarefa
            </label>
            <input
              type="text"
              placeholder="O que você precisa fazer?"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descrição (Opcional)
            </label>
            <textarea
              placeholder="Adicione detalhes sobre a tarefa..."
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition duration-200 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isCreating || !newItemTitle.trim()}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            {isCreating ? 'Adicionando...' : 'Adicionar Tarefa'}
          </button>
        </form>
      </div>

      {/* Tasks List Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <CheckCircle size={24} className="text-green-600" />
          Suas Tarefas
        </h2>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-indigo-600" />
            </div>
            <p className="text-gray-500 text-lg">Você não tem tarefas ainda.</p>
            <p className="text-gray-400 text-sm mt-1">Crie uma acima para começar!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="group p-5 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-lg transition duration-200 flex items-start justify-between"
              >
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="ml-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition duration-200 opacity-0 group-hover:opacity-100"
                  title="Deletar Tarefa"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-white/80">
        © 2024 X Project. Todos os direitos reservados.
      </p>
    </div>
  );
};

export default Dashboard;
