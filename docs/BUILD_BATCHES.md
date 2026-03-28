# Build Batches

## Goal

Build `solfege` in 3 serious batches instead of trying to solve the whole dream at once.

## Recommended Product Agreement

### Product Shape

- web app first
- installable PWA for Android home screen
- desktop-friendly main workspace
- mobile-friendly support experience

### Core Product Modules

- Projects
- Workspace
- Results
- Guide
- Notes
- History

### Recommended Stack

- `Next.js`
- `Vercel`
- `Supabase`
- `DeepSeek` for text intelligence

## Batch 1: Foundation + Guide + Analysis

This is the first real product.

### Includes

- landing page
- sign in
- project dashboard
- new project flow
- 3 reference inputs
- manual lyrics / hook / theme inputs
- BPM / duration / mood / roughness controls
- DeepSeek-powered analysis
- result page with concept, arrangement, hook ideas, and next steps
- Guide tab
- Guide chat history
- "Create note" from guide answer
- Notes section
- saved projects
- PWA support

### Auth Recommendation

Use `Supabase Auth` first.

Start with:

- Google sign in
- email magic link

This is a good balance of:

- user friendliness
- low maintenance
- safety

### Admin Recommendation

Do not use "whoever can open Supabase" as app admin logic.

Instead:

- create a simple `profiles` table
- store a `role` such as `user` or `admin`
- manually mark your own email as admin at first
- enforce admin checks on the server

In practice, your admin email can be inserted manually in Supabase during early setup.

Later, this can become:

- seeded admin account
- admin dashboard
- support tools

### Why Batch 1 Matters

If Batch 1 works well, the app is already useful:

- users can learn
- users can think through tracks
- users can save ideas
- users can use AI without full audio generation yet

## Batch 2: Better Workflow + Smarter Guide

### Includes

- richer project history
- better prompt refinement
- alternate outputs
- project-aware guide suggestions
- custom user-created guide topics
- better notes organization
- tagging and search
- richer result layout
- onboarding flow
- basic quota and plan system

### Goal

Turn `solfege` from "interesting concept tool" into a real repeat-use workspace.

## Batch 3: Audio Generation Layer

### Includes

- short audio previews
- section generation
- early iterative controls
- stronger project-to-audio pipeline
- export options

### Important Rule

Do not start Batch 3 until Batch 1 and 2 prove that the reference workflow is actually strong.

## Auth And Safety Notes

### Is Google sign-in safe?

Yes, if handled through a mature provider like Supabase Auth and if:

- OAuth secrets stay server-side
- sessions are handled securely
- row-level security protects user data
- all privileged actions are re-checked on the server

### Do we need a register page?

Yes, but keep it simple.

A clean auth experience can be:

- sign in with Google
- continue with email
- optional guest/demo mode

This can be one combined auth screen, not separate bloated pages.

### How admin works early

Simple early model:

- you sign in with your chosen email
- your account is tagged `admin` in the database
- admin-only routes check that role

That is enough for an early product.

## UX Direction

### Main Workspace

Use a simple structure:

- left column: Reference 1, Reference 2, Reference 3
- right column: BPM, duration, mood, roughness, theme, lyrics
- lower or tabbed area: AI result

### Guide

Guide should be a separate tab with:

- Guide chat
- topic cards
- saved notes

### Mobile / Android

As a PWA, users can add the app to the Android home screen.

That is realistic and much simpler than building a separate Android app first.

## Recommended Agreement Right Now

If we want to stay ambitious but sane, the best agreement is:

1. Batch 1 builds the real smart workspace and guide.
2. Batch 2 makes it polished and sticky.
3. Batch 3 adds audio generation.

That gives the project a serious path without pretending we can build everything instantly.
