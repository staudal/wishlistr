import { useState } from 'react';
import { cn, supabase } from '@/lib/utils';
import { useMediaQuery } from 'usehooks-ts';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
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
import { BadgePlus, CheckIcon, PlusIcon } from 'lucide-react';
import { ReloadIcon } from '@radix-ui/react-icons';

interface Props {
	wishlist_id: string;
}

export function AddWishButton({ wishlist_id }: Props) {
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
						<PlusIcon className="mr-2 h-4 w-4" />
						Add wish
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Create a new wish</DialogTitle>
					</DialogHeader>
					<WishForm wishlist_id={wishlist_id} onClose={onClose} />
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button size="default" variant="default">
					<PlusIcon className="mr-2 h-4 w-4" />
					Add wish
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>Create a new wish</DrawerTitle>
				</DrawerHeader>
				<WishForm wishlist_id={wishlist_id} onClose={onClose} className="px-4" />
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
	wishlist_id: string;
}

function WishForm({ className, onClose, wishlist_id }: WishFormProps) {
	const { wishlists, setWishlists } = useStore();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [quantity, setQuantity] = useState('');
	const [price, setPrice] = useState('');
	const [link, setLink] = useState('');
	const [image, setImage] = useState('');
	const [isCreatingWish, setIsCreatingWish] = useState(false);

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

		setIsCreatingWish(true);

		const { data, error } = await supabase
			.from('wishes')
			.insert([
				{
					title,
					description,
					quantity,
					price,
					link_url: link,
					img_url: image,
					wishlist_id,
				},
			])
			.select('*');
		if (error) {
			toast.error('Error creating wishlist');
			setIsCreatingWish(false);
		} else if (data) {
			toast.success('Wishlist created');
			onClose();
			setIsCreatingWish(false);
			const updatedWishlists = wishlists.map(wishlist => {
				if (wishlist.id === wishlist_id) {
					return { ...wishlist, wishes: [...wishlist.wishes, data[0]] };
				}
				return wishlist;
			});
			setWishlists(updatedWishlists);
		} else {
			console.log('No data or error');
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
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="description">Description</Label>
				<Textarea
					onChange={e => setDescription(e.target.value)}
					id="description"
					placeholder="The second generation with the MagSafe charging case"
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
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="price">Price *</Label>
					<Input
						onChange={e => setPrice(e.target.value)}
						type="number"
						id="price"
						placeholder="279"
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
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="title">Image URL</Label>
				<Input
					onChange={e => setImage(e.target.value)}
					type="text"
					id="title"
					placeholder="https://www.apple.com/airpods-pro/image.png"
					className="col-span-3"
				/>
			</div>
			{isCreatingWish ? (
				<Button disabled>
					<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
					Please wait
				</Button>
			) : (
				<Button type="submit">
					<CheckIcon className="mr-2 h-4 w-4" />
					Create wish
				</Button>
			)}
		</form>
	);
}
