import { createClient } from '@supabase/supabase-js';

// Ortam değişkenlerini (Vite ortamından) alıyoruz
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Supabase client oluşturuluyor
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
