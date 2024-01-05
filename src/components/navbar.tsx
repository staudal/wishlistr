import { LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { useStore } from '@/data/store';
import { supabase } from '@/lib/utils';
import { UserNav } from './user-nav';

export default function Navbar() {
	const { session } = useStore();

	async function handleLogin() {
		await supabase.auth.signInWithOAuth({ provider: 'google' });
	}

	if (!session) {
		return (
			<div className="flex items-center justify-between space-y-2">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
					<p className="text-muted-foreground">Here's a list of your wishlists.</p>
				</div>
				<div className="flex items-center space-x-2">
					<Button onClick={handleLogin}>
						<LogIn className="mr-2 h-4 w-4" /> Login
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full flex-1 flex-col space-y-8 flex">
			<div className="flex items-center justify-between space-y-2">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
					<p className="text-muted-foreground">Here's a list of your wishlists.</p>
				</div>
				<div className="flex items-center space-x-2">
					<UserNav />
				</div>
			</div>
		</div>
	);
}
