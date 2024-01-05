import { useParams } from 'react-router-dom';
import { useStore } from '@/data/store';
import { CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { AddWishButton } from '@/components/add-wish-button';

export default function WishlistRoute() {
	const { wishlists } = useStore();
	const params = useParams();
	const { id } = params;
	const wishlist = wishlists.find(wishlist => wishlist.id === id);

	if (!wishlist) {
		return <p>Wishlist not found.</p>;
	}

	const averagePrice = wishlist.wishes.length
		? wishlist.wishes.reduce((sum, wish) => sum + wish.price, 0) / wishlist.wishes.length
		: 0;

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between gap-4">
				<div className="flex-grow h-9 items-center grid grid-cols-3 rounded-md border divide-x">
					<p className="px-4 text-muted-foreground text-sm text-center">
						<span className="font-bold">Title: </span>
						{wishlist.title}
					</p>
					<p className="px-4 text-muted-foreground text-sm text-center">
						<span className="font-bold">Count: </span>
						{wishlist.wishes.length} wishes
					</p>
					<p className="px-4 text-muted-foreground text-sm text-center">
						<span className="font-bold">Average price: </span>
						{new Intl.NumberFormat('da-DK', {
							style: 'currency',
							currency: 'DKK',
						}).format(averagePrice)}
					</p>
				</div>
				<AddWishButton wishlist_id={wishlist.id} />
			</div>
			<div className="grid grid-cols-3 gap-4">
				{wishlist?.wishes.map(wish => (
					<div className="flex flex-col" key={wish.id}>
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
