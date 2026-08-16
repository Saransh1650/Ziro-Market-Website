# One-time setup: make LinkedIn auto-posting work

The auto-poster (`scripts/linkedin-post.mjs`) is built and ready. It cannot post until you give it a LinkedIn access token and your page's URN, because publishing needs your LinkedIn login, and that OAuth step can only be done by you. This is a ~30-minute, one-time job. After it, posting is fully automatic (GitHub Action, Mon/Wed/Fri).

## Step 1 — Create a LinkedIn app
1. Go to https://developer.linkedin.com → **Create app**.
2. Associate it with the **Ziro Market Company Page** (you must be a Page admin).
3. Note the **Client ID** and **Client Secret** (Auth tab).

## Step 2 — Get the right permission (the important part)
To post to the **company page**, request the **Community Management API** product (Products tab). It grants the `w_organization_social` scope. LinkedIn reviews this, typically **2-4 weeks**.

- Faster alternative for now: the **Share on LinkedIn** product grants `w_member_social`, which lets you post to a **personal profile** (approved instantly). Personal profiles also get ~10x the reach of pages, so this is a fine way to start while the page product is under review. Just use your personal URN as `LINKEDIN_AUTHOR_URN`.
- The #1 failure is a 403 "insufficient permissions" — that means the token does not have the scope for the author you used (page token used with a personal URN, or vice-versa).

## Step 3 — Get your author URN
- **Company page:** `urn:li:organization:<PAGE_ID>`. Find the numeric page ID in the page's admin URL, or call `GET https://api.linkedin.com/rest/organizationAcls?q=roleAssignee` with your token.
- **Personal:** `urn:li:person:<ID>` — call `GET https://api.linkedin.com/v2/userinfo` (the `sub` field) with a token that has `openid`/`profile`.

## Step 4 — Get an access token
Use your app's OAuth flow (the "OAuth 2.0 tools" / token generator in the LinkedIn developer console is the simplest) with the scope from Step 2 (`w_organization_social` for page, `w_member_social` for profile).
- Access tokens expire in ~60 days. If your app is approved for refresh tokens (valid ~1 year), grab the **refresh token** too, and set `LINKEDIN_CLIENT_ID` + `LINKEDIN_CLIENT_SECRET` + `LINKEDIN_REFRESH_TOKEN` so the script auto-refreshes and never needs manual reissue.

## Step 5 — Add the secrets
In the GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**, add:
- `LINKEDIN_ACCESS_TOKEN` (required)
- `LINKEDIN_AUTHOR_URN` (required, from Step 3)
- `LINKEDIN_REFRESH_TOKEN`, `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET` (optional, for auto-refresh)

## Step 6 — Test, then let it run
- Preview with no risk (no API call): `npm run linkedin:post -- --next --dry-run`
- Real test of one post locally:
  `LINKEDIN_ACCESS_TOKEN=xxx LINKEDIN_AUTHOR_URN=urn:li:organization:123 npm run linkedin:post -- quick-commerce-war-2026-blinkit-zepto-instamart`
- Or in GitHub: **Actions → LinkedIn auto-post → Run workflow**, set `dry_run=true` first to check, then `false` to publish.

Once secrets are set, the **LinkedIn auto-post** workflow runs automatically at 09:00 IST on Mon/Wed/Fri, posts the newest blog not yet in `content/linkedin/posted.json`, drops the blog + app link as the first comment, and commits the updated `posted.json`. To change the schedule, edit the cron in `.github/workflows/linkedin-autopost.yml`.

## Notes
- The poster records every posted slug in `content/linkedin/posted.json`, so it never posts the same blog twice. Delete an entry to allow reposting.
- Value goes in the post body; the link goes in the first comment (2026 reach rule).
- If you would rather not deal with the LinkedIn API at all, the same drafts can be pushed to **Buffer / Publer / Zapier** on a schedule — tell me and I will adapt the script to their webhook instead.
