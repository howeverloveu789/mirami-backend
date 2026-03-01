// utils/gpt.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function gpt(prompt) {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You write in a cold, engineering, EL6-style tone." },
      { role: "user", content: prompt }
    ],
    temperature: 0.2
  });

  return completion.choices[0].message.content;
}
