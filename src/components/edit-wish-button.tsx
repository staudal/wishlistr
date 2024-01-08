import { useState } from 'react';
import { cn, supabase } from '@/lib/utils';
import { useMediaQuery } from 'usehooks-ts';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useStore } from '@/data/store';
import { Textarea } from './ui/textarea';
import { BadgeCheck, Check, EditIcon } from 'lucide-react';
import { Wish } from '@/data/schema';
import { ReloadIcon } from '@radix-ui/react-icons';

interface Props {
	wish: Wish;
}

export function EditWishButton({ wish }: Props) {
	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery('(min-width: 768px)');

	function onClose() {
		setOpen(false);
	}

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button size="default" variant="default">
						<EditIcon className="mr-2 h-4 w-4" />
						Edit
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Edit wish: {wish.title}</DialogTitle>
					</DialogHeader>
					<WishForm wish={wish} onClose={onClose} />
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button size="default" variant="default">
					<EditIcon className="mr-2 h-4 w-4" />
					Edit
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>Edit wish: {wish.title}</DrawerTitle>
				</DrawerHeader>
				<WishForm wish={wish} onClose={onClose} className="px-4" />
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

interface WishFormProps {
	className?: string;
	onClose: () => void;
	wish: Wish;
}

function WishForm({ className, onClose, wish }: WishFormProps) {
	const { wishlists, setWishlists } = useStore();
	const [title, setTitle] = useState(wish.title);
	const [description, setDescription] = useState(wish.description);
	const [quantity, setQuantity] = useState(wish.quantity.toString());
	const [price, setPrice] = useState(wish.price.toString());
	const [link, setLink] = useState(wish.link_url);
	const [image, setImage] = useState(wish.img_url);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!title || !quantity || !price || !link) {
			toast.error('Please fill in all required fields');
			return;
		}

		if (isNaN(Number(quantity)) || isNaN(Number(price))) {
			toast.error('Quantity and price must be numbers');
			return;
		}

		if (Number(quantity) < 1 || Number(price) < 1) {
			toast.error('Quantity and price must be greater than 0');
			return;
		}

		if (Number(price) > 1000000) {
			toast.error('Price must be less than $1,000,000');
			return;
		}

		if (link && !link.startsWith('http')) {
			toast.error('Link must start with http:// or https://');
			return;
		}

		if (image && !image.startsWith('http')) {
			toast.error('Image must start with http:// or https://');
			return;
		}

		const imageUrl = new URL(image);
		const pathname = imageUrl.pathname.toLowerCase();

		if (
			pathname &&
			!pathname.endsWith('.png') &&
			!pathname.endsWith('.jpg') &&
			!pathname.endsWith('.jpeg')
		) {
			toast.error('Image must be a PNG, JPG or JPEG');
			return;
		}

		if (description.length > 1000) {
			toast.error('Description must be less than 1000 characters');
			return;
		}

		if (title.length > 100) {
			toast.error('Title must be less than 100 characters');
			return;
		}

		if (link.length > 500) {
			toast.error('Link must be less than 500 characters');
			return;
		}

		if (image.length > 500) {
			toast.error('Image must be less than 500 characters');
			return;
		}

		if (quantity.length > 10) {
			toast.error('Quantity must be less than 10 characters');
			return;
		}

		if (price.length > 10) {
			toast.error('Price must be less than 10 characters');
			return;
		}

		if (description.trim().length === 0) {
			setDescription('');
		}

		if (link.trim().length === 0) {
			setLink('');
		}

		if (image.trim().length === 0) {
			setImage('');
		}

		setIsSubmitting(true);

		const updatedWish = {
			title,
			description,
			quantity: Number(quantity),
			price: Number(price),
			link_url: link,
			img_url: image,
			wishlist_id: wish.wishlist_id,
		};

		const { error } = await supabase.from('wishes').update(updatedWish).eq('id', wish.id);

		if (error) {
			console.error('Error updating wish:', error);
			toast.error('Failed to update wish');
			setIsSubmitting(false);
		} else {
			// Update the local state to reflect the changes
			const updatedWishlists = wishlists.map(wishlist => {
				if (wishlist.id === wish.wishlist_id) {
					return {
						...wishlist,
						wishes: wishlist.wishes.map(w =>
							w.id === wish.id ? { ...w, ...updatedWish } : w
						),
					};
				} else {
					return wishlist;
				}
			});
			setWishlists(updatedWishlists);
			toast.success('Wish updated successfully');
			onClose();
			setIsSubmitting(false);
		}
	}

	return (
		<form className={cn('grid items-start gap-4', className)} onSubmit={handleSubmit}>
			<div className="grid gap-2">
				<Label htmlFor="title">Title *</Label>
				<Input
					onChange={e => setTitle(e.target.value)}
					type="text"
					id="title"
					placeholder="AirPods Pro"
					defaultValue={wish.title}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="description">Description</Label>
				<Textarea
					onChange={e => setDescription(e.target.value)}
					id="description"
					placeholder="The second generation with the MagSafe charging case"
					defaultValue={wish.description}
				/>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<div className="grid gap-2">
					<Label htmlFor="quantity">Quantity *</Label>
					<Input
						onChange={e => setQuantity(e.target.value)}
						type="number"
						id="quantity"
						placeholder="4"
						defaultValue={wish.quantity}
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="price">Price *</Label>
					<Input
						onChange={e => setPrice(e.target.value)}
						type="number"
						id="price"
						placeholder="279"
						defaultValue={wish.price}
					/>
				</div>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="title">Link URL *</Label>
				<Input
					onChange={e => setLink(e.target.value)}
					type="text"
					id="title"
					placeholder="https://www.apple.com/airpods-pro/"
					defaultValue={wish.link_url}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="title">Image URL</Label>
				<Input
					onChange={e => setImage(e.target.value)}
					type="text"
					id="title"
					placeholder="https://www.apple.com/airpods-pro/image.png"
					defaultValue={wish.img_url}
				/>
			</div>
			{isSubmitting ? (
				<Button type="submit" disabled>
					<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
					Please wait
				</Button>
			) : (
				<Button type="submit">
					<Check className="mr-2 h-4 w-4" />
					Update wish
				</Button>
			)}
		</form>
	);
}
