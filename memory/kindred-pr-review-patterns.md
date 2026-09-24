# Kindred PR review patterns (what gets fixed after Blue's PRs)

Last updated: 2026-09-24. Add a row whenever Kindred pushes a fix on top of one of your PRs.

Source: all 43 of Blue's PRs on KindredSM/sonura-site (#2 to #64), compared with Kindred's own commits on those branches and on `main` afterwards. Kindred has left one formal review in total (#53: "the link doesn't go anywhere"). He gives nearly all of his feedback by quietly pushing fix commits, so those commits are where to look.

Most small SEO PRs (titles, metas, FAQs, internal links, schema: #2–#14, #39–#42, #47–#49, #59) merged with no follow-up fix that I could find. The corrections pile up on **new pages** and **anything that states a business fact**.

---

## 1. Business facts stated wrong (the most serious)

| PR | What the PR said | What Kindred changed it to | Fix commit |
|---|---|---|---|
| #58 partner terms | Commission of 30–50% depending on tier | A flat **25% of net subscription revenue for 12 billing months**. Annual plans earn on the first payment only. Minimum payout £25, paid through PayPal. He took the whole page offline until this was right | `392a043`, `8813075` |
| #57 / #58 partners | Tracking link with a 30-day cookie; referrals get "20 free credits" | A **partner code entered at checkout**; the customer gets **20% off their first 3 months**. The page also contradicted itself (free credits in one place, 20% off in another) | `82a991c` |
| #57 | A "Log in" link to the partner portal | Removed, because the portal isn't live yet | `97bba5a` |
| #58 | Partner questions sent to kindred@ | Sent to **blue@** | `65c9eb0` |
| #14, #16–#20 | "100% royalty-free with full commercial rights" / commercial rights on "every tier, including free" | Free-tier output is **CC0 (public domain)**. **Exclusive** commercial rights come with every paid plan. This old claim came from older site copy, and your posts copied it | `9bab00f`, `38cf46e` |

**Rule:** don't write commission, pricing, rights, plan limits, or who to contact from memory or from old pages. Check against the app or the Terms, or ask Kindred.

## 2. Links and CTAs that go nowhere

- #53: the acapella extractor CTAs had no `appUrl`, so they fell back to the app root. That's the only formal review Kindred has left. Fixed in `9fa9bf5` (links now go to `app.sonurastudio.com/tools`).
- #8 redirected five `/use-cases/` pages, but five `/samples/` pages still had their canonical pointing at the redirected URLs. Fixed in `688561e`.

**Rule:** click every CTA on the built page. After redirecting a URL, grep for anything that still points at it (links and canonicals).

## 3. Design system (#57 partners page: 8 follow-up commits)

Kindred's fixes in `1be7079`, `b8e1f87`, `63355a3`, `2fe2003`, `d9b805a`, `d73d754`, `95680cc`:
- Purple headline line removed. `--accent` is only for 11–13px uppercase tags, and purple is never used on display type.
- The one-off hero padding was replaced with the standard sub-page clamp.
- The 780px width caps were removed so content uses the full column like the other pages do.
- `text-transform: lowercase` was removed. The live site never lowercases prose.
- Numbered kickers ("01 / …") were removed. Labels stand alone now.
- Wrong border tokens (`--border-light`, used as `--hairline`) and cramped base-size buttons were fixed. `.button.large` is the right one.
- The bottom CTA was rebuilt as the real poster-frame block, and the local duplicate of `.section-kicker` was deleted.
- Added a photo header in the same style as /about. Also fixed hero clipping and the CTA scroll.

**Rule:** build new pages by copying an existing live page (genre, samples, about) and checking `astro-site/DESIGN-SYSTEM.md`. Don't design from scratch.

## 4. Housekeeping misses

- **Blog dates:** posts #16–#23 all had the same date, and the union merge fused four entries in the blog index. Fixed in `9d0bef6`.
- **llms files:** `llms-full.txt` wasn't updated for new posts (`688561e`), and /partners wasn't in `llms.txt` or `llms-full.txt` (`d73d754`).
- **Author byline:** the #50 blog posts had no `author` / `authorRole`. Fixed in `7e9d416`.
- **Keyword targeting:** #42 retargeted /genre/hip-hop/ to "rap" only. Kindred widened the title and H1 to name both rap and hip hop, to match the URL (`6680ae8`).

## 5. Duplicated or competing work

- #53 built an acapella extractor tool page while Kindred was building the same thing on another branch. It also left the ranking blog post live, competing for the same query. Kindred kept his version and retired the post with a redirect (`bfcea73`).

**Rule:** check open branches and PRs before starting a new page. Don't leave an old post and a new page targeting the same query.

## 6. Process

- **#61** merged 7 seconds after it was opened, with no review, and had to be reverted (#62). Never merge your own PR.
- **#46** mixed unrelated changes (schema + H1s + redirect stubs) and was split up. Keep one topic per PR.
- **#55 CLAUDE.md** was removed "at the repo owner's request" in `bfcea73`. Ask before adding agent or tooling files to the repo.
- Style fixes that came up in your own follow-up PRs (#54, #56): no em dashes, and no "generate" framing for AI output.

---

## Pre-PR checklist (from the list above)
1. Every pricing, rights, commission, or contact fact checked against the app or the Terms.
2. Every CTA and link clicked on the built page. Nothing points at a redirected URL.
3. New page copies an existing layout. No purple display type, no lowercase transform, no numbered kickers, no one-off widths or padding.
4. New blog post: a unique date in both places, author byline, `llms-full.txt` updated.
5. Checked for an existing or in-progress page on the same query.
6. One topic per PR, no em dashes, and wait for Kindred to merge.
