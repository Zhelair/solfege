# Architecture

## Recommended Starting Shape

Start as a web app with a backend.

This is the best balance for:

- easy access
- user accounts
- project storage
- fast iteration
- AI integration

## Proposed Stack

- frontend: `Next.js`
- styling: `Tailwind CSS`
- database: `Postgres`
- ORM: `Prisma` or `Drizzle`
- auth: `Clerk` or `Auth.js`
- storage: `Supabase Storage` or `S3-compatible storage`
- payments later: `Stripe`
- analytics later: `PostHog`

## Why Web First

Web is better for the first phase because:

- onboarding is easier
- testing with users is easier
- auth is easier to manage
- deployment is simpler
- backend APIs fit AI workloads well

If richer local media workflows become important later, a desktop or hybrid client can come after.

## AI System Shape

Split the system into 3 layers:

### 1. Product Layer

Handles:

- users
- projects
- references
- settings
- saved outputs

### 2. Intelligence Layer

Handles:

- prompt interpretation
- reference analysis
- concept generation
- lyrics suggestions
- arrangement suggestions

This can use a text model such as DeepSeek or another provider.

### 3. Audio Generation Layer

Handles:

- preview generation
- section generation
- longer track generation

This should remain a separate concern from the text/intelligence layer.

## Data Model Sketch

Core entities:

- `users`
- `projects`
- `references`
- `project_settings`
- `analysis_results`
- `generation_jobs`
- `generated_assets`
- `usage_events`

## Job Model

Anything expensive or slow should be async.

Examples:

- reference analysis
- audio generation
- export processing

Each job should have:

- status
- timestamps
- owner
- error info
- output pointers

## Early System Rule

Do not tightly couple project storage to any single AI provider.

Store:

- clean input data
- clean output artifacts
- provider metadata only where needed

That keeps future model changes possible.
