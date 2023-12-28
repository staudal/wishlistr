import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DashboardRoute from './routes/Dashboard';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { wishlistSchema } from './data/schema';
import { supabase } from './lib/utils';
import { z } from 'zod';

function App() {
	const [session, setSession] = useState<Session | null>(null);
	const [wishlists, setWishlists] = useState<z.infer<typeof wishlistSchema>[]>([]);

	async function getWishlists(user_id: string) {
		const { data, error } = await supabase.from('wishlists').select('*').eq('user_id', user_id);
		if (error) console.log('Error fetching wishlists: ', error);
		if (data) {
			const wishlistsWithWishes: z.infer<typeof wishlistSchema>[] = [];
			for (const wishlist of data) {
				const { data: wishes } = await supabase.from('wishes').select('*').eq('wishlist_id', wishlist.id);
				if (wishes) {
					wishlistsWithWishes.push({ ...wishlist, wishes });
				}
			}
			setWishlists(wishlistsWithWishes);
		}
	}

	useEffect(() => {
		async function getSession() {
			const { data, error } = await supabase.auth.getSession();
			if (error) console.log('Error getting session: ', error);
			if (data.session) {
				setSession(data.session);
				getWishlists(data.session.user.id);
			}
		}

		getSession();

		const { data: authListener } = supabase.auth.onAuthStateChange(async (_, session) => {
			setSession(session);
		});

		return () => {
			authListener?.subscription.unsubscribe();
		};
	}, []);
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<DashboardRoute session={session} wishlists={wishlists} />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
