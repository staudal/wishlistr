import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DashboardRoute from './routes/Dashboard';
import { useEffect } from 'react';
import { wishlistSchema } from './data/schema';
import { supabase } from './lib/utils';
import { z } from 'zod';
import { Toaster } from '@/components/ui/sonner';
import { useStore } from './data/store';

function App() {
	const { setSession, setWishlists, setLoading } = useStore();

	async function getWishlists(user_id: string) {
		setLoading(true);
		const { data, error } = await supabase.from('wishlists').select('*').eq('user_id', user_id);
		if (error) {
			console.log('Error getting wishlists: ', error);
			setLoading(false);
			return;
		}
		if (data) {
			const wishlistsWithWishes: z.infer<typeof wishlistSchema>[] = [];
			for (const wishlist of data) {
				const { data: wishes } = await supabase.from('wishes').select('*').eq('wishlist_id', wishlist.id);
				if (wishes) {
					wishlistsWithWishes.push({ ...wishlist, wishes });
				}
			}
			setWishlists(wishlistsWithWishes);
			setLoading(false);
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
				<Route path="/" element={<DashboardRoute />} />
			</Routes>
			<Toaster position="top-center" />
		</BrowserRouter>
	);
}

export default App;
