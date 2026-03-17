import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileVideo, Image, Loader2 } from "lucide-react";
import MediaUploadZone from "@/components/MediaUploadZone";
import { trpc } from "@/lib/trpc";
import { formatBytes, formatDuration } from "@/lib/utils";

export default function BibliotecaPage() {
  const mediaListQuery = trpc.media.list.useQuery();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Biblioteca de Mídia</h1>
          <p className="text-slate-400 mt-2">Gerencie seus vídeos e imagens</p>
        </div>
      </div>

      {/* Upload Zone */}
      <MediaUploadZone />

      {/* Media Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Mídia Recente</h2>
        {mediaListQuery.isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : mediaListQuery.data && mediaListQuery.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaListQuery.data.map((media) => (
              <Card key={media.id} className="bg-slate-700/50 border-slate-600 overflow-hidden hover:border-red-500/50 transition">
                <div className="aspect-video bg-slate-800 flex items-center justify-center">
                  {media.mimeType.startsWith("video/") ? (
                    <FileVideo className="w-8 h-8 text-slate-400" />
                  ) : (
                    <Image className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold truncate">{media.filename}</h3>
                  <p className="text-sm text-slate-400">
                    {formatBytes(media.sizeBytes)}
                    {media.durationSeconds && ` • ${formatDuration(media.durationSeconds)}`}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Status: <span className={media.status === 'ready' ? 'text-green-400' : media.status === 'uploading' ? 'text-blue-400' : 'text-red-400'}>
                      {media.status}
                    </span>
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-700/50 border-slate-600 p-12 text-center">
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">Nenhuma mídia enviada ainda</p>
          </Card>
        )}
      </div>
    </div>
  );
}
