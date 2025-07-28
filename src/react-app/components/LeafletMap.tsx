import { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { StreetType } from '@/shared/types';
import { MapPin, Plus, CheckCircle, Clock, AlertCircle, X, Save } from 'lucide-react';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different statuses
const createCustomIcon = (color: string) => {
  const svgIcon = `
    <svg width="25" height="35" viewBox="0 0 25 35" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 8.8 12.5 22.5 12.5 22.5s12.5-13.7 12.5-22.5C25 5.6 19.4 0 12.5 0z" fill="${color}"/>
      <circle cx="12.5" cy="12.5" r="5" fill="white"/>
    </svg>
  `;
  
  return L.divIcon({
    html: svgIcon,
    className: 'custom-div-icon',
    iconSize: [25, 35],
    iconAnchor: [12.5, 35],
    popupAnchor: [0, -35],
  });
};

const statusIcons = {
  completed: createCustomIcon('#10b981'),
  in_progress: createCustomIcon('#f59e0b'),
  planned: createCustomIcon('#ef4444'),
  default: createCustomIcon('#6b7280'),
};

interface LeafletMapProps {
  streets: StreetType[];
  onStreetClick?: (street: StreetType) => void;
  isAdmin?: boolean;
  onAddStreet?: (lat: number, lng: number, name: string, status: string) => void;
}

interface NewStreetData {
  lat: number;
  lng: number;
  name: string;
  status: 'planned' | 'in_progress' | 'completed';
  neighborhood: string;
}

const MACEIO_CENTER: [number, number] = [-9.6658, -35.7353];

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

// Component for handling map clicks
function MapClickHandler({ 
  isAdmin, 
  onMapClick 
}: { 
  isAdmin: boolean; 
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      if (isAdmin) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return null;
}

export default function LeafletMap({ streets, onStreetClick, isAdmin = false, onAddStreet }: LeafletMapProps) {
  const [newStreetData, setNewStreetData] = useState<NewStreetData | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  const handleMapClick = (lat: number, lng: number) => {
    if (!isAdmin) return;
    
    setNewStreetData({
      lat,
      lng,
      name: '',
      status: 'planned',
      neighborhood: ''
    });
    setShowAddForm(true);
  };

  const handleAddStreet = async () => {
    if (!newStreetData || !onAddStreet) return;

    try {
      const response = await fetch('/api/admin/streets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: newStreetData.name,
          neighborhood: newStreetData.neighborhood || null,
          latitude: newStreetData.lat,
          longitude: newStreetData.lng,
          status: newStreetData.status,
          notes: 'Adicionada via mapa interativo (Leaflet)'
        }),
      });

      if (response.ok) {
        await response.json();
        onAddStreet(newStreetData.lat, newStreetData.lng, newStreetData.name, newStreetData.status);
        setShowAddForm(false);
        setNewStreetData(null);
        // Refresh page to show the new street
        window.location.reload();
      }
    } catch (error) {
      console.error('Error adding street:', error);
    }
  };

  return (
    <div className="relative">
      {isAdmin && (
        <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Plus className="w-4 h-4" />
            <span>Clique no mapa para adicionar uma rua</span>
          </div>
        </div>
      )}

      <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
        <MapContainer
          center={MACEIO_CENTER}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapClickHandler isAdmin={isAdmin} onMapClick={handleMapClick} />
          
          {streets.map((street) => {
            // Only show streets with coordinates
            if (!street.latitude || !street.longitude) return null;

            const icon = statusIcons[street.status as keyof typeof statusIcons] || statusIcons.default;

            return (
              <Marker
                key={street.id}
                position={[street.latitude, street.longitude]}
                icon={icon}
                eventHandlers={{
                  click: () => {
                    onStreetClick?.(street);
                  },
                }}
              >
                <Popup>
                  <div className="p-2 max-w-xs">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(street.status)}
                      <h3 className="font-semibold text-slate-900">{street.name}</h3>
                    </div>
                    
                    {street.neighborhood && (
                      <p className="text-sm text-slate-600 mb-2">
                        Bairro: {street.neighborhood}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                        {getStatusText(street.status)}
                      </span>
                    </div>
                    
                    {street.notes && (
                      <p className="text-sm text-slate-600 mb-2">
                        {street.notes}
                      </p>
                    )}
                    
                    {street.completed_at && (
                      <p className="text-xs text-green-600">
                        Concluída em: {new Date(street.completed_at).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                    
                    {street.started_at && street.status === 'in_progress' && (
                      <p className="text-xs text-yellow-600">
                        Iniciada em: {new Date(street.started_at).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Temporary marker for new street */}
          {newStreetData && (
            <Marker
              position={[newStreetData.lat, newStreetData.lng]}
              icon={statusIcons.planned}
            >
              <Popup>
                <div className="p-2">
                  <p className="text-sm font-medium text-slate-900">Nova Rua</p>
                  <p className="text-xs text-slate-600">Clique para adicionar</p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Add Street Modal */}
      {showAddForm && newStreetData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[2000]">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Adicionar Nova Rua</h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewStreetData(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nome da Rua</label>
                <input
                  type="text"
                  value={newStreetData.name}
                  onChange={(e) => setNewStreetData(prev => prev ? { ...prev, name: e.target.value } : null)}
                  placeholder="Ex: Rua das Flores"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Bairro</label>
                <input
                  type="text"
                  value={newStreetData.neighborhood}
                  onChange={(e) => setNewStreetData(prev => prev ? { ...prev, neighborhood: e.target.value } : null)}
                  placeholder="Ex: Centro"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status Inicial</label>
                <select
                  value={newStreetData.status}
                  onChange={(e) => setNewStreetData(prev => prev ? { ...prev, status: e.target.value as any } : null)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="planned">Planejada</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="completed">Concluída</option>
                </select>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-sm text-slate-600">
                  <strong>Coordenadas:</strong><br />
                  Lat: {newStreetData.lat.toFixed(6)}<br />
                  Lng: {newStreetData.lng.toFixed(6)}
                </p>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleAddStreet}
                  disabled={!newStreetData.name}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Adicionar</span>
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewStreetData(null);
                  }}
                  className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
