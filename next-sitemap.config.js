/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://zafay.link',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' }
    ],
  },
  exclude: [
    '/login', 
    '/register', 
    '/post', 
    '/settings', 
    '/account', 
    '/account/*', 
    '/jobs/edit/*',
    '/api/*',
    '/server-sitemap.xml'
  ],
};
