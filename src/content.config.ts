import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),

      canonical: z.url().optional(),

      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),

      description: z.string().optional(),

      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),

      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();

const postCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/post' }),
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    slug: z.string().optional(),
    videoUrl: z.string().optional(),
    excerpt: z.string().optional(),
    image: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),

    metadata: metadataDefinition(),
  }),
});

const eventCollection = defineCollection({
  loader: glob({ pattern: ['**/*.md', '**/*.mdx'], base: 'src/data/events' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    videoUrl: z.string().optional(),
    date: z.date().optional(),
    image: z.string().optional(),
    coverImage: z.string().optional(),

    metadata: metadataDefinition(),
  }),
});

const wingCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/wings' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    videoUrl: z.string().optional(),
    metadata: metadataDefinition(),
  }),
});

const legalCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/legal' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    videoUrl: z.string().optional(),
    metadata: metadataDefinition(),
  }),
});

export const collections = {
  post: postCollection,
  event: eventCollection,
  wing: wingCollection,
  legal: legalCollection,
};
