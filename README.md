# Decagon Signal Dashboard

A React-based GTM signal dashboard for healthcare payer outbound prospecting. Tracks key signals across target companies (UnitedHealth, Aetna, Elevance Health) and generates personalized cold emails using OpenAI.

## Features

- Dashboard table with signal indicators across target accounts
- Company drilldown with 3-year CX loss trends and CMS Medicare Advantage data
- AI-powered email draft generation with selectable signals for personalization
- 27 validated contacts with LinkedIn and email links

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- An [OpenAI API key](https://platform.openai.com/api-keys)

### Setup

1. Clone the repo:

   ```sh
   git clone https://github.com/<your-username>/decagon-signal-dashboard.git
   cd decagon-signal-dashboard
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create your environment file:

   ```sh
   cp .env.example .env
   ```

   Then open `.env` and paste in your OpenAI API key.

4. Start the dev server:

   ```sh
   npm run dev
   ```

   The app will be available at **http://localhost:5173**.

### Other Commands

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `npm run build`     | Build for production (outputs to `dist/`) |
| `npm run preview`   | Preview the production build locally |
| `npm run lint`      | Run ESLint                         |

## Tech Stack

- **React 19** + **Vite 7**
- **OpenAI SDK** for email generation
