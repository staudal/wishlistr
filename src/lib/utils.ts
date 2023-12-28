import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createClient } from '@supabase/supabase-js';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
