import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';

import { categories } from '../data/data';
import { Wishlist } from '../data/schema';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Wishlist>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
				onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
				className="ml-1"
			/>
		),
		cell: ({ row }) => (
			<Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label="Select row" className="ml-1" />
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
					<span className="max-w-[500px] truncate font-medium">{row.getValue('title')}</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'category',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
		cell: ({ row }) => {
			const category = categories.find(category => category.value === row.getValue('category'));

			if (!category) {
				return null;
			}

			return (
				<div className="flex w-[100px] items-center">
					{category.icon && <category.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
					<span>{category.label}</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			return (
				<div className="flex justify-end space-x-2">
					<DataTableRowActions id={row.original.id} />
				</div>
			);
		},
	},
];
