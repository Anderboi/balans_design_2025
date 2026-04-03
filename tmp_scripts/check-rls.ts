import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// We simulate a user session. Let's get tasks directly using the API.
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const projectId = "78eb079c-b03a-4a25-9ec4-63308ce0e49f"; // Миракс
  const taskId = "51d1415d-50d0-413e-b7dc-68f16a656fa7";
  
  // 1. Fetch using normal client (no auth, anonymous) - wait, if anon, RLS blocks.
  // We can try to authenticate using email/password, but we don't have it easily.
  // Let's use service_role key to see if the query itself is syntactically correct.
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    console.log("No SUPABASE_SERVICE_ROLE_KEY found");
    return;
  }
  const adminClient = createClient(supabaseUrl, serviceKey);
  
  console.log("Fetching task with ID:", taskId, "using service role...");
  const { data, error } = await adminClient
    .from("tasks")
    .select(`
      *,
      history:task_history(*, user:profiles(full_name))
    `)
    .eq("id", taskId)
    .single();

  if (error) {
    console.error("Error fetching task:", error.message);
  } else {
    console.log("Task fetched. History length:", data.history?.length);
    console.log("First history item:", JSON.stringify(data.history?.[0], null, 2));
    
    // Also check project_members to see if anyone is a member.
    const { data: pmData } = await adminClient.from("project_members").select("*").eq("project_id", projectId);
    console.log("Project members:", pmData);
    
    // Let's check project_participants maybe?
    const { data: tables } = await adminClient.from("information_schema.tables").select("table_name").eq("table_schema", "public");
    console.log("Tables available:", JSON.stringify(tables?.map(t => t.table_name)));
  }
}

check();
