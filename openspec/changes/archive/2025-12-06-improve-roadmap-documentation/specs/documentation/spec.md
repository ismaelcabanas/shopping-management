# documentation Specification Delta

## ADDED Requirements

### Requirement: Concise Roadmap Overview
The project SHALL provide a dedicated ROADMAP.md file that presents a high-level overview of project progress, current focus, and next priorities in less than 100 lines.

#### Scenario: Developer can see project status in under 1 minute
- **GIVEN** a developer opens the project documentation
- **WHEN** they read `docs/ROADMAP.md`
- **THEN** they SHALL see epic completion status within 10 lines
- **AND** they SHALL see current focus/sprint within 20 lines
- **AND** they SHALL see next 3-5 priorities within 30 lines
- **AND** they SHALL understand project direction in under 1 minute
- **AND** the entire file SHALL be under 100 lines

#### Scenario: Roadmap shows epic completion status visually
- **GIVEN** the ROADMAP.md file
- **WHEN** viewing the epics section
- **THEN** each epic SHALL display completion ratio (e.g., "3/3 stories")
- **AND** each epic SHALL display visual status (✅ Complete, 🚧 In Progress, ⏳ Backlog)
- **AND** each epic SHALL display priority level (🔥 High, 🟡 Medium, 🟢 Low)
- **AND** epics SHALL be ordered by priority

#### Scenario: Roadmap indicates current focus and next steps
- **GIVEN** the ROADMAP.md file
- **WHEN** viewing the "Next Up" section
- **THEN** it SHALL list 3-5 highest priority user stories
- **AND** each story SHALL link to its detailed documentation
- **AND** each story SHALL show importance rating (⭐ stars)
- **AND** a brief rationale SHALL explain why these are next

### Requirement: Organized User Story Archive
Completed user stories SHALL be organized in a dedicated archive structure, separated by epic, to provide clear distinction between done work and pending work.

#### Scenario: Completed stories organized by epic
- **GIVEN** a user story is completed
- **WHEN** it is archived
- **THEN** it SHALL be moved to `docs/userstories/completed/epic-{N}/`
- **AND** the epic number SHALL match the story's epic
- **AND** the file SHALL retain its original name
- **AND** git history SHALL be preserved using `git mv`

#### Scenario: Finding completed work is straightforward
- **GIVEN** a developer wants to see what's been built
- **WHEN** they browse `docs/userstories/completed/`
- **THEN** they SHALL see folders organized by epic
- **AND** each epic folder SHALL contain only completed stories
- **AND** each epic folder SHALL have a README.md with summary
- **AND** they can navigate to specific epic to see all its stories

### Requirement: Prioritized Backlog Organization
Pending user stories SHALL be organized by priority level, making it clear what work should be tackled next and what can wait.

#### Scenario: Backlog organized by priority levels
- **GIVEN** a pending user story
- **WHEN** it is placed in the backlog
- **THEN** it SHALL be in one of three priority folders:
  - `backlog/high-priority/` for critical next steps
  - `backlog/medium-priority/` for important but not urgent
  - `backlog/low-priority/` for nice-to-have features
- **AND** high-priority stories SHALL be worked on before medium
- **AND** medium-priority stories SHALL be worked on before low

#### Scenario: Quick identification of next work
- **GIVEN** a developer is ready to start new work
- **WHEN** they check `docs/userstories/backlog/high-priority/`
- **THEN** they SHALL see only high-priority user stories
- **AND** each story SHALL have complete documentation
- **AND** stories SHALL be ready to implement (no blockers)
- **AND** they can pick any story from this folder

### Requirement: Change History Tracking
The project SHALL maintain a CHANGELOG.md file that records completed features by sprint/date, following industry-standard format.

#### Scenario: CHANGELOG records shipped features chronologically
- **GIVEN** a sprint is completed with new features
- **WHEN** CHANGELOG.md is updated
- **THEN** it SHALL add an entry for the sprint
- **AND** the entry SHALL include date in ISO format (YYYY-MM-DD)
- **AND** the entry SHALL list all completed user stories
- **AND** each story SHALL link to its detailed documentation
- **AND** the most recent sprint SHALL appear first (reverse chronological)

#### Scenario: CHANGELOG follows Keep a Changelog format
- **GIVEN** the CHANGELOG.md file
- **WHEN** inspected
- **THEN** it SHALL follow [Keep a Changelog](https://keepachangelog.com/) format
- **AND** it SHALL use semantic sections (Added, Changed, Fixed, Removed)
- **AND** it SHALL be human-readable
- **AND** entries SHALL be grouped by release/sprint

### Requirement: Simplified Navigation Hub
The README.md in userstories/ SHALL serve as a navigation hub and index, simplified from its current 490+ line length to focus on structure and navigation.

#### Scenario: README provides quick navigation
- **GIVEN** a developer reads `docs/userstories/README.md`
- **WHEN** they want to find specific information
- **THEN** they SHALL see a table of contents within first 20 lines
- **AND** they SHALL see quick links to ROADMAP, CHANGELOG, completed, backlog
- **AND** they SHALL see epic summaries with links to folders
- **AND** the file SHALL be under 300 lines (vs current 490+)

#### Scenario: README links to detailed views
- **GIVEN** the simplified README.md
- **WHEN** a developer needs details
- **THEN** they SHALL find link to ROADMAP.md for overview
- **AND** they SHALL find link to CHANGELOG.md for history
- **AND** they SHALL find links to each epic's folder
- **AND** they SHALL find links to priority-based backlogs
- **AND** links SHALL be organized logically by purpose

### Requirement: Link Integrity After Reorganization
All documentation links SHALL remain functional after reorganizing user story files into new folder structure.

#### Scenario: Internal links work after file moves
- **GIVEN** user stories are moved to new folders
- **WHEN** links between documents are checked
- **THEN** all links in README.md SHALL work (no 404s)
- **AND** all links in user story files SHALL work
- **AND** all links in ROADMAP.md SHALL work
- **AND** all links in CHANGELOG.md SHALL work
- **AND** relative paths SHALL be updated to reflect new locations

#### Scenario: Git history preserved for moved files
- **GIVEN** user story files are moved with `git mv`
- **WHEN** checking file history
- **THEN** `git log --follow` SHALL show complete history
- **AND** commits SHALL be attributed correctly
- **AND** blame information SHALL be preserved
- **AND** no history SHALL be lost

## MODIFIED Requirements

### Requirement: User Story Documentation Organization
User stories SHALL be organized into subdirectories based on status (completed vs backlog) and priority, while maintaining the same documentation format within each file.

**Previous Behavior**: User stories were documented in flat `docs/userstories/` directory with all stories (completed and pending) in the same folder.

**New Behavior**: User stories are organized into `completed/` and `backlog/` subdirectories with further organization by epic and priority.

#### Scenario: User story file format unchanged
- **GIVEN** a user story document (completed or backlog)
- **WHEN** the file is opened
- **THEN** it SHALL maintain the same internal format:
  - Title with US-XXX prefix
  - Epic, Status, Priority, Sprint metadata
  - User story in "As a... I want... So that..." format
  - Acceptance criteria
  - Technical details
  - Definition of Done
- **AND** only the file location SHALL have changed
- **AND** the content format SHALL be identical

## REMOVED Requirements

None. This change enhances documentation structure without removing existing requirements.

## Implementation Notes

### Directory Structure

```
docs/
├── ROADMAP.md                         # NEW: Concise roadmap (<100 lines)
├── CHANGELOG.md                       # NEW: Feature release history
├── userstories/
│   ├── README.md                      # MODIFIED: Simplified navigation hub
│   ├── completed/                     # NEW: Completed stories archive
│   │   ├── README.md                  # NEW: Completed work index
│   │   ├── epic-1/
│   │   │   ├── README.md              # NEW: Epic 1 summary
│   │   │   ├── US-001-....md
│   │   │   └── US-002-....md
│   │   ├── epic-2/
│   │   └── epic-3/
│   └── backlog/                       # NEW: Pending stories by priority
│       ├── README.md                  # NEW: Backlog index
│       ├── high-priority/
│       │   ├── US-012-....md
│       │   └── US-014-....md
│       ├── medium-priority/
│       │   └── US-013-....md
│       └── low-priority/
│           └── US-019-....md
└── architecture/                      # EXISTING: Technical docs
```

### ROADMAP.md Template

```markdown
# Roadmap - Shopping Manager

**Last Updated**: YYYY-MM-DD
**Progress**: X/Y stories (Z%)
**Current Focus**: Épica N - Name

## 🎯 Épicas Status

| Epic | Stories | Status | Priority |
|------|---------|--------|----------|
| Name | X/Y     | ✅/🚧/⏳ | 🔥/🟡/🟢 |

## 🔥 Next Up

1. [US-XXX: Title](link) ⭐⭐⭐⭐⭐

## 📊 Progress

- Velocity: X stories/sprint
- Tests: N+ tests
- Architecture: Clean Architecture + DDD

## 📚 Quick Links

- [User Stories](./userstories/README.md)
- [Completed](./userstories/completed/)
- [Backlog](./userstories/backlog/)
- [Changelog](./CHANGELOG.md)
```

### CHANGELOG.md Template

```markdown
# Changelog

## [Sprint 7] - 2025-12-05

### Added
- US-011: Excluir productos del escaneo de ticket

## [Sprint 6] - 2025-12-04

### Added
- US-010: Mejorar matching de productos con catálogo
```

## Validation

- [ ] ROADMAP.md exists and is under 100 lines
- [ ] CHANGELOG.md follows Keep a Changelog format
- [ ] All completed stories in `completed/epic-{N}/`
- [ ] All backlog stories in `backlog/{priority}/`
- [ ] README.md simplified to under 300 lines
- [ ] All internal links work (no 404s)
- [ ] Git history preserved for moved files
- [ ] Can find project status in <1 minute
- [ ] Can identify next work in <30 seconds