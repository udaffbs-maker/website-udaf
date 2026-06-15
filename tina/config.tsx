import { defineConfig } from 'tinacms';

export default defineConfig({
  branch: process.env.GITHUB_BRANCH || process.env.GITHUB_REF_NAME || process.env.VERCEL_GIT_COMMIT_REF || 'master',

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || '',
  // Get this from tina.io
  token: process.env.TINA_TOKEN || '',

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  // Enable local mode only in development (tinacms dev command)
  contentApiUrlOverride: process.env.TINA_MODE === 'local' ? 'http://localhost:4001/graphql' : undefined,
  media: {
    loadCustomStore: async () => {
      const pack = await import('next-tinacms-cloudinary');
      
      const isLocal = typeof window === 'undefined' || 
                      window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
      
      if (isLocal) {
        return pack.TinaCloudCloudinaryMediaStore;
      } else {
        // Automatically default to Netlify endpoint if running on GitHub Pages
        const isGithubPages = typeof window !== 'undefined' && 
          (window.location.hostname.endsWith('github.io') || window.location.hostname === 'theudaf.com');
        
        const defaultBaseUrl = isGithubPages 
          ? 'https://udaf-du.netlify.app/.netlify/functions/cloudinary' 
          : '/api/cloudinary/media';

        const vercelUrl = process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL || defaultBaseUrl;
        return pack.createTinaCloudCloudinaryMediaStore({
          baseUrl: vercelUrl,
        });
      }
    },
  },
  // See docs on content modeling for more info on how to setup new collections: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: 'navigation',
        label: 'Navigation',
        path: 'src/data',
        format: 'yaml',
        match: {
          include: 'navigation*',
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: 'object',
            name: 'header',
            label: 'Header',
            fields: [
              {
                type: 'object',
                list: true,
                name: 'links',
                label: 'Links',
                ui: {
                  itemProps: (item) => ({ label: item?.text }),
                },
                fields: [
                  { type: 'string', name: 'text', label: 'Text' },
                  { type: 'string', name: 'href', label: 'Link (URL)' },
                  {
                    type: 'object',
                    list: true,
                    name: 'links',
                    label: 'Sub-links',
                    ui: {
                      itemProps: (item) => ({ label: item?.text }),
                    },
                    fields: [
                      { type: 'string', name: 'text', label: 'Text' },
                      { type: 'string', name: 'href', label: 'Link (URL)' },
                      {
                        type: 'object',
                        list: true,
                        name: 'links',
                        label: 'Sub-sub-links',
                        ui: {
                          itemProps: (item) => ({ label: item?.text }),
                        },
                        fields: [
                          { type: 'string', name: 'text', label: 'Text' },
                          { type: 'string', name: 'href', label: 'Link (URL)' },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'object',
                list: true,
                name: 'actions',
                label: 'Header Actions (Buttons)',
                ui: {
                  itemProps: (item) => ({ label: item?.text }),
                },
                fields: [
                  { type: 'string', name: 'text', label: 'Text' },
                  { type: 'string', name: 'href', label: 'Link' },
                  {
                    type: 'string',
                    name: 'variant',
                    label: 'Variant',
                    options: [
                      { label: 'Primary', value: 'primary' },
                      { label: 'Secondary', value: 'secondary' },
                      { label: 'Tertiary', value: 'tertiary' },
                      { label: 'Danger', value: 'danger' },
                      { label: 'Flashy (Event Promo)', value: 'flashy' },
                      { label: 'Link (Text only)', value: 'link' },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'footer',
            label: 'Footer',
            fields: [
              {
                type: 'object',
                list: true,
                name: 'links',
                label: 'Link Sections',
                ui: {
                  itemProps: (item) => ({ label: item?.title }),
                },
                fields: [
                  { type: 'string', name: 'title', label: 'Title' },
                  {
                    type: 'object',
                    list: true,
                    name: 'links',
                    label: 'Links',
                    ui: {
                      itemProps: (item) => ({ label: item?.text }),
                    },
                    fields: [
                      { type: 'string', name: 'text', label: 'Text' },
                      { type: 'string', name: 'href', label: 'Link (URL)' },
                    ],
                  },
                ],
              },
              {
                type: 'object',
                list: true,
                name: 'secondaryLinks',
                label: 'Secondary Links (e.g. Terms)',
                ui: {
                  itemProps: (item) => ({ label: item?.text }),
                },
                fields: [
                  { type: 'string', name: 'text', label: 'Text' },
                  { type: 'string', name: 'href', label: 'Link (URL)' },
                ],
              },
              { type: 'string', name: 'footNote', label: 'Footnote Text' },
            ],
          },
        ],
      },
      {
        name: 'pages',
        label: 'Pages',
        path: 'src/data/pages',
        format: 'yaml',
        match: {
          include: '*',
        },
        fields: [
          {
            type: 'object',
            name: 'metadata',
            label: 'Metadata',
            fields: [{ type: 'string', name: 'title', label: 'Title' }],
          },
          {
            type: 'object',
            name: 'hero',
            label: 'Hero',
            fields: [
              { type: 'string', name: 'title1', label: 'Title Line 1' },
              { type: 'string', name: 'title2', label: 'Title Line 2 (Highlighted)' },
              { type: 'string', name: 'subtitle', label: 'Subtitle', ui: { component: 'textarea' } },
              {
                type: 'object',
                list: true,
                name: 'images',
                label: 'Hero Images',
                ui: {
                  itemProps: (item) => ({ label: item?.alt || 'Hero Image' }),
                },
                fields: [
                  { type: 'image', name: 'src', label: 'Source' },
                  { type: 'string', name: 'alt', label: 'Alt Text' },
                ],
              },
              {
                type: 'object',
                list: true,
                name: 'actions',
                label: 'Actions (Buttons)',
                ui: {
                  itemProps: (item) => ({ label: item?.text }),
                },
                fields: [
                  { type: 'string', name: 'text', label: 'Text' },
                  { type: 'string', name: 'href', label: 'Link' },
                  { type: 'string', name: 'variant', label: 'Variant' },
                  { type: 'string', name: 'icon', label: 'Icon' },
                ],
              },
            ],
          },
          {
            type: 'object',
            list: true,
            name: 'stats',
            label: 'Stats',
            fields: [
              { type: 'string', name: 'title', label: 'Title' },
              { type: 'string', name: 'amount', label: 'Amount' },
              { type: 'string', name: 'icon', label: 'Icon' },
            ],
          },
          {
            type: 'object',
            name: 'facultyMessages',
            label: 'Faculty Messages Section',
            fields: [
              { type: 'string', name: 'title', label: 'Section Title' },
              {
                type: 'object',
                list: true,
                name: 'messages',
                label: 'Teacher Messages',
                ui: {
                  itemProps: (item) => ({ label: item?.name || 'Teacher Message' }),
                },
                fields: [
                  { type: 'string', name: 'name', label: 'Teacher Name' },
                  { type: 'string', name: 'role', label: 'Role (e.g. Chairman)' },
                  { type: 'string', name: 'department', label: 'Department' },
                  { type: 'image', name: 'image', label: 'Teacher Photo' },
                  { type: 'string', name: 'message', label: 'Message Content', ui: { component: 'textarea' } },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'features',
            label: 'Features',
            fields: [
              { type: 'string', name: 'tagline', label: 'Tagline' },
              { type: 'string', name: 'title', label: 'Title' },
              { type: 'string', name: 'subtitle', label: 'Subtitle' },
              {
                type: 'object',
                list: true,
                name: 'items',
                label: 'Items',
                fields: [
                  { type: 'string', name: 'title', label: 'Title' },
                  { type: 'string', name: 'description', label: 'Description' },
                  { type: 'string', name: 'icon', label: 'Icon' },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'about',
            label: 'About Us Section',
            fields: [
              { type: 'string', name: 'tagline', label: 'Tagline' },
              { type: 'string', name: 'title', label: 'Title' },
              { type: 'string', name: 'subtitle', label: 'Subtitle' },
              { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
              {
                type: 'object',
                name: 'image',
                label: 'About Image',
                fields: [
                  { type: 'image', name: 'src', label: 'Source' },
                  { type: 'string', name: 'alt', label: 'Alt Text' },
                ],
              },
              {
                type: 'object',
                list: true,
                name: 'items',
                label: 'Items',
                fields: [
                  { type: 'string', name: 'title', label: 'Title' },
                  { type: 'string', name: 'description', label: 'Description' },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'cta',
            label: 'Call To Action',
            fields: [
              { type: 'string', name: 'title', label: 'Title' },
              { type: 'string', name: 'subtitle', label: 'Subtitle' },
              {
                type: 'object',
                list: true,
                name: 'actions',
                label: 'Actions (Buttons)',
                ui: {
                  itemProps: (item) => ({ label: item?.text }),
                },
                fields: [
                  { type: 'string', name: 'text', label: 'Text' },
                  { type: 'string', name: 'href', label: 'Link' },
                  {
                    type: 'string',
                    name: 'variant',
                    label: 'Variant',
                    options: [
                      { label: 'Primary', value: 'primary' },
                      { label: 'Secondary', value: 'secondary' },
                      { label: 'Tertiary', value: 'tertiary' },
                      { label: 'Danger', value: 'danger' },
                      { label: 'Flashy (Event Promo)', value: 'flashy' },
                      { label: 'Link (Text only)', value: 'link' },
                    ],
                  },
                  { type: 'string', name: 'icon', label: 'Icon' },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'post',
        label: 'Posts',
        path: 'src/data/post',
        format: 'md',
        match: {
          include: '*',
        },
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return (values?.slug || values?.title || 'untitled')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            },
          },
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'videoUrl',
            label: 'YouTube Video URL',
            description: 'Embeds a video at the top of the post',
          },
          {
            type: 'string',
            name: 'slug',
            label: 'URL Slug',
            description: "The page URL path. Example: 'my-post' → theudaf.com/my-post. Leave empty to use filename.",
          },
          {
            type: 'datetime',
            name: 'publishDate',
            label: 'Publish Date',
          },
          {
            type: 'image',
            name: 'image',
            label: 'Image',
          },
          {
            type: 'string',
            name: 'category',
            label: 'Category',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
            templates: [
              {
                name: 'Button',
                label: 'Button',
                fields: [
                  { name: 'text', label: 'Text', type: 'string', required: true },
                  { name: 'href', label: 'Link', type: 'string', required: true },
                  {
                    name: 'variant',
                    label: 'Style',
                    type: 'string',
                    options: [
                      { value: 'primary', label: 'Primary (Filled)' },
                      { value: 'secondary', label: 'Secondary (Outline)' },
                      { value: 'tertiary', label: 'Tertiary (Ghost)' },
                      { value: 'flashy', label: 'Flashy (Animated Gradient)' },
                      { value: 'link', label: 'Link (Text only)' },
                    ],
                  },
                ],
              },
              {
                name: 'Carousel',
                label: 'Image Carousel',
                fields: [
                  { name: 'image1', label: 'Image 1', type: 'image', required: true },
                  { name: 'image2', label: 'Image 2', type: 'image' },
                  { name: 'image3', label: 'Image 3', type: 'image' },
                  { name: 'image4', label: 'Image 4', type: 'image' },
                  { name: 'image5', label: 'Image 5', type: 'image' },
                  { name: 'image6', label: 'Image 6', type: 'image' },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'wing',
        label: 'Wings',
        path: 'src/data/wings',
        format: 'md',
        match: {
          include: '*',
        },
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return (values?.slug || values?.title || 'untitled')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            },
          },
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'videoUrl',
            label: 'YouTube Video URL',
            description: 'Embeds a video at the top of the page',
          },
          {
            type: 'string',
            name: 'slug',
            label: 'URL Slug',
            description:
              "The page URL path. Example: 'my-wing' → theudaf.com/wings/my-wing. Leave empty to use filename.",
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },
      {
        name: 'event',
        label: 'Events',
        path: 'src/data/events',
        format: 'mdx',
        match: {
          include: '**/*',
        },
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return (values?.slug || values?.title || 'untitled')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            },
          },
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'videoUrl',
            label: 'YouTube Video URL',
            description: 'Embeds a video at the top of the event page',
          },
          {
            type: 'string',
            name: 'slug',
            label: 'URL Slug',
            description:
              "The page URL path. Example: 'iftar-2025' → theudaf.com/events/iftar-2025. Do NOT include /events/ prefix. Leave empty to use filename.",
          },
          {
            type: 'datetime',
            name: 'date',
            label: 'Date',
          },
          {
            type: 'image',
            name: 'image',
            label: 'Image',
          },
          {
            type: 'image',
            name: 'coverImage',
            label: 'Cover Image',
          },

          {
            type: 'object',
            name: 'metadata',
            label: 'Metadata (SEO)',
            fields: [
              { type: 'string', name: 'title', label: 'Title' },
              { type: 'string', name: 'description', label: 'Description' },
            ],
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
            templates: [
              {
                name: 'Video',
                label: 'YouTube Video',
                fields: [
                  { name: 'url', label: 'YouTube URL', type: 'string', required: true },
                  { name: 'title', label: 'Title (Aria Label)', type: 'string' },
                ],
              },
              {
                name: 'Carousel',
                label: 'Image Carousel',
                fields: [
                  { name: 'image1', label: 'Image 1', type: 'image', required: true },
                  { name: 'image2', label: 'Image 2', type: 'image' },
                  { name: 'image3', label: 'Image 3', type: 'image' },
                  { name: 'image4', label: 'Image 4', type: 'image' },
                  { name: 'image5', label: 'Image 5', type: 'image' },
                  { name: 'image6', label: 'Image 6', type: 'image' },
                ],
              },
              {
                name: 'Registration',
                label: 'Registration Button',
                fields: [
                  {
                    name: 'title',
                    label: 'Title',
                    type: 'string',
                  },
                  {
                    name: 'subtitle',
                    label: 'Subtitle',
                    type: 'string',
                    ui: {
                      component: 'textarea',
                    },
                  },
                  {
                    name: 'link',
                    label: 'Link (URL)',
                    type: 'string',
                  },
                  {
                    name: 'text',
                    label: 'Button Text',
                    type: 'string',
                  },
                ],
              },
              {
                name: 'Button',
                label: 'Button',
                fields: [
                  { name: 'text', label: 'Text', type: 'string', required: true },
                  { name: 'href', label: 'Link', type: 'string', required: true },
                  {
                    name: 'variant',
                    label: 'Style',
                    type: 'string',
                    options: [
                      { value: 'primary', label: 'Primary (Filled)' },
                      { value: 'secondary', label: 'Secondary (Outline)' },
                      { value: 'tertiary', label: 'Tertiary (Ghost)' },
                      { value: 'flashy', label: 'Flashy (Animated Gradient)' },
                      { value: 'link', label: 'Link (Text only)' },
                    ],
                  },
                ],
              },
              {
                name: 'Countdown',
                label: 'Countdown Timer',
                fields: [
                  {
                    name: 'title',
                    label: 'Title',
                    type: 'string',
                  },
                  {
                    name: 'targetDate',
                    label: 'Target Date',
                    type: 'string',
                  },
                ],
              },
              {
                name: 'RegistrationSteps',
                label: 'Registration Steps',
                fields: [
                  {
                    name: 'title',
                    label: 'Title',
                    type: 'string',
                  },
                  {
                    name: 'subtitle',
                    label: 'Subtitle',
                    type: 'string',
                  },
                  {
                    name: 'bkashNumber',
                    label: 'bKash Number (Copyable)',
                    type: 'string',
                  },
                  {
                    name: 'nagadNumber',
                    label: 'Nagad Number (Copyable)',
                    type: 'string',
                  },
                  {
                    name: 'rocketNumber',
                    label: 'Rocket Number (Copyable)',
                    type: 'string',
                  },
                  {
                    name: 'items',
                    label: 'Steps',
                    type: 'object',
                    list: true,
                    ui: {
                      itemProps: (item) => ({ label: item?.title }),
                    },
                    fields: [
                      {
                        name: 'title',
                        label: 'Title',
                        type: 'string',
                      },
                      {
                        name: 'description',
                        label: 'Description',
                        type: 'string',
                        ui: {
                          component: 'textarea',
                        },
                      },
                      {
                        name: 'icon',
                        label: 'Icon (tabler:name)',
                        type: 'string',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'committee',
        label: 'Committees',
        path: 'src/data/committees',
        format: 'yaml',
        match: {
          include: '*',
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'slug',
            label: 'URL Slug',
            description: 'Live URL: /committees/<slug>',
          },
          {
            type: 'object',
            list: true,
            name: 'presidentialPanel',
            label: 'Presidential Panel',
            ui: {
              itemProps: (item) => ({ label: item?.name || 'Panel Member' }),
            },
            fields: [
              { type: 'string', name: 'name', label: 'Name' },
              { type: 'string', name: 'role', label: 'Role' },
              { type: 'image', name: 'image', label: 'Image' },
              { type: 'string', name: 'facebook', label: 'Facebook' },
              { type: 'string', name: 'email', label: 'Email' },
              { type: 'string', name: 'linkedin', label: 'Linkedin' },
            ],
          },
          {
            type: 'object',
            list: true,
            name: 'vicePresidents',
            label: 'Vice Presidents',
            ui: {
              itemProps: (item) => ({ label: item?.name || 'Vice President' }),
            },
            fields: [
              { type: 'string', name: 'name', label: 'Name' },
              { type: 'string', name: 'role', label: 'Role' },
              { type: 'image', name: 'image', label: 'Image' },
              { type: 'string', name: 'facebook', label: 'Facebook' },
              { type: 'string', name: 'email', label: 'Email' },
              { type: 'string', name: 'linkedin', label: 'Linkedin' },
            ],
          },
        ],
      },
      {
        name: 'legal',
        label: 'Legal',
        path: 'src/data/legal',
        format: 'md',
        match: {
          include: '*',
        },
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return (values?.slug || values?.title || 'untitled')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            },
          },
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'videoUrl',
            label: 'YouTube Video URL',
            description: 'Embeds a video at the top of the page',
          },
          {
            type: 'string',
            name: 'slug',
            label: 'URL Slug',
            description:
              "The page URL path. Example: 'privacy' → theudaf.com/legal/privacy. Leave empty to use filename.",
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },
      {
        name: 'portfolio',
        label: 'Portfolio',
        path: 'src/data/portfolio',
        format: 'yaml',
        match: {
          include: '*',
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'image',
            name: 'coverImage',
            label: 'Cover Image',
          },
          {
            type: 'object',
            list: true,
            name: 'years',
            label: 'Portfolio Years',
            ui: {
              itemProps: (item) => ({ label: item?.year }),
            },
            fields: [
              { type: 'string', name: 'year', label: 'Year (e.g. 2025)' },
              { type: 'string', name: 'link', label: 'PDF Link (Google Drive)' },
            ],
          },
        ],
      },
    ],
  },
});
