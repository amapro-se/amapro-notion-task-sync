import { Client } from "@notionhq/client";
import "dotenv/config.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tasks = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../seed-tasks-week2.json"), "utf-8")
);

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const db = process.env.NOTION_DATABASE_ID;

// ── Get real DB property keys for debugging ──
(async () => {
  const meta = await notion.databases.retrieve({ database_id: db });
  console.log("📝 실제 DB Keys (key ➜ name, type) :");
  Object.entries(meta.properties).forEach(([k, v]) =>
    console.log(`${k} ➜ ${v.name} (${v.type})`)
  );
})();

async function seedTasks() {
  for (const t of tasks) {
    await notion.pages.create({
      parent: { database_id: db },
      properties: {
        할일:          { title: [{ text: { content: t["Name"] } }] },
        역할:          { select: { name: t["Role"] } },
        우선순위:      { select: { name: t["Priority"] } },
        "예상 시간(h)": { number: t["Estimate(h)"] },
        "예상 완료일":  { date: { start: t["Due"] } },
        "진행 상태":    { number: t["Progress"] },
        마일스톤:      { select: { name: t["Milestone"] } }
      },
    });
    console.log(`✅  ${t["Name"]}`);
  }
}

seedTasks();
