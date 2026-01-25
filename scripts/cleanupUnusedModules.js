/**
 * MIRAMI v3.7 — Cleanup Script
 *
 * Scans src/core/report/ for unused .js modules.
 * Flags any file not referenced by others.
 * Optional: pass --delete to auto-remove unused files.
 */

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.join(__dirname, "../src/core/report");
const DELETE_MODE = process.argv.includes("--delete");

function getAllJsFiles(dir) {
  const files = fs.readdirSync(dir);
  return files.flatMap(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      return getAllJsFiles(fullPath);
    } else if (file.endsWith(".js")) {
      return [fullPath];
    } else {
      return [];
    }
  });
}

function buildReferenceMap(allFiles) {
  const map = new Map();

  for (const file of allFiles) {
    const content = fs.readFileSync(file, "utf8");
    for (const target of allFiles) {
      const relPath = "./" + path.relative(path.dirname(file), target).replace(/\\/g, "/");
      if (relPath === "./index.js") continue;

      if (content.includes(`require("${relPath}")`) || content.includes(`require('${relPath}')`)) {
        const targetKey = path.resolve(target);
        if (!map.has(targetKey)) map.set(targetKey, new Set());
        map.get(targetKey).add(file);
      }
    }
  }

  return map;
}

function cleanupUnusedModules() {
  const allFiles = getAllJsFiles(ROOT_DIR);
  const referenceMap = buildReferenceMap(allFiles);

  const unused = allFiles.filter(file => !referenceMap.has(path.resolve(file)));

  if (unused.length === 0) {
    console.log("✅ No unused modules found.");
    return;
  }

  console.log("⚠️ Unused modules detected:");
  unused.forEach(file => console.log(" -", path.relative(ROOT_DIR, file)));

  if (DELETE_MODE) {
    console.log("\n🗑️ Deleting unused modules...");
    unused.forEach(file => {
      fs.unlinkSync(file);
      console.log("Deleted:", path.relative(ROOT_DIR, file));
    });
  } else {
    console.log("\nRun with --delete to remove them.");
  }
}

cleanupUnusedModules();