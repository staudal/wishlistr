import { useState } from 'react';
import { cn, supabase } from '@/lib/utils';
import { useMediaQuery } from 'usehooks-ts';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { categories } from '@/data/data';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
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
					<Button size="sm" variant="default">
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
				<Button size="sm" variant="default">
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
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState('');
	const [value, setValue] = useState('');

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
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
				<Input onChange={e => setTitle(e.target.value)} type="text" id="title" placeholder="Christmas 2024" required />
			</div>
			<div className="grid gap-2">
				<Label htmlFor="username">Category</Label>
				<DataTableAddCategory value={value} setValue={setValue} title="Category" options={categories} />
			</div>
			<Button type="submit">Create wishlist</Button>
		</form>
	);
}
