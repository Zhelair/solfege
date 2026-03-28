# Security

## Security Goals

Protect:

- user accounts
- project data
- uploaded media
- AI provider credentials
- billing and usage limits

## Core Requirements

- never expose provider API keys in the client
- validate all uploads on the server
- isolate data by authenticated user
- enforce authorization on every read and write
- rate limit expensive endpoints
- monitor generation usage

## Upload Safety

For any uploaded or fetched reference material:

- validate content type
- validate file size
- store with controlled access
- scan or inspect metadata when possible
- reject obviously unsupported formats

## Authentication

Recommended first auth options:

- Google
- email magic link

Avoid building custom password flows from scratch in the first version.

## Authorization

A user should only access:

- their own projects
- their own references
- their own generations
- their own account and billing data

## Abuse Prevention

This project will likely need:

- rate limits
- per-user quotas
- generation caps
- request logging
- admin visibility into failures and abuse

## Secrets

Use managed environment variables and server-side secret storage.

Never commit:

- API keys
- provider secrets
- service credentials
- database passwords

## Cost Protection

Because AI generation can be expensive, security also includes:

- limiting free usage
- capping duration and request size
- blocking runaway retries
- tracking usage by account

## Incident Mindset

The app should be designed so that:

- failures are visible
- abusive usage is traceable
- secrets can be rotated
- providers can be swapped if needed
