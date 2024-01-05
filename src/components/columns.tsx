import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';

import { categories } from '../data/data';
import { Wishlist } from '../data/schema';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

export const columns: ColumnDef<Wishlist>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
				className="ml-1"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={value => row.toggleSelected(!!value)}
				aria-label="Select row"
				className="ml-1"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'title',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
		cell: ({ row }) => {
			return (
				<div className="flex space-x-2">
					<span className="max-w-[500px] truncate font-medium">
						{row.getValue('title')}
					</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'category',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
		cell: ({ row }) => {
			const category = categories.find(
				category => category.value === row.getValue('category')
			);

			if (!category) {
				return null;
			}

			return (
				<div className="flex w-auto items-center">
					{category.icon && (
						<category.icon className="mr-2 h-4 w-4 text-muted-foreground" />
					)}
					<span>{category.label}</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		accessorKey: 'Created',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
		cell: ({ row }) => {
			return <span>{new Date(row.original.created_at).toLocaleDateString()}</span>;
		},
		sortingFn: (rowA, rowB) => {
			const dateA = new Date(rowA.original.created_at);
			const dateB = new Date(rowB.original.created_at);

			const result = dateA.getTime() - dateB.getTime();

			return result;
		},
	},
	{
		accessorKey: 'Count',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Count" />,
		cell: ({ row }) => {
			return <span>{row.original?.wishes?.length ?? 0} wishes</span>;
		},
		sortingFn: (rowA, rowB) => {
			const countA = rowA.original?.wishes?.length ?? 0;
			const countB = rowB.original?.wishes?.length ?? 0;

			const result = countA - countB;

			return result;
		},
	},
	{
		accessorKey: 'Average price',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Average price" />,
		cell: ({ row }) => {
			if (!row.original.wishes || row.original.wishes.length === 0) {
				return <span>0 kr.</span>;
			}

			const averagePrice =
				row.original.wishes.reduce(
					(sum, wish) => sum + (typeof wish.price === 'number' ? wish.price : 0),
					0
				) / row.original.wishes.length;

			return (
				<span>
					{new Intl.NumberFormat('da-DK', {
						style: 'currency',
						currency: 'DKK',
					}).format(averagePrice)}
				</span>
			);
		},
		sortingFn: (rowA, rowB) => {
			const averagePriceA =
				rowA.original.wishes && rowA.original.wishes.length
					? rowA.original.wishes.reduce(
							(sum, wish) => sum + (typeof wish.price === 'number' ? wish.price : 0),
							0
					  ) / rowA.original.wishes.length
					: 0;

			const averagePriceB =
				rowB.original.wishes && rowB.original.wishes.length
					? rowB.original.wishes.reduce(
							(sum, wish) => sum + (typeof wish.price === 'number' ? wish.price : 0),
							0
					  ) / rowB.original.wishes.length
					: 0;

			const result = averagePriceA - averagePriceB;

			return result;
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			return (
				<div className="flex justify-end space-x-2">
					<Link to={`/wishlist/${row.original.id}`}>
						<Button variant="default" size="default" className="flex px-3">
							View
						</Button>
					</Link>
					<DataTableRowActions id={row.original.id} />
				</div>
			);
		},
	},
];
