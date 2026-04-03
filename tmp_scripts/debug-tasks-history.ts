import { tasksService } from '@/lib/services/tasks';
import { createClient } from "@supabase/supabase-js";
// import * as dotenv from "dotenv";

// dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
  const projectId = "78eb079c-b03a-4a25-9ec4-63308ce0e49f"; // Миракс
  console.log("Fetching tasks for project:", projectId);
  const tasks = await tasksService.getTasks(projectId);
  
  const task = tasks.find(t => t.id === "51d1415d-50d0-413e-b7dc-68f16a656fa7");
  if (task) {
    console.log("Task found:", task.title);
    console.log("History type:", typeof task.history);
    console.log("History length:", task.history?.length);
    console.log("First history item:", JSON.stringify(task.history?.[0], null, 2));
  } else {
    console.log("Task not found in the list");
  }
}

debug();
