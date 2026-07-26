# Security Policy

## Scope

Smart Traffic Signal is a static, client-side simulation with no backend, no database, no authentication, and no user data collection. The realistic attack surface is limited to: the Next.js/React/npm dependency chain, the client-side code itself (XSS via untrusted rendering), and the Vercel deployment configuration.

## Reporting a vulnerability

If you find a security issue, please **do not open a public GitHub issue**. Instead, report it privately via [GitHub Security Advisories](https://github.com/krishrp1/smart-traffic-signal/security/advisories/new) for this repository, or email the maintainer directly (see the GitHub profile at [@krishrp1](https://github.com/krishrp1)).

Please include:

- A description of the issue and its potential impact
- Steps to reproduce
- Any relevant proof-of-concept code

You can expect an initial response within 5 business days.

## Supported versions

Only the `main` branch / latest deployed version is supported. There are no maintained release branches.

## Dependency security

Dependencies are audited via `npm audit` and kept current. `npm audit` must report zero known high/critical vulnerabilities before a release is tagged; the CI pipeline does not currently gate on this automatically, so please flag any regression you notice.
