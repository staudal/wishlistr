import { useState } from 'react';
import { cn, supabase } from '@/lib/utils';
import { useMediaQuery } from 'usehooks-ts';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { categories } from '@/data/data';
import { toast } from 'sonner';
import { useStore } from '@/data/store';
import { DataTableAddCategory } from './data-table-add-category';

export function DataTableAddButton() {
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
						Add wishlist
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Create a new wishlist</DialogTitle>
						<DialogDescription>Fill in the form below to create a new wishlist.</DialogDescription>
					</DialogHeader>
					<ProfileForm onClose={onClose} />
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button size="default" variant="default">
					Add wishlist
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>Create a new wishlist</DrawerTitle>
					<DrawerDescription>Fill in the form below to create a new wishlist.</DrawerDescription>
				</DrawerHeader>
				<ProfileForm onClose={onClose} className="px-4" />
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

interface ProfileFormProps {
	className?: string;
	onClose: () => void;
}

function ProfileForm({ className, onClose }: ProfileFormProps) {
	const { session, wishlists, setWishlists } = useStore();
	const [title, setTitle] = useState('');
	const [value, setValue] = useState('');

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (title.trim().length === 0 || !title) {
			toast.error('Please enter a title');
			return;
		}

		// only allow letters, spaces, dashes and numbers
		const regex = /^[a-zA-Z0-9- ]*$/;
		if (!regex.test(title)) {
			toast.error('Your title can only contain letters, numbers, spaces and dashes');
			return;
		}

		if (!value) {
			toast.error('Please select a category');
			return;
		}

		const { data, error } = await supabase
			.from('wishlists')
			.insert([{ title, category: value, user_id: session?.user.id }])
			.select('*');
		if (error) {
			toast.error('Error creating wishlist');
		} else if (data) {
			toast.success('Wishlist created');
			onClose();
			setWishlists([...wishlists, data[0]]);
		} else {
			console.log('No data or error');
		}
	}

	return (
		<form className={cn('grid items-start gap-4', className)} onSubmit={handleSubmit}>
			<div className="grid gap-2">
				<Label htmlFor="title">Title</Label>
				<Input onChange={e => setTitle(e.target.value)} type="text" id="title" placeholder="Christmas 2024" />
			</div>
			<div className="grid gap-2">
				<Label htmlFor="username">Category</Label>
				<DataTableAddCategory value={value} setValue={setValue} title="Category" options={categories} />
			</div>
			<Button type="submit">Create wishlist</Button>
		</form>
	);
}
