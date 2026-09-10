# ShilpSetu AI Photo Capture + Upload + AI Editing

This version supports:
- Live camera capture from the browser.
- Gallery/file upload with client-side resizing.
- Gemini vision analysis of either source.
- Gemini native image editing of either source.
- Three AI visual styles: Warm daylight, Clean paper, Village courtyard.
- Edited photo carried into the catalogue and product preview.

## Vercel
Keep `GEMINI_API_KEY` in the Production environment variables. Do not put the real key in frontend code.

## Gemini image-editing note
The app uses `gemini-3.1-flash-image` for the actual image-to-image edit. Google currently lists this image-generation model as having no free-tier availability, so if the photo-analysis features work but the actual image edit returns a billing/availability error, the Gemini API project needs image-generation billing/availability enabled. This is separate from your Vercel plan.
