#!/usr/bin/env node
/**
 * Premium History Snapshot Script
 *
 * Reads all products and appends current premium/CSR data to
 * data/history/<product-id>.json if values have changed.
 *
 * Run daily via cron or GitHub Actions:
 *   node scripts/snapshot-premiums.js
 */

const fs = require("fs");
const path = require("path");

const HISTORY_DIR = path.join(__dirname, "../data/history");
const DATA_DIR = path.join(__dirname, "../src/data");

const COUNTRIES = ["in", "us", "uk", "ae", "sg", "ca", "au", "de", "jp", "kr", "hk", "sa"];
const CATEGORY_FILES = {
  health: "health-insurance.json",
  "term-life": "term-life-insurance.json",
  motor: "motor-insurance.json",
  travel: "travel-insurance.json",
};

if (!fs.existsSync(HISTORY_DIR)) {
  fs.mkdirSync(HISTORY_DIR, { recursive: true });
}

const today = new Date().toISOString().split("T")[0];
let snapshotsAdded = 0;
let productsProcessed = 0;

for (const cc of COUNTRIES) {
  for (const [cat, file] of Object.entries(CATEGORY_FILES)) {
    const filePath = path.join(DATA_DIR, cc, file);
    if (!fs.existsSync(filePath)) continue;

    try {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      if (!data.products) continue;

      for (const product of data.products) {
        productsProcessed++;

        const snapshot = {
          date: today,
          premiumMin: product.premiumRange?.illustrativeMin ?? null,
          premiumMax: product.premiumRange?.illustrativeMax ?? null,
          csr: product.claimSettlement?.ratio ?? null,
          sumInsuredMin: product.sumInsured?.min ?? null,
          sumInsuredMax: product.sumInsured?.max ?? null,
        };

        const historyFile = path.join(HISTORY_DIR, `${product.id}.json`);
        let history = [];

        if (fs.existsSync(historyFile)) {
          try {
            history = JSON.parse(fs.readFileSync(historyFile, "utf-8"));
          } catch {
            history = [];
          }
        }

        // Check if latest entry is from today
        const latest = history[history.length - 1];
        if (latest && latest.date === today) {
          continue; // Already snapshotted today
        }

        // Check if values actually changed
        if (
          latest &&
          latest.premiumMin === snapshot.premiumMin &&
          latest.premiumMax === snapshot.premiumMax &&
          latest.csr === snapshot.csr
        ) {
          continue; // No change
        }

        history.push(snapshot);
        fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
        snapshotsAdded++;
      }
    } catch (err) {
      console.warn(`  ⚠ Error reading ${filePath}: ${err.message}`);
    }
  }
}

console.log(`✓ Snapshot complete: ${snapshotsAdded} new entries from ${productsProcessed} products`);
