/**
 * Review Queue Management for Zura Insurance Data Agent
 *
 * File-based JSON storage for managing data change review items.
 * Items flow through: pending -> approved/rejected/auto_approved
 */

import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";

// ---- Types ----

export interface ReviewItem {
  id: string;
  sourceId: string;
  insurerSlug: string;
  category: string;
  changeType: "new_product" | "updated_product" | "retired_product" | "field_update";
  productId: string;
  productName: string;
  changes: { field: string; oldValue: unknown; newValue: unknown }[];
  confidence: "high" | "medium" | "low";
  autoPublishEligible: boolean;
  status: "pending" | "approved" | "rejected" | "auto_approved";
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

// ---- Helpers ----

function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content) as T;
    }
  } catch {
    // corrupted file — return fallback
  }
  return fallback;
}

function writeJsonFile(filePath: string, data: unknown): void {
  const dir = path.dirname(filePath);
  ensureDir(dir);
  const tmpPath = filePath + ".tmp";
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2) + "\n", "utf-8");
  try {
    fs.renameSync(tmpPath, filePath);
  } catch {
    fs.copyFileSync(tmpPath, filePath);
    try { fs.unlinkSync(tmpPath); } catch { /* ignore */ }
  }
}

// ---- Review Queue Class ----

export class ReviewQueue {
  private pendingFile: string;
  private approvedFile: string;
  private rejectedFile: string;

  constructor(private queueDir: string) {
    this.pendingFile = path.join(queueDir, "pending.json");
    this.approvedFile = path.join(queueDir, "approved.json");
    this.rejectedFile = path.join(queueDir, "rejected.json");
    ensureDir(queueDir);
  }

  /**
   * Add a new item to the pending review queue.
   * Generates a unique ID and sets status to "pending".
   */
  addItem(item: Omit<ReviewItem, "id" | "createdAt" | "status">): ReviewItem {
    const fullItem: ReviewItem = {
      ...item,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    const pending = this.loadPending();
    pending.push(fullItem);
    writeJsonFile(this.pendingFile, pending);

    return fullItem;
  }

  /**
   * Get all items with status "pending".
   */
  getPending(): ReviewItem[] {
    return this.loadPending();
  }

  /**
   * Get all items across all queues (pending, approved, rejected).
   */
  getAll(): ReviewItem[] {
    const pending = this.loadPending();
    const approved = this.loadApproved();
    const rejected = this.loadRejected();
    return [...pending, ...approved, ...rejected];
  }

  /**
   * Approve a pending item. Moves it from pending to approved.
   */
  approve(id: string, reviewer?: string, notes?: string): ReviewItem | null {
    const pending = this.loadPending();
    const index = pending.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const item = pending[index];
    item.status = "approved";
    item.reviewedAt = new Date().toISOString();
    if (reviewer) item.reviewedBy = reviewer;
    if (notes) item.notes = notes;

    // Remove from pending
    pending.splice(index, 1);
    writeJsonFile(this.pendingFile, pending);

    // Add to approved
    const approved = this.loadApproved();
    approved.push(item);
    writeJsonFile(this.approvedFile, approved);

    return item;
  }

  /**
   * Reject a pending item. Moves it from pending to rejected.
   */
  reject(id: string, reviewer?: string, reason?: string): ReviewItem | null {
    const pending = this.loadPending();
    const index = pending.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const item = pending[index];
    item.status = "rejected";
    item.reviewedAt = new Date().toISOString();
    if (reviewer) item.reviewedBy = reviewer;
    if (reason) item.notes = reason;

    // Remove from pending
    pending.splice(index, 1);
    writeJsonFile(this.pendingFile, pending);

    // Add to rejected
    const rejected = this.loadRejected();
    rejected.push(item);
    writeJsonFile(this.rejectedFile, rejected);

    return item;
  }

  /**
   * Auto-approve all eligible pending items.
   * An item is eligible if autoPublishEligible is true and confidence is "high".
   * Returns the list of auto-approved items.
   */
  autoApproveEligible(): ReviewItem[] {
    const pending = this.loadPending();
    const eligible: ReviewItem[] = [];
    const remaining: ReviewItem[] = [];

    for (const item of pending) {
      if (item.autoPublishEligible && item.confidence === "high") {
        item.status = "auto_approved";
        item.reviewedAt = new Date().toISOString();
        item.reviewedBy = "auto";
        item.notes = "Auto-approved: high confidence, eligible for auto-publish";
        eligible.push(item);
      } else {
        remaining.push(item);
      }
    }

    if (eligible.length > 0) {
      writeJsonFile(this.pendingFile, remaining);
      const approved = this.loadApproved();
      approved.push(...eligible);
      writeJsonFile(this.approvedFile, approved);
    }

    return eligible;
  }

  /**
   * Get a single review item by ID from any queue.
   */
  getById(id: string): ReviewItem | null {
    const all = this.getAll();
    return all.find((item) => item.id === id) ?? null;
  }

  /**
   * Clear all queues. Useful for testing or resetting state.
   */
  clear(): void {
    writeJsonFile(this.pendingFile, []);
    writeJsonFile(this.approvedFile, []);
    writeJsonFile(this.rejectedFile, []);
  }

  // ---- Internal loaders ----

  private loadPending(): ReviewItem[] {
    return readJsonFile<ReviewItem[]>(this.pendingFile, []);
  }

  private loadApproved(): ReviewItem[] {
    return readJsonFile<ReviewItem[]>(this.approvedFile, []);
  }

  private loadRejected(): ReviewItem[] {
    return readJsonFile<ReviewItem[]>(this.rejectedFile, []);
  }
}
