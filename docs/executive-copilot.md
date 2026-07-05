# Executive Copilot

## Purpose

Executive Copilot is the action-oriented conversation layer for EP Intelligence.

It should not bypass the platform architecture.

It must resolve questions through:

Provider Layer → Services → Intelligence Engine → Memory → Knowledge Graph

## Core routes

- `/executive-copilot`
- `/executive-copilot/ask`
- `/executive-copilot/executive-briefing`
- `/executive-copilot/memory-context`

## Example questions

- What should I focus on today?
- Show urgent finance items.
- Which customers require replies?
- Summarise marketing performance.
- Explain this recommendation.
- Why is Business Health down?
- Show everything related to YouTube.
- Show every action awaiting approval.

## Rules

- answers should be concise and executive-ready
- answers should point back to routes, actions, and evidence
- answers should stay approval-first
- answers should use memory and prior decisions when relevant
- Copilot should help move from understanding into action
