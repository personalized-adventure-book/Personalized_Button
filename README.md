# Personalized Button

**Personalized Button** is a generic, reusable, multilingual website platform for **personalized products**.  
Despite the name, it is **not limited to buttons**. It is designed to host **many different personalized product websites** inside the same codebase, with the **product selected by the URL**.

The goal is to have a single, flexible website engine that can render different product pages (books, buttons, gifts, etc.), in multiple languages, with dynamic content, and later be driven by an LLM prompt to generate or adapt content automatically.

## Live Examples

The same website serves multiple products. Only the `id` in the URL changes:

- https://personalized-adventure-book.github.io/Personalized_Button/?id=BK3  
- https://personalized-adventure-book.github.io/Personalized_Button/?id=BT2  

Each `id` corresponds to a different personalized product configuration (content, texts, images, language, features, etc.).

## What This Project Does

- Hosts **multiple product websites** in one single app.
- Loads **product-specific content dynamically** based on URL parameters.
- Supports **multiple languages**.
- Uses **structured content (JSON, configs, assets)** to drive the UI.
- Keeps a **generic UI and logic**, reusable for any personalized product.
- Prepares the ground for **LLM-driven generation** of content and pages from prompts.

In short: one codebase, many products, many languages, many websites.

## Core Idea

1. User opens the website with a URL like:

?id=BK3

2. The app detects the `id`.
3. It loads the corresponding content/configuration.
4. The same UI engine renders a **different product website**.
5. Language, texts, images, and features adapt automatically.

Later, instead of only static configs, an **LLM can generate or adapt** this content from a prompt like:
> “Create a personalized children’s adventure book website in French and English.”

## Features

- Multi-product support from one deployment
- Multilingual content handling
- Dynamic content loading
- Generic and reusable components
- Next.js-based frontend
- Tailwind CSS styling
- Config/content-driven rendering
- Ready for LLM integration
- GitHub Pages deployment

## Project Structure (Simplified)

- `app/`, `components/`, `contexts/`, `hooks/`, `utils/`  
Core application logic and UI components.

- `content/`, `JSONS/`, `public/`  
Product content, assets, and configuration.

- `types/`  
TypeScript types for structured data.

- `scripts/`, `test-*.js`  
Debugging, testing, and utility scripts.

- `next.config*.js`, `tsconfig.json`, `tailwind.config.js`  
Framework and build configuration.

## How to Run Locally

1. Install dependencies:

npm install

2. Start the dev server:

npm run dev

3. Open in your browser:

http://localhost:3000/?id=BK3

Change the `id` to test different products.

## Adding a New Product

1. Create a new content/config entry for your product (JSON or config files).
2. Give it a unique `id` (for example: `MY1`).
3. Add the assets (images, texts, etc.).
4. Open:

?id=MY1

5. The same app will render your new personalized product website.

No new frontend project needed.

## Why the Name “Personalized Button”?

The project started with a button-based product, but the architecture is **generic**.  
It now supports (and is meant to support):

- Personalized books
- Personalized gifts
- Personalized prints
- Personalized cards
- Any product with customizable content

The name stayed, the scope grew.

## LLM Integration (Planned)

The long-term goal is to:

- Let a user describe a product via a prompt.
- Use an LLM to generate:
- Text content
- Structure
- Translations
- Sections and layout data
- Feed this into the same engine to instantly create a new product website.

So this becomes a **prompt → website** pipeline for personalized products.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Node.js
- GitHub Pages (deployment)

## Deployment

The project is deployed on GitHub Pages and serves all products from the same URL, using query parameters to switch between them.

## Contributing

- Keep everything generic and reusable.
- Do not hardcode product-specific logic in components.
- Add new products through content/config, not new apps.
- Keep multilingual support in mind for any new feature.

## License

Specify your license here (MIT, Apache-2.0, etc.).
