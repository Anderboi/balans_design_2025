"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // Type-casting here for convenience
  // In a production application, you should validate the email and password!
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/login?error=Could not authenticate user");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // Get the origin for the redirect
  // We need to dynamically get the URL because it might be localhost or a deployment
  // In server actions, we can't easily get the request object, but we can assume a default or use an env var if needed.
  // However, for now, let's try to rely on Supabase's default behavior or hardcode localhost for dev if needed,
  // but better is to use the site URL from config if available.
  // Actually, a better way in Next.js Server Actions is to use `headers()` to get the host.

  const { headers } = await import("next/headers");
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const {
    error,
    data: { session },
  } = await supabase.auth.signUp({
    ...data,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Signup error:", error);
    return redirect("/login?error=" + error.message);
  }

  if (!session) {
    // Email verification required
    return redirect(
      "/login?message=Check your email to continue sign in process"
    );
  }

  revalidatePath("/", "layout");
  redirect("/");
}
