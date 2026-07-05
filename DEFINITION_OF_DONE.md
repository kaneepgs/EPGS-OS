# EP Intelligence Definition of Done

This Definition of Done applies to every future sprint, feature, provider, module and release within EP Intelligence.

A sprint is **NOT** considered complete until every item below has been satisfied.

## 1. Code Quality

- Feature fully implemented
- Existing functionality preserved
- Architecture respected
- No duplicated logic where reusable components exist
- No unnecessary technical debt introduced

## 2. Architecture

The implementation must respect the EP Intelligence architecture.

Presentation Layer

↓

Service Layer

↓

Provider Layer

↓

Intelligence Layer

↓

Executive Memory

↓

Knowledge Graph

↓

UI

No shortcuts should bypass this architecture.

## 3. Validation

Every sprint must include:

- `node --check` across all application JavaScript
- Route validation
- Runtime validation
- Responsive validation
- Fallback validation (where applicable)
- No JavaScript errors
- No console warnings

Validation reports must be generated.

## 4. Screenshots

Every sprint must capture updated screenshots covering all affected areas.

Minimum:

- Desktop
- Mobile
- New functionality
- Validation evidence

Store within:

`.artifacts/`

## 5. Documentation

Every sprint must update, where applicable:

- `README.md`
- `START_HERE.md`
- `EXECUTIVE_DEMO_SCRIPT.md`
- `CHANGELOG.md`
- relevant architecture documentation
- relevant provider documentation

Documentation should accurately describe the current state of the project.

## 6. Release Management

Every sprint must determine whether it is:

- Patch Release
- Minor Release
- Major Release

If applicable:

- release version
- release configuration
- release notes
- release date
- build number

## 7. Executive Memory

Every completed sprint should record important milestones into Executive Memory where appropriate.

Include:

- major features
- platform capabilities
- architecture milestones

Avoid recording low-value implementation details.

## 8. Security

Every sprint must confirm:

- no secrets committed
- no credentials committed
- no generated snapshots committed
- sensitive files remain git-ignored

## 9. Performance

Verify:

- no unnecessary rendering
- no broken navigation
- search still functions
- command palette still functions
- responsive layouts remain correct

## 10. Executive Experience

Every new feature should answer at least one executive question:

- What happened?
- Why did it happen?
- Does it matter?
- What should I do next?

Features that cannot support executive decision-making should be reconsidered.

## 11. Git

Every sprint must end with:

- clean working tree
- meaningful commit message
- updated release metadata
- validation artifacts saved

## 12. Completion Report

Every sprint must finish with a structured report including:

- Completed
- Validation
- Documentation Updated
- Artifacts Generated
- Known Limitations
- Next Recommended Sprint
- Current Release
- Current Version
- Commit Hash
- Repository Status

This report becomes the standard sprint handoff format.

## Standard Handoff Format

Use this structure at the end of every sprint:

### Completed

- item

### Validation

- item

### Documentation Updated

- item

### Artifacts Generated

- item

### Known Limitations

- item

### Next Recommended Sprint

- item

### Current Release

- release name

### Current Version

- semver

### Commit Hash

- hash

### Repository Status

- clean / dirty

## Permanent Rule

No sprint, provider, module or release is considered complete until every Definition of Done requirement has been satisfied.

This document is the permanent engineering standard for EP Intelligence.

It should be applied after `PRODUCT_VISION.md` and `PROJECT_PRINCIPLES.md` have established why a feature should exist and how it should fit the platform.
