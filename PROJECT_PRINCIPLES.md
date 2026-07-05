# EP Intelligence Project Principles

`PRODUCT_VISION.md` defines the business and product strategy for EP Intelligence.

This document defines the engineering, architecture and delivery principles that support that vision.

## Vision

EP Intelligence is not a collection of dashboards.

It is an Executive Operating System designed to help business leaders make better decisions through structured business intelligence, deterministic reasoning, executive memory and carefully controlled AI assistance.

The objective is not simply to display information.

The objective is to improve executive decision-making.

---

## Principle 1 — Executive First

Every feature must improve an executive's ability to understand the business.

Every screen should help answer one or more of:

- What happened?
- Why did it happen?
- Does it matter?
- What should I do next?

If a feature cannot support better decisions, it should be reconsidered.

---

## Principle 2 — Approval First

EP Intelligence never performs business actions automatically.

Every potentially impactful action must require explicit approval.

Examples include:

- Sending emails
- Publishing content
- Creating reports
- Updating external systems
- Scheduling activity

Automation should always remain optional and under executive control.

---

## Principle 3 — Deterministic Before AI

Business reasoning should always begin with deterministic logic.

The Intelligence Engine should produce:

- insights
- priorities
- recommendations
- health scores
- narratives

using structured business rules.

Future LLM integrations should enhance these outputs, never replace them.

Executives should always be able to understand why a recommendation was made.

---

## Principle 4 — Provider Driven

All external information enters EP Intelligence through providers.

No dashboard should communicate directly with external services.

Presentation

↓

Services

↓

Providers

↓

External Systems

This architecture keeps integrations modular, testable and replaceable.

---

## Principle 5 — Executive Memory

Business knowledge should persist beyond individual sessions.

The platform should remember:

- goals
- decisions
- milestones
- historical trends
- business events
- strategic context

The system should become progressively more valuable as its memory grows.

---

## Principle 6 — Knowledge Before Data

Metrics alone do not create intelligence.

EP Intelligence should transform:

Data

↓

Information

↓

Knowledge

↓

Insight

↓

Recommendation

↓

Decision

Every feature should support this progression.

---

## Principle 7 — Modular Architecture

Every module should plug into the existing platform without requiring major rewrites.

New providers

New executive workspaces

New reports

New AI capabilities

should all extend the architecture rather than replacing it.

---

## Principle 8 — Live When Possible, Demo When Necessary

The application should always remain usable.

If live data is unavailable:

Automatically fall back to Demo Mode.

Demo Mode should never break the executive experience.

Graceful degradation is considered a feature.

---

## Principle 9 — Explainability

Every recommendation should be explainable.

Executives should be able to inspect:

- supporting evidence
- confidence
- assumptions
- reasoning
- contributing metrics

Black-box recommendations should be avoided.

---

## Principle 10 — One Source of Truth

Avoid duplicated business logic.

Configuration

Providers

Contracts

Services

Memory

Release metadata

should each exist in one authoritative location.

---

## Principle 11 — Security by Default

Secrets must never be committed.

Credentials remain local.

Generated snapshots remain ignored.

Live integrations should fail safely.

Security should never depend upon developer discipline alone.

---

## Principle 12 — Executive Experience

Every interaction should feel like working with an experienced executive advisor.

The interface should prioritise:

clarity

focus

confidence

speed

context

not complexity.

---

## Principle 13 — Continuous Evolution

Every sprint should improve one or more of:

- intelligence
- usability
- integration
- memory
- decision support
- executive experience

The platform should become progressively smarter without becoming more complicated.

---

## Principle 14 — EP Intelligence Standard

Before any feature is considered complete, confirm:

- It aligns with these principles.
- It supports executive decision-making.
- It integrates with the platform architecture.
- It respects the Definition of Done.
- It improves the long-term value of EP Intelligence.

If not, redesign the feature before implementation.

The permanent implementation checklist for this standard now lives in `DEFINITION_OF_DONE.md`.

---

## Future Rule

Every future AI agent working on EP Intelligence should read:

1. `PRODUCT_VISION.md`
2. `PROJECT_PRINCIPLES.md`
3. `DEFINITION_OF_DONE.md`
4. `CHANGELOG.md`
5. `docs/architecture-manual.md`
6. `docs/integration-framework.md`
7. sprint specification

before proposing or implementing changes.

These documents become the constitutional foundation of the project.
