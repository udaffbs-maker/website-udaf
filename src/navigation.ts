import fs from 'node:fs';
import yaml from 'js-yaml';
import { getPermalink } from './utils/permalinks';

const data = yaml.load(fs.readFileSync('./src/data/navigation.yaml', 'utf8')) as any;

const processLinks = (links: any[]): any[] => {
  return links.map((link) => {
    const processedLink = { ...link };
    if (link.href) {
      processedLink.href = getPermalink(link.href);
    }
    if (link.links) {
      processedLink.links = processLinks(link.links);
    }
    return processedLink;
  });
};

export const headerData = {
  links: processLinks(data.header.links),
  actions: data.header.actions,
};

export const footerData = {
  links: data.footer.links.map((section: any) => ({
    ...section,
    links: processLinks(section.links),
  })),
  secondaryLinks: processLinks(data.footer.secondaryLinks),
  socialLinks: data.footer.socialLinks,
  footNote: `&copy; ${new Date().getFullYear()} ${data.footer.footNote}`,
};
