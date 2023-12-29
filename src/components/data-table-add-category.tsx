import * as React from 'react';
import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

interface DataTableFacetedFilterProps {
	title?: string;
	options: {
		label: string;
		value: string;
		icon?: React.ComponentType<{ className?: string }>;
	}[];
	value: string;
	setValue: (value: string) => void;
}

export function DataTableAddCategory({ title, options, value, setValue }: DataTableFacetedFilterProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="h-8 border-dashed">
					<PlusCircledIcon className="mr-2 h-4 w-4" />
					{title}
					{value && (
						<>
							<Separator orientation="vertical" className="mx-2 h-4" />
							<Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
								{value}
							</Badge>
							<div className="hidden space-x-1 lg:flex">
								<Badge variant="secondary" className="rounded-sm px-1 font-normal">
									{value}
								</Badge>
							</div>
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="md:w-[375px] w-[calc(100vw-32px)] p-0" align="start">
				<Command>
					<CommandInput placeholder={title} />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							{options.map(option => {
								const isSelected = value === option.value;
								return (
									<CommandItem
										key={option.value}
										onSelect={() => {
											if (isSelected) {
												setValue('');
											} else {
												setValue(option.value);
											}
											setOpen(false);
										}}
									>
										<div
											className={cn(
												'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
												isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
											)}
										>
											<CheckIcon className={cn('h-4 w-4')} />
										</div>
										{option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
										<span>{option.label}</span>
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
