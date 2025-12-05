# Implementation Tasks

## 1. Create New Documentation Structure

- [ ] 1.1 Create directory structure
  - Create `docs/userstories/completed/` directory
  - Create subdirectories: `completed/epic-1/`, `epic-2/`, `epic-3/`
  - Create `docs/userstories/backlog/` directory
  - Create subdirectories: `backlog/high-priority/`, `medium-priority/`, `low-priority/`

- [ ] 1.2 Create ROADMAP.md
  - Create `docs/ROADMAP.md` at root of docs/
  - Add epic status table
  - Add "Next Up" section with top 3-5 priorities
  - Add progress metrics
  - Add quick links section
  - Keep under 100 lines

- [ ] 1.3 Create CHANGELOG.md
  - Create `docs/CHANGELOG.md` at root of docs/
  - Add entry for Sprint 7 (US-011)
  - Add entry for Sprint 6 (US-010)
  - Add entry for Sprint 5 (US-009)
  - Follow [Keep a Changelog](https://keepachangelog.com/) format

## 2. Migrate Completed User Stories

- [ ] 2.1 Move Épica 1 stories to completed/epic-1/
  - `git mv` US-001-ver-pagina-bienvenida.md to completed/epic-1/
  - `git mv` US-002-navegar-entre-secciones.md to completed/epic-1/
  - `git mv` US-003-ver-inventario-productos.md to completed/epic-1/
  - `git mv` US-004-anadir-producto-inventario.md to completed/epic-1/
  - `git mv` US-005-ver-catalogo-productos.md to completed/epic-1/

- [ ] 2.2 Move Épica 2 stories to completed/epic-2/
  - `git mv` US-006-editar-producto.md to completed/epic-2/
  - `git mv` US-007-eliminar-producto.md to completed/epic-2/
  - `git mv` US-008-registrar-compra-actualizar-inventario.md to completed/epic-2/

- [ ] 2.3 Move Épica 3 stories to completed/epic-3/
  - `git mv` US-009-escanear-ticket-registrar-compra.md to completed/epic-3/
  - `git mv` US-010-mejorar-matching-productos.md to completed/epic-3/
  - Create US-011-excluir-productos-escaneados.md (if doesn't exist)
  - `git mv` US-011-excluir-productos-escaneados.md to completed/epic-3/

## 3. Organize Backlog User Stories

- [ ] 3.1 Create high-priority user story files
  - Create US-012-registrar-consumo.md in backlog/high-priority/
  - Create US-014-alertas-stock-bajo.md in backlog/high-priority/
  - Create US-015-lista-compras-automatica.md in backlog/high-priority/
  - Create QW-001-busqueda-filtros.md in backlog/high-priority/
  - Create QW-004-pwa.md in backlog/high-priority/

- [ ] 3.2 Create medium-priority user story files
  - Create US-013-historial-consumo.md in backlog/medium-priority/
  - Create US-016-dashboard-estadisticas.md in backlog/medium-priority/
  - Create US-017-prediccion-agotamiento.md in backlog/medium-priority/
  - Create US-018-cantidad-optima-compra.md in backlog/medium-priority/
  - Create QW-002-exportar-importar.md in backlog/medium-priority/

- [ ] 3.3 Create low-priority user story files
  - Create US-019-gestionar-tiendas.md in backlog/low-priority/
  - Create US-020-historial-precios.md in backlog/low-priority/
  - Create US-021-comparacion-precios.md in backlog/low-priority/
  - Create QW-003-modo-oscuro.md in backlog/low-priority/

## 4. Update Links and References

- [ ] 4.1 Update README.md links
  - Find all `[US-XXX](./US-XXX-....md)` links
  - Update to point to new locations (completed/ or backlog/)
  - Update epic sections with new folder structure
  - Add link to ROADMAP.md at top

- [ ] 4.2 Update cross-references in user stories
  - Search for inter-US links in all files
  - Update paths to new locations
  - Verify links with markdown preview

- [ ] 4.3 Update other documentation files
  - Update CLAUDE.md if it references user stories
  - Update any ADRs that reference user stories
  - Update project.md if needed

## 5. Simplify and Refactor README.md

- [ ] 5.1 Simplify epic sections
  - Move roadmap visualization to ROADMAP.md
  - Keep epic sections focused on navigation
  - Add "Quick Links" section at top
  - Reference ROADMAP.md for overview

- [ ] 5.2 Refactor statistics section
  - Move detailed metrics to ROADMAP.md
  - Keep high-level stats only
  - Link to ROADMAP.md for full metrics

- [ ] 5.3 Simplify navigation
  - Add table of contents
  - Group sections logically
  - Reduce overall length (target: <300 lines)

## 6. Create Epic Index Files

- [ ] 6.1 Create completed/README.md
  - List all completed epics
  - Link to each epic folder
  - Show completion dates
  - Show total stories per epic

- [ ] 6.2 Create backlog/README.md
  - List stories by priority
  - Link to priority subfolders
  - Show story counts
  - Explain priority criteria

- [ ] 6.3 Create epic-specific README files
  - Create completed/epic-1/README.md
  - Create completed/epic-2/README.md
  - Create completed/epic-3/README.md
  - Include epic summary and story list

## 7. Validation and Testing

- [ ] 7.1 Validate markdown rendering
  - Preview all markdown files
  - Check formatting is correct
  - Verify code blocks render properly

- [ ] 7.2 Test all links
  - Click every link in README.md
  - Click every link in ROADMAP.md
  - Click links in CHANGELOG.md
  - Verify no 404s or broken links

- [ ] 7.3 Verify git history
  - Check moved files retain history (`git log --follow`)
  - Verify no lost commits
  - Confirm all files tracked

## 8. Documentation Updates

- [ ] 8.1 Update CLAUDE.md
  - Document new docs/ structure
  - Add section on "Documentation Conventions"
  - Explain where to find user stories
  - Document ROADMAP.md update process

- [ ] 8.2 Create docs/README.md (if needed)
  - Explain documentation structure
  - Guide to finding information
  - Link to ROADMAP.md, CHANGELOG.md

- [ ] 8.3 Add comments to ROADMAP.md
  - Explain how to update it
  - Document update frequency
  - Link to user story files

## 9. Final Review and Commit

- [ ] 9.1 Code review
  - Review all changed files
  - Check for consistency
  - Verify formatting standards

- [ ] 9.2 Test from user perspective
  - Navigate to docs/ as if new to project
  - Try to find specific user story
  - Try to understand roadmap status
  - Verify clarity and usability

- [ ] 9.3 Commit changes
  - Stage all changes
  - Write comprehensive commit message
  - Push to repository

## Dependencies

- Task 2 depends on Task 1.1 (need directories created)
- Task 3 depends on Task 1.1 (need directories created)
- Task 4 depends on Tasks 2 & 3 (files must be moved first)
- Task 5 depends on Task 4 (links must be updated first)
- Task 7 depends on Tasks 1-6 (everything must be done)
- Task 8 can be done in parallel with Tasks 1-7

## Parallelizable Work

- Tasks 1.2 and 1.3 can be done independently (ROADMAP.md vs CHANGELOG.md)
- Tasks 2.1, 2.2, 2.3 can be done in any order (moving epic files)
- Tasks 3.1, 3.2, 3.3 can be done in any order (creating backlog files)
- Task 6 epic README files can be created independently

## Notes

- **Use `git mv`**: Always use `git mv` instead of regular `mv` to preserve history
- **Test Links**: Test every link before committing
- **Atomic Commits**: Consider committing each phase separately for easier rollback
- **Backup First**: Create a branch before starting (safety net)