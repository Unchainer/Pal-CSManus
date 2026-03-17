import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Tv, Upload, Radio, BarChart3, Zap, Shield, Play, Users, Clock } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center font-bold text-lg">
              P
            </div>
            <span className="font-bold text-xl">Palé CMS</span>
          </div>
          <a href={getLoginUrl()} className="text-sm font-medium hover:text-red-400 transition">
            Entrar
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
              Gerenciamento de <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Digital Signage</span> Profissional
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Distribua conteúdo multimídia para múltiplas telas em tempo real. Sincronização WiFi impecável, dashboard intuitivo e controle total sobre suas campanhas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={getLoginUrl()}>
                <Button size="lg" className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
                  Começar Agora
                </Button>
              </a>
              <Button size="lg" variant="outline" className="border-slate-600 hover:bg-slate-800 w-full sm:w-auto">
                Ver Documentação
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Funcionalidades Principais</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: "Biblioteca de Mídia",
                description: "Upload de vídeos até 500MB, imagens em múltiplos formatos. Organização por pastas e busca avançada."
              },
              {
                icon: Tv,
                title: "Gerenciamento de Players",
                description: "Cadastre dispositivos com código de pareamento único. Monitore status online/offline em tempo real."
              },
              {
                icon: Play,
                title: "Campanhas & Playlists",
                description: "Crie campanhas com múltiplos vídeos, defina ordem de exibição e agende por data/hora."
              },
              {
                icon: Radio,
                title: "Sincronização WiFi",
                description: "Sincronização automática a cada 30 segundos. Retry inteligente e cache local para confiabilidade."
              },
              {
                icon: BarChart3,
                title: "Relatórios & Analytics",
                description: "Dashboard com métricas em tempo real: players online, campanhas ativas, histórico de sincronização."
              },
              {
                icon: Zap,
                title: "Notificações Push",
                description: "Alertas automáticos quando players ficam offline ou novas campanhas são atribuídas."
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="bg-slate-700/50 border-slate-600 hover:border-red-500/50 transition p-6">
                  <Icon className="w-12 h-12 text-red-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-slate-300">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Arquitetura Técnica</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Stack Profissional</h3>
              <div className="space-y-4">
                {[
                  { label: "Frontend", value: "React 19 + Tailwind CSS 4" },
                  { label: "Backend", value: "Node.js + Express + tRPC" },
                  { label: "Banco de Dados", value: "MySQL com transações ACID" },
                  { label: "Autenticação", value: "Manus OAuth" },
                  { label: "Storage", value: "S3 para vídeos/imagens" },
                  { label: "Sincronização", value: "WebSockets + Polling WiFi" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-sm text-slate-400">{item.label}</p>
                      <p className="text-slate-200">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-8">
              <div className="space-y-4 font-mono text-sm text-slate-300">
                <p>┌─ Dashboard (React)</p>
                <p>│  ├─ Biblioteca</p>
                <p>│  ├─ Players</p>
                <p>│  ├─ Campanhas</p>
                <p>│  └─ Relatórios</p>
                <p>│</p>
                <p>├─ Backend (tRPC)</p>
                <p>│  ├─ Media Router</p>
                <p>│  ├─ Players Router</p>
                <p>│  └─ Campaigns Router</p>
                <p>│</p>
                <p>└─ Database (MySQL)</p>
                <p>   ├─ Media</p>
                <p>   ├─ Players</p>
                <p>   └─ Campaigns</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Roadmap de Lançamento</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                month: "Mês 1",
                title: "MVP Web",
                items: ["Landing page", "Dashboard completo", "Biblioteca de mídia", "Gerenciamento de players", "Campanhas básicas"]
              },
              {
                month: "Mês 2-3",
                title: "App Mobile",
                items: ["PWA para Smart TVs", "Sincronização WiFi", "Cache local", "Notificações push", "Testes de carga"]
              },
              {
                month: "Mês 3",
                title: "Deploy & Otimização",
                items: ["Testes E2E", "Performance tuning", "Documentação API", "Deploy produção", "Monitoramento"]
              }
            ].map((phase, idx) => (
              <Card key={idx} className="bg-slate-700/50 border-slate-600 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-red-500" />
                  <span className="font-bold text-red-400">{phase.month}</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">{phase.title}</h3>
                <ul className="space-y-2">
                  {phase.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Pronto para Revolucionar Seu Digital Signage?</h2>
          <p className="text-xl text-red-100 mb-8">Comece agora com autenticação segura e acesso imediato ao dashboard.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={getLoginUrl()}>
              <Button size="lg" className="bg-white text-red-600 hover:bg-slate-100 w-full sm:w-auto">
                Acessar Dashboard
              </Button>
            </a>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-red-700 w-full sm:w-auto">
              Documentação Técnica
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Palé CMS</h4>
              <p className="text-slate-400 text-sm">Plataforma profissional de Digital Signage com sincronização WiFi em tempo real.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Preços</a></li>
                <li><a href="#" className="hover:text-white transition">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Recursos</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition">API</a></li>
                <li><a href="#" className="hover:text-white transition">GitHub</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition">Termos</a></li>
                <li><a href="#" className="hover:text-white transition">Contato</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2026 Palé Produções. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
