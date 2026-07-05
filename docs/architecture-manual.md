# Architecture Manual

## Overview

EP Intelligence is intended to become an AI Executive Operating System for EP Golf Studios.

The system will eventually coordinate executive agents, connected business data, decision memory, approval workflows, and recurring briefings. This first sprint defines the architecture rather than implementing the live system.

## Proposed System Layers

### 1. Data Source Layer

Future inputs may include:

- accounting platforms such as QuickBooks
- banking platforms such as Starling
- marketing and analytics platforms
- internal operational records
- manually uploaded files and notes

This sprint does not connect any of them.

### 2. Intelligence Layer

This layer will:

- normalise business data
- preserve historical snapshots
- compare current state against prior periods
- support evidence-based recommendations
- expose uncertainty, gaps, and assumptions

### 3. Executive Reasoning Layer

Separate executive agents will be responsible for domain-specific reasoning:

- CFO
- CMO
- COO
- CEO

Each executive should produce recommendations in a transparent format with rationale, evidence, alternatives, risks, impact, confidence, and missing information.

### 4. Decision and Memory Layer

This layer will maintain:

- a decision journal
- an approval history
- recommendation outcomes
- periodic business intelligence snapshots
- quarterly review material

### 5. Approval and Action Layer

All significant actions remain approval-first.

Possible future actions include:

- drafting but not sending communications
- preparing financial recommendations
- producing executive briefings
- staging operational plans
- generating strategic review packs

### 6. Reporting Layer

The reporting layer will eventually provide:

- weekly executive briefings
- Sunday CFO briefings
- decision review summaries
- risk and performance alerts
- historical trend summaries

## Architectural Rules for This Sprint

1. Documentation first.
2. No live integrations.
3. No direct access to financial accounts.
4. No automation without explicit approval.
5. All executive recommendations must be explainable.

## Initial Build Sequence

1. Define constitution and decision rules.
2. Define executive specifications.
3. Define prompt and skill foundations.
4. Define data, memory, and approval architecture.
5. Add integrations later in a controlled implementation sprint.
