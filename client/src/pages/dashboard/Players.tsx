import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Tv, Wifi, WifiOff } from "lucide-react";

export default function PlayersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Players</h1>
          <p className="text-slate-400 mt-2">Gerencie suas telas e dispositivos</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Player
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2].map((i) => (
          <Card key={i} className="bg-slate-700/50 border-slate-600 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Tv className="w-8 h-8 text-red-500" />
                <div>
                  <h3 className="font-semibold">Player {i}</h3>
                  <p className="text-sm text-slate-400">Sala de espera</p>
                </div>
              </div>
              {i === 1 ? (
                <span className="flex items-center gap-1 text-green-400 text-sm">
                  <Wifi className="w-4 h-4" />
                  Online
                </span>
              ) : (
                <span className="flex items-center gap-1 text-slate-400 text-sm">
                  <WifiOff className="w-4 h-4" />
                  Offline
                </span>
              )}
            </div>
            <div className="text-sm text-slate-400 mb-4">
              <p>Código: <span className="font-mono text-white">ABC123</span></p>
              <p>Última sync: há 2 minutos</p>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Gerenciar Campanhas
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
