import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = 'https://tjjvobommzwfqhnjjrwj.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_3NFjjt282RrKGkECocxEbg_gvWRagDB';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
