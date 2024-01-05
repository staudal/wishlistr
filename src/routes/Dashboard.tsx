import { columns } from '@/components/columns';
import { DataTable } from '@/components/data-table';
import { useStore } from '@/data/store';

export default function DashboardRoute() {
	const { session, wishlists } = useStore();

	if (!session) {
		return <p>You're not signed in.</p>;
	}

	return <DataTable data={wishlists} columns={columns} />;
}
