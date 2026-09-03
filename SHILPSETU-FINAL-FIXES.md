# ShilpSetu AI – final prototype fixes

This version includes:
- 13-language selector on the welcome screen and inside the workspace
- multilingual navigation labels for the main workspace
- create-new-profile flow with a clean workspace
- Meena Devi demo profile and a Demo Profile reset button
- live camera capture (localhost and HTTPS)
- gallery/photo upload
- AI photo analysis
- AI photo editing when Gemini image generation is configured
- local smart photo-edit fallback if Gemini image editing is unavailable
- voice capture with browser SpeechRecognition where supported, with recorded-audio fallback
- local `/api/ai` middleware during Vite development
- simple AI fallbacks for prototype operation when no API key is configured

## Run locally

From `artifacts/shilpsetu-ai`:

```bash
pnpm run dev
```

The Vite config now defaults to port 5173 and `/`, so the old `PORT`/`BASE_PATH` error is no longer required.

## Real Gemini AI

For actual Gemini-powered coaching, descriptions, photo analysis, translation and generative photo editing, put your own key in a local `.env` file (never commit it):

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
```

The API key is server-side only.

## Camera and microphone

- On this computer, `http://localhost:5173` is supported.
- On a deployed site, use the HTTPS URL and allow Camera/Microphone in the browser permission prompt.
- Chrome/Edge are recommended for voice capture.
