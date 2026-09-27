import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// World-space position/size of a node on the canvas. See docs/ARCHITECTURE.md#coordinates.
const point = { x: z.number(), y: z.number() };
const box = { ...point, w: z.number().positive().optional(), h: z.number().positive().optional() };

const posts = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		tags: z.array(z.string()).default([]),
		draft: z.boolean().default(false),
		canvas: z.object(box),
	}),
});

const nodes = defineCollection({
	loader: file('src/content/nodes.yaml'),
	schema: z.discriminatedUnion('type', [
		z.object({
			type: z.literal('media'),
			title: z.string(),
			kind: z.enum(['image', 'video']),
			src: z.string(),
			alt: z.string(),
			...box,
		}),
		z.object({
			type: z.literal('embed'),
			title: z.string(),
			url: z.url(),
			...box,
		}),
		z.object({
			type: z.literal('link'),
			title: z.string(),
			url: z.url(),
			description: z.string().optional(),
			...box,
		}),
	]),
});

export const collections = { posts, nodes };
