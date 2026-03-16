import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileVideo, Image } from "lucide-react";

export default function BibliotecaPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Biblioteca de Mídia</h1>
          <p className="text-slate-400 mt-2">Gerencie seus vídeos e imagens</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Upload className="w-4 h-4 mr-2" />
          Upload de Mídia
        </Button>
      </div>

      {/* Upload Zone */}
      <Card className="border-2 border-dashed border-slate-600 p-12 text-center hover:border-red-500/50 transition cursor-pointer">
        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Arraste seus arquivos aqui</h3>
        <p className="text-slate-400 mb-4">ou clique para selecionar</p>
        <p className="text-sm text-slate-500">
          Vídeos: MP4, WebM, MOV • Imagens: JPEG, PNG, WebP • Máximo: 500MB
        </p>
      </Card>

      {/* Media Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Mídia Recente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-slate-700/50 border-slate-600 overflow-hidden hover:border-red-500/50 transition">
              <div className="aspect-video bg-slate-800 flex items-center justify-center">
                {i % 2 === 0 ? (
                  <FileVideo className="w-8 h-8 text-slate-400" />
                ) : (
                  <Image className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold truncate">Arquivo {i}.mp4</h3>
                <p className="text-sm text-slate-400">250 MB • 3:28</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
