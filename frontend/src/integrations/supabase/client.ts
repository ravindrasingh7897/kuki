
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tadrxrmnbpkbweqogepn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhZHJ4cm1uYnBrYndlcW9nZXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MDcyMjksImV4cCI6MjA3MTk4MzIyOX0.snQmi9buemXHajql29DNfBD4GqqbID9KlJNunR3feEo";



export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});