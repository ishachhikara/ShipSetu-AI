# ShilpSetu AI Voice Capture

The voice feature now uses the browser Web Speech API when available and requests microphone permission explicitly. If SpeechRecognition is unavailable, it falls back to recording a short audio clip and sending it to the existing `/api/ai` endpoint for Gemini transcription.

## Testing on Vercel

1. Make sure `GEMINI_API_KEY` exists in the **Production** environment.
2. Redeploy after changing environment variables or code.
3. Open the Production URL over HTTPS.
4. Click **Describe by Voice** or **Ask by Voice**.
5. When Chrome asks for microphone access, choose **Allow**.
6. Speak clearly. The selected app language is used for recognition (`en-IN`, `hi-IN`, or `pa-IN`).

If microphone permission was previously blocked in Chrome:
- Click the site controls/lock icon next to the address bar.
- Set **Microphone** to **Allow**.
- Reload the page and try again.

The fallback Gemini transcription records for up to 7 seconds and is intended for short product descriptions/questions.
