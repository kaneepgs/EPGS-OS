# Executive Intelligence Engine v0.1

## Purpose

Sprint 7 introduces the first deterministic reasoning layer for EP Intelligence.

It does **not** call an external LLM or AI API.

Instead, it turns structured provider-backed business data into repeatable executive intelligence.

The goal is to make EP Intelligence capable of producing consistent observations before any future external AI is introduced.

## Architecture

The intelligence layer lives in `assets/intelligence/`.

Current modules:

- `InsightEngine`
- `CorrelationEngine`
- `RecommendationEngine`
- `PriorityEngine`
- `HealthEngine`
- `NarrativeEngine`
- `ConfidenceEngine`

The UI does not call these modules directly.

Instead, the flow is:

1. providers return structured demo data
2. services shape that data into stable workspace/domain objects
3. `IntelligenceService` invokes the intelligence engines
4. `assets/data/runtime.js` merges engine output into `WORKSPACE_DATA`
5. the UI renders the generated intelligence objects

## Reasoning Flow

### 1. Health scoring

`HealthEngine` computes:

- CEO health
- CFO health
- CMO health
- overall business health

These scores are weighted using configurable component weights.

Examples of weighted factors:

- revenue momentum
- margin quality
- cash resilience
- working-capital control
- audience momentum
- conversion strength
- channel focus
- governance pressure

### 2. Cross-department correlation

`CorrelationEngine` links signals across modules.

Current rule examples include:

- marketing momentum + revenue growth
- marketing momentum + profit softness
- strong website traffic + weaker enquiry conversion
- profit decline + expense drift
- lower forecast cash + supplier inflation
- approval backlog + project-health drag

Each correlation produces structured evidence and business meaning.

### 3. Recommendation generation

`RecommendationEngine` turns the strongest correlations into recommendation objects.

Each recommendation includes:

- recommendation
- why
- expected benefit
- risk
- confidence
- estimated value
- suggested owner
- ranked priority

### 4. Priority scoring

`PriorityEngine` scores recommendations using configurable weights across:

- financial impact
- customer impact
- strategic importance
- time sensitivity
- confidence

It then assigns:

- High
- Medium
- Low

priority labels plus a numeric priority score.

### 5. Confidence scoring

`ConfidenceEngine` assigns confidence using factors such as:

- evidence count
- metric coverage
- cross-functional support
- signal consistency
- penalties for weaker coverage

The output includes both:

- numeric confidence score
- confidence label

### 6. Narrative assembly

`NarrativeEngine` assembles structured executive outputs from insights and recommendations.

Current outputs include:

- Daily Briefing
- Weekly Briefing
- Board Summary
- Department Summaries

These narratives are assembled from structured insight objects rather than hardcoded page copy.

### 7. Timeline intelligence

The engine also creates generated timeline events for business-relevant changes such as:

- marketing demand milestones
- cash warnings
- margin pressure signals
- campaign successes

## Structured Insight Shape

Each executive insight includes:

- title
- executive summary
- supporting evidence
- confidence score
- confidence label
- business impact
- financial impact
- suggested actions
- responsible department
- priority
- timestamp

## Configuration

Configuration lives in:

- `assets/config/intelligence-config.js`

It currently controls:

- health weights
- priority weights
- health thresholds
- priority thresholds
- confidence thresholds

This keeps scoring logic separate from both the UI and the raw data.

## Current Integration Points

Sprint 7 routes engine output into:

- CEO Dashboard
- CFO workspace commentary
- CMO workspace commentary
- Reports → Weekly Briefings
- Reports → Board Meeting Mode
- Ask EP Intelligence

The visible result is that commentary, recommendations, priorities, and business narratives are now generated from a reasoning layer rather than being treated as static placeholder text.

## Why this matters

This changes EP Intelligence from:

- a dashboard that shows mock data and executive-looking copy

into:

- a prototype with its own internal reasoning model that can explain what happened and what leadership should do next

That is an important architectural step.

It means future AI work can enhance:

- depth
- phrasing
- scenario exploration
- natural-language interaction

without replacing the deterministic business logic that already exists.

## Future AI Integration Path

When external AI is eventually introduced, it should sit **after** this layer, not instead of it.

Recommended future pattern:

1. providers fetch real structured data
2. services normalize that data
3. intelligence engines generate deterministic scores, correlations, and recommendation candidates
4. optional LLM layer improves explanation, comparison, scenario writing, and question answering
5. UI still renders validated structured outputs

In other words:

- deterministic intelligence should remain the foundation
- external AI should become an augmentation layer

That keeps EP Intelligence explainable, auditable, and product-safe as it becomes more capable.
