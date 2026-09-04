import { createContext, type FormEvent, type ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Bot,
  Camera,
  Check,
  ChevronRight,
  CircleCheck,
  ClipboardList,
  Clock3,
  Home,
  Image as ImageIcon,
  IndianRupee,
  Languages,
  Leaf,
  MapPin,
  MessageCircle,
  Mic,
  Package,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Send,
  ShoppingBag,
  Sparkles,
  Store,
  Upload,
  UserRound,
  WandSparkles,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

type Language = 'English' | 'हिन्दी' | 'ਪੰਜਾਬੀ' | 'বাংলা' | 'ગુજરાતી' | 'मराठी' | 'தமிழ்' | 'తెలుగు' | 'ಕನ್ನಡ' | 'മലയാളം' | 'ଓଡ଼ିଆ' | 'অসমীয়া' | 'اردو';

const LANGUAGES: { value: Language; native: string; label: string }[] = [
  { value: 'English', native: 'English', label: 'English' },
  { value: 'हिन्दी', native: 'हिन्दी', label: 'Hindi' },
  { value: 'ਪੰਜਾਬੀ', native: 'ਪੰਜਾਬੀ', label: 'Punjabi' },
  { value: 'বাংলা', native: 'বাংলা', label: 'Bengali' },
  { value: 'ગુજરાતી', native: 'ગુજરાતી', label: 'Gujarati' },
  { value: 'मराठी', native: 'मराठी', label: 'Marathi' },
  { value: 'தமிழ்', native: 'தமிழ்', label: 'Tamil' },
  { value: 'తెలుగు', native: 'తెలుగు', label: 'Telugu' },
  { value: 'ಕನ್ನಡ', native: 'ಕನ್ನಡ', label: 'Kannada' },
  { value: 'മലയാളം', native: 'മലയാളം', label: 'Malayalam' },
  { value: 'ଓଡ଼ିଆ', native: 'ଓଡ଼ିଆ', label: 'Odia' },
  { value: 'অসমীয়া', native: 'অসমীয়া', label: 'Assamese' },
  { value: 'اردو', native: 'اردو', label: 'Urdu' },
];
const UI_TEXT: Record<Language, Record<string, string>> = {
  'English': { home:'Home', products:'Products', buyers:'Buyers', orders:'Orders', profile:'Profile', create:'Create New Profile', start:'Start your journey', demo:'Explore demo' },
  'हिन्दी': { home:'होम', products:'उत्पाद', buyers:'खरीदार', orders:'ऑर्डर', profile:'प्रोफ़ाइल', create:'नई प्रोफ़ाइल बनाएं', start:'शुरू करें', demo:'डेमो देखें' },
  'ਪੰਜਾਬੀ': { home:'ਹੋਮ', products:'ਉਤਪਾਦ', buyers:'ਖਰੀਦਦਾਰ', orders:'ਆਰਡਰ', profile:'ਪ੍ਰੋਫ਼ਾਈਲ', create:'ਨਵੀਂ ਪ੍ਰੋਫ਼ਾਈਲ ਬਣਾਓ', start:'ਸ਼ੁਰੂ ਕਰੋ', demo:'ਡੈਮੋ ਵੇਖੋ' },
  'বাংলা': { home:'হোম', products:'পণ্য', buyers:'ক্রেতা', orders:'অর্ডার', profile:'প্রোফাইল', create:'নতুন প্রোফাইল তৈরি করুন', start:'শুরু করুন', demo:'ডেমো দেখুন' },
  'ગુજરાતી': { home:'હોમ', products:'ઉત્પાદનો', buyers:'ખરીદદારો', orders:'ઓર્ડર', profile:'પ્રોફાઇલ', create:'નવી પ્રોફાઇલ બનાવો', start:'શરૂ કરો', demo:'ડેમો જુઓ' },
  'मराठी': { home:'मुख्यपृष्ठ', products:'उत्पादने', buyers:'खरेदीदार', orders:'ऑर्डर', profile:'प्रोफाइल', create:'नवीन प्रोफाइल तयार करा', start:'सुरू करा', demo:'डेमो पहा' },
  'தமிழ்': { home:'முகப்பு', products:'தயாரிப்புகள்', buyers:'வாங்குபவர்கள்', orders:'ஆர்டர்கள்', profile:'சுயவிவரம்', create:'புதிய சுயவிவரம் உருவாக்கு', start:'தொடங்குங்கள்', demo:'டெமோ பார்க்க' },
  'తెలుగు': { home:'హోమ్', products:'ఉత్పత్తులు', buyers:'కొనుగోలుదారులు', orders:'ఆర్డర్లు', profile:'ప్రొఫైల్', create:'కొత్త ప్రొఫైల్ సృష్టించండి', start:'ప్రారంభించండి', demo:'డెమో చూడండి' },
  'ಕನ್ನಡ': { home:'ಮುಖಪುಟ', products:'ಉತ್ಪನ್ನಗಳು', buyers:'ಖರೀದಿದಾರರು', orders:'ಆರ್ಡರ್‌ಗಳು', profile:'ಪ್ರೊಫೈಲ್', create:'ಹೊಸ ಪ್ರೊಫೈಲ್ ರಚಿಸಿ', start:'ಪ್ರಾರಂಭಿಸಿ', demo:'ಡೆಮೋ ನೋಡಿ' },
  'മലയാളം': { home:'ഹോം', products:'ഉൽപ്പന്നങ്ങൾ', buyers:'വാങ്ങുന്നവർ', orders:'ഓർഡറുകൾ', profile:'പ്രൊഫൈൽ', create:'പുതിയ പ്രൊഫൈൽ സൃഷ്ടിക്കുക', start:'തുടങ്ങുക', demo:'ഡെമോ കാണുക' },
  'ଓଡ଼ିଆ': { home:'ହୋମ୍', products:'ଉତ୍ପାଦ', buyers:'କ୍ରେତା', orders:'ଅର୍ଡର', profile:'ପ୍ରୋଫାଇଲ୍', create:'ନୂଆ ପ୍ରୋଫାଇଲ୍ ସୃଷ୍ଟି କରନ୍ତୁ', start:'ଆରମ୍ଭ କରନ୍ତୁ', demo:'ଡେମୋ ଦେଖନ୍ତୁ' },
  'অসমীয়া': { home:'হোম', products:'পণ্য', buyers:'ক্ৰেতা', orders:'অৰ্ডাৰ', profile:'প্ৰ’ফাইল', create:'নতুন প্ৰ’ফাইল বনাওক', start:'আৰম্ভ কৰক', demo:'ডেমো চাওক' },
  'اردو': { home:'ہوم', products:'مصنوعات', buyers:'خریدار', orders:'آرڈرز', profile:'پروفائل', create:'نیا پروفائل بنائیں', start:'شروع کریں', demo:'ڈیمو دیکھیں' },
};
function ui(language: Language, key: string) { return UI_TEXT[language]?.[key] || UI_TEXT.English[key] || key; }

type OrderStatus = 'Processing' | 'Ready' | 'Shipped' | 'Delivered';

type Product = {
  name: string;
  price: number;
  stock: number;
  description: string;
  category: string;
  material: string;
  craftType: string;
  origin: string;
  tags: string[];
  story: string;
  published: boolean;
};

type Artisan = {
  name: string;
  place: string;
  craft: string;
  experience: string;
  phone: string;
};

const EMPTY_ARTISAN: Artisan = {
  name: '',
  place: '',
  craft: '',
  experience: '',
  phone: '',
};

const DEMO_ARTISAN: Artisan = {
  name: 'Meena Devi',
  place: 'Sonipat, Haryana',
  craft: 'Bamboo Handicrafts',
  experience: '8 years',
  phone: '+91 98765 43210',
};

type Order = {
  id: string;
  buyer: string;
  product: string;
  quantity: number;
  total: number;
  status: OrderStatus;
};

type InventoryItem = {
  name: string;
  available: number;
};

type Buyer = {
  name: string;
  location: string;
  interest: string;
  quantity: number;
  budget: string;
  match: number;
  initials: string;
};

type AppState = {
  language: Language;
  setLanguage: (language: Language) => void;
  artisan: Artisan;
  setArtisan: React.Dispatch<React.SetStateAction<Artisan>>;
  product: Product;
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
  photoReady: boolean;
  setPhotoReady: (ready: boolean) => void;
  photoDataUrl: string;
  setPhotoDataUrl: (url: string) => void;
  photoAnalysis: string;
  setPhotoAnalysis: (analysis: string) => void;
  editedPhotoDataUrl: string;
  setEditedPhotoDataUrl: (url: string) => void;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  selectedBuyer: Buyer;
  setSelectedBuyer: (buyer: Buyer) => void;
};

const queryClient = new QueryClient();
const AppContext = createContext<AppState | null>(null);

function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('App context is missing');
  return context;
}

function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('shilpsetu-language');
      return ['English','हिन्दी','ਪੰਜਾਬੀ','বাংলা','ગુજરાતી','मराठी','தமிழ்','తెలుగు','ಕನ್ನಡ','മലയാളം','ଓଡ଼ିଆ','অসমীয়া','اردو'].includes(saved || '') ? saved as Language : 'English';
    } catch {
      return 'English';
    }
  });
  const [artisan, setArtisan] = useState<Artisan>(() => {
    try {
      const saved = localStorage.getItem('shilpsetu-artisan');
      return saved ? { ...DEMO_ARTISAN, ...JSON.parse(saved) } : DEMO_ARTISAN;
    } catch {
      return DEMO_ARTISAN;
    }
  });
  const [product, setProduct] = useState<Product>({
    name: 'Handmade Bamboo Basket',
    price: 999,
    stock: 32,
    description: 'Beautiful handwoven bamboo basket crafted by skilled rural artisans. Lightweight, durable and suitable for home décor and storage.',
    category: 'Home Décor',
    material: 'Bamboo',
    craftType: 'Handwoven',
    origin: 'Haryana',
    tags: ['#Handmade', '#Bamboo', '#IndianCraft', '#RuralArtisan'],
    story: 'Handcrafted using locally sourced bamboo. Each basket is carefully made by skilled artisans.',
    published: false,
  });
  const [photoReady, setPhotoReady] = useState(false);
  const [photoDataUrl, setPhotoDataUrl] = useState('');
  const [photoAnalysis, setPhotoAnalysis] = useState('');
  const [editedPhotoDataUrl, setEditedPhotoDataUrl] = useState('');
  const [orders, setOrders] = useState<Order[]>([
    { id: '#1024', buyer: 'Delhi Handicraft Store', product: 'Bamboo Basket', quantity: 20, total: 19980, status: 'Processing' },
    { id: '#1023', buyer: 'Home Décor Boutique', product: 'Bamboo Basket', quantity: 10, total: 9990, status: 'Delivered' },
  ]);
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { name: 'Bamboo Basket', available: 32 },
    { name: 'Handmade Mat', available: 14 },
    { name: 'Wood Craft', available: 8 },
  ]);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer>({
    name: 'Delhi Handicraft Store',
    location: 'New Delhi',
    interest: 'Bamboo Products',
    quantity: 20,
    budget: '₹900–₹1,100 per unit',
    match: 94,
    initials: 'DH',
  });
  useEffect(() => {
    try {
      localStorage.setItem('shilpsetu-artisan', JSON.stringify(artisan));
      localStorage.setItem('shilpsetu-language', language);
    } catch {}
  }, [artisan, language]);

  const value = useMemo(() => ({
    language, setLanguage, artisan, setArtisan, product, setProduct, photoReady, setPhotoReady, photoDataUrl, setPhotoDataUrl, photoAnalysis, setPhotoAnalysis, editedPhotoDataUrl, setEditedPhotoDataUrl,
    orders, setOrders, inventory, setInventory, selectedBuyer, setSelectedBuyer,
  }), [language, artisan, product, photoReady, photoDataUrl, photoAnalysis, editedPhotoDataUrl, orders, inventory, selectedBuyer]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Real AI service layer. Secrets stay server-side; the browser only calls /api/ai.
type AIAction = 'coach' | 'description' | 'translate' | 'categorize' | 'price' | 'buyers' | 'photo-analysis' | 'photo-edit' | 'voice';

async function callAI(action: AIAction, payload: Record<string, unknown>) {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...payload }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'AI service is unavailable right now.');
  return data;
}

async function prepareImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected image.'));
    reader.onload = () => {
      const source = String(reader.result || '');
      const img = new Image();
      img.onload = () => {
        const maxSide = 1400;
        const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Could not prepare the image.'));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.84));
      };
      img.onerror = () => reject(new Error('This image could not be opened. Please choose another photo.'));
      img.src = source;
    };
    reader.readAsDataURL(file);
  });
}

function languageToSpeechLocale(language: Language): string {
  const locales: Record<Language, string> = {
    'English': 'en-IN', 'हिन्दी': 'hi-IN', 'ਪੰਜਾਬੀ': 'pa-IN', 'বাংলা': 'bn-IN',
    'ગુજરાતી': 'gu-IN', 'मराठी': 'mr-IN', 'தமிழ்': 'ta-IN', 'తెలుగు': 'te-IN',
    'ಕನ್ನಡ': 'kn-IN', 'മലയാളം': 'ml-IN', 'ଓଡ଼ିଆ': 'or-IN', 'অসমীয়া': 'as-IN', 'اردو': 'ur-IN'
  };
  return locales[language] || 'en-IN';
}

function voiceErrorMessage(error: string): string {
  const messages: Record<string, string> = {
    'not-allowed': 'Microphone access was blocked. Click the lock icon beside the Vercel URL and allow Microphone, then try again.',
    'audio-capture': 'No microphone was found. Check that your microphone is connected and enabled.',
    'not-supported': 'Voice capture is not supported by this browser. Please use the latest Chrome or Edge.',
    'no-speech': 'I could not hear speech. Please try again.',
  };
  return messages[error] || `Voice capture failed (${error}). Please try again.`;
}

/**
 * Reliable voice capture for the deployed prototype.
 * We record the microphone ourselves and send the short recording to Gemini
 * for transcription. This avoids depending on browser SpeechRecognition.
 */
export async function speechToText(language: Language = 'English'): Promise<string> {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (SpeechRecognition) {
    return new Promise((resolve, reject) => {
      const recognition = new SpeechRecognition();
      recognition.lang = languageToSpeechLocale(language);
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;
      let finished = false;
      const timer = window.setTimeout(() => {
        if (!finished) recognition.stop();
      }, 8000);
      recognition.onresult = (event: any) => {
        const text = Array.from(event.results || [])
          .map((result: any) => result?.[0]?.transcript || '')
          .join(' ')
          .trim();
        if (text) { finished = true; window.clearTimeout(timer); resolve(text); }
      };
      recognition.onerror = (event: any) => {
        window.clearTimeout(timer);
        if (event?.error === 'not-allowed') reject(new Error(voiceErrorMessage('not-allowed')));
        else if (event?.error === 'no-speech') reject(new Error(voiceErrorMessage('no-speech')));
        else reject(new Error(`Voice capture failed (${event?.error || 'unknown'}). Please try again.`));
      };
      recognition.onend = () => {
        window.clearTimeout(timer);
        if (!finished) reject(new Error(voiceErrorMessage('no-speech')));
      };
      try { recognition.start(); }
      catch { window.clearTimeout(timer); reject(new Error('Could not start voice capture. Please try again.')); }
    });
  }

  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
    throw new Error(voiceErrorMessage('not-supported'));
  }
  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (error: any) {
    throw new Error(voiceErrorMessage(error?.name === 'NotAllowedError' ? 'not-allowed' : error?.name === 'NotFoundError' ? 'audio-capture' : 'unknown'));
  }
  const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'].find((type) => MediaRecorder.isTypeSupported(type)) || '';
  const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
  const chunks: Blob[] = [];
  return new Promise((resolve, reject) => {
    const stop = () => { if (recorder.state === 'recording') recorder.stop(); };
    recorder.ondataavailable = (event) => { if (event.data?.size) chunks.push(event.data); };
    recorder.onerror = () => { stream.getTracks().forEach((track) => track.stop()); reject(new Error('The microphone recorder stopped unexpectedly. Please try again.')); };
    recorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
      if (!blob.size) return reject(new Error('No audio was captured. Please speak clearly and try again.'));
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const result = await callAI('voice', { audio: String(reader.result || ''), language, locale: languageToSpeechLocale(language) });
          const text = String(result.text || '').trim();
          if (!text) throw new Error('The recording was captured, but no words were detected.');
          resolve(text);
        } catch (error) { reject(error instanceof Error ? error : new Error('Voice transcription failed.')); }
      };
      reader.onerror = () => reject(new Error('Could not read the recording. Please try again.'));
      reader.readAsDataURL(blob);
    };
    try { recorder.start(200); window.setTimeout(stop, 6000); }
    catch (error) { stream.getTracks().forEach((track) => track.stop()); reject(error instanceof Error ? error : new Error('Could not start voice capture.')); }
  });
}
export async function generateProductDescription(context: Record<string, unknown> = {}): Promise<string> {
  const data = await callAI('description', context);
  return data.text || '';
}
export async function translateCatalogue(language: Language, context: Record<string, unknown> = {}): Promise<string> {
  const data = await callAI('translate', { language, ...context });
  return data.text || '';
}
export async function categorizeProduct(context: Record<string, unknown> = {}): Promise<string> {
  const data = await callAI('categorize', context);
  return data.category || data.text || '';
}
export async function suggestPrice(context: Record<string, unknown> = {}): Promise<number> {
  const data = await callAI('price', context);
  return Number(data.price || 0);
}
export async function matchBuyers(context: Record<string, unknown> = {}): Promise<Buyer[]> {
  const data = await callAI('buyers', context);
  return Array.isArray(data.buyers) ? data.buyers : buyers;
}
export async function businessCoach(question: string, context: Record<string, unknown> = {}): Promise<string> {
  const data = await callAI('coach', { question, ...context });
  return data.text || 'I could not generate advice right now. Please try again.';
}

function Logo({ light = false }: { light?: boolean }) {
  return <div className="mark" data-testid="brand-shilpsetu"><span className="mark-dot"><Leaf size={15} /></span><span>ShilpSetu <span style={{ color: light ? '#f1d797' : 'hsl(var(--primary))' }}>AI</span></span></div>;
}

function BasketArt({ small = false }: { small?: boolean }) {
  return <div className="basket-art" data-testid={small ? 'image-basket-small' : 'image-basket-hero'}><svg viewBox="0 0 220 180" aria-label="Handmade bamboo basket illustration" role="img">
    <path d="M52 76 C55 132 76 153 110 156 C144 153 165 132 168 76 Z" fill="#a95e32" stroke="#6d412c" strokeWidth="4" />
    <path d="M48 75 C58 64 160 64 172 75 C163 86 57 86 48 75Z" fill="#d79a57" stroke="#6d412c" strokeWidth="4" />
    <path d="M66 73 C70 35 83 19 110 19 C137 19 150 35 154 73" fill="none" stroke="#7e4c2e" strokeWidth="9" strokeLinecap="round" />
    <path d="M61 93 L70 139 M79 88 L86 148 M98 87 L101 153 M119 87 L118 153 M139 88 L132 148 M157 92 L147 139" stroke="#e1b16d" strokeWidth="5" opacity=".9" />
    <path d="M56 106 C83 116 140 116 164 106 M61 124 C86 133 137 133 158 124" fill="none" stroke="#754529" strokeWidth="4" opacity=".8" />
    <path d="M76 52 C91 45 128 45 144 52" fill="none" stroke="#e1b16d" strokeWidth="4" />
  </svg></div>;
}

function WelcomePage() {
  const [, setLocation] = useLocation();
  const { language, setLanguage } = useApp();
  return <main className="welcome noise"><section className="welcome-panel animate-rise">
    <div className="welcome-story"><Logo light /><div className="story-copy"><div className="eyebrow" style={{ color: '#f1d797' }}>Your craft. Your next chapter.</div><h1 className="display">Make your hands<br />count online.</h1><p>AI-powered tools that help artisans create, price and sell their products.</p><div className="feature-grid"><span><Camera size={14} /> Create better listings</span><span><IndianRupee size={14} /> Price smarter</span><span><Store size={14} /> Find buyers</span></div></div><div className="story-footer"><strong>01 / 04</strong><span>Built for India's makers</span></div></div>
    <div className="welcome-form"><div className="eyebrow">A warm start</div><h2 className="display">Namaste, artisan.</h2><p>Choose a language to begin. We will keep every step short, visual and in your control.</p><div className="language-grid">{LANGUAGES.map((item) => <button key={item.value} type="button" className={`language-button ${language === item.value ? 'selected' : ''}`} onClick={() => setLanguage(item.value)} data-testid={`button-language-${item.value}`}><strong>{item.native}</strong><span>{item.label}</span></button>)}</div><button type="button" className="primary-button full-button" onClick={() => setLocation('/register')} data-testid="button-begin">{ui(language, 'start')} <ArrowRight size={16} /></button><button type="button" className="secondary-button full-button demo-button" onClick={() => { localStorage.removeItem('shilpsetu-artisan'); window.location.href = '/dashboard'; }} data-testid="button-explore-demo">{ui(language, 'demo')}</button><p className="form-note">No bank details needed. This demo keeps your choices on this device.</p></div>
  </section></main>;
}

function RegistrationPage() {
  const [location, setLocation] = useLocation();
  const { artisan, setArtisan, language, setProduct, setPhotoReady, setPhotoDataUrl, setPhotoAnalysis, setEditedPhotoDataUrl, setOrders, setInventory, setSelectedBuyer } = useApp();
  const isNewProfile = location.includes('?new=1');
  const [form, setForm] = useState<Artisan>(() => isNewProfile ? EMPTY_ARTISAN : artisan);
  const [error, setError] = useState('');
  const update = (key: keyof Artisan, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError('');
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const cleaned = Object.fromEntries(Object.entries(form).map(([k,v]) => [k, v.trim()])) as Artisan;
    if (!cleaned.name || !cleaned.place || !cleaned.craft || !cleaned.experience || !cleaned.phone) {
      setError('Please fill in every field so we can create your artisan profile.');
      return;
    }
    setArtisan(cleaned);
    // A new artisan starts with a clean workspace instead of inheriting Meena's demo data.
    setProduct({
      name: '', price: 0, stock: 0, description: '', category: '', material: '',
      craftType: '', origin: cleaned.place, tags: [], story: '', published: false,
    });
    setPhotoReady(false);
    setPhotoDataUrl('');
    setPhotoAnalysis('');
    setEditedPhotoDataUrl('');
    setOrders([]);
    setInventory([]);
    setSelectedBuyer({ name: '', location: '', interest: '', quantity: 0, budget: '', match: 0, initials: '' });
    setLocation('/dashboard');
  };
  return <main className="welcome noise"><section className="welcome-panel animate-rise">
    <div className="welcome-story"><Logo light /><div className="story-copy"><div className="eyebrow" style={{ color: '#f1d797' }}>{isNewProfile ? 'Create a new workspace' : 'Step 02 / 04'}</div><h1 className="display">Let us put<br />a name to it.</h1><p>Your name and craft help your catalogue sound like you, not a template.</p></div><div className="story-footer"><strong>{language}</strong><span>Saved privately on this device</span></div></div>
    <form className="welcome-form" onSubmit={submit}><button type="button" className="icon-button" onClick={() => setLocation('/')} aria-label="Back"><ArrowLeft size={18} /></button><div className="eyebrow" style={{ marginTop: '1.5rem' }}>Your maker profile</div><h2 className="display">Create your artisan profile.</h2><p>Enter your own details. Meena Devi is only the demo profile.</p><div className="form-stack"><div className="field-group"><label htmlFor="artisan-name">Name</label><input id="artisan-name" className="field-input" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Sunita Kumari" /></div><div className="field-group"><label htmlFor="artisan-place">Village / City</label><input id="artisan-place" className="field-input" value={form.place} onChange={(e) => update('place', e.target.value)} placeholder="e.g. Sonipat, Haryana" /></div><div className="form-inline"><div className="field-group"><label htmlFor="artisan-craft">Craft Type</label><input id="artisan-craft" className="field-input" value={form.craft} onChange={(e) => update('craft', e.target.value)} placeholder="e.g. Pottery" /></div><div className="field-group"><label htmlFor="artisan-experience">Experience</label><input id="artisan-experience" className="field-input" value={form.experience} onChange={(e) => update('experience', e.target.value)} placeholder="e.g. 5 years" /></div></div><div className="field-group"><label htmlFor="artisan-phone">Phone Number</label><input id="artisan-phone" className="field-input" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 98765 43210" /></div></div>{error && <div className="error-message" role="alert">{error}</div>}<button type="submit" className="primary-button full-button">Create my profile <ArrowRight size={16} /></button></form>
  </section></main>;
}

const navItems = [
  { path: '/dashboard', key: 'home', label: 'Home', icon: <Home size={16} /> },
  { path: '/add-product', key: 'products', label: 'Products', icon: <ShoppingBag size={16} /> },
  { path: '/market', key: 'buyers', label: 'Buyers', icon: <Store size={16} /> },
  { path: '/orders', key: 'orders', label: 'Orders', icon: <ClipboardList size={16} /> },
  { path: '/profile', key: 'profile', label: 'Profile', icon: <UserRound size={16} /> },
];

function NavItem({ path, label, icon, current }: { path: string; label: string; icon: ReactNode; current: string }) {
  const [, setLocation] = useLocation();
  return <button type="button" className={`nav-item ${current === path ? 'active' : ''}`} onClick={() => setLocation(path)}>{icon}<span>{label}</span></button>;
}

function AppShell({ children, current }: { children: ReactNode; current: string }) {
  const [, setLocation] = useLocation();
  const { artisan, language, setLanguage } = useApp();
  return <div className="workspace noise"><aside className="sidebar"><Logo light /><nav aria-label="Main navigation">{navItems.map((item) => <NavItem key={item.path} {...item} label={ui(language, item.key)} current={current} />)}</nav><div className="sidebar-bottom"><div className="profile-row"><span className="avatar">{artisan.name ? artisan.name.split(/\s+/).map((p) => p[0]).join('').slice(0,2).toUpperCase() : 'AR'}</span><span><strong>{artisan.name || 'New Artisan'}</strong><small>{artisan.craft || 'Create your craft profile'}</small></span></div><button type="button" className="secondary-button full-button" style={{ marginTop: '0.75rem' }} onClick={() => setLocation('/register?new=1')}><Plus size={14} /> {ui(language, 'create')}</button></div></aside><div className="main-area"><header className="topbar"><div className="mobile-mark"><Logo /></div><div className="topbar-context eyebrow">{current === '/dashboard' ? `Good morning, ${artisan.name.split(' ')[0]}` : ui(language, navItems.find((item) => item.path === current)?.key || 'home')}</div><div className="topbar-right"><label className="language-chip" title="Choose language"><Languages size={13} /><select value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label="Choose language">{LANGUAGES.map((item) => <option key={item.value} value={item.value}>{item.native} — {item.label}</option>)}</select></label><button type="button" className="icon-button" onClick={() => setLocation('/profile')} aria-label="Open profile"><Bell size={17} /></button></div></header>{children}<nav className="bottom-nav" aria-label="Mobile navigation">{navItems.map((item) => <BottomNav key={item.path} {...item} label={ui(language, item.key)} current={current} />)}</nav></div></div>;
}

function BottomNav({ path, label, icon, current }: { path: string; label: string; icon: ReactNode; current: string }) {
  const [, setLocation] = useLocation();
  return <button type="button" className={current === path ? 'active' : ''} onClick={() => setLocation(path)}>{icon}<span>{label}</span></button>;
}

function PageHeading({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1 className="display">{title}</h1><p>{description}</p></div>{actions && <div className="heading-actions">{actions}</div>}</div>;
}

function DashboardPage() {
  const [, setLocation] = useLocation();
  const { artisan, product, orders } = useApp();
  return <AppShell current="/dashboard"><main className="content animate-rise"><PageHeading eyebrow="Your artisan dashboard" title={`Good Morning, ${artisan.name.split(' ')[0]}`} description="Let's grow your craft business." actions={<button type="button" className="primary-button" onClick={() => setLocation('/add-product')}><Plus size={16} /> Add new product</button>} /><div className="stats-grid">{[['12', 'Products Listed'], ['5', 'Buyer Enquiries'], ['7', 'Orders'], ['₹18,500', 'Estimated Sales']].map(([value, label]) => <div className="metric panel" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div><div className="dashboard-grid" style={{ marginTop: '1rem' }}><section className="hero-card panel"><div><div className="eyebrow">Your featured craft</div><h2 className="display">{product.name}</h2><p>Beautifully made. Clearly priced. Ready to meet its next home.</p></div><div className="hero-stat"><span /> Catalogue strength <strong>82 / 100</strong><ChevronRight size={14} /></div></section><section className="ai-coach-card panel"><span className="coach-orb"><Bot size={21} /></span><div className="eyebrow">ShilpSetu AI Coach</div><h2 className="serif">Need help with pricing, products or customers?</h2><button type="button" className="secondary-button" onClick={() => setLocation('/coach')}>Ask AI Coach <ArrowRight size={14} /></button></section></div><section className="panel panel-pad activity-panel"><div className="section-label"><h2>Recent Activity</h2><button type="button" className="text-link" onClick={() => setLocation('/orders')}>View orders</button></div><div className="activity-list"><div><span className="activity-icon green"><Store size={15} /></span><span>New buyer interested in your bamboo baskets</span><small>Today</small></div><div><span className="activity-icon gold"><IndianRupee size={15} /></span><span>New pricing suggestion available</span><small>Yesterday</small></div><div><span className="activity-icon terracotta"><Package size={15} /></span><span>Order #1024 received</span><small>Yesterday</small></div></div></section><section className="impact-panel panel"><div><div className="eyebrow" style={{ color: '#f1d797' }}>Your impact</div><h2 className="display">Your digital presence is growing.</h2><p>Every listing makes Meena's craft easier to find.</p></div><div className="impact-grid">{[['12', 'Products Listed'], ['27', 'Buyer Connections'], ['7', 'Orders Received'], ['₹18,500', 'Estimated Revenue'], ['3', 'Languages Supported']].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></section></main></AppShell>;
}

function AddProductPage() {
  const [, setLocation] = useLocation();
  const { product, setProduct, setPhotoDataUrl, setPhotoReady, setPhotoAnalysis, photoDataUrl, language } = useApp();
  const [form, setForm] = useState({ name: product.name, description: product.description });
  const [source, setSource] = useState('');
  const [error, setError] = useState('');
  const [working, setWorking] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const stopCamera = () => {
    cameraStream?.getTracks().forEach((track) => track.stop());
    setCameraStream(null);
    setCameraOpen(false);
  };

  const openCamera = async () => {
    setError('');
    const localDev = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    if (!window.isSecureContext && !localDev) {
      setError('Camera access requires HTTPS. Open the deployed HTTPS link or use localhost on this computer.');
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Live camera is not supported by this browser. Please use the latest Chrome or Edge.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStream(stream);
      setCameraOpen(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      });
    } catch (error: any) {
      setError(error?.name === 'NotAllowedError'
        ? 'Camera permission was blocked. Click the lock icon beside the Vercel URL, allow Camera, and try again.'
        : 'Could not open the camera. Make sure no other app is using it and try again.');
    }
  };

  const capturePhoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) {
      setError('Camera is not ready yet. Please wait a moment and try again.');
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL('image/jpeg', 0.86);
    stopCamera();
    setPhotoDataUrl(url);
    setEditedPhotoDataUrl('');
    setPhotoReady(false);
    setSource('camera');
    setWorking(true);
    setError('');
    try {
      const analysis = await callAI('photo-analysis', { image: url, productName: form.name, description: form.description });
      setPhotoAnalysis(analysis.text || '');
      setForm((current) => ({
        name: analysis.name || current.name,
        description: analysis.description || current.description,
      }));
      if (analysis.category || analysis.material || analysis.craftType || analysis.origin || analysis.tags || analysis.story) {
        setProduct((current) => ({
          ...current,
          name: analysis.name || current.name,
          category: analysis.category || current.category,
          material: analysis.material || current.material,
          craftType: analysis.craftType || current.craftType,
          origin: analysis.origin || current.origin,
          tags: Array.isArray(analysis.tags) ? analysis.tags : current.tags,
          story: analysis.story || current.story,
          description: analysis.description || current.description,
        }));
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'AI photo analysis failed.');
    } finally {
      setWorking(false);
    }
  };

  const handleVoice = async () => {
    setSource('voice');
    setError('');
    setWorking(true);
    try {
      const description = await speechToText(language);
      setForm((current) => ({ ...current, description }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Voice capture failed. Please try again.');
    } finally {
      setWorking(false);
    }
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please choose an image file.'); return; }
    if (file.size > 12 * 1024 * 1024) { setError('Please choose an image smaller than 12 MB.'); return; }
    setWorking(true);
    setError('');
    try {
      const url = await prepareImageFile(file);
      setPhotoDataUrl(url);
      setEditedPhotoDataUrl('');
      setPhotoReady(false);
      setSource(`photo: ${file.name}`);
      const analysis = await callAI('photo-analysis', { image: url, productName: form.name, description: form.description });
      setPhotoAnalysis(analysis.text || '');
      setForm((current) => ({ name: analysis.name || current.name, description: analysis.description || current.description }));
      setProduct((current) => ({
        ...current,
        name: analysis.name || current.name,
        category: analysis.category || current.category,
        material: analysis.material || current.material,
        craftType: analysis.craftType || current.craftType,
        origin: analysis.origin || current.origin,
        tags: Array.isArray(analysis.tags) ? analysis.tags : current.tags,
        story: analysis.story || current.story,
        description: analysis.description || current.description,
      }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'AI photo analysis failed.');
    } finally { setWorking(false); }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (!form.name.trim() && !form.description.trim() && !photoDataUrl) { setError('Add a product name, description, or photo to continue.'); return; }
    setWorking(true);
    try {
      const ai = await generateProductDescription({ productName: form.name, description: form.description, artisan: 'rural Indian artisan' });
      setProduct((current) => ({ ...current, name: form.name.trim() || current.name, description: ai || form.description.trim() }));
      setPhotoReady(false);
      setLocation('/photo-studio');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'AI generation failed.');
    } finally { setWorking(false); }
  };

  return <AppShell current="/add-product"><main className="content animate-rise">
    <PageHeading eyebrow="Create / 01" title="Add Your Product" description="Take a live photo, speak your description, and let AI prepare the listing." actions={<button type="button" className="secondary-button" onClick={() => setLocation('/dashboard')}><ArrowLeft size={15} /> Back</button>} />
    <form className="form-layout" onSubmit={submit}>
      <section className="panel panel-pad form-stack">
        <div className="input-options">
          <button type="button" className={`input-option ${source === 'camera' ? 'selected' : ''}`} onClick={() => void openCamera()} disabled={working}><Camera size={23} /><strong>Take Product Photo</strong><small>Open live camera</small></button>
          <button type="button" className={`input-option ${source.startsWith('photo:') ? 'selected' : ''}`} onClick={() => fileRef.current?.click()} disabled={working}><ImageIcon size={23} /><strong>Upload Photo</strong><small>Choose from gallery</small></button>
          <button type="button" className={`input-option ${source === 'voice' ? 'selected' : ''}`} onClick={() => void handleVoice()} disabled={working}><Mic size={23} /><strong>{working && source === 'voice' ? 'Listening…' : 'Describe by Voice'}</strong><small>6-second AI voice capture</small></button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(event) => { void handleFile(event.target.files?.[0]); event.currentTarget.value = ''; }} />
        <canvas ref={canvasRef} hidden />
        {cameraOpen && <div className="camera-overlay" role="dialog" aria-modal="true" aria-label="Live product camera"><div className="camera-modal"><div className="camera-header"><strong>Live Product Camera</strong><button type="button" className="secondary-button" onClick={stopCamera}>Close</button></div><video ref={videoRef} autoPlay playsInline muted className="camera-video" /><button type="button" className="primary-button camera-capture" onClick={() => void capturePhoto()}><Camera size={18} /> Capture Photo</button></div></div>}
        {photoDataUrl && <div className="photo-preview"><img src={photoDataUrl} alt="Selected product" style={{ width: '100%', maxHeight: 260, objectFit: 'contain', borderRadius: 12 }} /></div>}
        <div className="field-group"><label htmlFor="product-name">Product name</label><input id="product-name" className="field-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
        <div className="field-group"><label htmlFor="product-description">Describe your product</label><div className="input-with-action"><textarea id="product-description" className="field-input" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Example: Ye bamboo ki handmade basket hai..." /><button type="button" className="mic-button" onClick={() => void handleVoice()} disabled={working} aria-label="Describe product by voice"><Mic size={16} /></button></div><small>{working ? (source === 'voice' ? 'Listening and transcribing with AI…' : 'AI is analysing your product…') : source ? `Selected: ${source}` : 'A few words or a photo are enough.'}</small></div>
        {error && <div className="error-message" role="alert">{error}</div>}
        <div className="form-actions"><button type="button" className="secondary-button" onClick={() => setLocation('/dashboard')}>Cancel</button><button type="submit" className="primary-button" disabled={working}>{working ? 'AI is working…' : 'Generate with AI'} <ArrowRight size={15} /></button></div>
      </section>
      <aside className="panel panel-pad"><div className="eyebrow">AI product understanding</div><BasketArt small /><p className="aside-copy">Use the live camera or upload a photo. AI can identify the product, suggest a category and create marketplace-ready copy.</p></aside>
    </form>
  </main></AppShell>;
}

async function localPhotoEdit(dataUrl: string, style: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const maxSide = 1600;
      const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Could not edit the photo on this device.'));
      ctx.filter = style === 'Clean paper' ? 'brightness(1.06) contrast(1.05) saturate(0.9)' : style === 'Village courtyard' ? 'brightness(1.04) contrast(1.08) saturate(1.08)' : 'brightness(1.08) contrast(1.03) saturate(1.05)';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = () => reject(new Error('Could not open the photo for editing.'));
    img.src = dataUrl;
  });
}

function PhotoStudioPage() {
  const [, setLocation] = useLocation();
  const { photoReady, setPhotoReady, photoDataUrl, editedPhotoDataUrl, setEditedPhotoDataUrl, photoAnalysis, product } = useApp();
  const [processing, setProcessing] = useState(false);
  const [tool, setTool] = useState('Warm daylight');
  const [error, setError] = useState('');

  const editPhoto = async (style = tool) => {
    if (!photoDataUrl) {
      setError('Please capture or upload a product photo first.');
      return;
    }
    setProcessing(true);
    setError('');
    try {
      const result = await callAI('photo-edit', {
        image: photoDataUrl,
        style,
        productName: product.name,
        description: product.description,
      });
      if (!result.image) throw new Error('AI did not return an edited image. Please try again.');
      setEditedPhotoDataUrl(result.image);
      setPhotoReady(true);
    } catch (e) {
      try {
        const localEdited = await localPhotoEdit(photoDataUrl, style);
        setEditedPhotoDataUrl(localEdited);
        setPhotoReady(true);
        setError('AI service is unavailable, so a local smart photo edit was applied. Add GEMINI_API_KEY for generative AI editing.');
      } catch (localError) {
        setError(localError instanceof Error ? localError.message : (e instanceof Error ? e.message : 'Photo editing failed.'));
        setPhotoReady(false);
      }
    } finally {
      setProcessing(false);
    }
  };

  const chooseStyle = (name: string) => {
    setTool(name);
    void editPhoto(name);
  };

  useEffect(() => {
    if (photoDataUrl && !editedPhotoDataUrl && !processing) {
      void editPhoto('Warm daylight');
    }
  }, [photoDataUrl]);

  return <AppShell current="/add-product"><main className="content animate-rise">
    <PageHeading eyebrow="Create / 02" title="AI Photo Studio" description="Use your captured or uploaded product photo and let AI create a marketplace-ready visual." actions={<button type="button" className="secondary-button" onClick={() => setLocation('/add-product')}><ArrowLeft size={15} /> Back</button>} />
    <section className="panel panel-pad">
      {!photoDataUrl ? <div className="empty-photo-state"><Camera size={32} /><strong>No product photo yet</strong><p>Go back and capture a live photo or upload one from your gallery.</p><button type="button" className="primary-button" onClick={() => setLocation('/add-product')}>Add Product Photo</button></div> : <>
        <div className="studio-comparison">
          <div className="studio-frame before"><span className="studio-label">Original</span><img src={photoDataUrl} alt="Original product" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }} /></div>
          <div className="studio-arrow"><WandSparkles size={18} /></div>
          <div className="studio-frame after"><span className="studio-label">AI Edited</span>{processing ? <div className="studio-loading"><Sparkles size={24} /><strong>AI is editing your photo…</strong><small>Preparing a clean marketplace presentation</small></div> : editedPhotoDataUrl ? <img src={editedPhotoDataUrl} alt="AI edited product" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }} /> : <div className="studio-loading"><Sparkles size={24} /><strong>Choose an AI style</strong><small>Your edited photo will appear here.</small></div>}</div>
        </div>
        <div className="tool-row">{['Warm daylight', 'Clean paper', 'Village courtyard'].map((name) => <button type="button" key={name} className={`tool-chip ${tool === name ? 'active' : ''}`} disabled={processing} onClick={() => chooseStyle(name)}><Sparkles size={13} />{name}</button>)}</div>
        <div className="checklist"><span><Check size={14} /> Original photo kept</span><span><Check size={14} /> AI product analysis</span><span><Check size={14} /> AI visual edit</span><span><Check size={14} /> Marketplace-ready image</span></div>
        {photoAnalysis && <div className="panel panel-pad" style={{ marginTop: '1rem' }}><div className="eyebrow">AI product analysis</div><p>{photoAnalysis}</p></div>}
        {error && <div className="error-message" role="alert" style={{ marginTop: '1rem' }}>{error}</div>}
        <div className="form-actions"><button type="button" className="secondary-button" onClick={() => setLocation('/add-product')}>Change Photo</button><button type="button" className="primary-button" disabled={processing || !editedPhotoDataUrl} onClick={() => setLocation('/catalogue')}>{processing ? 'AI is editing…' : 'Use AI Result'} <ArrowRight size={15} /></button></div>
      </>}
    </section>
  </main></AppShell>;
}

function CataloguePage() {
  const [, setLocation] = useLocation();
  const { product, setProduct, editedPhotoDataUrl, photoDataUrl } = useApp();
  const [language, setLanguage] = useState<Language>('English');
  const [fields, setFields] = useState({ name: product.name, category: product.category, material: product.material, craftType: product.craftType, origin: product.origin, description: product.description, story: product.story });
  const [notice, setNotice] = useState('');
  const update = (key: keyof typeof fields, value: string) => setFields((current) => ({ ...current, [key]: value }));
  const refresh = async () => { try { const description = await translateCatalogue(language, { description: fields.description, productName: fields.name }); const category = await categorizeProduct({ name: fields.name, description: fields.description, material: fields.material }); setFields((current) => ({ ...current, description, category: category || current.category })); setNotice('AI catalogue refreshed with translation and categorisation.'); } catch (e) { setNotice(e instanceof Error ? e.message : 'AI catalogue refresh failed.'); } };
  const save = () => {
    if (!fields.name.trim() || !fields.description.trim()) { setNotice('Please add a product name and description before continuing.'); return; }
    setProduct((current) => ({ ...current, name: fields.name.trim(), category: fields.category, material: fields.material, craftType: fields.craftType, origin: fields.origin, description: fields.description.trim(), story: fields.story.trim() }));
    setLocation('/pricing');
  };
  return <AppShell current="/add-product"><main className="content animate-rise"><PageHeading eyebrow="Create / 03" title="AI Generated Catalogue" description="Created from your photo and voice description." actions={<button type="button" className="secondary-button" onClick={() => setLocation('/photo-studio')}><ArrowLeft size={15} /> Back</button>} /><div className="form-layout"><section className="panel panel-pad"><div className="section-label"><h2>Edit your catalogue</h2><button type="button" className="secondary-button" onClick={refresh}><Sparkles size={14} /> Refresh with AI</button></div><div className="language-tabs">{(['English','हिन्दी','ਪੰਜਾਬੀ','বাংলা','ગુજરાતી','मराठी','தமிழ்','తెలుగు','ಕನ್ನಡ','മലയാളം','ଓଡ଼ିଆ','অসমীয়া','اردو'] as Language[]).map((item) => <button type="button" key={item} className={`language-tab ${language === item ? 'active' : ''}`} onClick={() => setLanguage(item)}>{item}</button>)}</div><p className="ai-source"><WandSparkles size={13} /> AI generated in seconds from your photo + voice description</p><div className="catalogue-fields"><div className="field-group"><label htmlFor="catalogue-name">Product Name</label><input id="catalogue-name" className="field-input" value={fields.name} onChange={(event) => update('name', event.target.value)} /></div><div className="form-inline"><div className="field-group"><label htmlFor="catalogue-category">Category</label><input id="catalogue-category" className="field-input" value={fields.category} onChange={(event) => update('category', event.target.value)} /></div><div className="field-group"><label htmlFor="catalogue-material">Material</label><input id="catalogue-material" className="field-input" value={fields.material} onChange={(event) => update('material', event.target.value)} /></div></div><div className="form-inline"><div className="field-group"><label htmlFor="catalogue-craft">Craft Type</label><input id="catalogue-craft" className="field-input" value={fields.craftType} onChange={(event) => update('craftType', event.target.value)} /></div><div className="field-group"><label htmlFor="catalogue-origin">Origin</label><input id="catalogue-origin" className="field-input" value={fields.origin} onChange={(event) => update('origin', event.target.value)} /></div></div><div className="field-group"><label htmlFor="catalogue-description">Description</label><textarea id="catalogue-description" className="field-input" value={fields.description} onChange={(event) => update('description', event.target.value)} /></div><div className="field-group"><label htmlFor="catalogue-story">Craft Story</label><textarea id="catalogue-story" className="field-input" value={fields.story} onChange={(event) => update('story', event.target.value)} /></div><div className="tag-row">{product.tags.map((tag) => <span className="pill pill-green" key={tag}>{tag}</span>)}</div></div>{notice && <p className="success-inline"><CircleCheck size={14} />{notice}</p>}<div className="form-actions"><button type="button" className="secondary-button" onClick={() => setNotice('All fields are ready to edit.')}>Edit</button><button type="button" className="primary-button" onClick={save}>Continue to Smart Pricing <ArrowRight size={15} /></button></div></section><aside className="catalogue-preview panel"><div className="eyebrow">Live preview / {language}</div>{(editedPhotoDataUrl || photoDataUrl) ? <img src={editedPhotoDataUrl || photoDataUrl} alt="AI prepared product" style={{ width: '100%', height: 220, objectFit: 'contain', borderRadius: 12, marginBottom: '1rem' }} /> : <BasketArt />}<div className="eyebrow" style={{ color: '#6b786e' }}>{fields.category} · {fields.origin}</div><h2 className="serif">{fields.name}</h2><p>{fields.description}</p><div className="tag-row">{product.tags.slice(0, 3).map((tag) => <span key={tag} className="pill pill-green">{tag}</span>)}</div><div className="preview-meta"><span className="price">₹{product.price.toLocaleString('en-IN')}</span><span className="pill pill-yellow"><Check size={12} /> {fields.craftType}</span></div></aside></div></main></AppShell>;
}

function PricingPage() {
  const [, setLocation] = useLocation();
  const { product, setProduct } = useApp();
  const [costs, setCosts] = useState({ material: 300, labour: 400, packaging: 50 });
  const [recommendation, setRecommendation] = useState(0);
  const [reason, setReason] = useState('Enter your costs and let AI suggest a fair selling price.');
  const [loading, setLoading] = useState(false);
  const costRef = useRef<HTMLInputElement>(null);
  const total = costs.material + costs.labour + costs.packaging;
  const update = (key: keyof typeof costs, value: string) => setCosts((current) => ({ ...current, [key]: Math.max(0, Number(value) || 0) }));
  const getPrice = async () => {
    setLoading(true);
    try {
      const data = await callAI('price', { product, costs, totalCost: total, artisan: 'rural Indian artisan' });
      setRecommendation(Number(data.price) || Math.max(total, Math.round(total * 1.35)));
      setReason(data.reason || 'AI recommendation based on your supplied costs and product context.');
    } catch (e) { setReason(e instanceof Error ? e.message : 'Could not calculate an AI price.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void getPrice(); }, []);
  const usePrice = () => { setProduct((current) => ({ ...current, price: recommendation || total })); setLocation('/product-preview'); };
  return <AppShell current="/add-product"><main className="content animate-rise"><PageHeading eyebrow="Create / 04" title="Smart Pricing Assistant" description="Know your costs. Let AI help you price your craft fairly." actions={<button type="button" className="secondary-button" onClick={() => setLocation('/catalogue')}><ArrowLeft size={15} /> Back</button>} /><div className="form-layout"><section className="panel panel-pad form-stack"><div className="price-intro"><div className="eyebrow">AI recommendation</div><h2 className="serif">A fair price respects your time.</h2><p>{reason}</p></div><div className="cost-grid"><div className="field-group"><label htmlFor="material-cost">Material Cost</label><div className="rupee-input"><span>₹</span><input ref={costRef} id="material-cost" type="number" min="0" value={costs.material} onChange={(event) => update('material', event.target.value)} /></div></div><div className="field-group"><label htmlFor="labour-cost">Labour Cost</label><div className="rupee-input"><span>₹</span><input id="labour-cost" type="number" min="0" value={costs.labour} onChange={(event) => update('labour', event.target.value)} /></div></div><div className="field-group"><label htmlFor="packaging-cost">Packaging</label><div className="rupee-input"><span>₹</span><input id="packaging-cost" type="number" min="0" value={costs.packaging} onChange={(event) => update('packaging', event.target.value)} /></div></div></div><div className="total-row"><span>Total Cost</span><strong>₹{total.toLocaleString('en-IN')}</strong></div><div className="recommendation"><span className="eyebrow">AI Recommended Selling Price</span><strong>{recommendation ? `₹${recommendation.toLocaleString('en-IN')}` : '—'}</strong><p>AI uses the product context and your supplied material, labour and packaging costs. Confirm the final price before selling.</p></div><div className="form-actions"><button type="button" className="secondary-button" onClick={() => void getPrice()} disabled={loading}>{loading ? 'AI calculating…' : 'Recalculate with AI'}</button><button type="button" className="primary-button" disabled={!recommendation || loading} onClick={usePrice}>Use ₹{recommendation || '—'} <ArrowRight size={15} /></button></div></section><aside className="panel panel-pad"><div className="eyebrow">Transparent pricing</div><div className="impact-list" style={{ marginTop: '1rem' }}><div className="impact-item"><span>Material Cost</span><strong>₹{costs.material}</strong></div><div className="impact-item"><span>Labour Cost</span><strong>₹{costs.labour}</strong></div><div className="impact-item"><span>Packaging</span><strong>₹{costs.packaging}</strong></div><div className="impact-item"><span>AI price</span><strong>₹{recommendation || '—'}</strong></div></div><p className="aside-copy">The artisan remains in control. AI recommends; you decide.</p></aside></div></main></AppShell>;
}

function ProductPreviewPage() {
  const [, setLocation] = useLocation();
  const { product, setProduct, artisan, editedPhotoDataUrl, photoDataUrl } = useApp();
  return <AppShell current="/add-product"><main className="content animate-rise"><PageHeading eyebrow="Last look" title="Your Product Listing" description="Check the details once. You will be able to edit them later." actions={<button type="button" className="secondary-button" onClick={() => setLocation('/pricing')}><ArrowLeft size={15} /> Adjust price</button>} /><section className="panel product-card listing-card">{(editedPhotoDataUrl || photoDataUrl) ? <img src={editedPhotoDataUrl || photoDataUrl} alt={product.name} style={{ width: '100%', height: '100%', minHeight: 180, objectFit: 'contain', borderRadius: 12 }} /> : <BasketArt />}<div className="product-copy"><div className="eyebrow">By {artisan.name} · {artisan.place}</div><h3>{product.name}</h3><div className="detail-pills"><span className="pill pill-green"><Check size={11} /> {product.craftType}</span><span className="pill pill-green"><Leaf size={11} /> {product.material}</span><span className="pill pill-yellow"><MapPin size={11} /> {product.origin}</span></div><p>{product.description}</p></div><span className="price">₹{product.price.toLocaleString('en-IN')}</span></section><section className="panel panel-pad story-section"><div className="eyebrow">Meet the Artisan</div><h2 className="serif">The human story behind the craft.</h2><p>{product.story}</p><div className="form-actions"><button type="button" className="secondary-button" onClick={() => setLocation('/catalogue')}><Pencil size={14} /> Edit Listing</button><button type="button" className="primary-button" onClick={() => { setProduct((current) => ({ ...current, published: true })); setLocation('/publish-success'); }}>Publish Product <Send size={15} /></button></div></section></main></AppShell>;
}

function PublishSuccessPage() {
  const [, setLocation] = useLocation();
  const { product } = useApp();
  return <AppShell current="/dashboard"><main className="content animate-rise"><section className="panel publish-card"><span className="success-mark"><CircleCheck size={37} /></span><div className="eyebrow">Product Published Successfully!</div><h1 className="display">Your craft is ready to travel.</h1><p><strong>{product.name}</strong> is now ready to reach potential buyers through ShilpSetu AI.</p><div className="link-card" style={{ marginTop: '1.3rem' }}><Store size={18} /><span><strong>Public catalogue listing</strong>Your product is now visible to potential buyers · ₹{product.price.toLocaleString('en-IN')}</span></div><button type="button" className="primary-button full-button" onClick={() => setLocation('/market')}>Find Potential Buyers <ArrowRight size={15} /></button></section></main></AppShell>;
}

const buyers: Buyer[] = [
  { name: 'Delhi Handicraft Store', location: 'New Delhi', interest: 'Bamboo Products', quantity: 20, budget: '₹900–₹1,100 per unit', match: 94, initials: 'DH' },
  { name: 'Home Décor Boutique', location: 'Gurugram', interest: 'Handmade Baskets', quantity: 15, budget: '₹850–₹1,050 per unit', match: 89, initials: 'HD' },
  { name: 'Craft & Culture Store', location: 'Jaipur', interest: 'Indian Handicrafts', quantity: 30, budget: 'Discuss with buyer', match: 86, initials: 'CC' },
];

function MarketPage() {
  const [, setLocation] = useLocation();
  const { selectedBuyer, setSelectedBuyer, product } = useApp();
  const [matches, setMatches] = useState<Buyer[]>(buyers);
  const [loading, setLoading] = useState(false);
  useEffect(() => { setLoading(true); matchBuyers({ product }).then(setMatches).catch(() => setMatches(buyers)).finally(() => setLoading(false)); }, [product]);
  return <AppShell current="/market"><main className="content animate-rise"><PageHeading eyebrow="Grow / market linkage" title="AI Market Linkage" description="AI-generated buyer suggestions matched to your product. These are suggestions, not confirmed buyers." actions={<button type="button" className="secondary-button" onClick={() => setLocation('/dashboard')}><ArrowLeft size={15} /> Overview</button>} /><section className="market-intro panel"><span className="coach-orb"><Sparkles size={20} /></span><div><strong>{loading ? 'Setu is finding suitable buyer types…' : 'ShilpSetu AI has generated buyer suggestions for your product.'}</strong><p>Use these leads as starting points for outreach and verify buyer details before contacting them.</p></div><span className="pill pill-green">{matches.length} suggestions</span></section><div className="buyer-cards">{matches.map((buyer) => <article className="buyer-card panel" key={`${buyer.name}-${buyer.location}`}><div className="buyer-card-head"><span className="buyer-avatar">{buyer.initials}</span><span><h2>{buyer.name}</h2><small><MapPin size={12} /> {buyer.location}</small></span><span className="match-score">{buyer.match}%<small>AI Match</small></span></div><div className="buyer-details"><div><span>Interested in</span><strong>{buyer.interest}</strong></div><div><span>Potential Quantity</span><strong>{buyer.quantity} units</strong></div><div><span>Budget</span><strong>{buyer.budget}</strong></div></div><button type="button" className="primary-button full-button" onClick={() => { setSelectedBuyer(buyer); setLocation('/buyer'); }}>View Suggestion <ArrowRight size={15} /></button></article>)}</div></main></AppShell>;
}

function BuyerPage() {
  const [, setLocation] = useLocation();
  const { selectedBuyer, product } = useApp();
  const [sent, setSent] = useState(false);
  const [contacted, setContacted] = useState(false);
  const [quantity, setQuantity] = useState(String(selectedBuyer.quantity));
  const [price, setPrice] = useState(String(product.price));
  const [message, setMessage] = useState(`I can supply ${selectedBuyer.quantity} handmade bamboo baskets at ₹${product.price} each.`);
  const [error, setError] = useState('');
  const submit = (event: FormEvent) => { event.preventDefault(); if (Number(quantity) < 1 || Number(price) < 1 || !message.trim()) { setError('Add a quantity, your price and a short message before sending.'); return; } setSent(true); };
  if (sent) return <AppShell current="/market"><main className="content animate-rise"><section className="panel publish-card offer-success"><span className="success-mark"><CircleCheck size={37} /></span><div className="eyebrow">Offer sent successfully</div><h1 className="display">A thoughtful hello is on its way.</h1><p>Your offer has been shared with <strong>{selectedBuyer.name}</strong>.</p><button type="button" className="primary-button full-button" onClick={() => setLocation('/market')}>Back to Market Linkage <ArrowRight size={15} /></button></section></main></AppShell>;
  return <AppShell current="/market"><main className="content animate-rise"><PageHeading eyebrow="Grow / buyer details" title="Buyer Details" description="Send the right product, a clear price and a human note." actions={<button type="button" className="secondary-button" onClick={() => setLocation('/market')}><ArrowLeft size={15} /> Back</button>} /><div className="detail-layout"><section className="panel panel-pad buyer-profile"><div className="buyer-card-head"><span className="buyer-avatar">{selectedBuyer.initials}</span><span><h2>{selectedBuyer.name}</h2><small><MapPin size={12} /> {selectedBuyer.location}</small></span><span className="match-score">{selectedBuyer.match}%<small>AI Match</small></span></div><div className="eyebrow" style={{ marginTop: '1.5rem' }}>Buyer Requirement</div><div className="detail-grid"><div><span>Product</span><strong>Handmade Bamboo Basket</strong></div><div><span>Quantity</span><strong>{selectedBuyer.quantity} units</strong></div><div><span>Budget</span><strong>{selectedBuyer.budget}</strong></div><div><span>Delivery</span><strong>Within 7–10 days</strong></div></div><div className="form-actions"><button type="button" className="secondary-button" onClick={() => setContacted(true)}><Phone size={15} /> {contacted ? 'Buyer contact noted' : 'Contact Buyer'}</button><button type="button" className="primary-button" onClick={() => document.getElementById('offer-form')?.scrollIntoView({ behavior: 'smooth' })}>Send Offer <Send size={15} /></button></div>{contacted && <p className="success-inline"><CircleCheck size={14} /> You can contact this buyer after preparing your offer.</p>}</section><form id="offer-form" className="panel panel-pad form-stack" onSubmit={submit}><div className="section-label"><h2>Send Offer</h2><span className="pill pill-green">{selectedBuyer.match}% match</span></div><div className="field-group"><label htmlFor="offer-quantity">Quantity</label><input id="offer-quantity" className="field-input" type="number" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} /></div><div className="field-group"><label htmlFor="offer-price">Your Price</label><div className="rupee-input"><span>₹</span><input id="offer-price" type="number" min="1" value={price} onChange={(event) => setPrice(event.target.value)} /></div></div><div className="field-group"><label htmlFor="offer-message">Message</label><textarea id="offer-message" className="field-input" value={message} onChange={(event) => setMessage(event.target.value)} /></div>{error && <div className="error-message" role="alert">{error}</div>}<button type="submit" className="primary-button full-button">Send Offer <ArrowRight size={15} /></button></form></div></main></AppShell>;
}

function OrdersPage() {
  const { orders, setOrders, inventory, setInventory } = useApp();
  const [tab, setTab] = useState<'orders' | 'inventory'>('orders');
  const [notice, setNotice] = useState('');
  const updateStatus = (id: string, status: OrderStatus) => setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order));
  const addInventory = () => { setInventory((current) => current.map((item, index) => index === 0 ? { ...item, available: item.available + 1 } : item)); setNotice('One Bamboo Basket added to inventory.'); };
  return <AppShell current="/orders"><main className="content animate-rise"><PageHeading eyebrow="Run / daily movement" title="My Business" description="Keep orders moving and know what is ready to travel." actions={<button type="button" className="primary-button" onClick={() => setTab(tab === 'orders' ? 'inventory' : 'orders')}>{tab === 'orders' ? <><Package size={15} /> View Inventory</> : <><ClipboardList size={15} /> View Orders</>}</button>} /><section className="panel panel-pad"><div className="tabs"><button type="button" className={`tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>Orders ({orders.length})</button><button type="button" className={`tab ${tab === 'inventory' ? 'active' : ''}`} onClick={() => setTab('inventory')}>Inventory</button></div>{tab === 'orders' ? <div className="order-list">{orders.map((order) => <article className="order-card" key={order.id}><div className="order-head"><div><strong>Order {order.id}</strong><span>{order.buyer}</span></div><span className={`pill ${order.status === 'Delivered' ? 'pill-green' : 'pill-yellow'}`}>{order.status}</span></div><div className="order-meta"><span>{order.product} · {order.quantity} units</span><strong>₹{order.total.toLocaleString('en-IN')}</strong></div><div className="status-steps">{(['Processing', 'Ready', 'Shipped', 'Delivered'] as OrderStatus[]).map((status, index) => <button type="button" key={status} className={order.status === status ? 'current' : index <= ['Processing', 'Ready', 'Shipped', 'Delivered'].indexOf(order.status) ? 'complete' : ''} onClick={() => updateStatus(order.id, status)}>{index < ['Processing', 'Ready', 'Shipped', 'Delivered'].indexOf(order.status) ? <Check size={11} /> : null}{status}</button>)}</div></article>)}</div> : <div className="inventory-list">{inventory.map((item) => <div className="inventory-row" key={item.name}><span className="inventory-icon"><Package size={17} /></span><span><strong>{item.name}</strong><small>{item.available} available</small></span><div className="inventory-meter"><span style={{ width: `${Math.min(100, item.available * 3)}%` }} /></div>{item.available <= 8 && <span className="pill pill-red">Low Stock</span>}<div className="stock-buttons"><button type="button" className="icon-button" onClick={() => setInventory((current) => current.map((entry) => entry.name === item.name ? { ...entry, available: Math.max(0, entry.available - 1) } : entry))} aria-label={`Decrease ${item.name}`}>−</button><button type="button" className="icon-button" onClick={() => setInventory((current) => current.map((entry) => entry.name === item.name ? { ...entry, available: entry.available + 1 } : entry))} aria-label={`Increase ${item.name}`}><Plus size={15} /></button></div></div>)}</div>}{tab === 'inventory' && <><button type="button" className="secondary-button add-inventory" onClick={addInventory}><Plus size={15} /> Add Inventory</button>{notice && <p className="success-inline"><CircleCheck size={14} />{notice}</p>}</>}</section></main></AppShell>;
}

function CoachPage() {
  const { product, artisan, language } = useApp();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ from: 'coach' | 'you'; text: string }[]>([{ from: 'coach', text: 'Namaste Meena! I am your AI business assistant. Ask me about pricing, products, customers, inventory, sales or your next business step.' }]);
  const prompts = ['How should I price my product?', 'Which product should I make more?', 'How can I improve my listing?', 'How can I get more buyers?', 'How much stock should I keep?'];
  const send = async (text = input) => {
    if (!text.trim() || loading) return;
    const question = text.trim();
    setMessages((current) => [...current, { from: 'you', text: question }]);
    setInput(''); setLoading(true);
    try {
      const answer = await businessCoach(question, { product, artisan, language });
      setMessages((current) => [...current, { from: 'coach', text: answer }]);
    } catch (e) {
      setMessages((current) => [...current, { from: 'coach', text: e instanceof Error ? e.message : 'I could not reach the AI service. Please try again.' }]);
    } finally { setLoading(false); }
  };
  return <AppShell current="/profile"><main className="content animate-rise"><PageHeading eyebrow="Your digital business assistant" title="ShilpSetu AI Coach" description="Ask plainly. Get advice powered by AI and tailored to your craft business." actions={<button type="button" className="secondary-button" onClick={() => setMessages([{ from: 'coach', text: 'Fresh start. What would make today’s business easier?' }])}><RefreshCw size={14} /> New thought</button>} /><div className="coach-shell"><section className="panel panel-pad coach-chat"><div className="chat-head"><span className="coach-orb"><Bot size={20} /></span><span><strong>Setu, your business coach</strong><small>{loading ? 'Thinking…' : 'AI assistant is ready'}</small></span></div><div className="messages" aria-live="polite">{messages.map((message, index) => <div key={`${message.from}-${index}`} className={`message ${message.from}`}>{message.text}</div>)}{loading && <div className="message coach">Thinking about your business…</div>}</div><div className="prompt-grid">{prompts.map((prompt) => <button type="button" className="prompt-chip" key={prompt} onClick={() => void send(prompt)}>{prompt}</button>)}</div><div className="chat-input"><button type="button" className="voice-button" onClick={async () => { try { setInput(await speechToText(language)); } catch (error) { setMessages((current) => [...current, { from: 'coach', text: error instanceof Error ? error.message : 'Voice capture failed. Please try again.' }]); } }}><Mic size={15} /> Ask by Voice</button><input className="field-input" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void send(); }} placeholder="Ask about your craft business..." /><button type="button" className="primary-button" onClick={() => void send()} disabled={loading} aria-label="Send message"><Send size={15} /></button></div></section><aside className="coach-side"><section className="panel panel-pad"><div className="eyebrow">AI can help with</div><h3>More than chat</h3><div className="coach-tip"><IndianRupee size={15} /><span>Smart pricing based on your product context.</span></div><div className="coach-tip"><Camera size={15} /><span>Photo understanding and listing creation.</span></div><div className="coach-tip"><Store size={15} /><span>Buyer and sales suggestions.</span></div></section><section className="panel panel-pad"><div className="eyebrow">Your craft</div><h3>{artisan.craft}</h3><p className="aside-copy">Setu uses the information in your workspace to make its advice more relevant to your business.</p></section></aside></div></main></AppShell>;
}

function ProfilePage() {
  const { artisan } = useApp();
  const [, setLocation] = useLocation();
  const initials = artisan.name ? artisan.name.split(/\s+/).map((p) => p[0]).join('').slice(0,2).toUpperCase() : 'AR';
  return <AppShell current="/profile"><main className="content animate-rise"><PageHeading eyebrow="Your artisan profile" title="Profile & Impact" description="Your artisan identity powers your catalogue, AI advice and buyer suggestions." actions={<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}><button type="button" className="secondary-button" onClick={() => { localStorage.removeItem('shilpsetu-artisan'); window.location.reload(); }}>Demo Profile</button><button type="button" className="primary-button" onClick={() => setLocation('/register?new=1')}><Plus size={15} /> Create New Profile</button></div>} /><section className="panel panel-pad profile-card"><span className="profile-large">{initials}</span><div><div className="eyebrow">Active Artisan</div><h2 className="serif">{artisan.name}</h2><p><MapPin size={14} /> {artisan.place}</p><p><Leaf size={14} /> {artisan.craft} · {artisan.experience}</p><p><Phone size={14} /> {artisan.phone}</p></div></section><section className="impact-panel panel" style={{ marginTop: '1rem' }}><div><div className="eyebrow" style={{ color: '#f1d797' }}>Your impact</div><h2 className="display">Your digital presence is growing.</h2></div><div className="impact-grid">{[['12', 'Products Listed'], ['27', 'Buyer Connections'], ['7', 'Orders Received'], ['₹18,500', 'Estimated Revenue'], ['3', 'Languages Supported']].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></section></main></AppShell>;
}

function WorkspacePage() {
  const [location] = useLocation();
  const pages: Record<string, ReactNode> = {
    '/dashboard': <DashboardPage />, '/add-product': <AddProductPage />, '/photo-studio': <PhotoStudioPage />,
    '/catalogue': <CataloguePage />, '/pricing': <PricingPage />, '/product-preview': <ProductPreviewPage />,
    '/publish-success': <PublishSuccessPage />, '/market': <MarketPage />, '/buyer': <BuyerPage />,
    '/orders': <OrdersPage />, '/coach': <CoachPage />, '/profile': <ProfilePage />,
  };
  return pages[location] ?? <DashboardPage />;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={WelcomePage} /><Route path="/register" component={RegistrationPage} /><Route path="/dashboard" component={WorkspacePage} /><Route path="/add-product" component={WorkspacePage} /><Route path="/photo-studio" component={WorkspacePage} /><Route path="/catalogue" component={WorkspacePage} /><Route path="/pricing" component={WorkspacePage} /><Route path="/product-preview" component={WorkspacePage} /><Route path="/publish-success" component={WorkspacePage} /><Route path="/market" component={WorkspacePage} /><Route path="/buyer" component={WorkspacePage} /><Route path="/orders" component={WorkspacePage} /><Route path="/coach" component={WorkspacePage} /><Route path="/profile" component={WorkspacePage} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><AppProvider><Router /></AppProvider></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;