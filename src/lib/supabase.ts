import { createClient } from '@supabase/supabase-js';

// Создаем клиент Supabase с переменными окружения
// В реальном проекте эти значения должны быть в .env файле
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);