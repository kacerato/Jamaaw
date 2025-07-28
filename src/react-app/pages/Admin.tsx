import { useEffect, useState } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import { StreetType, StreetSuggestionType, CreateStreetRequestType, UpdateStreetRequestType } from '@/shared/types';
import Header from '@/react-app/components/Header';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Eye,
  X,
  Save,
  ThumbsUp,
  ThumbsDown,
  Camera,
  
} from 'lucide-react';
import AdvancedPhotoGallery from '@/react-app/components/AdvancedPhotoGallery';
import MaceioFlag from '@/react-app/components/MaceioFlag';

export default function AdminPage() {
  const { user, isPending } = useAuth();
  const navigate = useNavigate();
  
  const [streets, setStreets] = useState<StreetType[]>([]);
  const [suggestions, setSuggestions] = useState<StreetSuggestionType[]>([]);
  const [activeTab, setActiveTab] = useState<'streets' | 'suggestions' | 'photos'>('streets');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modals
  const [showAddStreet, setShowAddStreet] = useState(false);
  const [editingStreet, setEditingStreet] = useState<StreetType | null>(null);
  
  // Forms
  const [newStreet, setNewStreet] = useState<CreateStreetRequestType>({
    name: '',
    neighborhood: '',
    status: 'planned',
    notes: '',
  });
  
  const [streetUpdate, setStreetUpdate] = useState<UpdateStreetRequestType>({});

  useEffect(() => {
    if (!isPending && !user) {
      navigate('/');
    }
  }, [user, isPending, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [streetsRes, suggestionsRes] = await Promise.all([
        fetch('/api/streets'),
        fetch('/api/admin/suggestions', { credentials: 'include' })
      ]);
      
      if (streetsRes.ok) {
        const streetsData = await streetsRes.json();
        setStreets(streetsData);
      }
      
      if (suggestionsRes.ok) {
        const suggestionsData = await suggestionsRes.json();
        setSuggestions(suggestionsData);
      } else if (suggestionsRes.status === 403) {
        setError('Acesso negado. Você precisa ser um administrador para acessar esta página.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStreet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/streets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newStreet),
      });
      
      if (response.ok) {
        const street = await response.json();
        setStreets(prev => [street, ...prev]);
        setNewStreet({ name: '', neighborhood: '', status: 'planned', notes: '' });
        setShowAddStreet(false);
      }
    } catch (error) {
      console.error('Error adding street:', error);
    }
  };

  const handleUpdateStreet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStreet) return;
    
    try {
      const response = await fetch(`/api/admin/streets/${editingStreet.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(streetUpdate),
      });
      
      if (response.ok) {
        const updatedStreet = await response.json();
        setStreets(prev => prev.map(s => s.id === updatedStreet.id ? updatedStreet : s));
        setEditingStreet(null);
        setStreetUpdate({});
      }
    } catch (error) {
      console.error('Error updating street:', error);
    }
  };

  const handleDeleteStreet = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta rua?')) return;
    
    try {
      const response = await fetch(`/api/admin/streets/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        setStreets(prev => prev.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error('Error deleting street:', error);
    }
  };

  const handleReviewSuggestion = async (id: number, approved: boolean, notes?: string) => {
    try {
      const response = await fetch(`/api/admin/suggestions/${id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_approved: approved, admin_notes: notes }),
      });
      
      if (response.ok) {
        const updatedSuggestion = await response.json();
        setSuggestions(prev => prev.map(s => s.id === updatedSuggestion.id ? updatedSuggestion : s));
        
        // Refresh streets if approved
        if (approved) {
          fetchData();
        }
      }
    } catch (error) {
      console.error('Error reviewing suggestion:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'planned':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-900 mb-2">Acesso Negado</h2>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Painel Administrativo
          </h1>
          <p className="text-xl text-slate-600">
            Gerencie ruas e analise sugestões da comunidade
          </p>
        </div>

        {/* Tabs with Maceió Flag */}
        <div className="mb-8">
          <div className="border-b border-slate-200">
            <div className="flex items-center justify-between">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('streets')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'streets'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  Gerenciar Ruas ({streets.length})
                </button>
                <button
                  onClick={() => setActiveTab('suggestions')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'suggestions'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  Sugestões ({suggestions.filter(s => !s.is_reviewed).length} pendentes)
                </button>
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'photos'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Camera className="w-4 h-4" />
                    <span>Galeria de Fotos</span>
                  </div>
                </button>
              </nav>
              
              <div className="flex items-center space-x-4">
                <MaceioFlag />
              </div>
            </div>
          </div>
        </div>

        {/* Streets Tab */}
        {activeTab === 'streets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-900">Ruas Cadastradas</h2>
              <button
                onClick={() => setShowAddStreet(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Rua</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rua</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Bairro</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Atualizado</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {streets.map((street) => (
                      <tr key={street.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-slate-900">{street.name}</div>
                          {street.notes && (
                            <div className="text-sm text-slate-500 truncate max-w-xs">{street.notes}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                          {street.neighborhood || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(street.status)}
                            <span className="text-sm font-medium">
                              {street.status === 'completed' ? 'Concluída' :
                               street.status === 'in_progress' ? 'Em Andamento' : 'Planejada'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {new Date(street.updated_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2 justify-end">
                            <button
                              onClick={() => {
                                setEditingStreet(street);
                                setStreetUpdate({ status: street.status, notes: street.notes || '' });
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStreet(street.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Suggestions Tab */}
        {activeTab === 'suggestions' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900">Sugestões da Comunidade</h2>

            <div className="grid gap-6">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-slate-900">{suggestion.street_name}</h3>
                        {suggestion.is_reviewed ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            suggestion.is_approved 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {suggestion.is_approved ? 'Aprovada' : 'Rejeitada'}
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pendente
                          </span>
                        )}
                      </div>
                      
                      {suggestion.neighborhood && (
                        <p className="text-sm text-slate-600 mb-2">Bairro: {suggestion.neighborhood}</p>
                      )}
                      
                      {suggestion.description && (
                        <p className="text-slate-700 mb-3">{suggestion.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <div>
                          {suggestion.suggested_by_name && (
                            <span>Por: {suggestion.suggested_by_name}</span>
                          )}
                          {suggestion.suggested_by_email && (
                            <span className="ml-2">({suggestion.suggested_by_email})</span>
                          )}
                        </div>
                        <span>{new Date(suggestion.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        className="p-2 text-slate-600 hover:text-blue-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {!suggestion.is_reviewed && (
                        <>
                          <button
                            onClick={() => handleReviewSuggestion(suggestion.id, true)}
                            className="p-2 text-green-600 hover:text-green-700"
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReviewSuggestion(suggestion.id, false)}
                            className="p-2 text-red-600 hover:text-red-700"
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-900">Galeria de Fotos dos Trabalhos</h2>
              <div className="text-sm text-slate-600">
                Gerencie fotos antes, durante e depois dos trabalhos de organização
              </div>
            </div>

            <div className="grid gap-6">
              {streets.map((street) => (
                <div key={street.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{street.name}</h3>
                      {street.neighborhood && (
                        <p className="text-sm text-slate-600">Bairro: {street.neighborhood}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(street.status)}
                      <span className="text-sm font-medium">
                        {street.status === 'completed' ? 'Concluída' :
                         street.status === 'in_progress' ? 'Em Andamento' : 'Planejada'}
                      </span>
                    </div>
                  </div>
                  
                  <AdvancedPhotoGallery
                    streetId={street.id}
                    streetName={street.name}
                    photos={[]} // In real implementation, fetch photos for this street
                    isAdmin={true}
                    onPhotosChange={() => {
                      // Refresh photos data
                      console.log('Photos updated for street', street.id);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Street Modal */}
      {showAddStreet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Adicionar Nova Rua</h3>
              <button
                onClick={() => setShowAddStreet(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddStreet} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nome da Rua</label>
                <input
                  type="text"
                  value={newStreet.name}
                  onChange={(e) => setNewStreet(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Bairro</label>
                <input
                  type="text"
                  value={newStreet.neighborhood}
                  onChange={(e) => setNewStreet(prev => ({ ...prev, neighborhood: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={newStreet.status}
                  onChange={(e) => setNewStreet(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="planned">Planejada</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="completed">Concluída</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Observações</label>
                <textarea
                  value={newStreet.notes}
                  onChange={(e) => setNewStreet(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Adicionar
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddStreet(false)}
                  className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Street Modal */}
      {editingStreet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Editar Rua</h3>
              <button
                onClick={() => setEditingStreet(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateStreet} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nome da Rua</label>
                <input
                  type="text"
                  value={editingStreet.name}
                  disabled
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={streetUpdate.status || editingStreet.status}
                  onChange={(e) => setStreetUpdate(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="planned">Planejada</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="completed">Concluída</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Observações</label>
                <textarea
                  value={streetUpdate.notes !== undefined ? streetUpdate.notes : (editingStreet.notes || '')}
                  onChange={(e) => setStreetUpdate(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingStreet(null)}
                  className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
