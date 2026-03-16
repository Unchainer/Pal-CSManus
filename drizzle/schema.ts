import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, bigint } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  avatarUrl: text("avatarUrl"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Media library - videos and images
 */
export const media = mysqlTable("media", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  url: text("url").notNull(),
  fileKey: text("fileKey").notNull(),
  mimeType: varchar("mimeType", { length: 50 }).notNull(),
  sizeBytes: bigint("sizeBytes", { mode: "number" }).notNull(),
  durationSeconds: int("durationSeconds"),
  thumbnailUrl: text("thumbnailUrl"),
  status: mysqlEnum("status", ["uploading", "ready", "failed"]).default("uploading").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Media = typeof media.$inferSelect;
export type InsertMedia = typeof media.$inferInsert;

/**
 * Players - TV/display devices
 */
export const players = mysqlTable("players", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  pairingCode: varchar("pairingCode", { length: 10 }).notNull().unique(),
  deviceId: varchar("deviceId", { length: 255 }).unique(),
  status: mysqlEnum("status", ["online", "offline", "pairing"]).default("pairing").notNull(),
  lastSync: timestamp("lastSync"),
  currentCampaignId: int("currentCampaignId"),
  location: text("location"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Player = typeof players.$inferSelect;
export type InsertPlayer = typeof players.$inferInsert;

/**
 * Campaigns - playlists of media
 */
export const campaigns = mysqlTable("campaigns", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["draft", "active", "paused", "archived"]).default("draft").notNull(),
  scheduledStart: timestamp("scheduledStart"),
  scheduledEnd: timestamp("scheduledEnd"),
  loop: boolean("loop").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;

/**
 * Campaign media - many-to-many with ordering
 */
export const campaignMedia = mysqlTable("campaignMedia", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(),
  mediaId: int("mediaId").notNull(),
  order: int("order").notNull(),
  durationOverride: int("durationOverride"),
});

export type CampaignMedia = typeof campaignMedia.$inferSelect;
export type InsertCampaignMedia = typeof campaignMedia.$inferInsert;

/**
 * Player campaigns - assignment
 */
export const playerCampaigns = mysqlTable("playerCampaigns", {
  id: int("id").autoincrement().primaryKey(),
  playerId: int("playerId").notNull(),
  campaignId: int("campaignId").notNull(),
  assignedAt: timestamp("assignedAt").defaultNow().notNull(),
  status: mysqlEnum("status", ["pending", "synced", "playing", "failed"]).default("pending").notNull(),
});

export type PlayerCampaign = typeof playerCampaigns.$inferSelect;
export type InsertPlayerCampaign = typeof playerCampaigns.$inferInsert;

/**
 * Sync logs - audit trail
 */
export const syncLogs = mysqlTable("syncLogs", {
  id: int("id").autoincrement().primaryKey(),
  playerId: int("playerId").notNull(),
  campaignId: int("campaignId"),
  syncTimestamp: timestamp("syncTimestamp").defaultNow().notNull(),
  status: mysqlEnum("status", ["success", "failed", "partial"]).notNull(),
  errorMessage: text("errorMessage"),
});

export type SyncLog = typeof syncLogs.$inferSelect;
export type InsertSyncLog = typeof syncLogs.$inferInsert;

/**
 * Notifications - push history
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  playerId: int("playerId"),
  userId: int("userId"),
  type: mysqlEnum("type", ["campaign_assigned", "content_updated", "offline_alert", "sync_error", "system"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  readAt: timestamp("readAt"),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;