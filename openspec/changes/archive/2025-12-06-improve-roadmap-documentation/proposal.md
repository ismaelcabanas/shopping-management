# Proposal: Improve Roadmap and User Story Documentation

## Change ID
`improve-roadmap-documentation`

## Type
Documentation / Infrastructure Improvement

## Status
Proposed

## Summary
Restructure and enhance the project documentation to provide a clearer, more professional roadmap view and better organization of user stories. The goal is to maintain simplicity while improving visibility of completed work vs. pending work, integrated with Git workflow.

## Problem Statement

### Current Structure Limitations

The current documentation structure has organizational issues:

1. **Flat Structure**: All user stories (completed and pending) in single directory
   ```
   docs/userstories/
   ├── README.md          # 490 lines, everything mixed
   ├── US-001-....md      # Completed
   ├── US-002-....md      # Completed
   ├── US-011-....md      # Completed
   └── US-012-....md      # Pending (not created yet)
   ```

2. **Lack of Quick Overview**:
   - Must read entire README.md (490 lines) to see roadmap status
   - No dedicated roadmap file for high-level view
   - Hard to quickly see "what's done" vs "what's next"

3. **Mixed Status**:
   - Completed and pending user stories in same folder
   - Hard to archive completed work
   - No clear separation of "done" from "todo"

4. **Navigation Issues**:
   - Long README requires scrolling to find specific information
   - No clear entry point for "what's the current state?"
   - Hard to quickly answer "what can I work on next?"

### User Needs

As a solo developer:
- ✅ Need quick visual overview of roadmap status
- ✅ Want to see completed work easily (motivation!)
- ✅ Want clear view of next priorities
- ✅ Want Git-integrated documentation (no external tools)
- ✅ Want simple structure (low maintenance)

## Proposed Solution

### New Documentation Structure

```
docs/
├── ROADMAP.md                    # 👈 NEW: High-level roadmap (50 lines)
├── CHANGELOG.md                  # 👈 NEW: Record of completed features
├── userstories/
│   ├── README.md                 # Index + full details (kept)
│   ├── completed/                # 👈 NEW: Archive of done stories
│   │   ├── epic-1/
│   │   │   ├── US-001-ver-pagina-bienvenida.md
│   │   │   └── US-002-navegar-entre-secciones.md
│   │   ├── epic-2/
│   │   │   └── US-006-editar-producto.md
│   │   └── epic-3/
│   │       └── US-011-excluir-productos-escaneados.md
│   └── backlog/                  # 👈 NEW: Pending stories by priority
│       ├── high-priority/
│       │   ├── US-012-registrar-consumo.md
│       │   └── US-014-alertas-stock-bajo.md
│       ├── medium-priority/
│       │   └── US-013-historial-consumo.md
│       └── low-priority/
│           └── US-019-gestionar-tiendas.md
└── architecture/                 # Technical docs (existing)
```

### Key Changes

1. **ROADMAP.md**: Concise, visual overview (50-100 lines)
   - Epic completion status
   - Current sprint/focus
   - Next 3-5 priorities
   - Quick stats

2. **CHANGELOG.md**: Record of shipped features
   - Organized by sprint/date
   - Links to user stories
   - Git-friendly format

3. **Organized by Status**: Separate completed from backlog
   - `completed/`: Archive of done work (organized by epic)
   - `backlog/`: What's next (organized by priority)

4. **README.md**: Becomes detailed index
   - Simpler, focused on navigation
   - Links to ROADMAP.md for overview
   - Full details still available

### Example ROADMAP.md

```markdown
# Roadmap - Shopping Manager

**Last Updated**: 2025-12-05
**Progress**: 11/27 stories (41%)
**Current Focus**: Épica 4 - Gestión de Consumo

---

## 🎯 Épicas Status

| Epic | Stories | Status | Priority |
|------|---------|--------|----------|
| 📦 Épica 1: Gestión de Inventario | 5/5 | ✅ Complete | - |
| 🔧 Épica 2: Gestión Avanzada | 3/3 | ✅ Complete | - |
| 📸 Épica 3: Automatización de Compras | 3/3 | ✅ Complete | - |
| 🔄 **Épica 4: Gestión de Consumo** | 0/4 | 🚧 Next | 🔥 High |
| 📊 Épica 5: Inteligencia de Consumo | 0/3 | ⏳ Backlog | 🟡 Medium |
| 🏪 Épica 6: Gestión de Tiendas | 0/3 | ⏳ Backlog | 🟢 Low |

---

## 🔥 Next Up (Épica 4)

1. [US-012: Registrar consumo de productos](./userstories/backlog/high-priority/US-012-registrar-consumo.md) ⭐⭐⭐⭐⭐
2. [US-014: Alertas de stock bajo](./userstories/backlog/high-priority/US-014-alertas-stock-bajo.md) ⭐⭐⭐⭐
3. [US-015: Lista de compras automática](./userstories/backlog/high-priority/US-015-lista-compras-automatica.md) ⭐⭐⭐⭐⭐

**Why Important**: Without consumption tracking, inventory is static and loses value. This completes the product lifecycle: Buy → Store → **Consume** → Alert → Auto-generate list.

---

## 📊 Progress

- **Velocity**: ~2 stories/sprint
- **Total Tests**: 393+ (392 unit + 12 e2e)
- **Architecture**: Clean Architecture + DDD
- **Tech Debt**: 2 items tracked in OpenSpec

---

## 📚 Quick Links

- [All User Stories](./userstories/README.md) - Full index and details
- [Completed Work](./userstories/completed/) - What's been built
- [Backlog](./userstories/backlog/) - What's next
- [Changelog](./CHANGELOG.md) - Release history
```

## Benefits

### Immediate Benefits

1. **Quick Status Check**: See project state in <1 minute (vs 5+ min scrolling)
2. **Clear Priorities**: Instantly know what to work on next
3. **Motivation**: See completed work organized and accessible
4. **Better Navigation**: Find user stories by status/priority

### Long-Term Benefits

5. **Maintainability**: Easier to keep docs updated (smaller files)
6. **Scalability**: Structure works as project grows to 50+ stories
7. **Professionalism**: Industry-standard documentation patterns
8. **Git-Friendly**: All changes tracked, no external tools needed

## Risks & Mitigation

### Risks

1. **Migration Effort**: Need to move 11 existing US files
   - **Mitigation**: Script-assisted migration, ~30 minutes work

2. **Maintaining Multiple Files**: More files to keep in sync
   - **Mitigation**: Most changes are to individual US files, ROADMAP updates are infrequent

3. **Breaking Existing Links**: Moving files breaks references
   - **Mitigation**: Search and replace, update all references before committing

### Non-Risks

- **Complexity**: Structure is still simple (just better organized)
- **Tool Learning**: No new tools, just better folder structure
- **Git History**: Moving files preserves history with `git mv`

## Success Criteria

1. ✅ ROADMAP.md exists and is <100 lines
2. ✅ Can see project status in <1 minute
3. ✅ Completed stories organized in `completed/` by epic
4. ✅ Backlog stories organized in `backlog/` by priority
5. ✅ README.md simplified and easier to navigate
6. ✅ CHANGELOG.md tracks shipped features
7. ✅ All existing links still work
8. ✅ Git history preserved for moved files

## Out of Scope

- External documentation tools (Notion, Linear, etc.)
- GitHub Projects/Issues integration (can be added later)
- Automated roadmap generation scripts (can be added later)
- Web-based documentation site (VitePress, Docusaurus)
- Metrics/analytics tracking

## Dependencies

- None (standalone change)
- Can be implemented independently
- Does not block development work

## Estimated Effort

- **Planning & Design**: 30 minutes
- **File Reorganization**: 30 minutes
- **Create ROADMAP.md**: 30 minutes
- **Create CHANGELOG.md**: 30 minutes
- **Update Links & References**: 30 minutes
- **Validation & Review**: 30 minutes
- **Total**: ~3 hours

## Implementation Phases

### Phase 1: Create New Structure (30 min)
- Create new folders: `completed/`, `backlog/` with subfolders
- Draft ROADMAP.md
- Draft CHANGELOG.md

### Phase 2: Migrate Completed Stories (30 min)
- Move US-001 through US-011 to `completed/epic-{X}/`
- Use `git mv` to preserve history
- Organize by epic

### Phase 3: Organize Backlog (30 min)
- Create backlog US files (if not exist)
- Organize by priority folders
- Add frontmatter for easy parsing (optional)

### Phase 4: Update References (30 min)
- Update all links in README.md
- Update links in other docs
- Verify no broken links

### Phase 5: Simplify README.md (30 min)
- Move roadmap details to ROADMAP.md
- Keep README as index/navigation hub
- Add links to new structure

### Phase 6: Validate (30 min)
- Review all files render correctly
- Test all links work
- Commit changes

## Next Steps

1. Review and approve this proposal
2. Create detailed task list
3. Execute migration
4. Update all references
5. Document new structure in CLAUDE.md

## References

- [Current User Stories Structure](../../../docs/userstories/)
- [Industry Patterns: Conventional Commits](https://www.conventionalcommits.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)

## Future Enhancements (Out of Scope)

### Optional: GitHub Projects Integration
- Import user stories as GitHub Issues
- Visual Kanban/Timeline view
- Link to commits/PRs

### Optional: Script-Based Roadmap Generation
```bash
# Auto-generate roadmap from user story files
./scripts/generate-roadmap.sh
```

### Optional: VitePress Documentation Site
- Static site generation
- Search functionality
- Beautiful UI

These can be added later without changing the core structure.