# slides-xt

Refreshed [reveal.js](https://revealjs.com/) slide decks for **CMPUT 404** (Web Applications and Architecture), published at [uofa-cmput404.github.io/slides-xt](https://uofa-cmput404.github.io/slides-xt/).

## Project overview

This repository builds the course slide site as static HTML, CSS, and JavaScript. Slide content and layouts live under `src/` (mostly Nunjucks templates). The production bundle is suitable for hosting on GitHub Pages.

## Tech stack

| Tool | Role |
|------|------|
| **[Vite](https://vitejs.dev/)** | Dev server, bundler, and production build |
| **[Vituum](https://vituum.dev/)** | Multi-page setup and integration with Vite |
| **[@vituum/vite-plugin-nunjucks](https://github.com/vituum/vituum/tree/main/packages/vite-plugin-nunjucks)** | Compiles **Nunjucks** templates |
| **[reveal.js](https://revealjs.com/)** | Slide framework used in the decks |

Other dependencies (for example `vite-plugin-pwa` and `vite-plugin-inspect`) support optional features and debugging during development.

## Prerequisites

- **[Node.js](https://nodejs.org/)** — the [GitHub Actions workflow](.github/workflows/yarn-webpack-pages.yml) uses **Node 20**; matching that version locally avoids surprises.

## Setup

Clone the repository, then install dependencies:

```bash
npm install
