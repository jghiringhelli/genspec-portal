# genspec-portal

**The public portal for the [Generative Specification](https://github.com/jghiringhelli/forgecraft-mcp) quality gates registry.**

Live at: **[genspec.dev](https://genspec.dev)**

---

## What this is

A static HTML/JS portal that renders the full ForgeCraft quality gate taxonomy:
- 24 project archetypes (API, FINTECH, HEALTHCARE, GAME, ML, CLI, …)
- All verification phases with gate conditions (development → pre-release → RC → production)
- OWASP ASVS level annotations on every security gate
- Pre-commit hooks catalogue
- Instruction block library with tier badges (core / recommended / optional)
- Full-text search across all gates, blocks, and hooks

## How to update

The portal reads `taxonomy.json`, generated from forgecraft-mcp:

```bash
cd C:\workspace\claude\forgecraft-mcp
npm run export:taxonomy
copy dist\taxonomy.json ..\genspec-portal\taxonomy.json
```

Or set up the export to write directly:
```bash
npm run export:taxonomy ..\genspec-portal\taxonomy.json
```

## Deploy to GitHub Pages

1. Push this repo to GitHub as `<yourusername>/genspec-portal`
2. Settings → Pages → Source: Deploy from branch `main`, root `/`
3. (Optional) Add custom domain `genspec.dev` in Pages settings + DNS CNAME record

## The flywheel

Community-contributed quality gates flow from projects → GitHub issues → quarantine →
registry. See [CONTRIBUTING.md](https://github.com/jghiringhelli/forgecraft-mcp/blob/main/CONTRIBUTING.md)
and the [quality gate proposal template](https://github.com/jghiringhelli/forgecraft-mcp/issues/new?template=quality-gate-proposal.md).

Approved gate contributors earn ForgeCraft Pro credits. See the full incentive structure
in [the flywheel article](https://github.com/jghiringhelli/forgecraft-mcp/blob/main/docs/blog-notes-publication.md).
