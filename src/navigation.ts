import { getPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: getPermalink('/'),
    },
    {
      text: 'About',
      href: getPermalink('/about-us'),
    },
    {
      text: 'Committee',
      links: [
        {
          text: 'Executive Committee 2025-26',
          href: getPermalink('/committees/executive-committee-2025-26'),
        },
        {
          text: 'Executive Committee 2025',
          href: getPermalink('/committees/executive-committee-2025'),
        },
        {
          text: 'Committee 23-24',
          href: getPermalink('/committees/committee-23-24'),
        },
      ],
    },
    {
      text: 'Wings',
      links: [
        { text: 'Art & Cultural Activities', href: getPermalink('/wings/art-cultural-activities') },
        { text: 'Career & Corporate Affairs', href: getPermalink('/wings/career-corporate-affairs') },
        { text: 'Events & Logistics', href: getPermalink('/wings/events-logistics') },
        { text: 'Graphics & IT', href: getPermalink('/wings/graphics-it') },
        { text: 'HR & Documentation', href: getPermalink('/wings/hr-documentation') },
        { text: 'Photography', href: getPermalink('/wings/photography') },
        { text: 'PR & Communication', href: getPermalink('/wings/pr-communication') },
        { text: 'Promotion & Content Development', href: getPermalink('/wings/promotion-content-development') },
        { text: 'Sports & Entertainment', href: getPermalink('/wings/sports-entertainment') },
      ],
    },
    {
      text: 'Events',
      links: [
        {
          text: 'Badminton PRO',
          links: [
            { text: 'Badminton PRO 4.0', href: getPermalink('/events/badminton-pro/4-0') },
            { text: 'Registration (4.0)', href: getPermalink('/events/badminton-pro/registration') },
            { text: 'Badminton PRO 3.0', href: getPermalink('/events/badminton-pro/3-0') },
            { text: 'Badminton PRO 2.0', href: getPermalink('/events/badminton-pro/2-0') },
          ],
        },
        {
          text: 'Prodigies',
          links: [
            { text: 'Prodigies 6.0', href: getPermalink('/events/prodigies/6-0') },
            { text: 'Prodigies (General)', href: getPermalink('/events/prodigies') },
          ],
        },
        {
          text: 'Iftar Mahfil',
          links: [
            { text: 'Iftar Mahfil 2025', href: getPermalink('/events/iftar-mahfil/2025') },
            { text: 'Iftar Mahfil 2024', href: getPermalink('/events/iftar-mahfil/2024') },
          ],
        },
        {
          text: 'Mindlogue',
          links: [
            { text: 'Mindlogue 2.0', href: getPermalink('/events/mindlogue/2-0') },
            { text: 'Mindlogue', href: getPermalink('/events/mindlogue') },
          ],
        },
        { text: 'BBQ Party 2024', href: getPermalink('/events/bbq-party-2024') },
        { text: 'Sports Day', href: getPermalink('/events/sports-day') },
        { text: 'Cleanup Project', href: getPermalink('/events/cleanup-project') },
        { text: 'Standing Beside Flood Victims', href: getPermalink('/events/standing-beside-flood-victims') },
      ],
    },
    {
      text: 'Contact',
      href: getPermalink('/contact-us'),
    },
  ],
  actions: [{ text: 'Join UDAF', href: '/contact-us' }],
};

export const footerData = {
  links: [
    {
      title: 'Navigation',
      links: [
        { text: 'Home', href: getPermalink('/') },
        { text: 'About Us', href: getPermalink('/about-us') },
        { text: 'Contact Us', href: getPermalink('/contact-us') },
      ],
    },
    {
      title: 'Committee',
      links: [
        { text: 'Executive Committee 2025-26', href: getPermalink('/committees/executive-committee-2025-26') },
        { text: 'Executive Committee 2025', href: getPermalink('/committees/executive-committee-2025') },
        { text: 'Committee 23-24', href: getPermalink('/committees/committee-23-24') },
      ],
    },
    {
      title: 'Wings',
      links: [
        { text: 'Art & Cultural', href: getPermalink('/wings/art-cultural-activities') },
        { text: 'Career & Corporate', href: getPermalink('/wings/career-corporate-affairs') },
        { text: 'Graphics & IT', href: getPermalink('/wings/graphics-it') },
        { text: 'PR & Communication', href: getPermalink('/wings/pr-communication') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/legal/terms') },
    { text: 'Privacy Policy', href: getPermalink('/legal/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://www.facebook.com/udaf.ais' },
    { ariaLabel: 'Linkedin', icon: 'tabler:brand-linkedin', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    &copy; ${new Date().getFullYear()} University of Dhaka Accounting Forum · All rights reserved.
  `,
};
