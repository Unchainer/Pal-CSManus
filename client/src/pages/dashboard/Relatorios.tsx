import { Card } from "@/components/ui/card";
import { BarChart3, Users, Activity, AlertCircle } from "lucide-react";

export default function RelatoriosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <p className="text-slate-400 mt-2">Métricas e analytics do seu sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Players Online", value: "12", icon: Users },
          { label: "Campanhas Ativas", value: "5", icon: Activity },
          { label: "Vídeos na Biblioteca", value: "48", icon: BarChart3 },
          { label: "Erros de Sync", value: "2", icon: AlertCircle }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="bg-slate-700/50 border-slate-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <Icon className="w-8 h-8 text-red-500 opacity-50" />
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="bg-slate-700/50 border-slate-600 p-6">
        <h2 className="text-xl font-semibold mb-4">Histórico de Sincronização</h2>
        <div className="space-y-2 text-slate-400 text-sm">
          <p>• Player 1: Sincronizado há 2 minutos</p>
          <p>• Player 2: Sincronizado há 5 minutos</p>
          <p>• Player 3: Offline há 30 minutos</p>
        </div>
      </Card>
    </div>
  );
}
