import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, media, InsertMedia, players, InsertPlayer, campaigns, InsertCampaign, syncLogs, InsertSyncLog, notifications, InsertNotification } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserProfile(userId: number, data: { name?: string; email?: string; avatarUrl?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, userId));
}

// ============ MEDIA QUERIES ============

export async function createMedia(data: InsertMedia) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(media).values(data);
  return result;
}

export async function getMediaById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(media).where(eq(media.id, id)).limit(1);
  return result[0];
}

export async function getMediaByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(media).where(eq(media.userId, userId)).orderBy(media.createdAt);
}

export async function updateMediaStatus(id: number, status: "uploading" | "ready" | "failed") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(media).set({ status }).where(eq(media.id, id));
}

export async function deleteMedia(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(media).where(eq(media.id, id));
}

// ============ PLAYER QUERIES ============

export async function createPlayer(data: InsertPlayer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(players).values(data);
}

export async function getPlayerById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(players).where(eq(players.id, id)).limit(1);
  return result[0];
}

export async function getPlayersByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(players).where(eq(players.userId, userId));
}

export async function getPlayerByPairingCode(code: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(players).where(eq(players.pairingCode, code)).limit(1);
  return result[0];
}

export async function updatePlayerStatus(id: number, status: "online" | "offline" | "pairing") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(players).set({ status, updatedAt: new Date() }).where(eq(players.id, id));
}

export async function updatePlayerSync(id: number, campaignId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(players).set({ lastSync: new Date(), currentCampaignId: campaignId }).where(eq(players.id, id));
}

export async function deletePlayer(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(players).where(eq(players.id, id));
}

// ============ CAMPAIGN QUERIES ============

export async function createCampaign(data: InsertCampaign) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(campaigns).values(data);
}

export async function getCampaignById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(campaigns).where(eq(campaigns.id, id)).limit(1);
  return result[0];
}

export async function getCampaignsByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(campaigns).where(eq(campaigns.userId, userId)).orderBy(campaigns.createdAt);
}

export async function updateCampaignStatus(id: number, status: "draft" | "active" | "paused" | "archived") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(campaigns).set({ status, updatedAt: new Date() }).where(eq(campaigns.id, id));
}

export async function deleteCampaign(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(campaigns).where(eq(campaigns.id, id));
}

// ============ SYNC LOG QUERIES ============

export async function createSyncLog(data: InsertSyncLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(syncLogs).values(data);
}

export async function getSyncLogsByPlayerId(playerId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(syncLogs).where(eq(syncLogs.playerId, playerId)).orderBy(syncLogs.syncTimestamp).limit(limit);
}

// ============ NOTIFICATION QUERIES ============

export async function createNotification(data: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(notifications).values(data);
}

export async function getNotificationsByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(notifications.sentAt);
}
