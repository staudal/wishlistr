import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from '@/components/data-table-view-options';
import { useMediaQuery } from 'usehooks-ts';

import { categories } from '../data/data';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableAddButton } from './data-table-add-button';

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;
	const isDesktop = useMediaQuery('(min-width: 768px)');

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Filter wishlists..."
					value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
					onChange={event => table.getColumn('title')?.setFilterValue(event.target.value)}
					className="h-9 w-[150px] md:w-[250px] font-base"
				/>
				{isDesktop && table.getColumn('category') && (
					<DataTableFacetedFilter column={table.getColumn('category')} title="Category" options={categories} />
				)}
				{isDesktop && isFiltered && (
					<Button variant="ghost" onClick={() => table.resetColumnFilters()} size="default" className="sm:flex hidden px-2 lg:px-3">
						Reset
						<Cross2Icon className="ml-2 h-4 w-4" />
					</Button>
				)}
			</div>
			<div className="flex space-x-2">
				<DataTableAddButton />
				{isDesktop && <DataTableViewOptions table={table} />}
			</div>
		</div>
	);
}
