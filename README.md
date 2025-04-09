# Advanced Dashboard UI - Setup Guide

## Overview
![alt text](<Screenshot 2025-04-09 at 9.45.41 PM.png>)

![alt text](<Screenshot 2025-04-09 at 9.45.31 PM.png>)

![alt text](<Screenshot 2025-04-09 at 9.45.22 PM.png>)

A production-ready responsive dashboard built with:
- React 18
- shadcn/ui components
- Tailwind CSS
- Vite
- React Router
- JSONPlaceholder API integration
- Fully typed with TypeScript

## Prerequisites

- Node.js 18+
- npm 9+ or yarn 1.22+
- Git

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/zainah7/Dashboard--app.git
cd dashboard-ui
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Using yarn:
```bash
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://jsonplaceholder.typicode.com
VITE_APP_ENV=development
VITE_APP_NAME=DashboardUI
```

### 4. Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173`

## Production Build

```bash
npm run build
# or
yarn build
```

## Deployment Options

### Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

## Advanced Configuration

### Customizing shadcn/ui Components

To modify components:

```bash
npx shadcn-ui@latest add [component-name]
```

Example:
```bash
npx shadcn-ui@latest add button
```

### API Mocking (for development)

Install MSW:
```bash
npm install msw --save-dev
# or
yarn add msw --dev
```

Set up mock handlers in `src/mocks/handlers.js`:

```javascript
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' }
      ])
    );
  })
];
```

### Testing

Run unit tests:
```bash
npm test
# or
yarn test
```

Run component tests:
```bash
npm run test:components
# or
yarn test:components
```

### Storybook Integration

Install Storybook:
```bash
npx storybook init
```

Start Storybook:
```bash
npm run storybook
# or
yarn storybook
```

## Project Structure

```
dashboard-ui/
├── public/               # Static assets
├── src/
│   ├── assets/           # Images, fonts
│   ├── components/       # Reusable components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utility functions
│   ├── mocks/            # API mocks
│   ├── pages/            # Page components
│   ├── routes/           # Routing configuration
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript types
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── .env                  # Environment variables
├── .eslintrc.json        # ESLint config
├── .prettierrc           # Prettier config
├── tsconfig.json         # TypeScript config
└── vite.config.ts        # Vite config
```

## CI/CD Setup

### GitHub Actions

Create `.github/workflows/main.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v2
        with:
          name: build
          path: dist
```

## Performance Optimization

1. Code splitting:
```javascript
// In your routes
const Home = lazy(() => import('./pages/Home'));
```

2. Add bundle analyzer:
```bash
npm install @bundle-analyzer/webpack-plugin --save-dev
```

Configure in `vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer()
  ],
});
```

Run analysis:
```bash
npm run build
```

## Troubleshooting

### Common Issues

1. **Styles not loading**:
   - Ensure Tailwind is properly configured in `tailwind.config.js`
   - Check PostCSS configuration

2. **API requests failing**:
   - Verify CORS settings on your API
   - Check network tab in devtools

3. **TypeScript errors**:
   - Run `npm run type-check` to identify issues
   - Ensure all dependencies have proper type definitions

## License

MIT License. See `LICENSE` for more information.