# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters, tech leads, and engineering managers evaluating Jhonatan for full-stack or front-end TypeScript roles (remote and international), looking for a hireable engineer with real shipped work.

Secondary: SMBs and entrepreneurs in Colombia (Pereira / Eje Cafetero) who need an online store or website that increases sales.

Both audiences are served, but the hiring path leads; the freelance service offer stays visible as a secondary route.

## Product Purpose

A personal portfolio and credibility surface for Jhonatan Cardona Duarte that turns a scan into a qualified contact — either an interview or a paid project. Success means a recruiter or potential client reaching out after seeing demonstrated engineering and commerce work.

## Positioning

A full-stack TypeScript engineer who ships commerce: fast, scalable, SEO-optimized online stores and web applications, backed by a Physics-engineering background and modern Next.js/NestJS architecture. The commerce angle is the differentiator a generic front-end portfolio could not truthfully copy.

## Operating Context

- Spanish (es-CO) is the primary language of the surface; copy and metadata are written in Spanish.
- Content (profile, projects) is database-backed with static fallbacks and editable through an admin dashboard.
- Contact happens through the on-site form and email; social links (GitHub, LinkedIn) support evaluation.
- Analytics and marketing scripts are consent-gated; the site is deployed on Vercel.

## Capabilities and Constraints

- Stack: Next.js 14 App Router, React 18, TypeScript, Tailwind CSS v4, shadcn/ui + Radix, framer-motion, Geist fonts.
- Data layer: DB-backed `getProfile` / `getProjects` with fallbacks; ISR `revalidate = 300`; admin edits trigger `revalidatePath`.
- API routes: contact form, admin auth/login/logout, UploadThing. Sentry, Google Analytics/GTM, Vercel Analytics, cookie consent, exit-intent popup, floating CTA.
- SEO/GEO surface: sitemap, robots, JSON-LD (Person/WebSite/ProfessionalService), per-route OG images, RSS, `llms.txt` / `llms-full.txt`, manifest.
- Deployment: Vercel; canonicals/OG/sitemap derive from `NEXT_PUBLIC_SITE_URL` (fallback `jhonatanc-dev.vercel.app`).
- Undecided facts to reconcile later: contact email differs (`tatancarduar@gmail.com` in `lib/site.ts` vs `tatancarduar@hotmail.com` in the hero mailto); the hero's fallback role says "Front-End Developer" while metadata says "Full-Stack TypeScript Engineer"; the public domain is not yet finalized.

## Brand Commitments

- Name: Jhonatan Cardona Duarte.
- Identity: Full-Stack TypeScript Engineer / "Commerce Creator"; Ingeniero Físico.
- Based in Pereira, Risaralda, Colombia.
- Socials: GitHub `@tatan22`, LinkedIn `jhonatan-cardona-duarte-bb525199`.
- Voice: Spanish, technical but accessible; confident, not salesy.

## Evidence on Hand

- Live deployed store: https://www.carvinofertas.com/ — real e-commerce work.
- Live demo: https://memorias-calculo-fotovoltaico-p9r1434nc.vercel.app/ — solar calculation system (memorias de cálculo fotovoltaico), no custom domain yet.
- Veloce — premium vehicle marketplace for the Eje Cafetero, in development, no public launch.
- Assets on hand: `/profile.webp`, `favicon.ico`.
- Absent and must not be fabricated: client testimonials, revenue/sales metrics, press, or launch dates beyond the two live URLs above.

## Product Principles

1. Hiring signal first — the engineering depth must be demonstrable, not asserted.
2. Commerce is the differentiator — lead with stores and selling outcomes, not generic web presence.
3. Evidence over adjectives — show real shipped links; never invent metrics, testimonials, or clients.
4. Fast and accessible in Spanish — performance and ES-first readability are part of the pitch.
5. Low-friction contact — every path should make it trivial to start a conversation.
