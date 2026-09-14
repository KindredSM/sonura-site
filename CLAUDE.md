# Sonura marketing site — agent guide

`astro-site/` is the actual site (Astro framework). Run it with `npm run dev` from inside `astro-site/` to get a local dev server at http://localhost:4321/ for reviewing changes.

## Workflow

- At the start of every block of changes, make a branch off `main` first — never commit/push directly to `main`. Keeps the live site untouched until a PR merges.
- Work sequentially: branch → make the changes → `git commit` / `git push` → `/code-review` (only after all changes for that block are made) → open a PR.
- Keep each branch/PR topical. Don't mix e.g. "backlinks for X, Y, Z" with "change this button's design" with "5 new marketing pages" in one branch — it gets hard to review and increases surface area for error. Break unrelated asks into separate branches/PRs.
- For a bulk of same-topic changes (e.g. several SEO pages), it's fine to do multiple `git commit`/`git push` cycles on one branch, then open a single PR covering all of them at the end.
- Multiple PRs touching the same shared file (e.g. the blog index, which every new post edits) will collide — if doing several posts, stack them as sequential commits on ONE branch instead of separate PRs.
- A PR merging into `main` triggers the deploy workflow (GitHub Actions → GitHub Pages) automatically. "Make a PR" is the hand-off point to the human for review + merge.

## Checklist before every PR (copy-paste these — we've been burned by each one)

When 20 PRs were merged at once in the past, several small misses slipped through. Before saying "make a PR", run through these explicitly:

1. **Build + metadata**: run `npm run build` and confirm it passes, then check every new/changed page has a title, meta description, and canonical. A passing build does NOT mean everything is fine — broken blog entries once built clean but silently failed to show 4 posts on the blog page. Always eyeball the actual pages in the browser too, not just the build output.
2. **New blog post dates**: the date lives in TWO places — the blog index list AND the post page itself (`publishedDate`). Make sure they're set and match in both places, and don't reuse the same date as other new posts — posts all dated the same day looks unnatural.
3. **New page or blog post → update `llms-full.txt`**: the sitemap updates itself on build and `robots.txt` doesn't need touching, but `llms-full.txt` is a manual list and goes stale if not updated.
4. **Deleting or redirecting a page**: check nothing still points at it — no other page's canonical or internal link should point at a freshly-redirected URL (wastes SEO value).
5. **Shared-file collisions**: if several PRs would touch the same file (classic case: the blog index), stack those changes as commits on one branch instead of separate PRs.
6. **Final pass**: run `/code-review`, then actually click through the changed pages in the browser. Don't trust "it built fine" as proof the pages render correctly.

## Model / mode notes

- `/model` switches model — Opus recommended for this work as the smartest option.
- Shift+Tab cycles modes: auto-accept (so you're not approving every single action) and plan mode (for bigger changes) are both useful here.
