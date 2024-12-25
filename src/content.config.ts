// Import Utilities
import { defineCollection, z } from 'astro:content';

// Import Loaders
import { glob } from 'astro/loaders';
import { notionLoader, notionPageSchema } from 'notion-astro-loader';
import { transformedPropertySchema } from 'notion-astro-loader/schemas';

// Import Schema Definition
// import { blogSchema } from './schema';

// Define Collection
const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.{md,mdx}',
  }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
});

const notionBlogDatabase = defineCollection({
  loader: notionLoader({
    auth: import.meta.env.NOTION_TOKEN,
    database_id: import.meta.env.NOTION_DATABASE_ID,
    filter: {
      property: 'Status',
      status: {
        equals: 'Published',
      },
    },
    sorts: [
      {
        property: 'Published',
        direction: 'descending',
      },
    ],
  }),
  // schema: notionPageSchema({
  //   properties: z.object({
  //     Videos: transformedPropertySchema.title,
  //   }),
  // }),
});

export const collections = { blog, notionBlogDatabase };
