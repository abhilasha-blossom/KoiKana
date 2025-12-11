import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseKey === 'PLACEHOLDER_KEY_PLEASE_UPDATE') {
    console.warn('Supabase URL or Key is missing. Database features will be disabled.');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');
