import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Lock, Globe } from "lucide-react";

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-slate-400 mt-2">Gerencie suas preferências</p>
      </div>

      <div className="space-y-4">
        {[
          { icon: Bell, title: "Notificações", description: "Gerenciar alertas e notificações push" },
          { icon: Lock, title: "Segurança", description: "Alterar senha e autenticação" },
          { icon: Globe, title: "Preferências Gerais", description: "Idioma, fuso horário e tema" }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card key={idx} className="bg-slate-700/50 border-slate-600 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Icon className="w-8 h-8 text-red-500" />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.description}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Configurar</Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
