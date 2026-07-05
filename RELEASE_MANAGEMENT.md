# Release Management

## Purpose

This document defines how EP Intelligence packages releases.

It exists so the product, docs, runtime metadata, and governance references move together.

## Current formal release

- **Version:** `2.0.0`
- **Release label:** `v2.0`
- **Codename:** `Executive Action Centre & Executive Copilot`
- **Build number:** `2026.07.05.6`

The source of truth for displayed release metadata is:

- `assets/config/release-config.js`

## Required release updates

Every formal release must update:

- `assets/config/release-config.js`
- `package.json`
- `CHANGELOG.md`
- `changelog/CHANGELOG.md`
- `README.md`
- `START_HERE.md`
- `EXECUTIVE_DEMO_SCRIPT.md`
- `Roadmap.md`

When relevant, also update:

- `docs/architecture-manual.md`
- integration/provider docs
- action / execution / copilot docs

## Release rules

1. The displayed app version and the package version must agree.
2. Formal release history belongs in `CHANGELOG.md`.
3. Detailed sprint history belongs in `changelog/CHANGELOG.md`.
4. The roadmap must advance after each completed release.
5. No release is complete until validation, screenshots, docs, and clean git state are finished.
6. Governance references must stay current with `PRODUCT_VISION.md`, `PROJECT_PRINCIPLES.md`, and `DEFINITION_OF_DONE.md`.

## v2.0 release notes summary

v2.0 formalises EP Intelligence as an approval-first Executive Operating System by introducing:

- Executive Action Centre
- Executive Queue
- Action Detail workspace
- Approval Workflow
- Executive Copilot
- Action-backed Business Health
- action / approval / workload reports
- action-backed Executive Memory and search coverage
- execution adapter scaffolding with locked execution
