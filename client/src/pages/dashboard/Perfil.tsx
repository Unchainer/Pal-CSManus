import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar } from "lucide-react";

export default function PerfilPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <p className="text-slate-400 mt-2">Informações da sua conta</p>
      </div>

      <Card className="bg-slate-700/50 border-slate-600 p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Usuário</h2>
            <p className="text-slate-400">usuario@example.com</p>
            <Button variant="outline" size="sm" className="mt-2">Alterar Foto</Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
            <Mail className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-sm text-slate-400">Email</p>
              <p className="font-semibold">usuario@example.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
            <Calendar className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-sm text-slate-400">Membro desde</p>
              <p className="font-semibold">15 de março de 2026</p>
            </div>
          </div>
        </div>

        <Button className="mt-6 w-full bg-red-600 hover:bg-red-700">
          Editar Perfil
        </Button>
      </Card>
    </div>
  );
}
