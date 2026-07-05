# Execution Layer

## Purpose

The execution layer prepares EP Intelligence for future one-click action without enabling automation in v2.0.

## Current adapters

- EmailAdapter
- CalendarAdapter
- SocialAdapter
- AccountingAdapter
- CRMAdapter

## Adapter contract

Each adapter exposes:

- `validate()`
- `preview()`
- `execute()`

## v2.0 rule

`execute()` must intentionally return:

- **Approval Required**

## Why this exists

This lets EP Intelligence:

- model future execution cleanly
- preview payloads before activation
- keep execution inside a governed interface
- avoid hard-coding automation into action generation or UI routes

## Architectural rule

When live execution is introduced later, it must activate through these adapters rather than bypassing the Action Layer or approval workflow.
