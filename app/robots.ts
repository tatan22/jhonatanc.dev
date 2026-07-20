import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/'], // No queremos que los reclutadores ni google entren al CMS
    },
    sitemap: 'https://jhonatanc-dev.vercel.app/sitemap.xml',
  }
}
