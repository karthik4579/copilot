# Writer's copilot Frontend

This is a Frontend written in React and uses Framer motion for animations, supabase for database and Auth and components from Primereact and MaterialUI.


## What is Writer's Copilot ? 

Copilot is a react app created to help writers of all kinds improve their writing using AI. Copilot allows writers to correct grammar and have creative suggestions instantly. Copilot currently uses the `qwen-3-235b-a22b-thinking-2507` hosted on [cerebras](https://www.cerebras.ai/) for generating creative and grammar suggestions. 

## Related repo 

The Backend code for Writer's copilot can be found here : [copilot backend](https://github.com/karthik4579/copilot_backend)
## Requirements

- `NodeJS v22+` [Get NodeJS](https://nodejs.org/en/download)
- `Supabase account` [Get supabase account](https://supabase.com/dashboard/sign-up?returnTo=%2Forganizations)
- `TinyMCE cloud account` [Get TinyMCE account](https://www.tiny.cloud/auth/signup/)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` → `.env` and update values: 
   
   - `VITE_TINYMCE_LICENSE_KEY` - License key to the TinyMCE text editor
   - `VITE_SUPABASE_URL` - URL to your supabase project
   - `VITE_SUPABASE_ANON_KEY` - Supabase anon key from your dashboard
   - `VITE_BACKEND_URL` - URL to the hosted backend (Maksure to allow in CORS)

## Run the UI:
   ```bash
   npm run dev
   ```
