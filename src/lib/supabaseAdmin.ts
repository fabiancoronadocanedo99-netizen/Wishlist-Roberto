import { createClient } from '@supabase/supabase-js';

// Service Role Client (Bypasses RLS) ONLY to be used within secured server environments (Webhooks).
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);
