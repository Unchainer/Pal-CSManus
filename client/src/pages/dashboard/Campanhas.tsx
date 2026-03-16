import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Play, Pause } from "lucide-react";

export default function CampanhasPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Campanhas</h1>
          <p className="text-slate-400 mt-2">Crie e gerencie suas playlists de vídeos</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="bg-slate-700/50 border-slate-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Play className="w-8 h-8 text-red-500" />
                <div>
                  <h3 className="font-semibold text-lg">Campanha {i}</h3>
                  <p className="text-sm text-slate-400">Criada em 15 de março</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
                  {i === 1 ? "Ativa" : "Pausada"}
                </span>
                <Button variant="outline" size="sm">Editar</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
