/**
 * Data Merger for Zura Insurance Agent
 *
 * Merges approved review items into the canonical src/data/*.json files.
 * Creates backups before any mutation and logs all changes to an audit trail.
 */

import * as fs from "fs";
import * as path from "path";
import type { ReviewItem } from "../agent/review";

// ---- Types ----

export interface MergeResult {
  category: string;
  filePath: string;
  added: number;
  updated: number;
  unchanged: number;
  backupPath: string;
}

interface DataFile {
  category: string;
  lastUpdated: string;
  disclaimer: string;
  products: Record<string, unknown>[];
  [key: string]: unknown;
}

interface AuditEntry {
  timestamp: string;
  action: "add" | "update" | "retire";
  category: string;
  productId: string;
  productName: string;
  reviewItemId: string;
  changes: { field: string; oldValue: unknown; newValue: unknown }[];
}

// ---- Helpers ----

function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function readJsonFile<T>(filePath: string): T {
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content) as T;
}

function writeJsonFileAtomic(filePath: string, data: unknown): void {
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

function appendJSONL(filePath: string, record: unknown): void {
  const dir = path.dirname(filePath);
  ensureDir(dir);
  const line = JSON.stringify(record) + "\n";
  fs.appendFileSync(filePath, line, "utf-8");
}

function backupFile(srcPath: string, backupDir: string): string {
  ensureDir(backupDir);
  const ext = path.extname(srcPath);
  const base = path.basename(srcPath, ext);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupName = `${base}_${timestamp}${ext}`;
  const backupPath = path.join(backupDir, backupName);
  fs.copyFileSync(srcPath, backupPath);
  return backupPath;
}

/**
 * Map a category string to its corresponding JSON data file name.
 */
function categoryToFileName(category: string): string {
  const mapping: Record<string, string> = {
    health: "health-insurance.json",
    "term-life": "term-life-insurance.json",
    motor: "motor-insurance.json",
    travel: "travel-insurance.json",
  };
  return mapping[category] ?? `${category}-insurance.json`;
}

// ---- Core Merge Logic ----

/**
 * Merge approved review items into the src/data/ JSON files.
 *
 * Steps for each category:
 * 1. Read existing data file
 * 2. Create a timestamped backup
 * 3. Apply field-level updates for updated_product / field_update items
 * 4. Append new products for new_product items
 * 5. Mark retired products for retired_product items
 * 6. Update the lastUpdated timestamp
 * 7. Write atomically
 * 8. Log each change to audit-log/changes.jsonl
 */
export async function mergeApprovedChanges(
  approvedItems: ReviewItem[],
  dataDir: string,
  backupDir: string
): Promise<MergeResult[]> {
  if (approvedItems.length === 0) {
    return [];
  }

  // Group items by category
  const byCategory = new Map<string, ReviewItem[]>();
  for (const item of approvedItems) {
    const cat = item.category;
    if (!byCategory.has(cat)) {
      byCategory.set(cat, []);
    }
    byCategory.get(cat)!.push(item);
  }

  const results: MergeResult[] = [];
  const auditLogPath = path.join(path.dirname(backupDir), "audit-log", "changes.jsonl");

  for (const [category, items] of byCategory) {
    const fileName = categoryToFileName(category);
    const filePath = path.join(dataDir, fileName);

    // Read existing data or create skeleton
    let data: DataFile;
    if (fs.existsSync(filePath)) {
      data = readJsonFile<DataFile>(filePath);
    } else {
      data = {
        category,
        lastUpdated: new Date().toISOString().split("T")[0],
        disclaimer:
          "Data collected from publicly available sources for educational and informational purposes only.",
        products: [],
      };
    }

    // Backup the existing file if it exists
    let bkPath = "";
    if (fs.existsSync(filePath)) {
      bkPath = backupFile(filePath, backupDir);
    }

    let added = 0;
    let updated = 0;
    let unchanged = 0;

    for (const item of items) {
      const existingIndex = data.products.findIndex(
        (p: Record<string, unknown>) => p.id === item.productId
      );

      if (item.changeType === "new_product") {
        if (existingIndex !== -1) {
          // Product already exists — treat as update instead
          applyFieldUpdates(data.products[existingIndex], item.changes);
          updated++;
        } else {
          // Build new product from changes (newValue fields)
          const newProduct: Record<string, unknown> = {
            id: item.productId,
            productName: item.productName,
            insurerSlug: item.insurerSlug,
            category,
            lastVerified: new Date().toISOString().split("T")[0],
          };
          for (const change of item.changes) {
            newProduct[change.field] = change.newValue;
          }
          data.products.push(newProduct);
          added++;
        }
      } else if (item.changeType === "updated_product" || item.changeType === "field_update") {
        if (existingIndex !== -1) {
          const product = data.products[existingIndex];
          const hadChanges = applyFieldUpdates(product, item.changes);
          // Update lastVerified timestamp
          (product as Record<string, unknown>).lastVerified = new Date()
            .toISOString()
            .split("T")[0];
          if (hadChanges) {
            updated++;
          } else {
            unchanged++;
          }
        } else {
          // Product not found — nothing to update
          unchanged++;
        }
      } else if (item.changeType === "retired_product") {
        if (existingIndex !== -1) {
          const product = data.products[existingIndex] as Record<string, unknown>;
          product.status = "retired";
          product.retiredAt = new Date().toISOString().split("T")[0];
          product.lastVerified = new Date().toISOString().split("T")[0];
          updated++;
        } else {
          unchanged++;
        }
      }

      // Write audit log entry
      const auditEntry: AuditEntry = {
        timestamp: new Date().toISOString(),
        action:
          item.changeType === "new_product"
            ? "add"
            : item.changeType === "retired_product"
              ? "retire"
              : "update",
        category,
        productId: item.productId,
        productName: item.productName,
        reviewItemId: item.id,
        changes: item.changes,
      };
      appendJSONL(auditLogPath, auditEntry);
    }

    // Update lastUpdated
    data.lastUpdated = new Date().toISOString().split("T")[0];

    // Write atomically
    writeJsonFileAtomic(filePath, data);

    results.push({
      category,
      filePath,
      added,
      updated,
      unchanged,
      backupPath: bkPath,
    });
  }

  return results;
}

/**
 * Apply field-level updates to an existing product object.
 * Returns true if at least one field was actually changed.
 */
function applyFieldUpdates(
  product: Record<string, unknown>,
  changes: { field: string; oldValue: unknown; newValue: unknown }[]
): boolean {
  let hadChange = false;
  for (const change of changes) {
    const currentValue = product[change.field];
    // Only apply if the value actually differs
    if (JSON.stringify(currentValue) !== JSON.stringify(change.newValue)) {
      product[change.field] = change.newValue;
      hadChange = true;
    }
  }
  return hadChange;
}
