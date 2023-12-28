import { z } from 'zod';

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const wishlistSchema = z.object({
	id: z.string(),
	created_at: z.date(),
	title: z.string(),
	category: z.string(),
	user_id: z.string(),
});

export type Wishlist = z.infer<typeof wishlistSchema>;
