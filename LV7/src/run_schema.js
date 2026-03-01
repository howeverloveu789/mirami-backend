import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load root .env
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

import fs from "fs";
import fetch from "node-fetch";

async function runSchema() {
  const specPath = path.join(__dirname, "..", "ai_specs", "schema_module.txt");
  const answersPath = path.join(__dirname, "..", "data", "answers.json");
  const outputPath = path.join(__dirname, "..", "data", "os.json");

  const spec = fs.readFileSync(specPath, "utf8");
  const answers = fs.readFileSync(answersPath, "utf8");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: spec },
        { role: "user", content: answers }
      ]
    })
  });

  const data = await res.json();

  if (!data.choices) {
    console.log("❌ OpenAI API Error:");
    console.log(data);
    return;
  }

  fs.writeFileSync(outputPath, data.choices[0].message.content);
  console.log("✔ Generated OS JSON:", outputPath);
}

runSchema();
