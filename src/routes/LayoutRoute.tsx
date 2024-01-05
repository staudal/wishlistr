import Navbar from '@/components/navbar';
import { Outlet } from 'react-router-dom';

export default function LayoutRoute() {
	return (
		<div className="mx-auto max-w-7xl p-4 md:p-8 space-y-8">
			<Navbar />
			<Outlet />
		</div>
	);
}
