import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sign in anonymously for demo mode (persists across refreshes)
export async function ensureAnonymousSession() {
  // Check if we already have a session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    console.log('Using existing session');
    return session;
  }
  
  // No session, sign in anonymously
  console.log('Creating new anonymous session');
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) {
    console.error('Anonymous sign-in error:', error);
    throw error;
  }
  return data.session;
}

