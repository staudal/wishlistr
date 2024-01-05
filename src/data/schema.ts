import { z } from 'zod';

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const wishlistSchema = z.object({
	id: z.string(),
	created_at: z.date(),
	title: z.string(),
	category: z.string(),
	user_id: z.string(),
	wishes: z.array(
		z.object({
			id: z.string(),
			title: z.string(),
			description: z.string(),
			price: z.number(),
			link_url: z.string(),
			img_url: z.string(),
			created_at: z.date(),
			quantity: z.number(),
		})
	),
});

export type Wishlist = z.infer<typeof wishlistSchema>;
