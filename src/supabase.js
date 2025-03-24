import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oinghqizkkkxehtgvwfs.supabase.co';
// Replace with your environment variable handling tool, e.g., Vite
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // For Vite, use import.meta.env
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
