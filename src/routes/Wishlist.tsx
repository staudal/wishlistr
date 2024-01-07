import { useParams } from 'react-router-dom';
import { useStore } from '@/data/store';
import { CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { AddWishButton } from '@/components/add-wish-button';
import { Button } from '@/components/ui/button';
import { CheckIcon, EditIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/utils';
import { toast } from 'sonner';
import { EditWishButton } from '@/components/edit-wish-button';

export default function WishlistRoute() {
	const { wishlists, setWishlists } = useStore();
	const params = useParams();
	const { id } = params;
	const wishlist = wishlists.find(wishlist => wishlist.id === id);
	const [isEditMode, setIsEditMode] = useState(false);

	if (!wishlist) {
		return <p>Wishlist not found.</p>;
	}

	async function handleDeleteWish(id: string) {
		const { error } = await supabase.from('wishes').delete().match({ id });

		if (error) {
			toast.error(error.message);
			return;
		}

		const updatedWishlists = wishlists.map(wishlist => {
			// Find the wishlist that contains the wish
			const wishExistsInWishlist = wishlist.wishes.some(wish => wish.id === id);
			if (wishExistsInWishlist) {
				// Return a new object with the same properties as the original wishlist,
				// but with the wishes array filtered to exclude the deleted wish
				return {
					...wishlist,
					wishes: wishlist.wishes.filter(wish => wish.id !== id),
				};
			}

			// If the wish doesn't exist in the current wishlist, return the wishlist as is
			return wishlist;
		});

		setWishlists(updatedWishlists);
		toast.success('Wish deleted.');
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between gap-4">
				<AddWishButton wishlist_id={wishlist.id} />
				<Button variant="secondary" onClick={() => setIsEditMode(!isEditMode)}>
					{isEditMode ? (
						<CheckIcon className="w-4 h-4 mr-1" />
					) : (
						<EditIcon className="w-4 h-4 mr-1" />
					)}
					{isEditMode ? 'Done' : 'Modify'}
				</Button>
			</div>
			<div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
				{wishlist?.wishes.map(wish => (
					<div className="flex flex-col relative" key={wish.id}>
						{isEditMode && (
							<div>
								<div className="absolute top-0 left-0 p-2">
									<EditWishButton wish={wish} />
								</div>
								<div className="absolute top-0 right-0 p-2">
									<Button
										variant="destructive"
										onClick={() => handleDeleteWish(wish.id)}
									>
										<TrashIcon className="w-4 h-4 mr-1" />
										<span>Delete</span>
									</Button>
								</div>
							</div>
						)}
						<img src={wish.img_url} className="w-full h-64 object-cover rounded-t-md" />
						<div className="flex flex-col border-b border-r border-l rounded-b-md pt-6 flex-grow">
							<CardContent className="flex flex-col gap-2 flex-grow">
								<CardTitle className="line-clamp-1">{wish.title}</CardTitle>
								<CardDescription className="line-clamp-2">
									{wish.description}
								</CardDescription>
							</CardContent>
							<div className="border-t p-4 flex justify-between items-center text-muted-foreground text-sm">
								<span>{new URL(wish.link_url).hostname.replace('www.', '')}</span>
								<span>
									{new Intl.NumberFormat('da-DK', {
										style: 'currency',
										currency: 'DKK',
									}).format(wish.price)}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
