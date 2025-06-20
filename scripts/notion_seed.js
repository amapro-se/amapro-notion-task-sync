import { Client } from "@notionhq/client";
import tasks from "../seed-tasks-week1.json" assert { type: "json" };
import "dotenv/config.js";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const db = process.env.NOTION_DATABASE_ID;

(async () => {
  for (const t of tasks) {
    await notion.pages.create({
      parent: { database_id: db },
      properties: {
        Name: { title: [{ text: { content: t["Name"] } }] },
        Role: { select: { name: t["Role"] } },
        Priority: { select: { name: t["Priority"] } },
        "Estimate(h)": { number: t["Estimate(h)"] },
        Due: { date: { start: t["Due"] } },
        Progress: { number: t["Progress"] },
        Milestone: { select: { name: t["Milestone"] } },
      },
    });
    console.log(`✅  ${t["Name"]}`);
  }
})();
