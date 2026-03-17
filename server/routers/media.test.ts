import { describe, it, expect, vi, beforeEach } from "vitest";
import { mediaRouter } from "./media";
import { TRPCError } from "@trpc/server";

// Mock the storage module
vi.mock("../../storage", () => ({
  getPresignedUploadUrl: vi.fn().mockResolvedValue({
    presignedUrl: "https://s3.amazonaws.com/presigned-url",
    fileKey: "media/1/abc123.mp4",
    s3Url: "https://bucket.s3.amazonaws.com/media/1/abc123.mp4",
  }),
}));

// Mock the database module
vi.mock("../db", () => ({
  createMedia: vi.fn().mockResolvedValue({ insertId: 1 }),
  getMediaByUserId: vi.fn().mockResolvedValue([
    {
      id: 1,
      userId: 1,
      filename: "test.mp4",
      mimeType: "video/mp4",
      sizeBytes: 1024000,
      durationSeconds: 180,
      fileKey: "media/1/abc123.mp4",
      url: "https://bucket.s3.amazonaws.com/media/1/abc123.mp4",
      status: "ready",
      createdAt: new Date(),
    },
  ]),
  deleteMedia: vi.fn().mockResolvedValue({ success: true }),
  updateMediaStatus: vi.fn().mockResolvedValue({ success: true }),
}));

describe("Media Router", () => {
  const mockContext = {
    user: {
      id: 1,
      openId: "test-user",
      name: "Test User",
      email: "test@example.com",
      role: "user" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {} as any,
    res: {} as any,
  };

  describe("getUploadUrl", () => {
    it("should generate presigned URL for valid video file", async () => {
      const caller = mediaRouter.createCaller(mockContext);

      const result = await caller.getUploadUrl({
        fileName: "test.mp4",
        mimeType: "video/mp4",
        fileSize: 100 * 1024 * 1024, // 100MB
      });

      expect(result).toHaveProperty("presignedUrl");
      expect(result).toHaveProperty("fileKey");
      expect(result).toHaveProperty("s3Url");
      expect(result).toHaveProperty("mediaId");
    });

    it("should generate presigned URL for valid image file", async () => {
      const caller = mediaRouter.createCaller(mockContext);

      const result = await caller.getUploadUrl({
        fileName: "image.png",
        mimeType: "image/png",
        fileSize: 5 * 1024 * 1024, // 5MB
      });

      expect(result).toHaveProperty("presignedUrl");
      expect(result).toHaveProperty("fileKey");
    });

    it("should reject unsupported file types", async () => {
      const caller = mediaRouter.createCaller(mockContext);

      try {
        await caller.getUploadUrl({
          fileName: "test.exe",
          mimeType: "application/x-msdownload",
          fileSize: 1024,
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it("should reject files larger than 500MB", async () => {
      const caller = mediaRouter.createCaller(mockContext);

      try {
        await caller.getUploadUrl({
          fileName: "large.mp4",
          mimeType: "video/mp4",
          fileSize: 600 * 1024 * 1024, // 600MB
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe("confirmUpload", () => {
    it("should confirm upload and update status to ready", async () => {
      const caller = mediaRouter.createCaller(mockContext);

      const result = await caller.confirmUpload({
        mediaId: 1,
        duration: 180,
      });

      expect(result).toEqual({
        success: true,
        mediaId: 1,
      });
    });
  });

  describe("list", () => {
    it("should return list of media for user", async () => {
      const caller = mediaRouter.createCaller(mockContext);

      const result = await caller.list();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("filename");
      expect(result[0]).toHaveProperty("mimeType");
      expect(result[0]).toHaveProperty("sizeBytes");
    });
  });

  describe("delete", () => {
    it("should delete media file", async () => {
      const caller = mediaRouter.createCaller(mockContext);

      const result = await caller.delete({
        mediaId: 1,
      });

      expect(result).toEqual({
        success: true,
        mediaId: 1,
      });
    });
  });

  describe("markFailed", () => {
    it("should mark upload as failed", async () => {
      const caller = mediaRouter.createCaller(mockContext);

      const result = await caller.markFailed({
        mediaId: 1,
        error: "Upload interrupted",
      });

      expect(result).toEqual({
        success: true,
        mediaId: 1,
      });
    });
  });
});
