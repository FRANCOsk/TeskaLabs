# TeskaLabs Training UI

A React-based training application built around list, detail, and custom data views. The project demonstrates integration with remote APIs, client-side routing, internationalization, reusable UI components, and a custom Webpack build.

## Highlights

- data-oriented React user interface
- list and detail navigation patterns
- remote API integration with Axios
- React Router navigation
- Material UI, Bootstrap, and ASAB WebUI components
- internationalization with i18next
- responsive styling with Emotion and Sass
- production build with Webpack
- automated build and dependency-security checks

## Technology stack

- React 19
- React Router 7
- Material UI and Emotion
- ASAB WebUI Shell and Components
- Axios
- i18next
- Bootstrap and Reactstrap
- Webpack and Babel
- Sass

## Data sources

The original exercise uses these endpoints:

```text
https://devtest.teskalabs.com/data
https://devtest.teskalabs.com/detail/{id}
```

Availability and response formats are controlled by the external service.

## Run locally

Requirements:

- Node.js 22 or newer
- npm 10 or newer

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm start
```

Create a production build:

```bash
npm run build
```

## Quality and security checks

Run the same build check used by CI:

```bash
npm run check
```

Check installed dependencies for high-severity vulnerabilities:

```bash
npm run audit
```

GitHub Actions executes a clean installation, production build, and npm security audit for every pull request. Dependabot checks npm and GitHub Actions dependencies weekly.

## Project background

This repository originated as a frontend implementation exercise. The assignment covered a paginated table view, a record-detail view, navigation between screens, translations, icons, and a custom data screen. The repository is retained as a portfolio example of working with an unfamiliar component library and an existing Webpack-based application structure.

## Development notes

The application depends on external APIs and third-party component libraries. When upgrading dependencies, review peer-dependency compatibility and verify the production build before merging.
