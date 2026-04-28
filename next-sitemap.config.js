/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.ushuaiaglow.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: './public',
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://www.ushuaiaglow.com/sitemap-products.xml',
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
  },
}