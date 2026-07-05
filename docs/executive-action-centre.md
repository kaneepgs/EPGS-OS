# Executive Action Centre

## Purpose

The Executive Action Centre is the single operating queue for the CEO.

Its job is to answer:

> What should I do next?

## What it does

It combines signals from:

- Finance
- Marketing
- Unified Social
- Executive Inbox
- Operations Calendar
- Approvals
- Executive Memory
- Knowledge Graph
- deterministic recommendations

and turns them into ranked, explainable, approval-first actions.

## Core surfaces

- `/executive-action-centre`
- `/executive-action-centre/queue`
- `/executive-action-centre/action-detail`
- `/executive-action-centre/approval-workflow`

## Queue groups

- My Queue
- Today's Actions
- Urgent
- This Week
- Waiting For Me
- Completed Today
- Recently Approved
- Recently Rejected

## Action model

Every action includes:

- ID
- title
- summary
- category
- department
- action type
- priority
- confidence
- risk
- business value
- estimated time
- created / due date
- owner
- status
- dependencies
- related KPIs
- related timeline events
- related decisions
- supporting evidence
- recommended outcome

## Workflow rules

- nothing executes automatically
- actions must remain explainable
- actions must remain searchable
- approved / rejected / completed outcomes must feed Executive Memory
