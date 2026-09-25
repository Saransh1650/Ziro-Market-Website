@AGENTS.md

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Trade Insights Website - Agent Coding Standards

## Before Any Work
- Check Linear for open tasks and feature scope
- Review git status and branch alignment
- Run build/tests before committing changes
- Verify no secrets or API keys in code

## File Structure Rules
- **Max 200 lines per file** (split components into smaller modules)
- Components in `/components` directory
- Pages/routes in `/app` directory
- Utilities in `/lib/utils` directory
- Hooks in `/lib/hooks` directory
- Styles remain local to component files

## Code Quality
- No dead code — remove unused imports/exports
- Use TypeScript strictly (no `any` type)
- Extract magic strings/numbers to constants
- Clear, descriptive variable/component names
- Comments only for non-obvious logic

## Security
- Never commit credentials or API keys (use env vars)
- Sanitize all user input before display
- Prevent XSS with proper escaping
- Use Content Security Policy headers
- Validate API responses
- Never expose sensitive data in client code
- HTTPS only for all external requests

## Performance
- Code-split pages with dynamic imports
- Lazy load below-the-fold components
- Image optimization (WebP, responsive sizes)
- Memoize expensive computations
- No unnecessary re-renders

## SEO & Accessibility
- Semantic HTML structure
- Proper heading hierarchy
- Alt text on all images
- ARIA labels where needed
- Meta tags for all pages
- Structured data (JSON-LD) for rich snippets

## Testing
- Component tests for critical UI
- Run `npm test` before committing
- Visual regression tests for design changes
- Test on mobile and desktop

## Linear Integration
- Link commits to issues: `git commit -m "feat: description [SAR-123]"`
- Update Linear issue status as you work
- Add comments for blockers or design decisions
- **Always check Linear before starting work**

## Build & Deploy
- Run `npm run build` to verify
- Check for console errors/warnings
- Test mobile responsiveness
- Verify image loading and performance
