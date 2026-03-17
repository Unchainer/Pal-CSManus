import { useState, useRef } from "react";
import { Upload, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
}

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function MediaUploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const getUploadUrlMutation = trpc.media.getUploadUrl.useMutation();
  const confirmUploadMutation = trpc.media.confirmUpload.useMutation();
  const mediaListQuery = trpc.media.list.useQuery();

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);

    for (const file of fileArray) {
      // Validate file
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`Tipo de arquivo não suportado: ${file.name}`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error(`Arquivo muito grande: ${file.name} (máx 500MB)`);
        continue;
      }

      // Create upload entry
      const uploadId = `${Date.now()}-${Math.random()}`;
      setUploadingFiles((prev) => [
        ...prev,
        {
          id: uploadId,
          name: file.name,
          progress: 0,
          status: "uploading",
        },
      ]);

      // Get presigned URL
      try {
        const uploadResponse = await getUploadUrlMutation.mutateAsync({
          fileName: file.name,
          mimeType: file.type,
          fileSize: file.size,
        });

        // Upload to S3
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            setUploadingFiles((prev) =>
              prev.map((f) =>
                f.id === uploadId ? { ...f, progress: percentComplete } : f
              )
            );
          }
        });

        xhr.addEventListener("load", async () => {
          if (xhr.status === 200) {
            // Confirm upload
            await confirmUploadMutation.mutateAsync({
              mediaId: uploadResponse.mediaId,
            });

            setUploadingFiles((prev) =>
              prev.map((f) =>
                f.id === uploadId ? { ...f, status: "success", progress: 100 } : f
              )
            );

            toast.success(`${file.name} enviado com sucesso!`);
            
            // Refresh media list
            mediaListQuery.refetch();
          } else {
            throw new Error("Upload failed");
          }
        });

        xhr.addEventListener("error", () => {
          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.id === uploadId
                ? {
                    ...f,
                    status: "error",
                    error: "Erro ao fazer upload",
                  }
                : f
            )
          );
          toast.error(`Erro ao fazer upload de ${file.name}`);
        });

        xhr.open("PUT", uploadResponse.presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.id === uploadId
              ? {
                  ...f,
                  status: "error",
                  error: "Erro ao gerar URL de upload",
                }
              : f
          )
        );
        toast.error(`Erro ao fazer upload de ${file.name}`);
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeUpload = (id: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-red-500 bg-red-50 dark:bg-red-950/20"
            : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50"
        }`}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
        <h3 className="text-lg font-semibold mb-2">Arraste seus arquivos aqui</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          ou clique para selecionar
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-500 mb-4">
          Vídeos: MP4, WebM, MOV • Imagens: JPEG, PNG, WebP • Máximo: 500MB
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_TYPES.join(",")}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="bg-red-600 hover:bg-red-700"
        >
          Selecionar Arquivos
        </Button>
      </div>

      {/* Uploading Files List */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Uploads em Andamento</h3>
          {uploadingFiles.map((file) => (
            <div
              key={file.id}
              className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {file.status === "success" && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  )}
                  {file.status === "error" && (
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  )}
                  {file.status === "uploading" && (
                    <Upload className="w-5 h-5 text-blue-500 flex-shrink-0 animate-pulse" />
                  )}
                  <span className="text-sm font-medium truncate">{file.name}</span>
                </div>
                <button
                  onClick={() => removeUpload(file.id)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {file.status === "uploading" && (
                <>
                  <Progress value={file.progress} className="mb-2" />
                  <p className="text-xs text-slate-500">
                    {Math.round(file.progress)}%
                  </p>
                </>
              )}

              {file.status === "success" && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  Upload concluído com sucesso
                </p>
              )}

              {file.status === "error" && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {file.error || "Erro ao fazer upload"}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
