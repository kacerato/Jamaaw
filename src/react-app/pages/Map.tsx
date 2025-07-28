import { useEffect, useState } from 'react';
import { StreetType } from '@/shared/types';
import Header from '@/react-app/components/Header';
import LeafletMap from '@/react-app/components/LeafletMap';
import FallbackMap from '@/react-app/components/FallbackMap';
import ProgressTracker from '@/react-app/components/ProgressTracker';
import { useAuth } from '@getmocha/users-service/react';
import { MapPin, CheckCircle, Clock, AlertCircle, Filter } from 'lucide-react';

export default function MapPage() {
  const { user } = useAuth();
  const [streets, setStreets] = useState<StreetType[]>([]);
  const [filteredStreets, setFilteredStreets] = useState<StreetType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedStreet, setSelectedStreet] = useState<StreetType | null>(null);
  const [useLeafletMaps, setUseLeafletMaps] = useState(true);

  useEffect(() => {
    const fetchStreets = async () => {
      try {
        const response = await fetch('/api/streets');
        if (!response.ok) {
          throw new Error('Failed to fetch streets');
        }
        const data = await response.json();
        setStreets(data);
        setFilteredStreets(data);
      } catch (error) {
        console.error('Error fetching streets:', error);
        setError('Erro ao carregar as ruas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreets();
  }, []);

  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredStreets(streets);
    } else {
      setFilteredStreets(streets.filter(street => street.status === selectedStatus));
    }
  }, [selectedStatus, streets]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'planned':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <MapPin className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'in_progress':
        return 'Em Andamento';
      case 'planned':
        return 'Planejada';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusCount = (status: string) => {
    return streets.filter(street => street.status === status).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Mapa de Ruas - Maceió
          </h1>
          <p className="text-xl text-slate-600 mb-6">
            Acompanhe o progresso dos serviços de organização de cabeamento em tempo real
          </p>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total de Ruas</p>
                  <p className="text-2xl font-bold text-slate-900">{streets.length}</p>
                </div>
                <MapPin className="w-8 h-8 text-slate-400" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Concluídas</p>
                  <p className="text-2xl font-bold text-green-700">{getStatusCount('completed')}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Em Andamento</p>
                  <p className="text-2xl font-bold text-yellow-700">{getStatusCount('in_progress')}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Planejadas</p>
                  <p className="text-2xl font-bold text-red-700">{getStatusCount('planned')}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Filtrar por status:</span>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas as ruas</option>
              <option value="completed">Concluídas</option>
              <option value="in_progress">Em andamento</option>
              <option value="planned">Planejadas</option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Mapa Interativo</h2>
              {isLoading ? (
                <div className="w-full h-96 bg-slate-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-slate-600">Carregando ruas...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="w-full h-96 bg-red-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Map Type Toggle */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setUseLeafletMaps(true)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          useLeafletMaps
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        OpenStreetMap
                      </button>
                      <button
                        onClick={() => setUseLeafletMaps(false)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          !useLeafletMaps
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Mapa Simplificado
                      </button>
                    </div>
                  </div>

                  {useLeafletMaps ? (
                    <LeafletMap
                      streets={filteredStreets}
                      onStreetClick={setSelectedStreet}
                      isAdmin={!!user}
                      onAddStreet={() => {
                        window.location.reload();
                      }}
                    />
                  ) : (
                    <FallbackMap
                      streets={filteredStreets}
                      onStreetClick={setSelectedStreet}
                      isAdmin={!!user}
                      onAddStreet={() => {
                        window.location.reload();
                      }}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          {/* Street List */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Lista de Ruas</h2>
            
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-slate-200 h-4 rounded mb-2"></div>
                    <div className="bg-slate-100 h-3 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : filteredStreets.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Nenhuma rua encontrada</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredStreets.map((street) => (
                  <div
                    key={street.id}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedStreet?.id === street.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedStreet(street)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-slate-900">{street.name}</h3>
                      {getStatusIcon(street.status)}
                    </div>
                    
                    {street.neighborhood && (
                      <p className="text-sm text-slate-600 mb-1">
                        {street.neighborhood}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                        {getStatusText(street.status)}
                      </span>
                      
                      {street.completed_at && (
                        <span className="text-xs text-green-600">
                          {new Date(street.completed_at).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Legenda</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-slate-700">Ruas Concluídas</span>
              <span className="text-sm text-slate-500">- Serviço finalizado</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-sm font-medium text-slate-700">Ruas em Andamento</span>
              <span className="text-sm text-slate-500">- Equipe trabalhando</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm font-medium text-slate-700">Ruas Planejadas</span>
              <span className="text-sm text-slate-500">- Próximas no cronograma</span>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <ProgressTracker />
      </div>
    </div>
  );
}
