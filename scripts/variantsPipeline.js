/**
 * MIRAMI v3.7 — Variants Pipeline
 *
 * 一鍵流程：
 * 1. 手動觸發 → 自動生成新 variants
 * 2. 自動去重（高相似度去重）
 * 3. 自動寫回乾淨版本
 */

const fs = require("fs");
const path = require("path");

const { generateVariants } = require("../core/report/variantGenerator");
const { dedupeVariantsFile } = require("../core/report/variantDeduplicator");

async function runPipeline() {
  console.log("🚀 MIRAMI Variants Pipeline Started");

  const engines = ["A", "B", "C"];
  const sections = ["section_1", "section_2", "section_3", "section_4", "section_5"];

  for (const engine of engines) {
    console.log(`\n=== ENGINE ${engine} ===`);

    const filePath = path.join(
      __dirname,
      "../core/report/variants",
      `${engine}_variants.json`
    );

    const variantsJSON = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    for (const section of sections) {
      console.log(`→ Generating new variants for ${engine} / ${section}`);

      const newVariants = await generateVariants({
        engine,
        section,
        count: 20
      });

      console.log(`   + Generated ${newVariants.length} variants`);

      // append to existing list
      variantsJSON[section] = [...variantsJSON[section], ...newVariants];
    }

    // write before dedupe
    fs.writeFileSync(filePath, JSON.stringify(variantsJSON, null, 2), "utf-8");

    console.log(`→ Running dedupe for ENGINE ${engine}`);
    dedupeVariantsFile(engine);

    console.log(`✔ ENGINE ${engine} updated and cleaned`);
  }

  console.log("\n🎉 MIRAMI Variants Pipeline Completed");
}

runPipeline();