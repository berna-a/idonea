import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tjjvobommzwfqhnjjrwj.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_3NFjjt282RrKGkECocxEbg_gvWRagDB';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
