import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { BarChart3, Settings, User, Tv, Upload, Play, LogOut } from "lucide-react";
import BibliotecaPage from "./dashboard/Biblioteca";
import PlayersPage from "./dashboard/Players";
import CampanhasPage from "./dashboard/Campanhas";
import RelatoriosPage from "./dashboard/Relatorios";
import ConfiguracoesPage from "./dashboard/Configuracoes";
import PerfilPage from "./dashboard/Perfil";

export default function Dashboard() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [location, navigate] = useLocation();

  // Extract section from URL
  const section = location.split("/dashboard/")[1] || "biblioteca";

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    {
      id: "biblioteca",
      label: "Biblioteca",
      icon: Upload,
    },
    {
      id: "players",
      label: "Players",
      icon: Tv,
    },
    {
      id: "campanhas",
      label: "Campanhas",
      icon: Play,
    },
    {
      id: "relatorios",
      label: "Relatórios",
      icon: BarChart3,
    },
    {
      id: "configuracoes",
      label: "Configurações",
      icon: Settings,
    },
    {
      id: "perfil",
      label: "Perfil",
      icon: User,
    },
    {
      id: "logout",
      label: "Sair",
      icon: LogOut,
      action: logout
    }
  ];

  const renderSection = () => {
    switch (section) {
      case "biblioteca":
        return <BibliotecaPage />;
      case "players":
        return <PlayersPage />;
      case "campanhas":
        return <CampanhasPage />;
      case "relatorios":
        return <RelatoriosPage />;
      case "configuracoes":
        return <ConfiguracoesPage />;
      case "perfil":
        return <PerfilPage />;
      default:
        return <BibliotecaPage />;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderSection()}
        </div>
      </div>
    </DashboardLayout>
  );
}
