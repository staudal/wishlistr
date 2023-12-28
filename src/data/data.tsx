import { Cake, CandyCane, Church, MessageCircleHeart, GraduationCap, HelpCircle, Baby, Home } from 'lucide-react';

export const categories = [
	{
		value: 'christmas',
		label: 'Christmas',
		icon: CandyCane,
	},
	{
		value: 'birthday',
		label: 'Birthday',
		icon: Cake,
	},
	{
		value: 'wedding',
		label: 'Wedding',
		icon: Church,
	},
	{
		value: 'anniversary',
		label: 'Anniversary',
		icon: MessageCircleHeart,
	},
	{
		value: 'graduation',
		label: 'Graduation',
		icon: GraduationCap,
	},
	{
		value: 'baby-shower',
		label: 'Baby Shower',
		icon: Baby,
	},
	{
		value: 'housewarming',
		label: 'Housewarming',
		icon: Home,
	},
	{
		value: 'other',
		label: 'Other',
		icon: HelpCircle,
	},
];
