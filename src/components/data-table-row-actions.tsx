import { DotsHorizontalIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/lib/utils';
import { toast } from 'sonner';
import { useStore } from '@/data/store';
import { CopyIcon, EditIcon, StarIcon, TrashIcon } from 'lucide-react';

interface DataTableRowActionsProps {
	id: string;
}

export function DataTableRowActions({ id }: DataTableRowActionsProps) {
	const { wishlists, setWishlists } = useStore();
	async function handleDelete() {
		const { error } = await supabase.from('wishlists').delete().eq('id', id);
		if (error) {
			toast.error('Error deleting wishlist');
		} else {
			toast.success('Wishlist deleted');
			const updatedWishlists = wishlists.filter(wishlist => wishlist.id !== id);
			setWishlists(updatedWishlists);
		}
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
					<DotsHorizontalIcon className="h-4 w-4" />
					<span className="sr-only">Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[160px]">
				<DropdownMenuItem>
					<EditIcon className="h-4 w-4 mr-2" />
					Edit
				</DropdownMenuItem>
				<DropdownMenuItem>
					<CopyIcon className="h-4 w-4 mr-2" />
					Make a copy
				</DropdownMenuItem>
				<DropdownMenuItem>
					<StarIcon className="h-4 w-4 mr-2" />
					Favorite
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleDelete}>
					<TrashIcon className="h-4 w-4 mr-2" />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
