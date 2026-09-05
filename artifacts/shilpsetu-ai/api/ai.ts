declare const fetch: (input: string, init?: any) => Promise<any>;
declare const console: { error: (...args: any[]) => void };
/// <reference lib="dom" />
declare const process: { env: Record<string, string | undefined> };
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

function json(res: any, status: number, body: unknown) {
  res.status(status).setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(body));
}

function extractText(data: any): string {
  return data?.candidates?.[0]?.content?.parts?.map((part: any) => part.text || '').join('')?.trim() || '';
}

function cleanJson(text: string) {
  const fenced = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  const start = fenced.indexOf('{');
  const end = fenced.lastIndexOf('}');
  if (start >= 0 && end > start) return JSON.parse(fenced.slice(start, end + 1));
  return JSON.parse(fenced);
}

function hasAIKey() {
  return Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
}

function localFallback(action: string, payload: any): any {
  const name = String(payload.productName || payload.product?.name || 'your product').trim() || 'your product';
  const description = String(payload.description || '').trim();
  if (action === 'coach') return { text: `For ${name}, start with three things: keep your material and labour costs clear, use a simple product photo, and test your price with a few customers. For your next step, improve one listing and contact a few relevant buyer types. This is prototype guidance; confirm costs and local market conditions before pricing.` };
  if (action === 'description') return { text: description || `${name} is a handmade artisan product made with care. It is designed for customers who value traditional Indian craftsmanship and thoughtful, practical design. Highlight the material, making process, size and care instructions in your final listing so buyers can make an informed choice.` };
  if (action === 'translate') return { text: description || `Translation preview for ${payload.language || 'the selected language'}. Add a product description to translate it.` };
  if (action === 'categorize') return { category: 'Handicrafts' };
  if (action === 'price') return { price: 999, reason: 'Prototype estimate only. Add your material, labour, packaging and delivery costs before setting the final price.' };
  if (action === 'buyers') return { buyers: [
    { name: 'Local Handicraft Store', location: 'Your nearest city', interest: 'Handmade products', quantity: 10, budget: 'Discuss based on product', match: 90, initials: 'LH' },
    { name: 'Home Décor Boutique', location: 'Nearby market', interest: 'Home décor', quantity: 15, budget: 'Discuss based on product', match: 86, initials: 'HD' },
    { name: 'Corporate Gift Buyer', location: 'Regional', interest: 'Artisan gift sets', quantity: 25, budget: 'Discuss based on product', match: 80, initials: 'CG' },
  ] };
  if (action === 'photo-analysis') return {
    name: name === 'your product' ? 'Handmade Artisan Product' : name,
    category: 'Handicrafts', material: 'Not specified', craftType: 'Handmade', origin: 'Not specified',
    description: description || 'A handmade artisan product ready for a marketplace listing. Add material, dimensions and care details for a stronger listing.',
    tags: ['#Handmade', '#IndianCraft', '#ArtisanMade', '#RuralCraft'],
    story: 'Made with care by an artisan. The listing can be personalised with the craft story and making process.', confidence: 50,
    visualAdvice: 'Use natural light and a clean background for the clearest product presentation.',
    text: `Prototype AI analysis prepared a listing for ${name}.` };
  return null;
}

function systemContext(action: string) {
  return `You are Setu, the AI business assistant inside ShilpSetu AI, a prototype for rural Indian artisans. Give practical, simple, respectful advice. Never invent facts about the artisan. For prices, give an estimate and explain that the artisan should confirm material and labour costs. Focus on ethical selling, fair pricing, product quality, customer communication and small-business growth. Current task: ${action}.`;
}

async function generate(parts: any[], responseJson = false) {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) throw new Error('Gemini API key is not configured. Add GEMINI_API_KEY in Vercel Environment Variables.');
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      contents: [{ role: 'user', parts }],
      generationConfig: responseJson ? { responseMimeType: 'application/json' } : undefined,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || 'Gemini request failed.');
  const text = extractText(data);
  if (!text) throw new Error('The AI returned an empty response.');
  return text;
}

function imagePart(image: string) {
  const match = image.match(/^data:(image\/[\w.+-]+);base64,(.+)$/);
  if (!match) throw new Error('Invalid image format. Please upload the photo again.');
  if (match[2].length > 16_000_000) throw new Error('Image is too large. Please upload a smaller photo.');
  return { inlineData: { mimeType: match[1], data: match[2] } };
}

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') return json(res, 204, {});
  if (req.method !== 'POST') return json(res, 405, { error: 'POST only' });
  try {
    const { action, ...payload } = req.body || {};
    if (!action) return json(res, 400, { error: 'Missing AI action.' });

    let text = '';
    let result: any = {};
    const fallback = !hasAIKey() ? localFallback(action, payload) : null;
    if (fallback && action !== 'photo-edit' && action !== 'voice') return json(res, 200, fallback);

    if (action === 'coach') {
      text = await generate([{ text: `${systemContext('business coaching')}\nArtisan: ${JSON.stringify(payload.artisan)}\nProduct: ${JSON.stringify(payload.product)}\nQuestion: ${payload.question}\nSelected UI language: ${payload.language || 'English'}. Answer in that language. Keep it concise, actionable and easy to understand.` }]);
      result = { text };
    } else if (action === 'description') {
      text = await generate([{ text: `${systemContext('product listing copy')}\nProduct name: ${payload.productName || ''}\nCurrent description: ${payload.description || ''}\nWrite the description in ${payload.language || 'English'}. Create one marketplace-ready product description in 60-90 words. Mention material, handmade nature and useful qualities only when supported by the input. Return only the description.` }]);
      result = { text };
    } else if (action === 'translate') {
      text = await generate([{ text: `${systemContext('catalogue translation')}\nTranslate this product description into ${payload.language}. Preserve the meaning and keep it natural for an Indian artisan marketplace. Return only the translation.\n${payload.description || ''}` }]);
      result = { text };
    } else if (action === 'categorize') {
      text = await generate([{ text: `${systemContext('product categorisation')}\nProduct: ${JSON.stringify(payload)}\nReturn JSON: {"category":"..."}. Choose a practical marketplace category.` }], true);
      result = cleanJson(text);
    } else if (action === 'price') {
      text = await generate([{ text: `${systemContext('smart pricing')}\nProduct: ${JSON.stringify(payload)}\nEstimate a fair Indian retail price using material, craft type, complexity and quantity if supplied. Do not pretend this is a verified market price. Return JSON: {"price": number, "reason":"short explanation"}.` }], true);
      result = cleanJson(text);
    } else if (action === 'buyers') {
      text = await generate([{ text: `${systemContext('buyer matching')}\nProduct: ${JSON.stringify(payload.product)}\nKnown buyer examples: Delhi Handicraft Store, Home Décor Boutique, Green Living Store, Corporate Gift Shop, FolkCraft Collective. Return JSON with 3-5 plausible buyer leads, each having name, location, interest, quantity, budget, match (0-100), initials. Do not claim they are real confirmed leads; label them as suggested buyer types/leads.` }], true);
      result = cleanJson(text);
    } else if (action === 'voice') {
      if (!payload.audio) return json(res, 400, { error: 'No voice recording was received.' });
      const audio = String(payload.audio);
      const match = audio.match(/^data:(audio\/[\w.+-]+);base64,(.+)$/);
      if (!match) return json(res, 400, { error: 'Invalid voice recording format. Please try again.' });
      if (match[2].length > 10_000_000) return json(res, 413, { error: 'Voice recording is too large. Please speak for a shorter time.' });
      text = await generate([
        { inline_data: { mime_type: match[1], data: match[2] } },
        { text: `${systemContext('voice transcription')} Transcribe the artisan's speech accurately. The speaker may use English, Hindi, Punjabi, Bengali, Gujarati, Marathi, Tamil, Telugu, Kannada, Malayalam, Odia, Assamese, Urdu, or a mix of these languages. Preserve the meaning and do not add information. Return only the transcription text, with no quotation marks. Selected UI language: ${payload.language || 'English'}.` },
      ]);
      result = { text };
    } else if (action === 'photo-analysis') {
      if (!payload.image) return json(res, 400, { error: 'Please upload a product photo.' });
      const image = imagePart(String(payload.image));
      text = await generate([image, { text: `${systemContext('multimodal product photo analysis')}\nAnalyse this artisan product photo. Existing product name: ${payload.productName || ''}. Existing description: ${payload.description || ''}. Return JSON with: name, category, material, craftType, origin (only if known from supplied context; otherwise "Not specified"), description (60-90 words), tags (array of 4-6 short tags), story (2-3 sentences), confidence (0-100), visualAdvice (one sentence). Do not identify people. Do not invent an exact origin from appearance alone.` }], true);
      result = cleanJson(text);
      result.text = `AI identified this as ${result.name || 'an artisan product'} in ${result.category || 'a craft category'} with ${result.material || 'a handmade material'}. ${result.visualAdvice || ''}`.trim();
    } else if (action === 'photo-edit') {
      if (!payload.image) return json(res, 400, { error: 'Please capture or upload a product photo first.' });
      const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
      if (!key) throw new Error('Gemini API key is not configured. Add GEMINI_API_KEY in Vercel Environment Variables.');
      const raw = String(payload.image);
      const match = raw.match(/^data:(image\/[\w.+-]+);base64,(.+)$/);
      if (!match) return json(res, 400, { error: 'Invalid image format. Please choose the photo again.' });
      if (match[2].length > 16_000_000) return json(res, 413, { error: 'Image is too large. Please choose a smaller photo.' });
      const style = String(payload.style || 'Warm daylight');
      const prompt = `Edit the provided artisan product photograph for a small Indian craft marketplace. Keep the actual product faithful to the source: do not replace it with a different product, change its shape, invent details, or remove important product features. Improve presentation only. Style: ${style}. Product: ${payload.productName || 'artisan product'}. Context: ${payload.description || ''}. Use natural realistic lighting, a clean uncluttered background, realistic shadows, and a professional e-commerce composition. Do not add text, logos, watermarks, people, or decorative objects that distract from the product.`;
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [
            { inlineData: { mimeType: match[1], data: match[2] } },
            { text: prompt },
          ] }],
          generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
        }),
      });
      const imageData = await response.json();
      if (!response.ok) throw new Error(imageData?.error?.message || 'Gemini image editing failed. If your API project does not have image generation enabled, enable billing/image generation for the Gemini API.');
      const parts = imageData?.candidates?.[0]?.content?.parts || [];
      const generated = parts.find((part: any) => part?.inlineData?.data || part?.inline_data?.data);
      const generatedData = generated?.inlineData?.data || generated?.inline_data?.data;
      const generatedMime = generated?.inlineData?.mimeType || generated?.inline_data?.mime_type || 'image/png';
      if (!generatedData) throw new Error('Gemini returned text but no edited image. Please try again.');
      result = { image: `data:${generatedMime};base64,${generatedData}`, text: extractText(imageData) };
    } else {
      return json(res, 400, { error: `Unknown AI action: ${action}` });
    }
    return json(res, 200, result);
  } catch (error) {
    console.error(error);
    return json(res, 500, { error: error instanceof Error ? error.message : 'AI request failed.' });
  }
}
