// Single source of truth for the site's canonical host. ziromarket.com
// (apex) 308-redirects to this host — every canonical tag, OG url, JSON-LD
// url, and sitemap <loc> must reference this, not the apex, or they point one
// redirect hop away from the page that actually serves.
export const SITE_URL = 'https://www.ziromarket.com'
