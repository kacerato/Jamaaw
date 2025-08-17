import { useEffect, useState } from 'react';
import { Wifi, CheckCircle, Shield, Phone, MapPin, TrendingUp, Users, Award, Clock, Globe, Zap, HeadphonesIcon } from 'lucide-react';
import Header from '@/react-app/components/Header';
import StatsCard from '@/react-app/components/StatsCard';
import Timeline from '@/react-app/components/Timeline';
import WorkProgressDashboard from '@/react-app/components/WorkProgressDashboard';
import { StreetType } from '@/shared/types';

export default function Home() {
  const [streets, setStreets] = useState<StreetType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Fetch streets data
    fetchStreets();
  }, []);

  const fetchStreets = async () => {
    try {
      const response = await fetch('/api/streets');
      if (response.ok) {
        const data = await response.json();
        setStreets(data);
      }
    } catch (error) {
      console.error('Error fetching streets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStats = () => {
    const completed = streets.filter(s => s.status === 'completed').length;
    const inProgress = streets.filter(s => s.status === 'in_progress').length;
    const planned = streets.filter(s => s.status === 'planned').length;
    
    return { completed, inProgress, planned, total: streets.length };
  };

  const getRecentActivity = () => {
    return streets
      .slice(0, 5)
      .map(street => ({
        id: street.id,
        street: street.name,
        neighborhood: street.neighborhood || '',
        status: street.status as 'completed' | 'in_progress' | 'planned',
        date: street.updated_at,
        description: street.notes || undefined,
      }));
  };

  const stats = getStats();
  const recentActivity = getRecentActivity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-500/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Shield className="w-4 h-4" />
                  <span>Internet Confiável e de Alta Velocidade</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Conecte-se com a{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                    Internet do Futuro
                  </span>
                </h1>
                <p className="text-xl text-slate-600 mt-6 leading-relaxed">
                  Parceiros da Net oferece internet fibra óptica de alta velocidade com planos 
                  personalizados para residências e empresas. Conexão estável e suporte 24/7.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-slate-700">Internet fibra óptica de alta velocidade</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-slate-700">Planos residenciais e empresariais</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-slate-700">Suporte técnico especializado 24/7</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-slate-700">Instalação gratuita e rápida</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2">
                  <Wifi className="w-5 h-5" />
                  <span>Teste sua Velocidade</span>
                </button>
                <button className="bg-white hover:bg-slate-50 text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-slate-200 hover:border-slate-300 transition-all duration-200 flex items-center justify-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>Fale Conosco</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Planos Disponíveis</h3>
                  <Globe className="w-8 h-8 opacity-80" />
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-lg">Residencial</h4>
                        <p className="text-blue-100">Até 500 Mbps</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">R$ 79,90</p>
                        <p className="text-blue-100 text-sm">/mês</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-lg">Empresarial</h4>
                        <p className="text-blue-100">Até 1 Gbps</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">R$ 149,90</p>
                        <p className="text-blue-100 text-sm">/mês</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-white text-blue-600 font-semibold py-3 rounded-xl mt-6 hover:bg-blue-50 transition-colors">
                  Ver Todos os Planos
                </button>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Zap className="w-8 h-8 text-yellow-900" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <CheckCircle className="w-6 h-6 text-green-900" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              icon={<CheckCircle className="w-6 h-6 text-white" />}
              title="Ruas Concluídas"
              value={stats.completed}
              gradient="from-green-500 to-green-600"
            />
            <StatsCard
              icon={<Clock className="w-6 h-6 text-white" />}
              title="Em Andamento"
              value={stats.inProgress}
              gradient="from-yellow-500 to-orange-500"
            />
            <StatsCard
              icon={<TrendingUp className="w-6 h-6 text-white" />}
              title="Planejadas"
              value={stats.planned}
              gradient="from-blue-500 to-blue-600"
            />
            <StatsCard
              icon={<Award className="w-6 h-6 text-white" />}
              title="Total de Ruas"
              value={stats.total}
              gradient="from-purple-500 to-purple-600"
            />
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      {!isLoading && recentActivity.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Expansão da Rede
                </h2>
                <p className="text-xl text-slate-600 mb-8">
                  Acompanhe o progresso da expansão da nossa rede de fibra óptica
                </p>
                <Timeline items={recentActivity} />
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Nossa Garantia
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 mb-2">Conexão Estável</h4>
                      <p className="text-slate-600">Garantimos 99,9% de uptime com nossa infraestrutura redundante.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 mb-2">Suporte Especializado</h4>
                      <p className="text-slate-600">Técnicos qualificados disponíveis 24/7 para resolver qualquer problema.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 mb-2">Melhor Custo-Benefício</h4>
                      <p className="text-slate-600">Planos competitivos com a melhor relação qualidade-preço da região.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Por que escolher a Parceiros da Net?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Oferecemos muito mais que internet rápida. Nossa missão é conectar você 
              ao que realmente importa com tecnologia de ponta e atendimento excepcional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Alta Velocidade</h3>
              <p className="text-slate-600">
                Internet fibra óptica com velocidades de até 1 Gbps para download e upload simétrico.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Conexão Estável</h3>
              <p className="text-slate-600">
                Rede redundante e tecnologia avançada garantem 99,9% de disponibilidade.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <HeadphonesIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Suporte 24/7</h3>
              <p className="text-slate-600">
                Equipe técnica especializada disponível 24 horas por dia, 7 dias por semana.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Planos Personalizados</h3>
              <p className="text-slate-600">
                Soluções sob medida para residências, empresas e condomínios.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Qualidade Premiada</h3>
              <p className="text-slate-600">
                Reconhecida pela excelência no atendimento e qualidade dos serviços.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-8 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Cobertura Regional</h3>
              <p className="text-slate-600">
                Ampla cobertura com expansão constante para atender mais regiões.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Speed Test Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Teste sua Velocidade Atual
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Descubra se sua internet atual está realmente entregando a velocidade contratada
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Teste de Velocidade</h3>
              <p className="text-blue-100 mb-6">Meça sua velocidade atual de download e upload</p>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                Iniciar Teste
              </button>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-8 flex items-center justify-center text-center">
              <div>
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wifi className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-900 mb-2">Cobertura</h3>
                <p className="text-green-700">Verifique se nossa fibra óptica já chegou na sua região</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-8 flex items-center justify-center text-center">
              <div>
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-orange-900 mb-2">Planos Ideais</h3>
                <p className="text-orange-700">Encontre o plano perfeito para suas necessidades</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Pronto para uma Internet Mais Rápida?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Contrate já nossa fibra óptica e experimente a diferença de uma conexão 
            verdadeiramente estável e ultrarrápida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Contratar Agora
            </button>
            <a
              href="/mapa"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Ver Cobertura
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Wifi className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>Parceiros da Net</h3>
                  <p className="text-slate-400 text-sm">Internet de Alta Velocidade</p>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed mb-4">
                Provedor de internet fibra óptica com foco na qualidade, 
                velocidade e atendimento excepcional ao cliente.
              </p>
              <div className="flex items-center space-x-2 text-green-400 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Rede Online 24/7</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Nossos Serviços</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>• Internet Fibra Óptica</li>
                <li>• Planos Residenciais</li>
                <li>• Planos Empresariais</li>
                <li>• Suporte Técnico 24/7</li>
                <li>• Instalação Gratuita</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contato & Suporte</h4>
              <div className="space-y-3 text-slate-400">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>0800 123 4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Atendemos toda a região</span>
                </div>
                <div className="bg-slate-800 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Suporte técnico:</p>
                  <p className="text-sm font-medium text-white">Disponível 24 horas por dia</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 Parceiros da Net. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Work Progress Dashboard */}
      <WorkProgressDashboard streets={streets} />
    </div>
  );
}
