import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getPresignedUploadUrl } from "../../storage";
import { createMedia, getMediaByUserId, deleteMedia, updateMediaStatus } from "../db";
import { TRPCError } from "@trpc/server";

// Validation constants
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_MIME_TYPES = [...ALLOWED_VIDEO_TYPES, ...ALLOWED_IMAGE_TYPES];

export const mediaRouter = router({
  /**
   * Get presigned URL for uploading a file to S3
   */
  getUploadUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string().min(1).max(255),
        mimeType: z.string().refine(
          (type) => ALLOWED_MIME_TYPES.includes(type),
          "Tipo de arquivo não suportado. Use MP4, WebM, MOV, JPEG, PNG ou WebP."
        ),
        fileSize: z.number().positive().refine(
          (size) => size <= MAX_FILE_SIZE,
          `Arquivo muito grande. Máximo permitido: 500MB`
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { presignedUrl, fileKey, s3Url } = await getPresignedUploadUrl(
          input.fileName,
          input.mimeType,
          ctx.user.id
        );

        // Determine media type
        const isVideo = ALLOWED_VIDEO_TYPES.includes(input.mimeType);
        const mediaType = isVideo ? "video" : "image";

        // Create media record in database (status: uploading)
        const result = await createMedia({
          userId: ctx.user.id,
          filename: input.fileName,
          mimeType: input.mimeType,
          sizeBytes: input.fileSize,
          durationSeconds: isVideo ? null : undefined,
          fileKey: fileKey,
          url: s3Url,
          status: "uploading",
        });

        return {
          presignedUrl,
          fileKey,
          s3Url,
          mediaId: (result as any).insertId, // Get the inserted media ID
        };
      } catch (error) {
        console.error("[Media] Error getting presigned URL:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao gerar URL de upload",
        });
      }
    }),

  /**
   * Confirm upload completion and update media status
   */
  confirmUpload: protectedProcedure
    .input(
      z.object({
        mediaId: z.number(),
        duration: z.number().optional(), // For videos
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Update media status to ready
        await updateMediaStatus(input.mediaId, "ready");

        return {
          success: true,
          mediaId: input.mediaId,
        };
      } catch (error) {
        console.error("[Media] Error confirming upload:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao confirmar upload",
        });
      }
    }),

  /**
   * List all media files for the current user
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const mediaList = await getMediaByUserId(ctx.user.id);
      return mediaList;
    } catch (error) {
      console.error("[Media] Error listing media:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erro ao listar mídia",
      });
    }
  }),

  /**
   * Delete a media file
   */
  delete: protectedProcedure
    .input(z.object({ mediaId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        // TODO: Delete from S3 as well
        await deleteMedia(input.mediaId);

        return {
          success: true,
          mediaId: input.mediaId,
        };
      } catch (error) {
        console.error("[Media] Error deleting media:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao deletar mídia",
        });
      }
    }),

  /**
   * Mark upload as failed
   */
  markFailed: protectedProcedure
    .input(
      z.object({
        mediaId: z.number(),
        error: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await updateMediaStatus(input.mediaId, "failed");

        return {
          success: true,
          mediaId: input.mediaId,
        };
      } catch (error) {
        console.error("[Media] Error marking upload as failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao marcar upload como falho",
        });
      }
    }),
});
