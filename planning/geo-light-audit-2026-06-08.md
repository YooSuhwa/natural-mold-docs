# Moldy Docs GEO Light Audit - 2026-06-08

## Scope

- Target checked locally: `http://localhost:3003`
- Workspace: `/Users/chester/dev/ref/docs-mold`
- Source set: 60 MDX pages under `src/hancom/moldy/{ko,en}`
- Method: local route checks, static MDX structure scan, GEO skill guidance for AI citability, content quality, `llms.txt`, crawler access, and structured data readiness

This was a lightweight GEO-first pass for the local documentation site. It is not a final production-domain audit because the public docs base URL was not confirmed.

## Baseline Findings

| Area | Baseline | Evidence |
| --- | --- | --- |
| AI citability | Strong | 60 pages, average 520 words, every page has H2 structure, 54 pages include tables, 60 pages start with answer-first explanatory content |
| Content depth | Good | Major workflows cover menu location, user steps, permissions, APIs, screenshots, and troubleshooting |
| AI discovery assets | Missing before this pass | `/llms.txt`, `/robots.txt`, and `/sitemap.xml` returned 404 in local preview |
| Structured data readiness | Partial | Documentation workflow includes Schema.org guidance, but production JSON-LD cannot be finalized without a public base URL |
| Short-page risk | Low to medium | 11 pages are under 300 words; most are narrow reference pages, but they should be revisited after future product changes |

## Scores

| Category | Pre-fix estimate | Post-fix estimate | Notes |
| --- | ---: | ---: | --- |
| AI citability | 90 | 90 | Structure and answer-first writing are already strong |
| Content and E-E-A-T | 78 | 80 | Source-grounded docs, screenshots, OpenAPI, and update workflow support trust; public authorship/contact metadata still depends on hosting strategy |
| Technical GEO | 64 | 76 | Added `llms.txt` and `robots.txt`; production sitemap and canonical URLs remain open |
| Schema readiness | 58 | 62 | Workflow now reinforces JSON-LD checks, but no production URL was invented |
| Overall | 77 | 83 | Main lift came from adding AI discovery files and repeatable update instructions |

## Changes Applied

- Added `src/llms.txt` with Korean and English guide maps, capability summaries, API references, and maintenance links.
- Added `src/robots.txt` to allow crawling and point AI crawlers toward `/llms.txt`.
- Added GEO/SEO and AI visibility instructions to `AGENTS.md` so future feature updates can refresh the guide consistently.
- Added GEO checks to the Korean and English documentation workflow pages.
- Updated Korean and English changelogs with the GEO pass.

## Remaining Production Tasks

Do these after the public docs domain is known:

1. Generate a production `sitemap.xml` with absolute canonical URLs.
2. Add or generate JSON-LD from final page frontmatter, production URLs, language, navigation path, and modified date.
3. Validate generated JSON-LD with a production URL, not placeholders.
4. Confirm that `/llms.txt`, `/robots.txt`, and `/sitemap.xml` return `200` from the deployed site.
5. Re-run this audit after major menu, artifact viewer, Agent API, marketplace, or admin changes.
