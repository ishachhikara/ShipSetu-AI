# ShilpSetu AI setup

The prototype now calls Gemini through the server-side `/api/ai` endpoint. The browser never receives the Gemini API key.

## Local
1. Copy `artifacts/shilpsetu-ai/.env.example` to `.env` or configure the variable in your local server environment.
2. Set `GEMINI_API_KEY` to a Gemini API key.
3. Run the project using the existing pnpm/Vite setup.

## Vercel
In the Vercel project, open **Settings → Environment Variables** and add:

- Name: `GEMINI_API_KEY`
- Value: your Gemini API key
- Environment: **Production** (also Preview/Development if you want those deployments to use AI)

Then redeploy. Environment variable changes take effect after a new deployment.

## AI-powered features
- AI Business Coach
- Product description generation
- Catalogue translation
- Product categorisation
- Smart pricing suggestion
- Buyer matching suggestions
- Product photo analysis
- Browser voice input where supported

The photo workflow uses the actual uploaded image and Gemini multimodal image understanding; it does not pretend a stock illustration is the uploaded photo.
