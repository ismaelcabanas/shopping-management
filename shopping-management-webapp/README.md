# Shopping Management - WebApp

Web application for intelligent personal inventory management and shopping optimization.

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 3
- React Router 7
- Zustand (state management)
- TanStack Query (data fetching)
- Vitest + React Testing Library (testing)
- Playwright (E2E testing)

## Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

## Installation

```bash
npm install
```

## Available Commands

### Development

Start the development server with hot-reload:

```bash
npm run dev
```

```bash
npm run dev -- --host
```

The application will be available at `http://localhost:5173`

### Build

Build the application for production:

```bash
npm run build
```

The compiled files will be generated in the `dist/` directory

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run the linter to check the code:

```bash
npm run lint
```

### Testing

Run unit tests in watch mode:

```bash
npm test
```

Run unit tests once:

```bash
npm run test:unit
```

Run E2E tests with Playwright:

```bash
npm run test:e2e
```

Run E2E tests in UI mode:

```bash
npm run test:e2e:ui
```

Run E2E tests in headed mode (with visible browser):

```bash
npm run test:e2e:headed
```

Run E2E tests in debug mode:

```bash
npm run test:e2e:debug
```

## Architecture

The project follows Domain-Driven Design (DDD) and Clean Architecture principles:

- `src/domain/` - Entities, value objects, and business logic
- `src/application/` - Use cases and application services
- `src/infrastructure/` - Repository implementations and external services
- `src/presentation/` - UI components and pages

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
