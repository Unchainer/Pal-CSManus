import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET = process.env.AWS_S3_BUCKET || "pale-cms-media";

/**
 * Get a presigned URL for uploading a file to S3
 * @param fileName - Original file name
 * @param mimeType - MIME type of the file
 * @param userId - User ID for organizing files
 * @returns Presigned URL and file key
 */
export async function getPresignedUploadUrl(
  fileName: string,
  mimeType: string,
  userId: number
) {
  const fileExtension = fileName.split(".").pop() || "";
  const uniqueId = nanoid(10);
  const fileKey = `media/${userId}/${uniqueId}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: fileKey,
    ContentType: mimeType,
  });

  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600, // 1 hour
  });

  return {
    presignedUrl,
    fileKey,
    s3Url: `https://${BUCKET}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${fileKey}`,
  };
}

/**
 * Get a presigned URL for downloading a file from S3
 * @param fileKey - S3 file key
 * @returns Presigned URL
 */
export async function getPresignedDownloadUrl(fileKey: string) {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: fileKey,
  });

  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600, // 1 hour
  });

  return presignedUrl;
}

/**
 * Delete a file from S3
 * @param fileKey - S3 file key
 */
export async function deleteS3File(fileKey: string) {
  const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: fileKey,
  });

  return s3Client.send(command);
}
