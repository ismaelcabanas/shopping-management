# AI Agent Development Rules

This document contains all development rules and guidelines for this project, applicable to all AI agents (Claude, Cursor, GitHub Copilot, etc.).

## 1. Core Principles

- **Baby Steps**: Always work in baby steps, one at a time. Never go forward more than one step.
- **Test-Driven Development**: Start with a failing test for any new functionality (TDD).
- **Progressive Revelation**: Never show all the code at once; only the next step.
- **Type Safety**: All code must be fully typed (TypeScript strict mode).
- **Simplicity First**: Use the simplest working solution; avoid unnecessary abstractions.
- **Small Components**: Functions and components should be small (10–20 lines max when practical).
- **Clear Naming**: Use clear, descriptive names for all variables and functions.
- **Incremental Changes**: Prefer incremental, focused changes over large, complex modifications.
- **Question Assumptions**: Always question assumptions and inferences.
- **Refactoring Awareness**: Highlight opportunities for refactoring and flag functions exceeding 20 lines.
- **Pattern Detection**: Detect and highlight repeated code patterns.

## 2. Code Quality & Coverage

- **MANDATORY Validation**: Before EVERY commit, run tests and build. Zero tolerance for failures.
- **Quality Requirements**: The project has strict requirements for code quality and maintainability.
- **High Coverage**: All code must have very high test coverage; strive for 100% where practical.
- **Pre-commit Checks**: All code must pass the following before any commit:
    - TypeScript compilation (`npm run build`)
    - All tests passing (`npm test`)
    - No ESLint errors
- **TDD Workflow**: Test-Driven Development (TDD) is the default workflow: always write tests first.
- **Domain-Driven Design**: Follow DDD principles and Clean Architecture patterns.

## 3. Style Guidelines

- **Natural Expression**: Express all reasoning in a natural, conversational internal monologue.
- **Progressive Building**: Use progressive, stepwise building: start with basics, build on previous points, break down complex thoughts.
- **Simple Communication**: Use short, simple sentences that mirror natural thought patterns.
- **Avoid Rushing**: Never rush to conclusions; frequently reassess and revise.
- **Seek Clarification**: If in doubt, always ask for clarification before proceeding.
- **Self-Documenting Code**: Avoid comments in code; rely on self-documenting names. Eliminate superficial comments (Arrange/Act/Assert, describing obvious code behavior, historical references that Git already manages).

## 4. Output Format Requirements

- **Show Thinking**: Show your thought process and reasoning.
- **Final Answer**: Provide clear, actionable conclusions.
- **No Skipping**: Never skip the reasoning phase.
- **Progress Indicators**: When outlining plans, use numbers/metrics to indicate progress.

## 5. Process & Key Requirements

- **Show Work**: Show all work and thinking.
- **Embrace Uncertainty**: Embrace uncertainty and revision.
- **Persistence**: Persist through multiple attempts until resolution.
- **Thorough Iteration**: Break down complex thoughts and iterate thoroughly.
- **Sequential Questions**: Only one question at a time; each question should build on previous answers.

## 6. Language Standards

- **Communication Flexibility**: Team communication can be conducted in Spanish or English for convenience and comfort.
- **English-Only Artifacts**: All technical artifacts must always use English, including:
  - Code (variables, functions, classes, comments)
  - Documentation (README, guides, API docs)
  - Issue tickets (titles, descriptions, comments)
  - Data schemas and database names
  - Configuration files and scripts
  - Git commit messages
  - Test names and descriptions
- **Professional Consistency**: This ensures global collaboration, tool compatibility, and industry best practices.

## 7. Documentation Standards

- **User-Focused README**: README.md must be user-focused, containing only information relevant to end users.
- **Separate Dev Docs**: All developer documentation must be placed in separate files (e.g., docs/development.md), with a clear link from the README.
- **Error Examples**: User-facing documentation should include example error messages for common validation failures to help users quickly resolve issues.

## 8. Development Best Practices

### Error Handling & Debugging
- **Graceful Error Handling**: Always implement proper error handling with meaningful error messages.
- **Debugging First**: When encountering issues, use debugging tools and logging before asking for help.
- **Error Context**: Provide sufficient context in error messages to enable quick problem resolution.
- **Fail Fast**: Design code to fail fast and fail clearly when errors occur.

### Code Review & Collaboration
- **Pair Programming**: Prefer pairing sessions for complex features and knowledge sharing.
- **Small Pull Requests**: Keep changes small and focused for easier review and faster integration.
- **Code Review Standards**: All code must be reviewed before merging, following project quality standards.
- **Knowledge Sharing**: Document decisions and share context with team members.

### Security Considerations
- **Security by Design**: Consider security implications in all design decisions.
- **Input Validation**: Always validate and sanitize user inputs and external data.
- **Secrets Management**: Never hardcode secrets; use proper secret management systems.
- **Dependency Security**: Regularly update dependencies and monitor for security vulnerabilities.

### Testing Strategy Distinction
- **Unit Tests**: Fast, isolated tests for individual components (majority of test suite).
- **Integration Tests**: Test interactions between components and external systems (limited, focused).
- **E2E Tests**: Full system validation (minimal, critical user paths only).
- **Test Pyramid**: Follow the test pyramid - many unit tests, some integration tests, few E2E tests.

## 9. Pre-Commit Validation (MANDATORY)

Before ANY commit:
1. Run `npm run build` (TypeScript compilation)
2. Run `npm run lint` (code quality checks)
3. Run `npm test` (all tests must pass)
4. If errors exist: fix them and re-run
5. Only commit when all checks pass with ZERO errors

❌ **NEVER**: Commit → discover errors → fix commit
✅ **ALWAYS**: Validate → fix all errors → commit once

**Validation order matters:**
1. Build first (catches type errors)
2. Lint second (catches code quality issues)
3. Test last (validates functionality)

## 10. Quick Reference for All AI Agents

When working on this project:

1. **Take baby steps** - one test, one file, one change at a time 👣
2. **Always write the failing test first** (TDD) ❌➡️✅
3. **Keep code small and typed** - TypeScript strict mode, max 20 lines per function when practical 📏
4. **Show your thinking process** - be conversational and progressive 💭
5. **Question everything** - assumptions, requirements, design choices ❓
6. **Run build, lint, and tests before EVERY commit** - zero tolerance ✅
7. **Run tests automatically** after every change 🧪
8. **Focus on simplicity** over cleverness ✨
9. **Ask for clarification** when in doubt 🤔
10. **Follow DDD and Clean Architecture** - domain-first approach 🏗️

Remember: This is a high-quality, test-driven, incremental development environment. Quality over speed, clarity over cleverness, baby steps over big leaps.