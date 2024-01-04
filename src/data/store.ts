import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { z } from 'zod';
import { wishlistSchema } from './schema';

type Store = {
	session: Session | null;
	setSession: (session: Session | null) => void;
	wishlists: z.infer<typeof wishlistSchema>[];
	setWishlists: (wishlists: z.infer<typeof wishlistSchema>[]) => void;
	loading: boolean;
	setLoading: (loading: boolean) => void;
};

export const useStore = create<Store>(set => ({
	session: null,
	setSession: session => set({ session }),
	wishlists: [],
	setWishlists: wishlists => set({ wishlists }),
	loading: false,
	setLoading: loading => set({ loading }),
}));
