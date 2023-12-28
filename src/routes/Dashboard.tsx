import { z } from 'zod';

import { columns } from '@/components/columns';
import { DataTable } from '@/components/data-table';
import { UserNav } from '@/components/user-nav';
import { wishlistSchema } from '@/data/schema';
import { supabase } from '@/lib/utils';
import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

interface Props {
	session: Session | null;
	wishlists: z.infer<typeof wishlistSchema>[];
}

export default function DashboardRoute({ session, wishlists }: Props) {
	async function handleLogin() {
		await supabase.auth.signInWithOAuth({ provider: 'google' });
	}

	if (!session) {
		return (
			<div className="container my-8">
				<div className="flex items-center justify-between space-y-2">
					<div>
						<h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
						<p className="text-muted-foreground">Here&apos;s a list of your tasks for this month!</p>
					</div>
					<div className="flex items-center space-x-2">
						{!session && (
							<Button onClick={handleLogin}>
								<LogIn className="mr-2 h-4 w-4" /> Login
							</Button>
						)}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container my-8">
			<div className="h-full flex-1 flex-col space-y-8 flex">
				<div className="flex items-center justify-between space-y-2">
					<div>
						<h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
						<p className="text-muted-foreground">Here&apos;s a list of your tasks for this month!</p>
					</div>
					<div className="flex items-center space-x-2">
						<UserNav session={session} />
					</div>
				</div>
				<DataTable data={wishlists} columns={columns} />
			</div>
		</div>
	);
}
