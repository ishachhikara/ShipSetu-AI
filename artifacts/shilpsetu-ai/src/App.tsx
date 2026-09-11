import { createContext, type FormEvent, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
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
  'हिन्दी': {
    'Good morning': 'सुप्रभात',
    'Good Morning': 'सुप्रभात',
    'Your artisan dashboard': 'आपका कारीगर डैशबोर्ड',
    'Add new product': 'नया उत्पाद जोड़ें',
    'Products Listed': 'सूचीबद्ध उत्पाद',
    'Buyer Enquiries': 'खरीदार पूछताछ',
    'Orders': 'ऑर्डर',
    'Estimated Sales': 'अनुमानित बिक्री',
    'Your featured craft': 'आपका प्रमुख शिल्प',
    'Catalogue strength': 'कैटलॉग गुणवत्ता',
    'Need help with pricing, products or customers?': 'कीमत, उत्पाद या ग्राहकों में मदद चाहिए?',
    'Ask AI Coach': 'AI कोच से पूछें',
    'Recent Activity': 'हाल की गतिविधि',
    'View orders': 'ऑर्डर देखें',
    'Your impact': 'आपका प्रभाव',
    'Your digital presence is growing.': 'आपकी डिजिटल उपस्थिति बढ़ रही है।',
    'Every listing makes your craft easier to find.': 'हर सूची आपके शिल्प को आसानी से खोजने योग्य बनाती है।',
    'Buyer Connections': 'खरीदार संपर्क',
    'Orders Received': 'प्राप्त ऑर्डर',
    'Estimated Revenue': 'अनुमानित आय',
    'Languages Supported': 'समर्थित भाषाएं',
    'New buyer interested in your bamboo baskets': 'नए खरीदार ने आपके बांस के उत्पादों में रुचि दिखाई',
    'New pricing suggestion available': 'नई मूल्य सुझाव उपलब्ध है',
    'Order #1024 received': 'ऑर्डर #1024 प्राप्त हुआ',
    'Today': 'आज',
    'Yesterday': 'कल',
    'No activity yet. Add your first product to get started.': 'अभी कोई गतिविधि नहीं। शुरुआत करने के लिए अपना पहला उत्पाद जोड़ें।',
    'No product yet': 'अभी कोई उत्पाद नहीं',
    'Beautifully made. Clearly priced. Ready to meet its next home.': 'खूबसूरती से बना। उचित कीमत के साथ बिक्री के लिए तैयार।',
    'New Artisan': 'नया कारीगर',
    'Create your craft profile': 'अपनी शिल्प प्रोफ़ाइल बनाएं',
    'Demo data — kept separate': 'डेमो डेटा — अलग रखा गया है',
    'New profile — data starts from 0': 'नई प्रोफ़ाइल — डेटा 0 से शुरू',
    'Profile & Impact': 'प्रोफ़ाइल और प्रभाव',
    'Active Artisan': 'सक्रिय कारीगर',
    'Create New Profile': 'नई प्रोफ़ाइल बनाएं',
    'Create my profile': 'मेरी प्रोफ़ाइल बनाएं',
    'Back': 'वापस',
    'Cancel': 'रद्द करें',
    'Edit': 'संपादित करें',
    'Product Name': 'उत्पाद का नाम',
    'Description': 'विवरण',
    'Category': 'श्रेणी',
    'Material': 'सामग्री',
    'Craft Type': 'शिल्प प्रकार',
    'Origin': 'स्थान',
    'Smart Pricing Assistant': 'स्मार्ट मूल्य निर्धारण सहायक',
    'Know your costs. Let AI help you price your craft fairly.': 'अपनी लागत जानें। AI को अपने शिल्प की उचित कीमत तय करने दें।',
    'Material Cost': 'सामग्री लागत',
    'Labour Cost': 'श्रम लागत',
    'Packaging': 'पैकेजिंग',
    'Total Cost': 'कुल लागत',
    'AI Recommended Selling Price': 'AI द्वारा सुझाई बिक्री कीमत',
    'Recalculate with AI': 'AI से दोबारा गणना करें',
    'AI calculating…': 'AI गणना कर रहा है…',
    'Transparent pricing': 'पारदर्शी मूल्य निर्धारण',
    'Continue to Smart Pricing': 'स्मार्ट मूल्य निर्धारण जारी रखें',
    'Take Product Photo': 'उत्पाद की फोटो लें',
    'Upload Photo': 'फोटो अपलोड करें',
    'Describe by Voice': 'आवाज़ से बताएं',
    'Home': 'होम',
    'Products': 'उत्पाद',
    'Buyers': 'खरीदार',
    'Profile': 'प्रोफ़ाइल',
    'View Inventory': 'इन्वेंटरी देखें',
    'View Orders': 'ऑर्डर देखें',
    'Inventory': 'इन्वेंटरी',
    'Order': 'ऑर्डर',
    'units': 'इकाइयाँ',
    'Processing': 'प्रक्रिया में',
    'Ready': 'तैयार',
    'Shipped': 'भेजा गया',
    'Delivered': 'पहुंचाया गया',
    'available': 'उपलब्ध',
    'Low Stock': 'कम स्टॉक',
    'Decrease': 'कम करें',
    'Increase': 'बढ़ाएँ',
    'Add Inventory': 'इन्वेंटरी जोड़ें',
    'One Bamboo Basket added to inventory.': 'एक बांस की टोकरी इन्वेंटरी में जोड़ी गई।',
  },
  'ਪੰਜਾਬੀ': {
    'Good morning': 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', 'Good Morning': 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', 'Your artisan dashboard': 'ਤੁਹਾਡਾ ਕਾਰੀਗਰ ਡੈਸ਼ਬੋਰਡ', "Let's grow your craft business.": 'ਆਓ ਤੁਹਾਡੇ ਹਸਤਕਲਾ ਕਾਰੋਬਾਰ ਨੂੰ ਵਧਾਈਏ।', 'Add new product': 'ਨਵਾਂ ਉਤਪਾਦ ਸ਼ਾਮਲ ਕਰੋ', 'Products Listed': 'ਸੂਚੀਬੱਧ ਉਤਪਾਦ', 'Buyer Enquiries': 'ਖਰੀਦਦਾਰ ਪੁੱਛਗਿੱਛ', 'Orders': 'ਆਰਡਰ', 'Estimated Sales': 'ਅਨੁਮਾਨਿਤ ਵਿਕਰੀ', 'Your featured craft': 'ਤੁਹਾਡੀ ਮੁੱਖ ਹਸਤਕਲਾ', 'Catalogue strength': 'ਕੈਟਾਲਾਗ ਗੁਣਵੱਤਾ', 'Need help with pricing, products or customers?': 'ਕੀਮਤ, ਉਤਪਾਦਾਂ ਜਾਂ ਗਾਹਕਾਂ ਬਾਰੇ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?', 'Ask AI Coach': 'AI ਕੋਚ ਨੂੰ ਪੁੱਛੋ', 'Recent Activity': 'ਹਾਲੀਆ ਗਤੀਵਿਧੀ', 'View orders': 'ਆਰਡਰ ਵੇਖੋ', 'Your impact': 'ਤੁਹਾਡਾ ਪ੍ਰਭਾਵ', 'Your digital presence is growing.': 'ਤੁਹਾਡੀ ਡਿਜ਼ੀਟਲ ਮੌਜੂਦਗੀ ਵੱਧ ਰਹੀ ਹੈ।', 'Buyer Connections': 'ਖਰੀਦਦਾਰ ਸੰਪਰਕ', 'Orders Received': 'ਪ੍ਰਾਪਤ ਆਰਡਰ', 'Estimated Revenue': 'ਅਨੁਮਾਨਿਤ ਆਮਦਨ', 'Languages Supported': 'ਸਮਰਥਿਤ ਭਾਸ਼ਾਵਾਂ', 'Today': 'ਅੱਜ', 'Yesterday': 'ਕੱਲ੍ਹ', 'No product yet': 'ਅਜੇ ਕੋਈ ਉਤਪਾਦ ਨਹੀਂ', 'New Artisan': 'ਨਵਾਂ ਕਾਰੀਗਰ', 'Create New Profile': 'ਨਵੀਂ ਪ੍ਰੋਫ਼ਾਈਲ ਬਣਾਓ', 'Back': 'ਵਾਪਸ', 'Edit': 'ਸੋਧੋ', 'Product Name': 'ਉਤਪਾਦ ਦਾ ਨਾਮ', 'Description': 'ਵੇਰਵਾ', 'Category': 'ਸ਼੍ਰੇਣੀ', 'Material': 'ਸਮੱਗਰੀ', 'Craft Type': 'ਹਸਤਕਲਾ ਕਿਸਮ', 'Origin': 'ਮੂਲ ਸਥਾਨ', 'Smart Pricing Assistant': 'ਸਮਾਰਟ ਕੀਮਤ ਸਹਾਇਕ', 'Material Cost': 'ਸਮੱਗਰੀ ਦੀ ਲਾਗਤ', 'Labour Cost': 'ਮਜ਼ਦੂਰੀ ਦੀ ਲਾਗਤ', 'Packaging': 'ਪੈਕੇਜਿੰਗ', 'Total Cost': 'ਕੁੱਲ ਲਾਗਤ', 'AI Recommended Selling Price': 'AI ਵੱਲੋਂ ਸੁਝਾਈ ਵਿਕਰੀ ਕੀਮਤ', 'Home': 'ਹੋਮ', 'Products': 'ਉਤਪਾਦ', 'Buyers': 'ਖਰੀਦਦਾਰ', 'Profile': 'ਪ੍ਰੋਫ਼ਾਈਲ',
  },
  'বাংলা': {
    'Good morning': 'সুপ্রভাত', 'Good Morning': 'সুপ্রভাত', 'Your artisan dashboard': 'আপনার কারিগর ড্যাশবোর্ড', "Let's grow your craft business.": 'চলুন আপনার কারুশিল্পের ব্যবসা বাড়াই।', 'Add new product': 'নতুন পণ্য যোগ করুন', 'Products Listed': 'তালিকাভুক্ত পণ্য', 'Buyer Enquiries': 'ক্রেতার জিজ্ঞাসা', 'Orders': 'অর্ডার', 'Estimated Sales': 'আনুমানিক বিক্রি', 'Your featured craft': 'আপনার বিশেষ কারুশিল্প', 'Catalogue strength': 'ক্যাটালগের মান', 'Need help with pricing, products or customers?': 'দাম, পণ্য বা ক্রেতা নিয়ে সাহায্য দরকার?', 'Ask AI Coach': 'AI কোচকে জিজ্ঞাসা করুন', 'Recent Activity': 'সাম্প্রতিক কার্যকলাপ', 'View orders': 'অর্ডার দেখুন', 'Your impact': 'আপনার প্রভাব', 'Your digital presence is growing.': 'আপনার ডিজিটাল উপস্থিতি বাড়ছে।', 'Buyer Connections': 'ক্রেতার সংযোগ', 'Orders Received': 'প্রাপ্ত অর্ডার', 'Estimated Revenue': 'আনুমানিক আয়', 'Languages Supported': 'সমর্থিত ভাষা', 'Today': 'আজ', 'Yesterday': 'গতকাল', 'No product yet': 'এখনও কোনো পণ্য নেই', 'New Artisan': 'নতুন কারিগর', 'Create New Profile': 'নতুন প্রোফাইল তৈরি করুন', 'Back': 'ফিরে যান', 'Edit': 'সম্পাদনা', 'Product Name': 'পণ্যের নাম', 'Description': 'বিবরণ', 'Category': 'বিভাগ', 'Material': 'উপাদান', 'Craft Type': 'কারুশিল্পের ধরন', 'Origin': 'উৎপত্তি', 'Smart Pricing Assistant': 'স্মার্ট মূল্য সহায়ক', 'Material Cost': 'উপাদানের খরচ', 'Labour Cost': 'শ্রমের খরচ', 'Packaging': 'প্যাকেজিং', 'Total Cost': 'মোট খরচ', 'AI Recommended Selling Price': 'AI প্রস্তাবিত বিক্রয়মূল্য', 'Home': 'হোম', 'Products': 'পণ্য', 'Buyers': 'ক্রেতা', 'Profile': 'প্রোফাইল',
  },
  'ગુજરાતી': {
    'Good morning': 'સુપ્રભાત', 'Good Morning': 'સુપ્રભાત', 'Your artisan dashboard': 'તમારું કારીગર ડેશબોર્ડ', "Let's grow your craft business.": 'ચાલો તમારા હસ્તકલા વ્યવસાયને વધારીએ.', 'Add new product': 'નવું ઉત્પાદન ઉમેરો', 'Products Listed': 'સૂચિબદ્ધ ઉત્પાદનો', 'Buyer Enquiries': 'ખરીદદાર પૂછપરછ', 'Orders': 'ઓર્ડર', 'Estimated Sales': 'અંદાજિત વેચાણ', 'Your featured craft': 'તમારી વિશેષ હસ્તકલા', 'Catalogue strength': 'કેટલોગ ગુણવત્તા', 'Need help with pricing, products or customers?': 'કિંમત, ઉત્પાદનો અથવા ગ્રાહકો અંગે મદદ જોઈએ?', 'Ask AI Coach': 'AI કોચને પૂછો', 'Recent Activity': 'તાજેતરની પ્રવૃત્તિ', 'View orders': 'ઓર્ડર જુઓ', 'Your impact': 'તમારી અસર', 'Your digital presence is growing.': 'તમારી ડિજિટલ હાજરી વધી રહી છે.', 'Buyer Connections': 'ખરીદદાર જોડાણો', 'Orders Received': 'મળેલા ઓર્ડર', 'Estimated Revenue': 'અંદાજિત આવક', 'Languages Supported': 'સમર્થિત ભાષાઓ', 'Today': 'આજે', 'Yesterday': 'ગઈકાલે', 'No product yet': 'હજુ કોઈ ઉત્પાદન નથી', 'New Artisan': 'નવા કારીગર', 'Create New Profile': 'નવી પ્રોફાઇલ બનાવો', 'Back': 'પાછા', 'Edit': 'ફેરફાર કરો', 'Product Name': 'ઉત્પાદનનું નામ', 'Description': 'વર્ણન', 'Category': 'શ્રેણી', 'Material': 'સામગ્રી', 'Craft Type': 'હસ્તકલા પ્રકાર', 'Origin': 'મૂળ સ્થાન', 'Smart Pricing Assistant': 'સ્માર્ટ કિંમત સહાયક', 'Material Cost': 'સામગ્રી ખર્ચ', 'Labour Cost': 'મજૂરી ખર્ચ', 'Packaging': 'પેકેજિંગ', 'Total Cost': 'કુલ ખર્ચ', 'AI Recommended Selling Price': 'AI સૂચવેલી વેચાણ કિંમત', 'Home': 'હોમ', 'Products': 'ઉત્પાદનો', 'Buyers': 'ખરીદદારો', 'Profile': 'પ્રોફાઇલ',
  },
  'मराठी': {
    'Good morning': 'शुभ प्रभात', 'Good Morning': 'शुभ प्रभात', 'Your artisan dashboard': 'तुमचे कारागीर डॅशबोर्ड', "Let's grow your craft business.": 'चला तुमचा हस्तकला व्यवसाय वाढवूया.', 'Add new product': 'नवीन उत्पादन जोडा', 'Products Listed': 'नोंदवलेली उत्पादने', 'Buyer Enquiries': 'खरेदीदार चौकशी', 'Orders': 'ऑर्डर', 'Estimated Sales': 'अंदाजे विक्री', 'Your featured craft': 'तुमची खास हस्तकला', 'Catalogue strength': 'कॅटलॉग गुणवत्ता', 'Need help with pricing, products or customers?': 'किंमत, उत्पादने किंवा ग्राहकांबाबत मदत हवी आहे?', 'Ask AI Coach': 'AI कोचकडे विचारा', 'Recent Activity': 'अलीकडील क्रियाकलाप', 'View orders': 'ऑर्डर पहा', 'Your impact': 'तुमचा प्रभाव', 'Your digital presence is growing.': 'तुमची डिजिटल उपस्थिती वाढत आहे.', 'Buyer Connections': 'खरेदीदार संपर्क', 'Orders Received': 'प्राप्त ऑर्डर्स', 'Estimated Revenue': 'अंदाजे उत्पन्न', 'Languages Supported': 'समर्थित भाषा', 'Today': 'आज', 'Yesterday': 'काल', 'No product yet': 'अद्याप कोणतेही उत्पादन नाही', 'New Artisan': 'नवीन कारागीर', 'Create New Profile': 'नवीन प्रोफाइल तयार करा', 'Back': 'मागे', 'Edit': 'संपादित करा', 'Product Name': 'उत्पादनाचे नाव', 'Description': 'वर्णन', 'Category': 'श्रेणी', 'Material': 'साहित्य', 'Craft Type': 'हस्तकला प्रकार', 'Origin': 'मूळ ठिकाण', 'Smart Pricing Assistant': 'स्मार्ट किंमत सहाय्यक', 'Material Cost': 'साहित्य खर्च', 'Labour Cost': 'मजुरी खर्च', 'Packaging': 'पॅकेजिंग', 'Total Cost': 'एकूण खर्च', 'AI Recommended Selling Price': 'AI सुचवलेली विक्री किंमत', 'Home': 'मुख्यपृष्ठ', 'Products': 'उत्पादने', 'Buyers': 'खरेदीदार', 'Profile': 'प्रोफाइल',
  },
  'தமிழ்': {
    'Good morning': 'காலை வணக்கம்', 'Good Morning': 'காலை வணக்கம்', 'Your artisan dashboard': 'உங்கள் கைவினைஞர் டாஷ்போர்டு', "Let's grow your craft business.": 'உங்கள் கைவினைத் தொழிலை வளர்ப்போம்.', 'Add new product': 'புதிய தயாரிப்பைச் சேர்க்கவும்', 'Products Listed': 'பட்டியலிடப்பட்ட தயாரிப்புகள்', 'Buyer Enquiries': 'வாங்குபவர் விசாரணைகள்', 'Orders': 'ஆர்டர்கள்', 'Estimated Sales': 'மதிப்பிடப்பட்ட விற்பனை', 'Your featured craft': 'உங்கள் சிறப்பு கைவினை', 'Catalogue strength': 'பட்டியல் தரம்', 'Need help with pricing, products or customers?': 'விலை, தயாரிப்புகள் அல்லது வாடிக்கையாளர்கள் பற்றி உதவி வேண்டுமா?', 'Ask AI Coach': 'AI பயிற்சியாளரிடம் கேளுங்கள்', 'Recent Activity': 'சமீபத்திய செயல்பாடு', 'View orders': 'ஆர்டர்களைப் பார்க்கவும்', 'Your impact': 'உங்கள் தாக்கம்', 'Your digital presence is growing.': 'உங்கள் டிஜிட்டல் இருப்பு வளர்ந்து வருகிறது.', 'Buyer Connections': 'வாங்குபவர் இணைப்புகள்', 'Orders Received': 'பெறப்பட்ட ஆர்டர்கள்', 'Estimated Revenue': 'மதிப்பிடப்பட்ட வருவாய்', 'Languages Supported': 'ஆதரிக்கப்படும் மொழிகள்', 'Today': 'இன்று', 'Yesterday': 'நேற்று', 'No product yet': 'இன்னும் தயாரிப்பு இல்லை', 'New Artisan': 'புதிய கைவினைஞர்', 'Create New Profile': 'புதிய சுயவிவரத்தை உருவாக்கவும்', 'Back': 'பின்', 'Edit': 'திருத்து', 'Product Name': 'தயாரிப்பு பெயர்', 'Description': 'விளக்கம்', 'Category': 'வகை', 'Material': 'பொருள்', 'Craft Type': 'கைவினை வகை', 'Origin': 'தோற்றம்', 'Smart Pricing Assistant': 'ஸ்மார்ட் விலை உதவியாளர்', 'Material Cost': 'பொருள் செலவு', 'Labour Cost': 'தொழிலாளர் செலவு', 'Packaging': 'பேக்கேஜிங்', 'Total Cost': 'மொத்த செலவு', 'AI Recommended Selling Price': 'AI பரிந்துரைக்கும் விற்பனை விலை', 'Home': 'முகப்பு', 'Products': 'தயாரிப்புகள்', 'Buyers': 'வாங்குபவர்கள்', 'Profile': 'சுயவிவரம்',
  },
  'తెలుగు': {
    'Good morning': 'శుభోదయం', 'Good Morning': 'శుభోదయం', 'Your artisan dashboard': 'మీ కళాకారుడి డ్యాష్‌బోర్డ్', "Let's grow your craft business.": 'మీ హస్తకళ వ్యాపారాన్ని అభివృద్ధి చేద్దాం.', 'Add new product': 'కొత్త ఉత్పత్తిని జోడించండి', 'Products Listed': 'జాబితాలోని ఉత్పత్తులు', 'Buyer Enquiries': 'కొనుగోలుదారుల విచారణలు', 'Orders': 'ఆర్డర్లు', 'Estimated Sales': 'అంచనా అమ్మకాలు', 'Your featured craft': 'మీ ప్రత్యేక హస్తకళ', 'Catalogue strength': 'కేటలాగ్ నాణ్యత', 'Need help with pricing, products or customers?': 'ధరలు, ఉత్పత్తులు లేదా కస్టమర్ల గురించి సహాయం కావాలా?', 'Ask AI Coach': 'AI కోచ్‌ను అడగండి', 'Recent Activity': 'ఇటీవలి కార్యకలాపాలు', 'View orders': 'ఆర్డర్లను చూడండి', 'Your impact': 'మీ ప్రభావం', 'Your digital presence is growing.': 'మీ డిజిటల్ ఉనికి పెరుగుతోంది.', 'Buyer Connections': 'కొనుగోలుదారుల సంబంధాలు', 'Orders Received': 'అందుకున్న ఆర్డర్లు', 'Estimated Revenue': 'అంచనా ఆదాయం', 'Languages Supported': 'మద్దతు ఉన్న భాషలు', 'Today': 'ఈరోజు', 'Yesterday': 'నిన్న', 'No product yet': 'ఇంకా ఉత్పత్తి లేదు', 'New Artisan': 'కొత్త కళాకారుడు', 'Create New Profile': 'కొత్త ప్రొఫైల్ సృష్టించండి', 'Back': 'వెనుకకు', 'Edit': 'సవరించు', 'Product Name': 'ఉత్పత్తి పేరు', 'Description': 'వివరణ', 'Category': 'వర్గం', 'Material': 'పదార్థం', 'Craft Type': 'హస్తకళ రకం', 'Origin': 'మూలం', 'Smart Pricing Assistant': 'స్మార్ట్ ధర సహాయకుడు', 'Material Cost': 'పదార్థం ఖర్చు', 'Labour Cost': 'కార్మిక ఖర్చు', 'Packaging': 'ప్యాకేజింగ్', 'Total Cost': 'మొత్తం ఖర్చు', 'AI Recommended Selling Price': 'AI సూచించిన అమ్మకపు ధర', 'Home': 'హోమ్', 'Products': 'ఉత్పత్తులు', 'Buyers': 'కొనుగోలుదారులు', 'Profile': 'ప్రొఫైల్',
  },
  'ಕನ್ನಡ': {
    'Good morning': 'ಶುಭೋದಯ', 'Good Morning': 'ಶುಭೋದಯ', 'Your artisan dashboard': 'ನಿಮ್ಮ ಕರಕುಶಲಗಾರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', "Let's grow your craft business.": 'ನಿಮ್ಮ ಕರಕುಶಲ ವ್ಯವಹಾರವನ್ನು ಬೆಳೆಸೋಣ.', 'Add new product': 'ಹೊಸ ಉತ್ಪನ್ನ ಸೇರಿಸಿ', 'Products Listed': 'ಪಟ್ಟಿಯಲ್ಲಿರುವ ಉತ್ಪನ್ನಗಳು', 'Buyer Enquiries': 'ಖರೀದಿದಾರರ ವಿಚಾರಣೆಗಳು', 'Orders': 'ಆರ್ಡರ್‌ಗಳು', 'Estimated Sales': 'ಅಂದಾಜು ಮಾರಾಟ', 'Your featured craft': 'ನಿಮ್ಮ ವಿಶೇಷ ಕರಕುಶಲ', 'Catalogue strength': 'ಕ್ಯಾಟಲಾಗ್ ಗುಣಮಟ್ಟ', 'Need help with pricing, products or customers?': 'ಬೆಲೆ, ಉತ್ಪನ್ನಗಳು ಅಥವಾ ಗ್ರಾಹಕರ ಬಗ್ಗೆ ಸಹಾಯ ಬೇಕೇ?', 'Ask AI Coach': 'AI ಕೋಚ್‌ಗೆ ಕೇಳಿ', 'Recent Activity': 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ', 'View orders': 'ಆರ್ಡರ್‌ಗಳನ್ನು ನೋಡಿ', 'Your impact': 'ನಿಮ್ಮ ಪರಿಣಾಮ', 'Your digital presence is growing.': 'ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಉಪಸ್ಥಿತಿ ಹೆಚ್ಚುತ್ತಿದೆ.', 'Buyer Connections': 'ಖರೀದಿದಾರ ಸಂಪರ್ಕಗಳು', 'Orders Received': 'ಸ್ವೀಕರಿಸಿದ ಆರ್ಡರ್‌ಗಳು', 'Estimated Revenue': 'ಅಂದಾಜು ಆದಾಯ', 'Languages Supported': 'ಬೆಂಬಲಿತ ಭಾಷೆಗಳು', 'Today': 'ಇಂದು', 'Yesterday': 'ನಿನ್ನೆ', 'No product yet': 'ಇನ್ನೂ ಉತ್ಪನ್ನವಿಲ್ಲ', 'New Artisan': 'ಹೊಸ ಕರಕುಶಲಗಾರ', 'Create New Profile': 'ಹೊಸ ಪ್ರೊಫೈಲ್ ರಚಿಸಿ', 'Back': 'ಹಿಂದೆ', 'Edit': 'ತಿದ್ದು', 'Product Name': 'ಉತ್ಪನ್ನದ ಹೆಸರು', 'Description': 'ವಿವರಣೆ', 'Category': 'ವರ್ಗ', 'Material': 'ವಸ್ತು', 'Craft Type': 'ಕರಕುಶಲ ಪ್ರಕಾರ', 'Origin': 'ಮೂಲ', 'Smart Pricing Assistant': 'ಸ್ಮಾರ್ಟ್ ಬೆಲೆ ಸಹಾಯಕ', 'Material Cost': 'ವಸ್ತು ವೆಚ್ಚ', 'Labour Cost': 'ಕಾರ್ಮಿಕ ವೆಚ್ಚ', 'Packaging': 'ಪ್ಯಾಕೇಜಿಂಗ್', 'Total Cost': 'ಒಟ್ಟು ವೆಚ್ಚ', 'AI Recommended Selling Price': 'AI ಶಿಫಾರಸು ಮಾಡಿದ ಮಾರಾಟ ಬೆಲೆ', 'Home': 'ಮುಖಪುಟ', 'Products': 'ಉತ್ಪನ್ನಗಳು', 'Buyers': 'ಖರೀದಿದಾರರು', 'Profile': 'ಪ್ರೊಫೈಲ್',
  },
  'മലയാളം': {
    'Good morning': 'സുപ്രഭാതം', 'Good Morning': 'സുപ്രഭാതം', 'Your artisan dashboard': 'നിങ്ങളുടെ കരകൗശല ഡാഷ്ബോർഡ്', "Let's grow your craft business.": 'നിങ്ങളുടെ കരകൗശല ബിസിനസ് വളർത്താം.', 'Add new product': 'പുതിയ ഉൽപ്പന്നം ചേർക്കുക', 'Products Listed': 'പട്ടികപ്പെടുത്തിയ ഉൽപ്പന്നങ്ങൾ', 'Buyer Enquiries': 'വാങ്ങുന്നവരുടെ അന്വേഷണങ്ങൾ', 'Orders': 'ഓർഡറുകൾ', 'Estimated Sales': 'കണക്കാക്കിയ വിൽപ്പന', 'Your featured craft': 'നിങ്ങളുടെ പ്രത്യേക കരകൗശലം', 'Catalogue strength': 'കാറ്റലോഗ് നിലവാരം', 'Need help with pricing, products or customers?': 'വില, ഉൽപ്പന്നങ്ങൾ അല്ലെങ്കിൽ ഉപഭോക്താക്കളെക്കുറിച്ച് സഹായം വേണമോ?', 'Ask AI Coach': 'AI കോച്ചിനോട് ചോദിക്കുക', 'Recent Activity': 'സമീപകാല പ്രവർത്തനം', 'View orders': 'ഓർഡറുകൾ കാണുക', 'Your impact': 'നിങ്ങളുടെ സ്വാധീനം', 'Your digital presence is growing.': 'നിങ്ങളുടെ ഡിജിറ്റൽ സാന്നിധ്യം വളരുന്നു.', 'Buyer Connections': 'വാങ്ങുന്നവരുടെ ബന്ധങ്ങൾ', 'Orders Received': 'ലഭിച്ച ഓർഡറുകൾ', 'Estimated Revenue': 'കണക്കാക്കിയ വരുമാനം', 'Languages Supported': 'പിന്തുണയ്ക്കുന്ന ഭാഷകൾ', 'Today': 'ഇന്ന്', 'Yesterday': 'ഇന്നലെ', 'No product yet': 'ഇതുവരെ ഉൽപ്പന്നമില്ല', 'New Artisan': 'പുതിയ കരകൗശലക്കാരൻ', 'Create New Profile': 'പുതിയ പ്രൊഫൈൽ സൃഷ്ടിക്കുക', 'Back': 'തിരികെ', 'Edit': 'തിരുത്തുക', 'Product Name': 'ഉൽപ്പന്നത്തിന്റെ പേര്', 'Description': 'വിവരണം', 'Category': 'വിഭാഗം', 'Material': 'വസ്തു', 'Craft Type': 'കരകൗശല തരം', 'Origin': 'ഉത്ഭവം', 'Smart Pricing Assistant': 'സ്മാർട്ട് വില സഹായി', 'Material Cost': 'വസ്തു ചെലവ്', 'Labour Cost': 'തൊഴിൽ ചെലവ്', 'Packaging': 'പാക്കേജിംഗ്', 'Total Cost': 'ആകെ ചെലവ്', 'AI Recommended Selling Price': 'AI ശുപാർശ ചെയ്യുന്ന വിൽപ്പന വില', 'Home': 'ഹോം', 'Products': 'ഉൽപ്പന്നങ്ങൾ', 'Buyers': 'വാങ്ങുന്നവർ', 'Profile': 'പ്രൊഫൈൽ',
  },
  'ଓଡ଼ିଆ': {
    'Good morning': 'ଶୁଭ ସକାଳ', 'Good Morning': 'ଶୁଭ ସକାଳ', 'Your artisan dashboard': 'ଆପଣଙ୍କ କାରିଗର ଡ୍ୟାସବୋର୍ଡ', "Let's grow your craft business.": 'ଆସନ୍ତୁ ଆପଣଙ୍କ ହସ୍ତଶିଳ୍ପ ବ୍ୟବସାୟକୁ ବଢ଼ାଇବା।', 'Add new product': 'ନୂଆ ଉତ୍ପାଦ ଯୋଡନ୍ତୁ', 'Products Listed': 'ତାଲିକାଭୁକ୍ତ ଉତ୍ପାଦ', 'Buyer Enquiries': 'କ୍ରେତାଙ୍କ ପଚରାଉଚରା', 'Orders': 'ଅର୍ଡର', 'Estimated Sales': 'ଆନୁମାନିକ ବିକ୍ରି', 'Your featured craft': 'ଆପଣଙ୍କ ବିଶେଷ ହସ୍ତଶିଳ୍ପ', 'Catalogue strength': 'କ୍ୟାଟାଲଗ୍ ଗୁଣବତ୍ତା', 'Need help with pricing, products or customers?': 'ମୂଲ୍ୟ, ଉତ୍ପାଦ କିମ୍ବା ଗ୍ରାହକ ବିଷୟରେ ସାହାଯ୍ୟ ଦରକାର କି?', 'Ask AI Coach': 'AI କୋଚ୍‌ଙ୍କୁ ପଚାରନ୍ତୁ', 'Recent Activity': 'ସାମ୍ପ୍ରତିକ କାର୍ଯ୍ୟକଳାପ', 'View orders': 'ଅର୍ଡର ଦେଖନ୍ତୁ', 'Your impact': 'ଆପଣଙ୍କ ପ୍ରଭାବ', 'Your digital presence is growing.': 'ଆପଣଙ୍କ ଡିଜିଟାଲ୍ ଉପସ୍ଥିତି ବଢ଼ୁଛି।', 'Buyer Connections': 'କ୍ରେତା ସଂଯୋଗ', 'Orders Received': 'ପ୍ରାପ୍ତ ଅର୍ଡର', 'Estimated Revenue': 'ଆନୁମାନିକ ଆୟ', 'Languages Supported': 'ସମର୍ଥିତ ଭାଷା', 'Today': 'ଆଜି', 'Yesterday': 'ଗତକାଲି', 'No product yet': 'ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଉତ୍ପାଦ ନାହିଁ', 'New Artisan': 'ନୂଆ କାରିଗର', 'Create New Profile': 'ନୂଆ ପ୍ରୋଫାଇଲ୍ ସୃଷ୍ଟି କରନ୍ତୁ', 'Back': 'ପଛକୁ', 'Edit': 'ସମ୍ପାଦନା', 'Product Name': 'ଉତ୍ପାଦର ନାମ', 'Description': 'ବର୍ଣ୍ଣନା', 'Category': 'ଶ୍ରେଣୀ', 'Material': 'ସାମଗ୍ରୀ', 'Craft Type': 'ହସ୍ତଶିଳ୍ପ ପ୍ରକାର', 'Origin': 'ମୂଳ ସ୍ଥାନ', 'Smart Pricing Assistant': 'ସ୍ମାର୍ଟ ମୂଲ୍ୟ ସହାୟକ', 'Material Cost': 'ସାମଗ୍ରୀ ଖର୍ଚ୍ଚ', 'Labour Cost': 'ଶ୍ରମ ଖର୍ଚ୍ଚ', 'Packaging': 'ପ୍ୟାକେଜିଂ', 'Total Cost': 'ମୋଟ ଖର୍ଚ୍ଚ', 'AI Recommended Selling Price': 'AI ପ୍ରସ୍ତାବିତ ବିକ୍ରୟ ମୂଲ୍ୟ', 'Home': 'ହୋମ୍', 'Products': 'ଉତ୍ପାଦ', 'Buyers': 'କ୍ରେତା', 'Profile': 'ପ୍ରୋଫାଇଲ୍',
  },
  'অসমীয়া': {
    'Good morning': 'সুপ্ৰভাত', 'Good Morning': 'সুপ্ৰভাত', 'Your artisan dashboard': 'আপোনাৰ কাৰিকৰ ডেশ্বব’ৰ্ড', "Let's grow your craft business.": 'আহক আপোনাৰ হস্তশিল্প ব্যৱসায় বৃদ্ধি কৰোঁ।', 'Add new product': 'নতুন সামগ্ৰী যোগ কৰক', 'Products Listed': 'তালিকাভুক্ত সামগ্ৰী', 'Buyer Enquiries': 'ক্ৰেতাৰ অনুসন্ধান', 'Orders': 'অৰ্ডাৰ', 'Estimated Sales': 'আনুমানিক বিক্ৰী', 'Your featured craft': 'আপোনাৰ বিশেষ হস্তশিল্প', 'Catalogue strength': 'কেটেলগৰ মান', 'Need help with pricing, products or customers?': 'মূল্য, সামগ্ৰী বা গ্ৰাহকৰ বিষয়ে সহায় লাগে নেকি?', 'Ask AI Coach': 'AI কোচক সোধক', 'Recent Activity': 'শেহতীয়া কাৰ্যকলাপ', 'View orders': 'অৰ্ডাৰ চাওক', 'Your impact': 'আপোনাৰ প্ৰভাৱ', 'Your digital presence is growing.': 'আপোনাৰ ডিজিটেল উপস্থিতি বৃদ্ধি পাইছে।', 'Buyer Connections': 'ক্ৰেতা সংযোগ', 'Orders Received': 'পোৱা অৰ্ডাৰ', 'Estimated Revenue': 'আনুমানিক আয়', 'Languages Supported': 'সমৰ্থিত ভাষা', 'Today': 'আজি', 'Yesterday': 'কালি', 'No product yet': 'এতিয়ালৈ কোনো সামগ্ৰী নাই', 'New Artisan': 'নতুন কাৰিকৰ', 'Create New Profile': 'নতুন প্ৰ’ফাইল বনাওক', 'Back': 'পিছলৈ', 'Edit': 'সম্পাদনা', 'Product Name': 'সামগ্ৰীৰ নাম', 'Description': 'বিৱৰণ', 'Category': 'শ্ৰেণী', 'Material': 'সামগ্ৰী', 'Craft Type': 'হস্তশিল্পৰ ধৰণ', 'Origin': 'উৎপত্তি', 'Smart Pricing Assistant': 'স্মাৰ্ট মূল্য সহায়ক', 'Material Cost': 'সামগ্ৰীৰ খৰচ', 'Labour Cost': 'শ্ৰমৰ খৰচ', 'Packaging': 'পেকেজিং', 'Total Cost': 'মুঠ খৰচ', 'AI Recommended Selling Price': 'AI পৰামৰ্শ দিয়া বিক্ৰী মূল্য', 'Home': 'হোম', 'Products': 'সামগ্ৰী', 'Buyers': 'ক্ৰেতা', 'Profile': 'প্ৰ’ফাইল',
  },
  'اردو': {
    'Good morning': 'صبح بخیر', 'Good Morning': 'صبح بخیر', 'Your artisan dashboard': 'آپ کا کاریگر ڈیش بورڈ', "Let's grow your craft business.": 'آئیے آپ کے دستکاری کے کاروبار کو بڑھائیں۔', 'Add new product': 'نئی مصنوعات شامل کریں', 'Products Listed': 'درج شدہ مصنوعات', 'Buyer Enquiries': 'خریدار کی پوچھ گچھ', 'Orders': 'آرڈرز', 'Estimated Sales': 'متوقع فروخت', 'Your featured craft': 'آپ کی نمایاں دستکاری', 'Catalogue strength': 'کیٹلاگ کا معیار', 'Need help with pricing, products or customers?': 'قیمت، مصنوعات یا گاہکوں کے بارے میں مدد چاہیے؟', 'Ask AI Coach': 'AI کوچ سے پوچھیں', 'Recent Activity': 'حالیہ سرگرمی', 'View orders': 'آرڈرز دیکھیں', 'Your impact': 'آپ کا اثر', 'Your digital presence is growing.': 'آپ کی ڈیجیٹل موجودگی بڑھ رہی ہے۔', 'Buyer Connections': 'خریدار رابطے', 'Orders Received': 'موصولہ آرڈرز', 'Estimated Revenue': 'متوقع آمدنی', 'Languages Supported': 'معاون زبانیں', 'Today': 'آج', 'Yesterday': 'کل', 'No product yet': 'ابھی کوئی مصنوعات نہیں', 'New Artisan': 'نیا کاریگر', 'Create New Profile': 'نیا پروفائل بنائیں', 'Back': 'واپس', 'Edit': 'ترمیم کریں', 'Product Name': 'مصنوعات کا نام', 'Description': 'تفصیل', 'Category': 'زمرہ', 'Material': 'مواد', 'Craft Type': 'دستکاری کی قسم', 'Origin': 'اصل مقام', 'Smart Pricing Assistant': 'سمارٹ قیمت معاون', 'Material Cost': 'مواد کی لاگت', 'Labour Cost': 'مزدوری کی لاگت', 'Packaging': 'پیکیجنگ', 'Total Cost': 'کل لاگت', 'AI Recommended Selling Price': 'AI کی تجویز کردہ فروخت قیمت', 'Home': 'ہوم', 'Products': 'مصنوعات', 'Buyers': 'خریدار', 'Profile': 'پروفائل',
  },
};

const STATIC_TEXT: Partial<Record<Language, Record<string, string>>> = {
  'English': {},
  'हिन्दी': {
    'Dashboard': 'डैशबोर्ड',
    'Orders': 'ऑर्डर',
    'Inventory': 'इन्वेंटरी',
    'Coach': 'कोच',
    'Catalogue': 'कैटलॉग',
    'Buyer Profile': 'खरीदार प्रोफ़ाइल',
    'Create New Profile': 'नई प्रोफ़ाइल बनाएँ',
    'Add Product': 'उत्पाद जोड़ें',
    'Back': 'वापस',
    'Edit': 'संपादित करें',
    'Save': 'सहेजें',
    'Cancel': 'रद्द करें',
    'Product Name': 'उत्पाद का नाम',
    'Description': 'विवरण',
    'Category': 'श्रेणी',
    'Material': 'सामग्री',
    'Craft Type': 'शिल्प प्रकार',
    'Origin': 'उत्पत्ति',
    'Price': 'कीमत',
    'Stock': 'स्टॉक',
    'Publish': 'प्रकाशित करें',
    'View Inventory': 'इन्वेंटरी देखें',
    'View Orders': 'ऑर्डर देखें',
    'Order': 'ऑर्डर',
    'units': 'इकाइयाँ',
    'Processing': 'प्रोसेसिंग',
    'Ready': 'तैयार',
    'Shipped': 'भेजा गया',
    'Delivered': 'डिलीवर किया गया',
    'available': 'उपलब्ध',
    'Low Stock': 'कम स्टॉक',
    'Decrease': 'घटाएँ',
    'Increase': 'बढ़ाएँ',
    'Add Inventory': 'इन्वेंटरी जोड़ें',
    'One Bamboo Basket added to inventory.': 'एक बाँस की टोकरी इन्वेंटरी में जोड़ी गई।',
  },
};

const ADD_PRODUCT_TEXT: Partial<Record<Language, Record<string, string>>> = {
  'English': {
    'Create / 01': 'Create / 01',
    'Add Your Product': 'Add Your Product',
    'Take a live photo, speak your description, and let AI prepare the listing.': 'Take a live photo, speak your description, and let AI prepare the listing.',
    'Take Product Photo': 'Take Product Photo',
    'Open live camera': 'Open live camera',
    'Upload Photo': 'Upload Photo',
    'Choose from gallery': 'Choose from gallery',
    'Describe by Voice': 'Describe by Voice',
    '6-second AI voice capture': '6-second AI voice capture',
    'Live product camera': 'Live product camera',
    'Live Product Camera': 'Live Product Camera',
    'Close': 'Close',
    'Capture Photo': 'Capture Photo',
    'Selected product': 'Selected product',
    'Product name': 'Product name',
    'Describe your product': 'Describe your product',
    'Example: Ye bamboo ki handmade basket hai...': 'Example: Ye bamboo ki handmade basket hai...',
    'Describe product by voice': 'Describe product by voice',
    'Listening…': 'Listening…',
    'Listening and transcribing with AI…': 'Listening and transcribing with AI…',
    'AI is analysing your product…': 'AI is analysing your product…',
    'Selected:': 'Selected:',
    'A few words or a photo are enough.': 'A few words or a photo are enough.',
    'Cancel': 'Cancel',
    'AI is working…': 'AI is working…',
    'Generate with AI': 'Generate with AI',
    'AI product understanding': 'AI product understanding',
    'Use the live camera or upload a photo. AI can identify the product, suggest a category and create marketplace-ready copy.': 'Use the live camera or upload a photo. AI can identify the product, suggest a category and create marketplace-ready copy.',
  },

  'हिन्दी': {
    'Create / 01': 'बनाएँ / 01',
    'Add Your Product': 'अपना उत्पाद जोड़ें',
    'Take a live photo, speak your description, and let AI prepare the listing.': 'लाइव फोटो लें, अपने उत्पाद के बारे में बोलें और AI को आपकी लिस्टिंग तैयार करने दें।',
    'Take Product Photo': 'उत्पाद की फोटो लें',
    'Open live camera': 'लाइव कैमरा खोलें',
    'Upload Photo': 'फोटो अपलोड करें',
    'Choose from gallery': 'गैलरी से चुनें',
    'Describe by Voice': 'आवाज़ से बताएं',
    '6-second AI voice capture': '6 सेकंड का AI वॉइस कैप्चर',
    'Live product camera': 'लाइव उत्पाद कैमरा',
    'Live Product Camera': 'लाइव उत्पाद कैमरा',
    'Close': 'बंद करें',
    'Capture Photo': 'फोटो लें',
    'Selected product': 'चयनित उत्पाद',
    'Product name': 'उत्पाद का नाम',
    'Describe your product': 'अपने उत्पाद का वर्णन करें',
    'Example: Ye bamboo ki handmade basket hai...': 'उदाहरण: यह बाँस की हाथ से बनी टोकरी है...',
    'Describe product by voice': 'उत्पाद का विवरण आवाज़ से बताएं',
    'Listening…': 'सुन रहे हैं…',
    'Listening and transcribing with AI…': 'AI सुन रहा है और लिख रहा है…',
    'AI is analysing your product…': 'AI आपके उत्पाद का विश्लेषण कर रहा है…',
    'Selected:': 'चयनित:',
    'A few words or a photo are enough.': 'कुछ शब्द या एक फोटो ही पर्याप्त है।',
    'Cancel': 'रद्द करें',
    'AI is working…': 'AI काम कर रहा है…',
    'Generate with AI': 'AI से तैयार करें',
    'AI product understanding': 'AI उत्पाद समझ',
    'Use the live camera or upload a photo. AI can identify the product, suggest a category and create marketplace-ready copy.': 'लाइव कैमरा इस्तेमाल करें या फोटो अपलोड करें। AI उत्पाद की पहचान कर सकता है, श्रेणी सुझा सकता है और मार्केटप्लेस के लिए तैयार विवरण बना सकता है।',
  },

  'ਪੰਜਾਬੀ': {
    'Create / 01': 'ਬਣਾਓ / 01',
    'Add Your Product': 'ਆਪਣਾ ਉਤਪਾਦ ਸ਼ਾਮਲ ਕਰੋ',
    'Take a live photo, speak your description, and let AI prepare the listing.': 'ਲਾਈਵ ਫੋਟੋ ਲਓ, ਆਪਣੇ ਉਤਪਾਦ ਬਾਰੇ ਬੋਲੋ ਅਤੇ AI ਨੂੰ ਲਿਸਟਿੰਗ ਤਿਆਰ ਕਰਨ ਦਿਓ।',
    'Take Product Photo': 'ਉਤਪਾਦ ਦੀ ਫੋਟੋ ਲਓ',
    'Open live camera': 'ਲਾਈਵ ਕੈਮਰਾ ਖੋਲ੍ਹੋ',
    'Upload Photo': 'ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ',
    'Choose from gallery': 'ਗੈਲਰੀ ਤੋਂ ਚੁਣੋ',
    'Describe by Voice': 'ਆਵਾਜ਼ ਨਾਲ ਦੱਸੋ',
    '6-second AI voice capture': '6 ਸਕਿੰਟ ਦਾ AI ਵੌਇਸ ਕੈਪਚਰ',
    'Live product camera': 'ਲਾਈਵ ਉਤਪਾਦ ਕੈਮਰਾ',
    'Live Product Camera': 'ਲਾਈਵ ਉਤਪਾਦ ਕੈਮਰਾ',
    'Close': 'ਬੰਦ ਕਰੋ',
    'Capture Photo': 'ਫੋਟੋ ਖਿੱਚੋ',
    'Selected product': 'ਚੁਣਿਆ ਉਤਪਾਦ',
    'Product name': 'ਉਤਪਾਦ ਦਾ ਨਾਮ',
    'Describe your product': 'ਆਪਣੇ ਉਤਪਾਦ ਦਾ ਵੇਰਵਾ ਦਿਓ',
    'Example: Ye bamboo ki handmade basket hai...': 'ਉਦਾਹਰਨ: ਇਹ ਬਾਂਸ ਦੀ ਹੱਥ ਨਾਲ ਬਣੀ ਟੋਕਰੀ ਹੈ...',
    'Describe product by voice': 'ਉਤਪਾਦ ਦਾ ਵੇਰਵਾ ਆਵਾਜ਼ ਨਾਲ ਦਿਓ',
    'Listening…': 'ਸੁਣ ਰਹੇ ਹਾਂ…',
    'Listening and transcribing with AI…': 'AI ਸੁਣ ਰਿਹਾ ਹੈ ਅਤੇ ਲਿਖ ਰਿਹਾ ਹੈ…',
    'AI is analysing your product…': 'AI ਤੁਹਾਡੇ ਉਤਪਾਦ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ…',
    'Selected:': 'ਚੁਣਿਆ:',
    'A few words or a photo are enough.': 'ਕੁਝ ਸ਼ਬਦ ਜਾਂ ਇੱਕ ਫੋਟੋ ਕਾਫ਼ੀ ਹੈ।',
    'Cancel': 'ਰੱਦ ਕਰੋ',
    'AI is working…': 'AI ਕੰਮ ਕਰ ਰਿਹਾ ਹੈ…',
    'Generate with AI': 'AI ਨਾਲ ਤਿਆਰ ਕਰੋ',
    'AI product understanding': 'AI ਉਤਪਾਦ ਸਮਝ',
    'Use the live camera or upload a photo. AI can identify the product, suggest a category and create marketplace-ready copy.': 'ਲਾਈਵ ਕੈਮਰਾ ਵਰਤੋ ਜਾਂ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ। AI ਉਤਪਾਦ ਦੀ ਪਛਾਣ ਕਰ ਸਕਦਾ ਹੈ, ਸ਼੍ਰੇਣੀ ਸੁਝਾ ਸਕਦਾ ਹੈ ਅਤੇ ਮਾਰਕੀਟਪਲੇਸ ਲਈ ਤਿਆਰ ਵੇਰਵਾ ਬਣਾ ਸਕਦਾ ਹੈ।',
  },

  'বাংলা': {
    'Create / 01': 'তৈরি করুন / 01',
    'Add Your Product': 'আপনার পণ্য যোগ করুন',
    'Take a live photo, speak your description, and let AI prepare the listing.': 'লাইভ ছবি তুলুন, পণ্যের বিবরণ বলুন এবং AI-কে লিস্টিং তৈরি করতে দিন।',
    'Take Product Photo': 'পণ্যের ছবি তুলুন',
    'Open live camera': 'লাইভ ক্যামেরা খুলুন',
    'Upload Photo': 'ছবি আপলোড করুন',
    'Choose from gallery': 'গ্যালারি থেকে বেছে নিন',
    'Describe by Voice': 'কণ্ঠে বলুন',
    '6-second AI voice capture': '৬ সেকেন্ডের AI ভয়েস ক্যাপচার',
    'Live product camera': 'লাইভ পণ্য ক্যামেরা',
    'Live Product Camera': 'লাইভ পণ্য ক্যামেরা',
    'Close': 'বন্ধ করুন',
    'Capture Photo': 'ছবি তুলুন',
    'Selected product': 'নির্বাচিত পণ্য',
    'Product name': 'পণ্যের নাম',
    'Describe your product': 'আপনার পণ্যের বিবরণ দিন',
    'Example: Ye bamboo ki handmade basket hai...': 'উদাহরণ: এটি হাতে তৈরি বাঁশের ঝুড়ি...',
    'Describe product by voice': 'কণ্ঠে পণ্যের বিবরণ দিন',
    'Listening…': 'শোনা হচ্ছে…',
    'Listening and transcribing with AI…': 'AI শুনছে এবং লিখছে…',
    'AI is analysing your product…': 'AI আপনার পণ্য বিশ্লেষণ করছে…',
    'Selected:': 'নির্বাচিত:',
    'A few words or a photo are enough.': 'কয়েকটি শব্দ বা একটি ছবিই যথেষ্ট।',
    'Cancel': 'বাতিল করুন',
    'AI is working…': 'AI কাজ করছে…',
    'Generate with AI': 'AI দিয়ে তৈরি করুন',
    'AI product understanding': 'AI পণ্য বোঝাপড়া',
    'Use the live camera or upload a photo. AI can identify the product, suggest a category and create marketplace-ready copy.': 'লাইভ ক্যামেরা ব্যবহার করুন বা ছবি আপলোড করুন। AI পণ্য শনাক্ত করতে, বিভাগ সাজেস্ট করতে এবং মার্কেটপ্লেসের জন্য প্রস্তুত বিবরণ তৈরি করতে পারে।',
  },

  'ગુજરાતી': {
    'Create / 01': 'બનાવો / 01',
    'Add Your Product': 'તમારું ઉત્પાદન ઉમેરો',
    'Take a live photo, speak your description, and let AI prepare the listing.': 'લાઇવ ફોટો લો, તમારા ઉત્પાદનનું વર્ણન બોલો અને AIને લિસ્ટિંગ તૈયાર કરવા દો.',
    'Take Product Photo': 'ઉત્પાદનનો ફોટો લો',
    'Open live camera': 'લાઇવ કેમેરા ખોલો',
    'Upload Photo': 'ફોટો અપલોડ કરો',
    'Choose from gallery': 'ગેલેરીમાંથી પસંદ કરો',
    'Describe by Voice': 'અવાજથી જણાવો',
    '6-second AI voice capture': '6 સેકન્ડનું AI વૉઇસ કૅપ્ચર',
    'Live product camera': 'લાઇવ ઉત્પાદન કેમેરા',
    'Live Product Camera': 'લાઇવ ઉત્પાદન કેમેરા',
    'Close': 'બંધ કરો',
    'Capture Photo': 'ફોટો લો',
    'Selected product': 'પસંદ કરેલું ઉત્પાદન',
    'Product name': 'ઉત્પાદનનું નામ',
    'Describe your product': 'તમારા ઉત્પાદનનું વર્ણન કરો',
    'Example: Ye bamboo ki handmade basket hai...': 'ઉદાહરણ: આ હાથથી બનાવેલી વાંસની ટોપલી છે...',
    'Describe product by voice': 'અવાજથી ઉત્પાદનનું વર્ણન કરો',
    'Listening…': 'સાંભળી રહ્યા છીએ…',
    'Listening and transcribing with AI…': 'AI સાંભળી રહ્યું છે અને લખી રહ્યું છે…',
    'AI is analysing your product…': 'AI તમારા ઉત્પાદનનું વિશ્લેષણ કરી રહ્યું છે…',
    'Selected:': 'પસંદ કરેલું:',
    'A few words or a photo are enough.': 'થોડા શબ્દો અથવા એક ફોટો પૂરતો છે.',
    'Cancel': 'રદ કરો',
    'AI is working…': 'AI કામ કરી રહ્યું છે…',
    'Generate with AI': 'AI સાથે તૈયાર કરો',
    'AI product understanding': 'AI ઉત્પાદન સમજ',
    'Use the live camera or upload a photo. AI can identify the product, suggest a category and create marketplace-ready copy.': 'લાઇવ કેમેરાનો ઉપયોગ કરો અથવા ફોટો અપલોડ કરો. AI ઉત્પાદન ઓળખી શકે છે, શ્રેણી સૂચવી શકે છે અને માર્કેટપ્લેસ માટે તૈયાર વર્ણન બનાવી શકે છે.',
  },

  'मराठी': {
    'Create / 01': 'तयार करा / 01',
    'Add Your Product': 'तुमचे उत्पादन जोडा',
    'Take a live photo, speak your description, and let AI prepare the listing.': 'लाइव्ह फोटो घ्या, तुमच्या उत्पादनाचे वर्णन बोला आणि AI ला लिस्टिंग तयार करू द्या.',
    'Take Product Photo': 'उत्पादनाचा फोटो घ्या',
    'Open live camera': 'लाइव्ह कॅमेरा उघडा',
    'Upload Photo': 'फोटो अपलोड करा',
    'Choose from gallery': 'गॅलरीमधून निवडा',
    'Describe by Voice': 'आवाजाने सांगा',
    '6-second AI voice capture': '६ सेकंदांचे AI व्हॉइस कॅप्चर',
    'Live product camera': 'लाइव्ह उत्पादन कॅमेरा',
    'Live Product Camera': 'लाइव्ह उत्पादन कॅमेरा',
    'Close': 'बंद करा',
    'Capture Photo': 'फोटो घ्या',
    'Selected product': 'निवडलेले उत्पादन',
    'Product name': 'उत्पादनाचे नाव',
    'Describe your product': 'तुमच्या उत्पादनाचे वर्णन करा',
    'Example: Ye bamboo ki handmade basket hai...': 'उदाहरण: ही हाताने बनवलेली बांबूची टोपली आहे...',
    'Describe product by voice': 'आवाजाने उत्पादनाचे वर्णन करा',
    'Listening…': 'ऐकत आहे…',
    'Listening and transcribing with AI…': 'AI ऐकत आहे आणि लिहित आहे…',
    'AI is analysing your product…': 'AI तुमच्या उत्पादनाचे विश्लेषण करत आहे…',
    'Selected:': 'निवडलेले:',
    'A few words or a photo are enough.': 'काही शब्द किंवा एक फोटो पुरेसा आहे.',
    'Cancel': 'रद्द करा',
    'AI is working…': 'AI काम करत आहे…',
    'Generate with AI': 'AI ने तयार करा',
    'AI product understanding': 'AI उत्पादन समज',
    'Use the live camera or upload a photo. AI can identify the product, suggest a category and create marketplace-ready copy.': 'लाइव्ह कॅमेरा वापरा किंवा फोटो अपलोड करा. AI उत्पादन ओळखू शकते, श्रेणी सुचवू शकते आणि मार्केटप्लेससाठी तयार मजकूर तयार करू शकते.',
  },

  'தமிழ்': {
    'Create / 01': 'உருவாக்கு / 01',
    'Add Your Product': 'உங்கள் பொருளைச் சேர்க்கவும்',
    'Take a live photo, speak your description, and let AI prepare the listing.': 'நேரடி புகைப்படம் எடுத்து, உங்கள் பொருளைப் பற்றி பேசுங்கள்; AI பட்டியலைத் தயாரிக்கட்டும்.',
    'Take Product Photo': 'பொருளின் புகைப்படம் எடுக்கவும்',
    'Open live camera': 'நேரடி கேமராவைத் திறக்கவும்',
    'Upload Photo': 'புகைப்படத்தைப் பதிவேற்றவும்',
    'Choose from gallery': 'கேலரியில் இருந்து தேர்வு செய்யவும்',
    'Describe by Voice': 'குரலில் விவரிக்கவும்',
    '6-second AI voice capture': '6 வினாடி AI குரல் பதிவு',
    'Live product camera': 'நேரடி பொருள் கேமரா',
    'Live Product Camera': 'நேரடி பொருள் கேமரா',
    'Close': 'மூடவும்',
    'Capture Photo': 'புகைப்படம் எடுக்கவும்',
    'Selected product': 'தேர்ந்தெடுக்கப்பட்ட பொருள்',
    'Product name': 'பொருளின் பெயர்',
    'Describe your product': 'உங்கள் பொருளை விவரிக்கவும்',
    'Example: Ye bamboo ki handmade basket hai...': 'உதாரணம்: இது கையால் செய்யப்பட்ட மூங்கில் கூடை...',
    'Describe product by voice': 'குரலில் பொருளை விவரிக்கவும்',
    'Listening…': 'கேட்கிறது…',
    'Listening and transcribing with AI…': 'AI கேட்டு எழுத்தாக்குகிறது…',
    'AI is analysing your product…': 'AI உங்கள் பொருளை ஆய்வு செய்கிறது…',
    'Selected:': 'தேர்ந்தெடுக்கப்பட்டது:',
    'A few words or a photo are enough.': 'சில வார்த்தைகள் அல்லது ஒரு புகைப்படம் போதும்.',
    'Cancel': 'ரத்து செய்',
    'AI is working…': 'AI செயல்படுகிறது…',
    'Generate with AI': 'AI மூலம் உருவாக்கவும்',
    'AI product understanding': 'AI பொருள் புரிதல்',
    'Use the live camera or upload a photo. AI can identify the product, suggest a category and create marketplace-ready copy.': 'நேரடி கேமராவைப் பயன்படுத்தவும் அல்லது புகைப்படத்தைப் பதிவேற்றவும். AI பொருளைக் கண்டறிந்து, வகையைப் பரிந்துரைத்து, சந்தைக்குத் தயாரான விவரத்தை உருவாக்கும்.',
  },

  'తెలుగు': {
    'Create / 01': 'తయారు చేయండి / 01',
    'Add Your Product': 'మీ ఉత్పత్తిని జోడించండి',
    'Take a live photo, speak your description, and let AI prepare the listing.': 'లైవ్ ఫోటో తీసి, మీ ఉత్పత్తి గురించి చెప్పండి; AI లిస్టింగ్‌ను సిద్ధం చేస్తుంది.',
    'Take Product Photo': 'ఉత్పత్తి ఫోటో తీయండి',
    'Open live camera': 'లైవ్ కెమెరాను తెరవండి',
    'Upload Photo': 'ఫోటోను అప్‌లోడ్ చేయండి',
    'Choose from gallery': 'గ్యాలరీ నుంచి ఎంచుకోండి',
    'Describe by Voice': 'వాయిస్‌తో వివరించండి',
    '6-second AI voice capture': '6 సెకన్ల AI వాయిస్ క్యాప్చర్',
    'Live product camera': 'లైవ్ ఉత్పత్తి కెమెరా',
    'Live Product Camera': 'లైవ్ ఉత్పత్తి కెమెరా',
    'Close': 'మూసివేయండి',
    'Capture Photo': 'ఫోటో తీయండి',
    'Selected product': 'ఎంచుకున్న ఉత్పత్తి',
    'Product name': 'ఉత్పత్తి పేరు',
    'Describe your product': 'మీ ఉత్పత్తిని వివరించండి',
    'Example: Ye bamboo ki handmade basket hai...': 'ఉదాహరణ: ఇది చేతితో తయారు చేసిన వెదురు బుట్ట...',
    'Describe product by voice': 'వాయిస్‌తో ఉత్పత్తిని వివరించండి',
    'Listening…': 'వింటోంది…',
    'Listening and transcribing with AI…': 'AI వింటూ లిఖిస్తోంది…',
    'AI is analysing your product…': 'AI మీ ఉత్పత్తిని విశ్లేషిస్తోంది…',
    'Selected:': 'ఎంచుకున్నది:',
    'A few words or a photo are enough.': 'కొన్ని మాటలు లేదా ఒక ఫోటో సరిపోతుంది.',
    'Cancel': 'రద్దు చేయండి',
    'AI is working…': 'AI పనిచేస్తోంది…',
    'Generate with AI': 'AIతో రూపొందించండి',
    'AI product understanding': 'AI ఉత్పత్తి అవగాహన',
    'Use the live camera or upload a photo. AI can identify the product, suggest a category and create marketplace-ready copy.': 'లైవ్ కెమెరాను ఉపయోగించండి లేదా ఫోటోను అప్‌లోడ్ చేయండి. AI ఉత్పత్తిని గుర్తించి, వర్గాన్ని సూచించి, మార్కెట్‌ప్లేస్‌కు సిద్ధమైన వివరణను రూపొందించగలదు.',
  },

  'ಕನ್ನಡ': {
    'Create / 01': 'ರಚಿಸಿ / 01',
    'Add Your Product': 'ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು ಸೇರಿಸಿ',
    'Take a live photo, speak your description, and let AI prepare the listing.': 'ಲೈವ್ ಫೋಟೋ ತೆಗೆದು, ನಿಮ್ಮ ಉತ್ಪನ್ನದ ಬಗ್ಗೆ ಮಾತನಾಡಿ; AI ಪಟ್ಟಿಯನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತದೆ.',
    'Take Product Photo': 'ಉತ್ಪನ್ನದ ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ',
    'Open live camera': 'ಲೈವ್ ಕ್ಯಾಮೆರಾ ತೆರೆಯಿರಿ',
    'Upload Photo': 'ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    'Choose from gallery': 'ಗ್ಯಾಲರಿಯಿಂದ ಆಯ್ಕೆ ಮಾಡಿ',
    'Describe by Voice': 'ಧ್ವನಿಯಲ್ಲಿ ವಿವರಿಸಿ',
    '6-second AI voice capture': '6 ಸೆಕೆಂಡ್ AI ಧ್ವನಿ ಕ್ಯಾಪ್ಚರ್',
    'Live product camera': 'ಲೈವ್ ಉತ್ಪನ್ನ ಕ್ಯಾಮೆರಾ',
    'Live Product Camera': 'ಲೈವ್ ಉತ್ಪನ್ನ ಕ್ಯಾಮೆರಾ',
    'Close': 'ಮುಚ್ಚಿ',
    'Capture Photo': 'ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ',
    'Selected product': 'ಆಯ್ಕೆ ಮಾಡಿದ ಉತ್ಪನ್ನ',
    'Product name': 'ಉತ್ಪನ್ನದ ಹೆಸರು',
    'Describe your product': 'ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು ವಿವರಿಸಿ',
    'Example: Ye bamboo ki handmade basket hai...': 'ಉದಾಹರಣೆ: ಇದು ಕೈಯಿಂದ ಮಾಡಿದ ಬಿದಿರಿನ ಬುಟ್ಟಿ...',
    'Describe product by voice': 'ಧ್ವನಿಯಲ್ಲಿ ಉತ್ಪನ್ನವನ್ನು ವಿವರಿಸಿ',
    'Listening…': 'ಕೇಳುತ್ತಿದೆ…',
    'Listening and transcribing with AI…': 'AI ಕೇಳಿ ಬರೆಯುತ್ತಿದೆ…',
    'AI is analysing your product…': 'AI ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ…',
    'Selected:': 'ಆಯ್ಕೆ:',
    'A few words or a photo are enough.': 'ಕೆಲವು ಪದಗಳು ಅಥವಾ ಒಂದು ಫೋಟೋ ಸಾಕು.',
    'Cancel': 'ರದ್ದುಮಾಡಿ',
    'AI is working…': 'AI ಕೆಲಸ ಮಾಡುತ್ತಿದೆ…',
    'Generate with AI': 'AI ಮೂಲಕ ರಚಿಸಿ',
    'AI product understanding': 'AI ಉತ್ಪನ್ನ ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವಿಕೆ',
    'Use the live camera or upload a photo. AI can identify the product, suggest a category and create marketplace-ready copy.': 'ಲೈವ್ ಕ್ಯಾಮೆರಾ ಬಳಸಿ ಅಥವಾ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. AI ಉತ್ಪನ್ನವನ್ನು ಗುರುತಿಸಿ, ವರ್ಗವನ್ನು ಸೂಚಿಸಿ ಮತ್ತು ಮಾರುಕಟ್ಟೆಗೆ ಸಿದ್ಧವಾದ ವಿವರಣೆಯನ್ನು ರಚಿಸಬಹುದು.',
  },

  'മലയാളം': {
    'Create / 01': 'തയ്യാറാക്കുക / 01',
    'Add Your Product': 'നിങ്ങളുടെ ഉൽപ്പന്നം ചേർക്കുക',
    'Take a live photo, speak your description, and let AI prepare the listing.': 'ലൈവ് ഫോട്ടോ എടുക്കുക, ഉൽപ്പന്നത്തെക്കുറിച്ച് പറയുക, AI ലിസ്റ്റിംഗ് തയ്യാറാക്കട്ടെ.',
    'Take Product Photo': 'ഉൽപ്പന്നത്തിന്റെ ഫോട്ടോ എടുക്കുക',
    'Open live camera': 'ലൈവ് ക്യാമറ തുറക്കുക',
    'Upload Photo': 'ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക',
    'Choose from gallery': 'ഗാലറിയിൽ നിന്ന് തിരഞ്ഞെടുക്കുക',
    'Describe by Voice': 'ശബ്ദത്തിലൂടെ വിവരിക്കുക',
    '6-second AI voice capture': '6 സെക്കൻഡ് AI വോയ്സ് ക്യാപ്ചർ',
    'Live product camera': 'ലൈവ് ഉൽപ്പന്ന ക്യാമറ',
    'Live Product Camera': 'ലൈവ് ഉൽപ്പന്ന ക്യാമറ',
    'Close': 'അടയ്ക്കുക',
    'Capture Photo': 'ഫോട്ടോ എടുക്കുക',
    'Selected product': 'തിരഞ്ഞെടുത്ത ഉൽപ്പന്നം',
    'Product name': 'ഉൽപ്പന്നത്തിന്റെ പേര്',
    'Describe your product': 'നിങ്ങളുടെ ഉൽപ്പന്നം വിവരിക്കുക',
    'Example: Ye bamboo ki handmade basket hai...': 'ഉദാഹരണം: ഇത് കൈകൊണ്ട് നിർമ്മിച്ച മുളക്കൂടയാണ്...',
    'Describe product by voice': 'ശബ്ദത്തിലൂടെ ഉൽപ്പന്നം വിവരിക്കുക',
    'Listening…': 'കേൾക്കുന്നു…',
    'Listening and transcribing with AI…': 'AI കേട്ട് എഴുതുന്നു…',
    'AI is analysing your product…': 'AI നിങ്ങളുടെ ഉൽപ്പന്നം വിശകലനം ചെയ്യുന്നു…',
    'Selected:': 'തിരഞ്ഞെടുത്തത്:',
    'A few words or a photo are enough.': 'കുറച്ച് വാക്കുകളോ ഒരു ഫോട്ടോയോ മതിയാകും.',
    'Cancel': 'റദ്ദാക്കുക',
    'AI is working…': 'AI പ്രവർത്തിക്കുന്നു…',
    'Generate with AI': 'AI ഉപയോഗിച്ച് തയ്യാറാക്കുക',
    'AI product understanding': 'AI ഉൽപ്പന്ന മനസ്സിലാക്കൽ',
    'Use the live camera or upload a photo. AI can identify the product, suggest a category and create marketplace-ready copy.': 'ലൈവ് ക്യാമറ ഉപയോഗിക്കുക അല്ലെങ്കിൽ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക. AI ഉൽപ്പന്നം തിരിച്ചറിയുകയും വിഭാഗം നിർദ്ദേശിക്കുകയും മാർക്കറ്റ്പ്ലേസിനായി തയ്യാറായ വിവരണം സൃഷ്ടിക്കുകയും ചെയ്യും.',
  },

  'ଓଡ଼ିଆ': {
    'Create / 01': 'ତିଆରି କରନ୍ତୁ / 01',
    'Add Your Product': 'ଆପଣଙ୍କ ଉତ୍ପାଦ ଯୋଡନ୍ତୁ',
    'Take a live photo, speak your description, and let AI prepare the listing.': 'ଲାଇଭ୍ ଫଟୋ ନିଅନ୍ତୁ, ଆପଣଙ୍କ ଉତ୍ପାଦ ବିଷୟରେ କୁହନ୍ତୁ ଏବଂ AIକୁ ଲିଷ୍ଟିଂ ପ୍ରସ୍ତୁତ କରିବାକୁ ଦିଅନ୍ତୁ।',
    'Take Product Photo': 'ଉତ୍ପାଦର ଫଟୋ ନିଅନ୍ତୁ',
    'Open live camera': 'ଲାଇଭ୍ କ୍ୟାମେରା ଖୋଲନ୍ତୁ',
    'Upload Photo': 'ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ',
    'Choose from gallery': 'ଗ୍ୟାଲେରୀରୁ ବାଛନ୍ତୁ',
    'Describe by Voice': 'ସ୍ୱରରେ କୁହନ୍ତୁ',
    '6-second AI voice capture': '୬ ସେକେଣ୍ଡ AI ଭଏସ୍ କ୍ୟାପଚର୍',
    'Live product camera': 'ଲାଇଭ୍ ଉତ୍ପାଦ କ୍ୟାମେରା',
    'Live Product Camera': 'ଲାଇଭ୍ ଉତ୍ପାଦ କ୍ୟାମେରା',
    'Close': 'ବନ୍ଦ କରନ୍ତୁ',
    'Capture Photo': 'ଫଟୋ ନିଅନ୍ତୁ',
    'Selected product': 'ଚୟନ କରାଯାଇଥିବା ଉତ୍ପାଦ',
    'Product name': 'ଉତ୍ପାଦର ନାମ',
    'Describe your product': 'ଆପଣଙ୍କ ଉତ୍ପାଦ ବିଷୟରେ ବର୍ଣ୍ଣନା କରନ୍ତୁ',
    'Example: Ye bamboo ki handmade basket hai...': 'ଉଦାହରଣ: ଏହା ହାତରେ ତିଆରି ବାଉଁଶ ଟୋକେଇ...',
    'Describe product by voice': 'ସ୍ୱରରେ ଉତ୍ପାଦ ବିଷୟରେ କୁହନ୍ତୁ',
    'Listening…': 'ଶୁଣୁଛି…',
    'Listening and transcribing with AI…': 'AI ଶୁଣି ଲେଖୁଛି…',
    'AI is analysing your product…': 'AI ଆପଣଙ୍କ ଉତ୍ପାଦକୁ ବିଶ୍ଳେଷଣ କରୁଛି…',
    'Selected:': 'ଚୟନ:',
    'A few words or a photo are enough.': 'କିଛି ଶବ୍ଦ କିମ୍ବା ଗୋଟିଏ ଫଟୋ ଯଥେଷ୍ଟ।',
    'Cancel': 'ବାତିଲ୍ କରନ୍ତୁ',
    'AI is working…': 'AI କାମ କରୁଛି…',
    'Generate with AI': 'AI ସହିତ ପ୍ରସ୍ତୁତ କରନ୍ତୁ',
    'AI product understanding': 'AI ଉତ୍ପାଦ ବୁଝାମଣା',
    'Use the live camera or upload a photo. AI can identify the product, suggest a category and create marketplace-ready copy.': 'ଲାଇଭ୍ କ୍ୟାମେରା ବ୍ୟବହାର କରନ୍ତୁ କିମ୍ବା ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ। AI ଉତ୍ପାଦ ଚିହ୍ନଟ କରି, ବର୍ଗ ସୁପାରିଶ କରି ମାର୍କେଟପ୍ଲେସ୍ ପାଇଁ ପ୍ରସ୍ତୁତ ବର୍ଣ୍ଣନା ତିଆରି କରିପାରିବ।',
  },

  'অসমীয়া': {
    'Create / 01': 'সৃষ্টি কৰক / 01',
    'Add Your Product': 'আপোনাৰ সামগ্ৰী যোগ কৰক',
    'Take a live photo, speak your description, and let AI prepare the listing.': 'লাইভ ফটো লওক, আপোনাৰ সামগ্ৰীৰ বিষয়ে কওক আৰু AI-ক লিষ্টিং প্ৰস্তুত কৰিবলৈ দিয়ক।',
    'Take Product Photo': 'সামগ্ৰীৰ ফটো লওক',
    'Open live camera': 'লাইভ কেমেৰা খোলক',
    'Upload Photo': 'ফটো আপলোড কৰক',
    'Choose from gallery': 'গেলাৰীৰ পৰা বাছক',
    'Describe by Voice': 'কণ্ঠেৰে বৰ্ণনা কৰক',
    '6-second AI voice capture': '৬ ছেকেণ্ডৰ AI ভইচ কেপচাৰ',
    'Live product camera': 'লাইভ সামগ্ৰী কেমেৰা',
    'Live Product Camera': 'লাইভ সামগ্ৰী কেমেৰা',
    'Close': 'বন্ধ কৰক',
    'Capture Photo': 'ফটো লওক',
    'Selected product': 'নিৰ্বাচিত সামগ্ৰী',
    'Product name': 'সামগ্ৰীৰ নাম',
    'Describe your product': 'আপোনাৰ সামগ্ৰীৰ বৰ্ণনা দিয়ক',
    'Example: Ye bamboo ki handmade basket hai...': 'উদাহৰণ: এইখন হাতেৰে বনোৱা বাঁহৰ পাচি...',
    'Describe product by voice': 'কণ্ঠেৰে সামগ্ৰীৰ বৰ্ণনা দিয়ক',
    'Listening…': 'শুনি আছে…',
    'Listening and transcribing with AI…': 'AI-য়ে শুনি লিখি আছে…',
    'AI is analysing your product…': 'AI-য়ে আপোনাৰ সামগ্ৰী বিশ্লেষণ কৰি আছে…',
    'Selected:': 'নিৰ্বাচিত:',
    'A few words or a photo are enough.': 'কেইটামান শব্দ বা এখন ফটোই যথেষ্ট।',
    'Cancel': 'বাতিল কৰক',
    'AI is working…': 'AI কাম কৰি আছে…',
    'Generate with AI': 'AI-ৰ সহায়ত প্ৰস্তুত কৰক',
    'AI product understanding': 'AI সামগ্ৰী বুজাবুজি',
    'Use the live camera or upload a photo. AI can identify the product, suggest a category and create marketplace-ready copy.': 'লাইভ কেমেৰা ব্যৱহাৰ কৰক বা ফটো আপলোড কৰক। AI-য়ে সামগ্ৰী চিনাক্ত কৰি, শ্ৰেণী পৰামৰ্শ দি আৰু মাৰ্কেটপ্লেচৰ বাবে সাজু বৰ্ণনা প্ৰস্তুত কৰিব পাৰে।',
  },

  'اردو': {
    'Create / 01': 'بنائیں / 01',
    'Add Your Product': 'اپنی مصنوعات شامل کریں',
    'Take a live photo, speak your description, and let AI prepare the listing.': 'لائیو تصویر لیں، اپنی مصنوعات کے بارے میں بولیں اور AI کو لسٹنگ تیار کرنے دیں۔',
    'Take Product Photo': 'مصنوعات کی تصویر لیں',
    'Open live camera': 'لائیو کیمرہ کھولیں',
    'Upload Photo': 'تصویر اپ لوڈ کریں',
    'Choose from gallery': 'گیلری سے منتخب کریں',
    'Describe by Voice': 'آواز سے بتائیں',
    '6-second AI voice capture': '6 سیکنڈ کی AI وائس کیپچر',
    'Live product camera': 'لائیو پروڈکٹ کیمرہ',
    'Live Product Camera': 'لائیو پروڈکٹ کیمرہ',
    'Close': 'بند کریں',
    'Capture Photo': 'تصویر لیں',
    'Selected product': 'منتخب مصنوعات',
    'Product name': 'مصنوعات کا نام',
    'Describe your product': 'اپنی مصنوعات کی تفصیل دیں',
    'Example: Ye bamboo ki handmade basket hai...': 'مثال: یہ ہاتھ سے بنی بانس کی ٹوکری ہے...',
    'Describe product by voice': 'آواز سے مصنوعات کی تفصیل دیں',
    'Listening…': 'سن رہے ہیں…',
    'Listening and transcribing with AI…': 'AI سن رہا ہے اور لکھ رہا ہے…',
    'AI is analysing your product…': 'AI آپ کی مصنوعات کا تجزیہ کر رہا ہے…',
    'Selected:': 'منتخب:',
    'A few words or a photo are enough.': 'چند الفاظ یا ایک تصویر کافی ہے۔',
    'Cancel': 'منسوخ کریں',
    'AI is working…': 'AI کام کر رہا ہے…',
    'Generate with AI': 'AI سے تیار کریں',
    'AI product understanding': 'AI مصنوعات کی سمجھ',
    'Use the live camera or upload a photo. AI can identify the product, suggest a category and create marketplace-ready copy.': 'لائیو کیمرہ استعمال کریں یا تصویر اپ لوڈ کریں۔ AI مصنوعات کی شناخت، زمرہ تجویز اور مارکیٹ پلیس کے لیے تیار تفصیل بنا سکتا ہے۔',
  },
};

const UI_KEY_LABELS: Record<string, string> = {
  home: 'Home',
  products: 'Products',
  buyers: 'Buyers',
  orders: 'Orders',
  profile: 'Profile',
  create: 'Create New Profile',
  start: 'Start your journey',
  demo: 'Explore demo',
};

function ui(language: Language, key: string): string {
  const englishLabel = UI_KEY_LABELS[key] || key;
  return localizeStaticText(englishLabel, language);
}


const PHOTO_STUDIO_TEXT: Partial<Record<Language, Record<string, string>>> = {
  'English': {
    'Create / 02': 'Create / 02',
    'AI Photo Studio': 'AI Photo Studio',
    'Use your captured or uploaded product photo and let AI create a marketplace-ready visual.': 'Use your captured or uploaded product photo and let AI create a marketplace-ready visual.',
    'No product photo yet': 'No product photo yet',
    'Go back and capture a live photo or upload one from your gallery.': 'Go back and capture a live photo or upload one from your gallery.',
    'Add Product Photo': 'Add Product Photo',
    'Original': 'Original',
    'AI Edited': 'AI Edited',
    'AI is editing your photo…': 'AI is editing your photo…',
    'Preparing a clean marketplace presentation': 'Preparing a clean marketplace presentation',
    'Choose an AI style': 'Choose an AI style',
    'Your edited photo will appear here.': 'Your edited photo will appear here.',
    'Warm daylight': 'Warm daylight',
    'Clean paper': 'Clean paper',
    'Village courtyard': 'Village courtyard',
    'Original photo kept': 'Original photo kept',
    'AI product analysis': 'AI product analysis',
    'AI visual edit': 'AI visual edit',
    'Marketplace-ready image': 'Marketplace-ready image',
    'Change Photo': 'Change Photo',
    'AI is editing…': 'AI is editing…',
    'Use AI Result': 'Use AI Result',
    'Please capture or upload a product photo first.': 'Please capture or upload a product photo first.',
    'AI did not return an edited image. Please try again.': 'AI did not return an edited image. Please try again.',
    'Local smart photo enhancement applied because generative image AI is not configured.': 'Local smart photo enhancement applied because generative image AI is not configured.',
    'Photo editing failed.': 'Photo editing failed.',
  },
  'हिन्दी': {
    'Create / 02': 'बनाएं / 02',
    'AI Photo Studio': 'AI फोटो स्टूडियो',
    'Use your captured or uploaded product photo and let AI create a marketplace-ready visual.': 'अपनी ली गई या अपलोड की गई उत्पाद फोटो का उपयोग करें और AI को मार्केटप्लेस के लिए तैयार तस्वीर बनाने दें।',
    'No product photo yet': 'अभी कोई उत्पाद फोटो नहीं है',
    'Go back and capture a live photo or upload one from your gallery.': 'वापस जाएं और लाइव फोटो लें या अपनी गैलरी से फोटो अपलोड करें।',
    'Add Product Photo': 'उत्पाद फोटो जोड़ें',
    'Original': 'मूल',
    'AI Edited': 'AI द्वारा संपादित',
    'AI is editing your photo…': 'AI आपकी फोटो संपादित कर रहा है…',
    'Preparing a clean marketplace presentation': 'मार्केटप्लेस के लिए साफ प्रस्तुति तैयार की जा रही है',
    'Choose an AI style': 'AI शैली चुनें',
    'Your edited photo will appear here.': 'आपकी संपादित फोटो यहां दिखाई देगी।',
    'Warm daylight': 'गर्म दिन की रोशनी',
    'Clean paper': 'साफ कागज़',
    'Village courtyard': 'गांव का आंगन',
    'Original photo kept': 'मूल फोटो सुरक्षित',
    'AI product analysis': 'AI उत्पाद विश्लेषण',
    'AI visual edit': 'AI दृश्य संपादन',
    'Marketplace-ready image': 'मार्केटप्लेस के लिए तैयार फोटो',
    'Change Photo': 'फोटो बदलें',
    'AI is editing…': 'AI संपादन कर रहा है…',
    'Use AI Result': 'AI परिणाम उपयोग करें',
    'Please capture or upload a product photo first.': 'कृपया पहले उत्पाद की फोटो लें या अपलोड करें।',
    'AI did not return an edited image. Please try again.': 'AI ने संपादित फोटो नहीं दी। कृपया फिर कोशिश करें।',
    'Local smart photo enhancement applied because generative image AI is not configured.': 'जनरेटिव इमेज AI कॉन्फ़िगर नहीं है, इसलिए स्थानीय स्मार्ट फोटो सुधार लागू किया गया।',
    'Photo editing failed.': 'फोटो संपादन विफल रहा।',
  },
  'ਪੰਜਾਬੀ': {},
  'বাংলা': {},
  'ગુજરાતી': {},
  'मराठी': {},
  'தமிழ்': {},
  'తెలుగు': {},
  'ಕನ್ನಡ': {},
  'മലയാളം': {},
  'ଓଡ଼ିଆ': {},
  'অসমীয়া': {},
  'اردو': {},
};


const MARKET_TEXT: Partial<Record<Language, Record<string, string>>> = {
  'English': {
    'Grow / market linkage': 'Grow / market linkage',
    'AI Market Linkage': 'AI Market Linkage',
    'AI-generated buyer suggestions matched to your product. These are suggestions, not confirmed buyers.': 'AI-generated buyer suggestions matched to your product. These are suggestions, not confirmed buyers.',
    'Overview': 'Overview',
    'Setu is finding suitable buyer types…': 'Setu is finding suitable buyer types…',
    'ShilpSetu AI has generated buyer suggestions for your product.': 'ShilpSetu AI has generated buyer suggestions for your product.',
    'Use these leads as starting points for outreach and verify buyer details before contacting them.': 'Use these leads as starting points for outreach and verify buyer details before contacting them.',
    'suggestions': 'suggestions',
    'AI Match': 'AI Match',
    'Interested in': 'Interested in',
    'Potential Quantity': 'Potential Quantity',
    'units': 'units',
    'Budget': 'Budget',
    'View Suggestion': 'View Suggestion',
  },
  'हिन्दी': {
    'Grow / market linkage': 'बढ़ें / बाज़ार से जुड़ाव',
    'AI Market Linkage': 'AI बाज़ार जुड़ाव',
    'AI-generated buyer suggestions matched to your product. These are suggestions, not confirmed buyers.': 'आपके उत्पाद से मेल खाते AI खरीदार सुझाव। ये केवल सुझाव हैं, पक्के खरीदार नहीं।',
    'Overview': 'अवलोकन',
    'Setu is finding suitable buyer types…': 'सेतु उपयुक्त खरीदार प्रकार खोज रहा है…',
    'ShilpSetu AI has generated buyer suggestions for your product.': 'ShilpSetu AI ने आपके उत्पाद के लिए खरीदार सुझाव तैयार किए हैं।',
    'Use these leads as starting points for outreach and verify buyer details before contacting them.': 'इन लीड्स का उपयोग संपर्क की शुरुआत के लिए करें और संपर्क करने से पहले खरीदार की जानकारी सत्यापित करें।',
    'suggestions': 'सुझाव',
    'AI Match': 'AI मिलान',
    'Interested in': 'रुचि',
    'Potential Quantity': 'संभावित मात्रा',
    'units': 'इकाइयाँ',
    'Budget': 'बजट',
    'View Suggestion': 'सुझाव देखें',
  },
  'ਪੰਜਾਬੀ': {
    'Grow / market linkage': 'ਵਧੋ / ਬਾਜ਼ਾਰ ਨਾਲ ਜੋੜ',
    'AI Market Linkage': 'AI ਬਾਜ਼ਾਰ ਜੋੜ',
    'AI-generated buyer suggestions matched to your product. These are suggestions, not confirmed buyers.': 'ਤੁਹਾਡੇ ਉਤਪਾਦ ਨਾਲ ਮੇਲ ਖਾਂਦੇ AI ਖਰੀਦਦਾਰ ਸੁਝਾਅ। ਇਹ ਸਿਰਫ਼ ਸੁਝਾਅ ਹਨ, ਪੱਕੇ ਖਰੀਦਦਾਰ ਨਹੀਂ।',
    'Overview': 'ਜਾਇਜ਼ਾ',
    'Setu is finding suitable buyer types…': 'ਸੇਤੂ ਢੁਕਵੇਂ ਖਰੀਦਦਾਰ ਲੱਭ ਰਿਹਾ ਹੈ…',
    'ShilpSetu AI has generated buyer suggestions for your product.': 'ShilpSetu AI ਨੇ ਤੁਹਾਡੇ ਉਤਪਾਦ ਲਈ ਖਰੀਦਦਾਰ ਸੁਝਾਅ ਤਿਆਰ ਕੀਤੇ ਹਨ।',
    'Use these leads as starting points for outreach and verify buyer details before contacting them.': 'ਇਨ੍ਹਾਂ ਲੀਡਾਂ ਨਾਲ ਸੰਪਰਕ ਦੀ ਸ਼ੁਰੂਆਤ ਕਰੋ ਅਤੇ ਸੰਪਰਕ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਖਰੀਦਦਾਰ ਦੀ ਜਾਣਕਾਰੀ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ।',
    'suggestions': 'ਸੁਝਾਅ',
    'AI Match': 'AI ਮੇਲ',
    'Interested in': 'ਦਿਲਚਸਪੀ',
    'Potential Quantity': 'ਸੰਭਾਵਿਤ ਮਾਤਰਾ',
    'units': 'ਇਕਾਈਆਂ',
    'Budget': 'ਬਜਟ',
    'View Suggestion': 'ਸੁਝਾਅ ਵੇਖੋ',
  },
  'বাংলা': {
    'Grow / market linkage': 'বৃদ্ধি / বাজার সংযোগ',
    'AI Market Linkage': 'AI বাজার সংযোগ',
    'AI-generated buyer suggestions matched to your product. These are suggestions, not confirmed buyers.': 'আপনার পণ্যের সঙ্গে মিলে যাওয়া AI ক্রেতার পরামর্শ। এগুলো শুধু পরামর্শ, নিশ্চিত ক্রেতা নয়।',
    'Overview': 'সংক্ষিপ্ত বিবরণ',
    'Setu is finding suitable buyer types…': 'সেতু উপযুক্ত ক্রেতার ধরন খুঁজছে…',
    'ShilpSetu AI has generated buyer suggestions for your product.': 'ShilpSetu AI আপনার পণ্যের জন্য ক্রেতার পরামর্শ তৈরি করেছে।',
    'Use these leads as starting points for outreach and verify buyer details before contacting them.': 'যোগাযোগের শুরু হিসেবে এই লিডগুলি ব্যবহার করুন এবং যোগাযোগের আগে ক্রেতার তথ্য যাচাই করুন।',
    'suggestions': 'পরামর্শ',
    'AI Match': 'AI মিল',
    'Interested in': 'আগ্রহ',
    'Potential Quantity': 'সম্ভাব্য পরিমাণ',
    'units': 'ইউনিট',
    'Budget': 'বাজেট',
    'View Suggestion': 'পরামর্শ দেখুন',
  },
  'ગુજરાતી': {
    'Grow / market linkage': 'વિકાસ / બજાર જોડાણ',
    'AI Market Linkage': 'AI બજાર જોડાણ',
    'AI-generated buyer suggestions matched to your product. These are suggestions, not confirmed buyers.': 'તમારા ઉત્પાદન સાથે મેળ ખાતા AI ખરીદદાર સૂચનો. આ માત્ર સૂચનો છે, ખાતરી થયેલા ખરીદદાર નથી.',
    'Overview': 'ઝાંખી',
    'Setu is finding suitable buyer types…': 'સેતુ યોગ્ય ખરીદદાર પ્રકારો શોધી રહ્યું છે…',
    'ShilpSetu AI has generated buyer suggestions for your product.': 'ShilpSetu AI એ તમારા ઉત્પાદન માટે ખરીદદાર સૂચનો તૈયાર કર્યા છે.',
    'Use these leads as starting points for outreach and verify buyer details before contacting them.': 'સંપર્કની શરૂઆત માટે આ લીડ્સનો ઉપયોગ કરો અને સંપર્ક પહેલાં ખરીદદારની વિગતો ચકાસો.',
    'suggestions': 'સૂચનો',
    'AI Match': 'AI મેળ',
    'Interested in': 'રસ ધરાવે છે',
    'Potential Quantity': 'સંભવિત જથ્થો',
    'units': 'એકમો',
    'Budget': 'બજેટ',
    'View Suggestion': 'સૂચન જુઓ',
  },
  'मराठी': {
    'Grow / market linkage': 'वाढ / बाजार जोडणी',
    'AI Market Linkage': 'AI बाजार जोडणी',
    'AI-generated buyer suggestions matched to your product. These are suggestions, not confirmed buyers.': 'तुमच्या उत्पादनाशी जुळणारे AI खरेदीदार सुचवले आहेत. हे फक्त सुझाव आहेत, निश्चित खरेदीदार नाहीत.',
    'Overview': 'आढावा',
    'Setu is finding suitable buyer types…': 'सेतू योग्य खरेदीदारांचे प्रकार शोधत आहे…',
    'ShilpSetu AI has generated buyer suggestions for your product.': 'ShilpSetu AI ने तुमच्या उत्पादनासाठी खरेदीदारांचे सुझाव तयार केले आहेत.',
    'Use these leads as starting points for outreach and verify buyer details before contacting them.': 'संपर्काची सुरुवात करण्यासाठी या लीड्सचा वापर करा आणि संपर्क करण्यापूर्वी खरेदीदाराची माहिती तपासा.',
    'suggestions': 'सूचना',
    'AI Match': 'AI जुळणी',
    'Interested in': 'स्वारस्य',
    'Potential Quantity': 'संभाव्य प्रमाण',
    'units': 'एकके',
    'Budget': 'अर्थसंकल्प',
    'View Suggestion': 'सूचना पहा',
  },
  'தமிழ்': {
    'Grow / market linkage': 'வளர்ச்சி / சந்தை இணைப்பு',
    'AI Market Linkage': 'AI சந்தை இணைப்பு',
    'AI-generated buyer suggestions matched to your product. These are suggestions, not confirmed buyers.': 'உங்கள் தயாரிப்புடன் பொருந்தும் AI வாங்குபவர் பரிந்துரைகள். இவை பரிந்துரைகள் மட்டுமே, உறுதி செய்யப்பட்ட வாங்குபவர்கள் அல்ல.',
    'Overview': 'கண்ணோட்டம்',
    'Setu is finding suitable buyer types…': 'சேது பொருத்தமான வாங்குபவர் வகைகளைத் தேடுகிறது…',
    'ShilpSetu AI has generated buyer suggestions for your product.': 'ShilpSetu AI உங்கள் தயாரிப்பிற்கான வாங்குபவர் பரிந்துரைகளை உருவாக்கியுள்ளது.',
    'Use these leads as starting points for outreach and verify buyer details before contacting them.': 'தொடர்பைத் தொடங்க இந்த லீட்களைப் பயன்படுத்தி, தொடர்புகொள்வதற்கு முன் வாங்குபவர் விவரங்களைச் சரிபார்க்கவும்.',
    'suggestions': 'பரிந்துரைகள்',
    'AI Match': 'AI பொருத்தம்',
    'Interested in': 'ஆர்வம்',
    'Potential Quantity': 'சாத்தியமான அளவு',
    'units': 'அலகுகள்',
    'Budget': 'பட்ஜெட்',
    'View Suggestion': 'பரிந்துரையைப் பார்க்கவும்',
  },
  'తెలుగు': {
    'Grow / market linkage': 'వృద్ధి / మార్కెట్ అనుసంధానం',
    'AI Market Linkage': 'AI మార్కెట్ అనుసంధానం',
    'AI-generated buyer suggestions matched to your product. These are suggestions, not confirmed buyers.': 'మీ ఉత్పత్తికి సరిపోలిన AI కొనుగోలుదారుల సూచనలు. ఇవి సూచనలు మాత్రమే, నిర్ధారిత కొనుగోలుదారులు కాదు.',
    'Overview': 'అవలోకనం',
    'Setu is finding suitable buyer types…': 'సేతు సరైన కొనుగోలుదారుల రకాలను కనుగొంటోంది…',
    'ShilpSetu AI has generated buyer suggestions for your product.': 'ShilpSetu AI మీ ఉత్పత్తికి కొనుగోలుదారుల సూచనలను రూపొందించింది.',
    'Use these leads as starting points for outreach and verify buyer details before contacting them.': 'సంప్రదింపులను ప్రారంభించడానికి ఈ లీడ్లను ఉపయోగించండి మరియు సంప్రదించే ముందు కొనుగోలుదారు వివరాలను ధృవీకరించండి.',
    'suggestions': 'సూచనలు',
    'AI Match': 'AI సరిపోలిక',
    'Interested in': 'ఆసక్తి',
    'Potential Quantity': 'సంభావ్య పరిమాణం',
    'units': 'యూనిట్లు',
    'Budget': 'బడ్జెట్',
    'View Suggestion': 'సూచనను చూడండి',
  },
  'ಕನ್ನಡ': {
    'Grow / market linkage': 'ಬೆಳವಣಿಗೆ / ಮಾರುಕಟ್ಟೆ ಸಂಪರ್ಕ',
    'AI Market Linkage': 'AI ಮಾರುಕಟ್ಟೆ ಸಂಪರ್ಕ',
    'AI-generated buyer suggestions matched to your product. These are suggestions, not confirmed buyers.': 'ನಿಮ್ಮ ಉತ್ಪನ್ನಕ್ಕೆ ಹೊಂದುವ AI ಖರೀದಿದಾರರ ಸಲಹೆಗಳು. ಇವು ಸಲಹೆಗಳು ಮಾತ್ರ, ಖಚಿತ ಖರೀದಿದಾರರಲ್ಲ.',
    'Overview': 'ಅವಲೋಕನ',
    'Setu is finding suitable buyer types…': 'ಸೇತು ಸೂಕ್ತ ಖರೀದಿದಾರರ ಪ್ರಕಾರಗಳನ್ನು ಹುಡುಕುತ್ತಿದೆ…',
    'ShilpSetu AI has generated buyer suggestions for your product.': 'ShilpSetu AI ನಿಮ್ಮ ಉತ್ಪನ್ನಕ್ಕಾಗಿ ಖರೀದಿದಾರರ ಸಲಹೆಗಳನ್ನು ಸೃಷ್ಟಿಸಿದೆ.',
    'Use these leads as starting points for outreach and verify buyer details before contacting them.': 'ಸಂಪರ್ಕ ಆರಂಭಿಸಲು ಈ ಲೀಡ್‌ಗಳನ್ನು ಬಳಸಿ ಮತ್ತು ಸಂಪರ್ಕಿಸುವ ಮೊದಲು ಖರೀದಿದಾರರ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
    'suggestions': 'ಸಲಹೆಗಳು',
    'AI Match': 'AI ಹೊಂದಾಣಿಕೆ',
    'Interested in': 'ಆಸಕ್ತಿ',
    'Potential Quantity': 'ಸಂಭಾವ್ಯ ಪ್ರಮಾಣ',
    'units': 'ಘಟಕಗಳು',
    'Budget': 'ಬಜೆಟ್',
    'View Suggestion': 'ಸಲಹೆ ನೋಡಿ',
  },
  'മലയാളം': {
    'Grow / market linkage': 'വളർച്ച / വിപണി ബന്ധം',
    'AI Market Linkage': 'AI വിപണി ബന്ധം',
    'AI-generated buyer suggestions matched to your product. These are suggestions, not confirmed buyers.': 'നിങ്ങളുടെ ഉൽപ്പന്നവുമായി പൊരുത്തപ്പെടുന്ന AI വാങ്ങുന്നവരുടെ നിർദ്ദേശങ്ങൾ. ഇവ നിർദ്ദേശങ്ങൾ മാത്രമാണ്, സ്ഥിരീകരിച്ച വാങ്ങുന്നവർ അല്ല.',
    'Overview': 'അവലോകനം',
    'Setu is finding suitable buyer types…': 'സേതു അനുയോജ്യമായ വാങ്ങുന്നവരുടെ തരങ്ങൾ കണ്ടെത്തുന്നു…',
    'ShilpSetu AI has generated buyer suggestions for your product.': 'ShilpSetu AI നിങ്ങളുടെ ഉൽപ്പന്നത്തിനായി വാങ്ങുന്നവരുടെ നിർദ്ദേശങ്ങൾ സൃഷ്ടിച്ചു.',
    'Use these leads as starting points for outreach and verify buyer details before contacting them.': 'ബന്ധപ്പെടൽ ആരംഭിക്കാൻ ഈ ലീഡുകൾ ഉപയോഗിക്കുകയും ബന്ധപ്പെടുന്നതിന് മുമ്പ് വാങ്ങുന്നവരുടെ വിവരങ്ങൾ പരിശോധിക്കുകയും ചെയ്യുക.',
    'suggestions': 'നിർദ്ദേശങ്ങൾ',
    'AI Match': 'AI പൊരുത്തം',
    'Interested in': 'താൽപ്പര്യം',
    'Potential Quantity': 'സാധ്യമായ അളവ്',
    'units': 'യൂണിറ്റുകൾ',
    'Budget': 'ബജറ്റ്',
    'View Suggestion': 'നിർദ്ദേശം കാണുക',
  },
  'ଓଡ଼ିଆ': {
    'Grow / market linkage': 'ବୃଦ୍ଧି / ବଜାର ସଂଯୋଗ',
    'AI Market Linkage': 'AI ବଜାର ସଂଯୋଗ',
    'AI-generated buyer suggestions matched to your product. These are suggestions, not confirmed buyers.': 'ଆପଣଙ୍କ ଉତ୍ପାଦ ସହ ମେଳ ଖାଉଥିବା AI କ୍ରେତା ପରାମର୍ଶ। ଏଗୁଡ଼ିକ କେବଳ ପରାମର୍ଶ, ନିଶ୍ଚିତ କ୍ରେତା ନୁହେଁ।',
    'Overview': 'ସାରାଂଶ',
    'Setu is finding suitable buyer types…': 'ସେତୁ ଉପଯୁକ୍ତ କ୍ରେତା ପ୍ରକାର ଖୋଜୁଛି…',
    'ShilpSetu AI has generated buyer suggestions for your product.': 'ShilpSetu AI ଆପଣଙ୍କ ଉତ୍ପାଦ ପାଇଁ କ୍ରେତା ପରାମର୍ଶ ପ୍ରସ୍ତୁତ କରିଛି।',
    'Use these leads as starting points for outreach and verify buyer details before contacting them.': 'ଯୋଗାଯୋଗ ଆରମ୍ଭ ପାଇଁ ଏହି ଲିଡ୍‌ଗୁଡ଼ିକୁ ବ୍ୟବହାର କରନ୍ତୁ ଏବଂ ଯୋଗାଯୋଗ ପୂର୍ବରୁ କ୍ରେତାଙ୍କ ବିବରଣୀ ଯାଞ୍ଚ କରନ୍ତୁ।',
    'suggestions': 'ପରାମର୍ଶ',
    'AI Match': 'AI ମେଳ',
    'Interested in': 'ଆଗ୍ରହ',
    'Potential Quantity': 'ସମ୍ଭାବ୍ୟ ପରିମାଣ',
    'units': 'ଏକକ',
    'Budget': 'ବଜେଟ୍',
    'View Suggestion': 'ପରାମର୍ଶ ଦେଖନ୍ତୁ',
  },
  'অসমীয়া': {
    'Grow / market linkage': 'বৃদ্ধি / বজাৰ সংযোগ',
    'AI Market Linkage': 'AI বজাৰ সংযোগ',
    'AI-generated buyer suggestions matched to your product. These are suggestions, not confirmed buyers.': 'আপোনাৰ সামগ্ৰীৰ সৈতে মিল থকা AI ক্ৰেতাৰ পৰামৰ্শ। এইবোৰ কেৱল পৰামৰ্শ, নিশ্চিত ক্ৰেতা নহয়।',
    'Overview': 'অভাৰভিউ',
    'Setu is finding suitable buyer types…': 'সেতুৱে উপযুক্ত ক্ৰেতাৰ প্ৰকাৰ বিচাৰি আছে…',
    'ShilpSetu AI has generated buyer suggestions for your product.': 'ShilpSetu AI-এ আপোনাৰ সামগ্ৰীৰ বাবে ক্ৰেতাৰ পৰামৰ্শ প্ৰস্তুত কৰিছে।',
    'Use these leads as starting points for outreach and verify buyer details before contacting them.': 'যোগাযোগ আৰম্ভ কৰিবলৈ এই লিডসমূহ ব্যৱহাৰ কৰক আৰু যোগাযোগ কৰাৰ আগতে ক্ৰেতাৰ তথ্য পৰীক্ষা কৰক।',
    'suggestions': 'পৰামৰ্শ',
    'AI Match': 'AI মিল',
    'Interested in': 'আগ্ৰহ',
    'Potential Quantity': 'সম্ভাৱ্য পৰিমাণ',
    'units': 'একক',
    'Budget': 'বাজেট',
    'View Suggestion': 'পৰামৰ্শ চাওক',
  },
  'اردو': {
    'Grow / market linkage': 'ترقی / مارکیٹ سے رابطہ',
    'AI Market Linkage': 'AI مارکیٹ رابطہ',
    'AI-generated buyer suggestions matched to your product. These are suggestions, not confirmed buyers.': 'آپ کی مصنوعات سے مطابقت رکھنے والے AI خریداروں کی تجاویز۔ یہ صرف تجاویز ہیں، تصدیق شدہ خریدار نہیں۔',
    'Overview': 'جائزہ',
    'Setu is finding suitable buyer types…': 'سیٹو موزوں خریداروں کی اقسام تلاش کر رہا ہے…',
    'ShilpSetu AI has generated buyer suggestions for your product.': 'ShilpSetu AI نے آپ کی مصنوعات کے لیے خریداروں کی تجاویز تیار کی ہیں۔',
    'Use these leads as starting points for outreach and verify buyer details before contacting them.': 'رابطے کی شروعات کے لیے ان لیڈز کو استعمال کریں اور رابطہ کرنے سے پہلے خریدار کی معلومات کی تصدیق کریں۔',
    'suggestions': 'تجاویز',
    'AI Match': 'AI مطابقت',
    'Interested in': 'دلچسپی',
    'Potential Quantity': 'ممکنہ مقدار',
    'units': 'یونٹس',
    'Budget': 'بجٹ',
    'View Suggestion': 'تجویز دیکھیں',
  },
};

const CATALOGUE_TEXT: Partial<Record<Language, Record<string, string>>> = {
  'English': {
    'Create / 03': 'Create / 03',
    'AI Generated Catalogue': 'AI Generated Catalogue',
    'Created from your photo and voice description.': 'Created from your photo and voice description.',
    'Back': 'Back',
    'Edit your catalogue': 'Edit your catalogue',
    'Translating…': 'Translating…',
    'Refresh with AI': 'Refresh with AI',
    'AI generated in seconds from your photo + voice description': 'AI generated in seconds from your photo + voice description',
    'Product Name': 'Product Name',
    'Category': 'Category',
    'Material': 'Material',
    'Craft Type': 'Craft Type',
    'Origin': 'Origin',
    'Description': 'Description',
    'Craft Story': 'Craft Story',
    'Catalogue translated to': 'Catalogue translated to',
    'Translation failed. Please try again.': 'Translation failed. Please try again.',
    'Please add a product name and description before continuing.': 'Please add a product name and description before continuing.',
    'All fields are ready to edit.': 'All fields are ready to edit.',
    'Edit': 'Edit',
    'Continue to Smart Pricing': 'Continue to Smart Pricing',
    'Live preview': 'Live preview',
    'AI prepared product': 'AI prepared product',
  },
  'हिन्दी': {
    'Create / 03': 'बनाएं / 03',
    'AI Generated Catalogue': 'AI द्वारा तैयार कैटलॉग',
    'Created from your photo and voice description.': 'आपकी फोटो और आवाज़ में दिए विवरण से तैयार किया गया।',
    'Back': 'वापस',
    'Edit your catalogue': 'अपना कैटलॉग संपादित करें',
    'Translating…': 'अनुवाद हो रहा है…',
    'Refresh with AI': 'AI से रीफ्रेश करें',
    'AI generated in seconds from your photo + voice description': 'आपकी फोटो और आवाज़ के विवरण से AI ने सेकंडों में तैयार किया',
    'Product Name': 'उत्पाद का नाम',
    'Category': 'श्रेणी',
    'Material': 'सामग्री',
    'Craft Type': 'शिल्प का प्रकार',
    'Origin': 'स्थान',
    'Description': 'विवरण',
    'Craft Story': 'शिल्प की कहानी',
    'Catalogue translated to': 'कैटलॉग का अनुवाद',
    'Translation failed. Please try again.': 'अनुवाद विफल हुआ। कृपया फिर से प्रयास करें।',
    'Please add a product name and description before continuing.': 'आगे बढ़ने से पहले उत्पाद का नाम और विवरण जोड़ें।',
    'All fields are ready to edit.': 'सभी फ़ील्ड संपादन के लिए तैयार हैं।',
    'Edit': 'संपादित करें',
    'Continue to Smart Pricing': 'स्मार्ट प्राइसिंग पर जाएं',
    'Live preview': 'लाइव प्रीव्यू',
    'AI prepared product': 'AI द्वारा तैयार उत्पाद',
  },
  'ਪੰਜਾਬੀ': {
    'Create / 03': 'ਬਣਾਓ / 03',
    'AI Generated Catalogue': 'AI ਵੱਲੋਂ ਤਿਆਰ ਕੈਟਾਲਾਗ',
    'Created from your photo and voice description.': 'ਤੁਹਾਡੀ ਫੋਟੋ ਅਤੇ ਆਵਾਜ਼ ਦੇ ਵੇਰਵੇ ਤੋਂ ਤਿਆਰ ਕੀਤਾ ਗਿਆ।',
    'Back': 'ਵਾਪਸ',
    'Edit your catalogue': 'ਆਪਣਾ ਕੈਟਾਲਾਗ ਸੋਧੋ',
    'Translating…': 'ਅਨੁਵਾਦ ਹੋ ਰਿਹਾ ਹੈ…',
    'Refresh with AI': 'AI ਨਾਲ ਰਿਫ੍ਰੈਸ਼ ਕਰੋ',
    'AI generated in seconds from your photo + voice description': 'ਤੁਹਾਡੀ ਫੋਟੋ ਅਤੇ ਆਵਾਜ਼ ਦੇ ਵੇਰਵੇ ਤੋਂ AI ਨੇ ਸਕਿੰਟਾਂ ਵਿੱਚ ਤਿਆਰ ਕੀਤਾ',
    'Product Name': 'ਉਤਪਾਦ ਦਾ ਨਾਮ',
    'Category': 'ਸ਼੍ਰੇਣੀ',
    'Material': 'ਸਮੱਗਰੀ',
    'Craft Type': 'ਕਲਾ ਦੀ ਕਿਸਮ',
    'Origin': 'ਮੂਲ ਸਥਾਨ',
    'Description': 'ਵੇਰਵਾ',
    'Craft Story': 'ਕਲਾ ਦੀ ਕਹਾਣੀ',
    'Catalogue translated to': 'ਕੈਟਾਲਾਗ ਦਾ ਅਨੁਵਾਦ',
    'Translation failed. Please try again.': 'ਅਨੁਵਾਦ ਅਸਫਲ ਹੋਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    'Please add a product name and description before continuing.': 'ਅੱਗੇ ਵਧਣ ਤੋਂ ਪਹਿਲਾਂ ਉਤਪਾਦ ਦਾ ਨਾਮ ਅਤੇ ਵੇਰਵਾ ਜੋੜੋ।',
    'All fields are ready to edit.': 'ਸਾਰੇ ਫੀਲਡ ਸੋਧਣ ਲਈ ਤਿਆਰ ਹਨ।',
    'Edit': 'ਸੋਧੋ',
    'Continue to Smart Pricing': 'ਸਮਾਰਟ ਪ੍ਰਾਈਸਿੰਗ ਵੱਲ ਜਾਓ',
    'Live preview': 'ਲਾਈਵ ਪ੍ਰੀਵਿਊ',
    'AI prepared product': 'AI ਵੱਲੋਂ ਤਿਆਰ ਉਤਪਾਦ',
  },
  'বাংলা': {
    'Create / 03': 'তৈরি / ০৩',
    'AI Generated Catalogue': 'AI তৈরি ক্যাটালগ',
    'Created from your photo and voice description.': 'আপনার ছবি ও কণ্ঠের বর্ণনা থেকে তৈরি।',
    'Back': 'ফিরে যান',
    'Edit your catalogue': 'আপনার ক্যাটালগ সম্পাদনা করুন',
    'Translating…': 'অনুবাদ হচ্ছে…',
    'Refresh with AI': 'AI দিয়ে রিফ্রেশ করুন',
    'AI generated in seconds from your photo + voice description': 'আপনার ছবি ও কণ্ঠের বর্ণনা থেকে AI কয়েক সেকেন্ডে তৈরি করেছে',
    'Product Name': 'পণ্যের নাম',
    'Category': 'বিভাগ',
    'Material': 'উপাদান',
    'Craft Type': 'কারুশিল্পের ধরন',
    'Origin': 'উৎপত্তি',
    'Description': 'বিবরণ',
    'Craft Story': 'কারুশিল্পের গল্প',
    'Catalogue translated to': 'ক্যাটালগ অনুবাদ হয়েছে',
    'Translation failed. Please try again.': 'অনুবাদ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।',
    'Please add a product name and description before continuing.': 'এগিয়ে যাওয়ার আগে পণ্যের নাম ও বিবরণ যোগ করুন।',
    'All fields are ready to edit.': 'সব ফিল্ড সম্পাদনার জন্য প্রস্তুত।',
    'Edit': 'সম্পাদনা করুন',
    'Continue to Smart Pricing': 'স্মার্ট প্রাইসিংয়ে যান',
    'Live preview': 'লাইভ প্রিভিউ',
    'AI prepared product': 'AI তৈরি পণ্য',
  },
  'ગુજરાતી': {
    'Create / 03': 'બનાવો / 03',
    'AI Generated Catalogue': 'AI દ્વારા તૈયાર કેટલોગ',
    'Created from your photo and voice description.': 'તમારા ફોટા અને અવાજના વર્ણનથી તૈયાર કરાયેલ.',
    'Back': 'પાછા',
    'Edit your catalogue': 'તમારો કેટલોગ સંપાદિત કરો',
    'Translating…': 'અનુવાદ થઈ રહ્યો છે…',
    'Refresh with AI': 'AI સાથે રિફ્રેશ કરો',
    'AI generated in seconds from your photo + voice description': 'તમારા ફોટા અને અવાજના વર્ણનથી AIએ સેકન્ડોમાં તૈયાર કર્યું',
    'Product Name': 'ઉત્પાદનનું નામ',
    'Category': 'શ્રેણી',
    'Material': 'સામગ્રી',
    'Craft Type': 'હસ્તકલાનો પ્રકાર',
    'Origin': 'મૂળ સ્થાન',
    'Description': 'વર્ણન',
    'Craft Story': 'હસ્તકલાની વાર્તા',
    'Catalogue translated to': 'કેટલોગનો અનુવાદ',
    'Translation failed. Please try again.': 'અનુવાદ નિષ્ફળ ગયો. કૃપા કરીને ફરી પ્રયાસ કરો.',
    'Please add a product name and description before continuing.': 'આગળ વધતા પહેલાં ઉત્પાદનનું નામ અને વર્ણન ઉમેરો.',
    'All fields are ready to edit.': 'બધા ફીલ્ડ સંપાદન માટે તૈયાર છે.',
    'Edit': 'સંપાદિત કરો',
    'Continue to Smart Pricing': 'સ્માર્ટ પ્રાઇસિંગ પર જાઓ',
    'Live preview': 'લાઇવ પ્રીવ્યૂ',
    'AI prepared product': 'AI દ્વારા તૈયાર ઉત્પાદન',
  },
  'मराठी': {
    'Create / 03': 'तयार करा / 03',
    'AI Generated Catalogue': 'AI तयार कॅटलॉग',
    'Created from your photo and voice description.': 'तुमच्या फोटो आणि आवाजातील वर्णनातून तयार केलेले.',
    'Back': 'मागे',
    'Edit your catalogue': 'तुमचा कॅटलॉग संपादित करा',
    'Translating…': 'भाषांतर सुरू आहे…',
    'Refresh with AI': 'AI ने रिफ्रेश करा',
    'AI generated in seconds from your photo + voice description': 'तुमच्या फोटो आणि आवाजातील वर्णनातून AI ने काही सेकंदांत तयार केले',
    'Product Name': 'उत्पादनाचे नाव',
    'Category': 'श्रेणी',
    'Material': 'साहित्य',
    'Craft Type': 'हस्तकलेचा प्रकार',
    'Origin': 'मूळ स्थान',
    'Description': 'वर्णन',
    'Craft Story': 'हस्तकलेची कथा',
    'Catalogue translated to': 'कॅटलॉगचा अनुवाद',
    'Translation failed. Please try again.': 'भाषांतर अयशस्वी झाले. कृपया पुन्हा प्रयत्न करा.',
    'Please add a product name and description before continuing.': 'पुढे जाण्यापूर्वी उत्पादनाचे नाव आणि वर्णन जोडा.',
    'All fields are ready to edit.': 'सर्व फील्ड संपादनासाठी तयार आहेत.',
    'Edit': 'संपादित करा',
    'Continue to Smart Pricing': 'स्मार्ट प्राइसिंगकडे जा',
    'Live preview': 'लाइव्ह प्रिव्ह्यू',
    'AI prepared product': 'AI ने तयार केलेले उत्पादन',
  },
  'தமிழ்': {
    'Create / 03': 'உருவாக்கு / 03',
    'AI Generated Catalogue': 'AI உருவாக்கிய பட்டியல்',
    'Created from your photo and voice description.': 'உங்கள் புகைப்படம் மற்றும் குரல் விளக்கத்திலிருந்து உருவாக்கப்பட்டது.',
    'Back': 'பின்',
    'Edit your catalogue': 'உங்கள் பட்டியலைத் திருத்துங்கள்',
    'Translating…': 'மொழிபெயர்க்கிறது…',
    'Refresh with AI': 'AI மூலம் புதுப்பிக்கவும்',
    'AI generated in seconds from your photo + voice description': 'உங்கள் புகைப்படம் மற்றும் குரல் விளக்கத்திலிருந்து AI சில நொடிகளில் உருவாக்கியது',
    'Product Name': 'தயாரிப்பு பெயர்',
    'Category': 'வகை',
    'Material': 'பொருள்',
    'Craft Type': 'கைவினை வகை',
    'Origin': 'தோற்றம்',
    'Description': 'விளக்கம்',
    'Craft Story': 'கைவினைக் கதை',
    'Catalogue translated to': 'பட்டியல் மொழிபெயர்க்கப்பட்டது',
    'Translation failed. Please try again.': 'மொழிபெயர்ப்பு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.',
    'Please add a product name and description before continuing.': 'தொடர்வதற்கு முன் தயாரிப்பு பெயர் மற்றும் விளக்கத்தைச் சேர்க்கவும்.',
    'All fields are ready to edit.': 'அனைத்து புலங்களும் திருத்தத் தயாராக உள்ளன.',
    'Edit': 'திருத்து',
    'Continue to Smart Pricing': 'ஸ்மார்ட் விலை நிர்ணயத்திற்குச் செல்லவும்',
    'Live preview': 'நேரடி முன்னோட்டம்',
    'AI prepared product': 'AI தயாரித்த தயாரிப்பு',
  },
  'తెలుగు': {
    'Create / 03': 'సృష్టించు / 03',
    'AI Generated Catalogue': 'AI రూపొందించిన కేటలాగ్',
    'Created from your photo and voice description.': 'మీ ఫోటో మరియు వాయిస్ వివరణతో రూపొందించబడింది.',
    'Back': 'వెనక్కి',
    'Edit your catalogue': 'మీ కేటలాగ్‌ను సవరించండి',
    'Translating…': 'అనువదిస్తోంది…',
    'Refresh with AI': 'AIతో రిఫ్రెష్ చేయండి',
    'AI generated in seconds from your photo + voice description': 'మీ ఫోటో మరియు వాయిస్ వివరణతో AI కొన్ని సెకన్లలో రూపొందించింది',
    'Product Name': 'ఉత్పత్తి పేరు',
    'Category': 'వర్గం',
    'Material': 'పదార్థం',
    'Craft Type': 'కళా రకం',
    'Origin': 'మూలం',
    'Description': 'వివరణ',
    'Craft Story': 'కళా కథ',
    'Catalogue translated to': 'కేటలాగ్ అనువదించబడింది',
    'Translation failed. Please try again.': 'అనువాదం విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    'Please add a product name and description before continuing.': 'కొనసాగించే ముందు ఉత్పత్తి పేరు మరియు వివరణను జోడించండి.',
    'All fields are ready to edit.': 'అన్ని ఫీల్డ్‌లు సవరించడానికి సిద్ధంగా ఉన్నాయి.',
    'Edit': 'సవరించండి',
    'Continue to Smart Pricing': 'స్మార్ట్ ప్రైసింగ్‌కు కొనసాగండి',
    'Live preview': 'లైవ్ ప్రివ్యూ',
    'AI prepared product': 'AI రూపొందించిన ఉత్పత్తి',
  },
  'ಕನ್ನಡ': {
    'Create / 03': 'ರಚಿಸಿ / 03',
    'AI Generated Catalogue': 'AI ರಚಿಸಿದ ಕ್ಯಾಟಲಾಗ್',
    'Created from your photo and voice description.': 'ನಿಮ್ಮ ಫೋಟೋ ಮತ್ತು ಧ್ವನಿ ವಿವರಣೆಯಿಂದ ರಚಿಸಲಾಗಿದೆ.',
    'Back': 'ಹಿಂದೆ',
    'Edit your catalogue': 'ನಿಮ್ಮ ಕ್ಯಾಟಲಾಗ್ ಸಂಪಾದಿಸಿ',
    'Translating…': 'ಅನುವಾದಿಸಲಾಗುತ್ತಿದೆ…',
    'Refresh with AI': 'AI ಮೂಲಕ ರಿಫ್ರೆಶ್ ಮಾಡಿ',
    'AI generated in seconds from your photo + voice description': 'ನಿಮ್ಮ ಫೋಟೋ ಮತ್ತು ಧ್ವನಿ ವಿವರಣೆಯಿಂದ AI ಕೆಲವೇ ಕ್ಷಣಗಳಲ್ಲಿ ರಚಿಸಿದೆ',
    'Product Name': 'ಉತ್ಪನ್ನದ ಹೆಸರು',
    'Category': 'ವರ್ಗ',
    'Material': 'ವಸ್ತು',
    'Craft Type': 'ಕರಕುಶಲ ಪ್ರಕಾರ',
    'Origin': 'ಮೂಲ',
    'Description': 'ವಿವರಣೆ',
    'Craft Story': 'ಕರಕುಶಲ ಕಥೆ',
    'Catalogue translated to': 'ಕ್ಯಾಟಲಾಗ್ ಅನುವಾದಿಸಲಾಗಿದೆ',
    'Translation failed. Please try again.': 'ಅನುವಾದ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    'Please add a product name and description before continuing.': 'ಮುಂದುವರಿಯುವ ಮೊದಲು ಉತ್ಪನ್ನದ ಹೆಸರು ಮತ್ತು ವಿವರಣೆಯನ್ನು ಸೇರಿಸಿ.',
    'All fields are ready to edit.': 'ಎಲ್ಲಾ ಫೀಲ್ಡ್‌ಗಳು ಸಂಪಾದನೆಗೆ ಸಿದ್ಧವಾಗಿವೆ.',
    'Edit': 'ಸಂಪಾದಿಸಿ',
    'Continue to Smart Pricing': 'ಸ್ಮಾರ್ಟ್ ಪ್ರೈಸಿಂಗ್‌ಗೆ ಮುಂದುವರಿಯಿರಿ',
    'Live preview': 'ಲೈವ್ ಪ್ರಿವ್ಯೂ',
    'AI prepared product': 'AI ಸಿದ್ಧಪಡಿಸಿದ ಉತ್ಪನ್ನ',
  },
  'മലയാളം': {
    'Create / 03': 'സൃഷ്ടിക്കുക / 03',
    'AI Generated Catalogue': 'AI തയ്യാറാക്കിയ കാറ്റലോഗ്',
    'Created from your photo and voice description.': 'നിങ്ങളുടെ ഫോട്ടോയും ശബ്ദ വിവരണവും ഉപയോഗിച്ച് തയ്യാറാക്കിയത്.',
    'Back': 'തിരികെ',
    'Edit your catalogue': 'നിങ്ങളുടെ കാറ്റലോഗ് തിരുത്തുക',
    'Translating…': 'വിവർത്തനം ചെയ്യുന്നു…',
    'Refresh with AI': 'AI ഉപയോഗിച്ച് പുതുക്കുക',
    'AI generated in seconds from your photo + voice description': 'നിങ്ങളുടെ ഫോട്ടോയും ശബ്ദ വിവരണവും ഉപയോഗിച്ച് AI നിമിഷങ്ങൾക്കുള്ളിൽ തയ്യാറാക്കി',
    'Product Name': 'ഉൽപ്പന്നത്തിന്റെ പേര്',
    'Category': 'വിഭാഗം',
    'Material': 'മെറ്റീരിയൽ',
    'Craft Type': 'കരകൗശല തരം',
    'Origin': 'ഉത്ഭവം',
    'Description': 'വിവരണം',
    'Craft Story': 'കരകൗശല കഥ',
    'Catalogue translated to': 'കാറ്റലോഗ് വിവർത്തനം ചെയ്തു',
    'Translation failed. Please try again.': 'വിവർത്തനം പരാജയപ്പെട്ടു. വീണ്ടും ശ്രമിക്കുക.',
    'Please add a product name and description before continuing.': 'തുടരുന്നതിന് മുമ്പ് ഉൽപ്പന്നത്തിന്റെ പേരും വിവരണവും ചേർക്കുക.',
    'All fields are ready to edit.': 'എല്ലാ ഫീൽഡുകളും തിരുത്താൻ തയ്യാറാണ്.',
    'Edit': 'തിരുത്തുക',
    'Continue to Smart Pricing': 'സ്മാർട്ട് പ്രൈസിംഗിലേക്ക് തുടരുക',
    'Live preview': 'ലൈവ് പ്രിവ്യൂ',
    'AI prepared product': 'AI തയ്യാറാക്കിയ ഉൽപ്പന്നം',
  },
  'ଓଡ଼ିଆ': {
    'Create / 03': 'ତିଆରି / 03',
    'AI Generated Catalogue': 'AI ଦ୍ୱାରା ପ୍ରସ୍ତୁତ କ୍ୟାଟାଲଗ୍',
    'Created from your photo and voice description.': 'ଆପଣଙ୍କ ଫଟୋ ଏବଂ ସ୍ୱର ବର୍ଣ୍ଣନାରୁ ପ୍ରସ୍ତୁତ।',
    'Back': 'ପଛକୁ',
    'Edit your catalogue': 'ଆପଣଙ୍କ କ୍ୟାଟାଲଗ୍ ସମ୍ପାଦନ କରନ୍ତୁ',
    'Translating…': 'ଅନୁବାଦ ହେଉଛି…',
    'Refresh with AI': 'AI ସହିତ ରିଫ୍ରେଶ କରନ୍ତୁ',
    'AI generated in seconds from your photo + voice description': 'ଆପଣଙ୍କ ଫଟୋ ଏବଂ ସ୍ୱର ବର୍ଣ୍ଣନାରୁ AI କିଛି ସେକେଣ୍ଡରେ ପ୍ରସ୍ତୁତ କରିଛି',
    'Product Name': 'ଉତ୍ପାଦର ନାମ',
    'Category': 'ବର୍ଗ',
    'Material': 'ସାମଗ୍ରୀ',
    'Craft Type': 'ହସ୍ତଶିଳ୍ପ ପ୍ରକାର',
    'Origin': 'ଉତ୍ପତ୍ତି ସ୍ଥାନ',
    'Description': 'ବର୍ଣ୍ଣନା',
    'Craft Story': 'ହସ୍ତଶିଳ୍ପ କାହାଣୀ',
    'Catalogue translated to': 'କ୍ୟାଟାଲଗ୍ ଅନୁବାଦ',
    'Translation failed. Please try again.': 'ଅନୁବାଦ ବିଫଳ ହେଲା। ଦୟାକରି ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।',
    'Please add a product name and description before continuing.': 'ଆଗକୁ ବଢ଼ିବା ପୂର୍ବରୁ ଉତ୍ପାଦର ନାମ ଏବଂ ବର୍ଣ୍ଣନା ଯୋଡନ୍ତୁ।',
    'All fields are ready to edit.': 'ସମସ୍ତ ଫିଲ୍ଡ ସମ୍ପାଦନ ପାଇଁ ପ୍ରସ୍ତୁତ।',
    'Edit': 'ସମ୍ପାଦନ କରନ୍ତୁ',
    'Continue to Smart Pricing': 'ସ୍ମାର୍ଟ ପ୍ରାଇସିଂକୁ ଯାଆନ୍ତୁ',
    'Live preview': 'ଲାଇଭ୍ ପ୍ରିଭ୍ୟୁ',
    'AI prepared product': 'AI ପ୍ରସ୍ତୁତ ଉତ୍ପାଦ',
  },
  'অসমীয়া': {
    'Create / 03': 'তৈয়াৰ / 03',
    'AI Generated Catalogue': 'AI-এ তৈয়াৰ কৰা কেটেলগ',
    'Created from your photo and voice description.': 'আপোনাৰ ফটো আৰু কণ্ঠৰ বিৱৰণৰ পৰা তৈয়াৰ কৰা হৈছে।',
    'Back': 'উভতি যাওক',
    'Edit your catalogue': 'আপোনাৰ কেটেলগ সম্পাদনা কৰক',
    'Translating…': 'অনুবাদ হৈ আছে…',
    'Refresh with AI': 'AI-ৰে ৰিফ্ৰেছ কৰক',
    'AI generated in seconds from your photo + voice description': 'আপোনাৰ ফটো আৰু কণ্ঠৰ বিৱৰণৰ পৰা AI-এ কেইছেকেণ্ডতে তৈয়াৰ কৰিছে',
    'Product Name': 'উৎপাদনৰ নাম',
    'Category': 'শ্ৰেণী',
    'Material': 'সামগ্ৰী',
    'Craft Type': 'হস্তশিল্পৰ ধৰণ',
    'Origin': 'উৎপত্তি',
    'Description': 'বিৱৰণ',
    'Craft Story': 'হস্তশিল্পৰ কাহিনী',
    'Catalogue translated to': 'কেটেলগ অনুবাদ কৰা হৈছে',
    'Translation failed. Please try again.': 'অনুবাদ বিফল হৈছে। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।',
    'Please add a product name and description before continuing.': 'আগবাঢ়াৰ আগতে উৎপাদনৰ নাম আৰু বিৱৰণ যোগ কৰক।',
    'All fields are ready to edit.': 'সকলো ফিল্ড সম্পাদনাৰ বাবে সাজু।',
    'Edit': 'সম্পাদনা কৰক',
    'Continue to Smart Pricing': 'স্মাৰ্ট প্ৰাইচিঙলৈ যাওক',
    'Live preview': 'লাইভ প্ৰিভিউ',
    'AI prepared product': 'AI-এ প্ৰস্তুত কৰা উৎপাদন',
  },
  'اردو': {
    'Create / 03': 'بنائیں / 03',
    'AI Generated Catalogue': 'AI تیار کردہ کیٹلاگ',
    'Created from your photo and voice description.': 'آپ کی تصویر اور آواز کی تفصیل سے تیار کیا گیا۔',
    'Back': 'واپس',
    'Edit your catalogue': 'اپنا کیٹلاگ ترمیم کریں',
    'Translating…': 'ترجمہ ہو رہا ہے…',
    'Refresh with AI': 'AI سے ریفریش کریں',
    'AI generated in seconds from your photo + voice description': 'آپ کی تصویر اور آواز کی تفصیل سے AI نے چند سیکنڈ میں تیار کیا',
    'Product Name': 'مصنوعات کا نام',
    'Category': 'زمرہ',
    'Material': 'مواد',
    'Craft Type': 'دستکاری کی قسم',
    'Origin': 'اصل مقام',
    'Description': 'تفصیل',
    'Craft Story': 'دستکاری کی کہانی',
    'Catalogue translated to': 'کیٹلاگ کا ترجمہ',
    'Translation failed. Please try again.': 'ترجمہ ناکام ہوگیا۔ دوبارہ کوشش کریں۔',
    'Please add a product name and description before continuing.': 'آگے بڑھنے سے پہلے مصنوعات کا نام اور تفصیل شامل کریں۔',
    'All fields are ready to edit.': 'تمام فیلڈز ترمیم کے لیے تیار ہیں۔',
    'Edit': 'ترمیم کریں',
    'Continue to Smart Pricing': 'اسمارٹ پرائسنگ پر جائیں',
    'Live preview': 'لائیو پیش نظارہ',
    'AI prepared product': 'AI تیار کردہ مصنوعات',
  },
};

function localizeStaticText(text: string, language: Language): string {
    return STATIC_TEXT[language]?.[text] || ADD_PRODUCT_TEXT[language]?.[text] || PHOTO_STUDIO_TEXT[language]?.[text] || CATALOGUE_TEXT[language]?.[text] || MARKET_TEXT[language]?.[text] || UI_TEXT[language]?.[text] || text;
}

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

const EMPTY_PRODUCT: Product = {
  name: '', price: 0, stock: 0, description: '', category: '', material: '',
  craftType: '', origin: '', tags: [], story: '', published: false,
};

const DEMO_ARTISAN: Artisan = {
  name: 'Meena Devi',
  place: 'Sonipat, Haryana',
  craft: 'Bamboo Handicrafts',
  experience: '8 years',
  phone: '+91 98765 43210',
};

const DEMO_PRODUCT: Product = {
  name: 'Handmade Bamboo Basket', price: 999, stock: 32,
  description: 'Beautiful handwoven bamboo basket crafted by skilled rural artisans. Lightweight, durable and suitable for home décor and storage.',
  category: 'Home Décor', material: 'Bamboo', craftType: 'Handwoven', origin: 'Haryana',
  tags: ['#Handmade', '#Bamboo', '#IndianCraft', '#RuralArtisan'],
  story: 'Handcrafted using locally sourced bamboo. Each basket is carefully made by skilled artisans.', published: false,
};

const DEMO_PRODUCT_IMAGE = "/images/demo-bamboo-basket.png";

const DEMO_ORDERS: Order[] = [
  { id: '#1024', buyer: 'Delhi Handicraft Store', product: 'Bamboo Basket', quantity: 20, total: 19980, status: 'Processing' },
  { id: '#1023', buyer: 'Home Décor Boutique', product: 'Bamboo Basket', quantity: 10, total: 9990, status: 'Delivered' },
];
const DEMO_INVENTORY: InventoryItem[] = [
  { name: 'Bamboo Basket', available: 32 },
  { name: 'Handmade Mat', available: 14 },
  { name: 'Wood Craft', available: 8 },
];
const DEMO_BUYER: Buyer = {
  name: 'Delhi Handicraft Store', location: 'New Delhi', interest: 'Bamboo Products', quantity: 20,
  budget: '₹900–₹1,100 per unit', match: 94, initials: 'DH',
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

const buyers: Buyer[] = [DEMO_BUYER];

type WorkspaceMode = 'demo' | 'profile';

type AppState = {
  workspaceMode: WorkspaceMode;
  openDemo: () => void;
  startNewProfile: (artisan?: Artisan) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  t: (text: string) => string;
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
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>(() => {
    try { return localStorage.getItem('shilpsetu-workspace-mode') === 'profile' ? 'profile' : 'demo'; } catch { return 'demo'; }
  });
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('shilpsetu-language');
      return ['English','हिन्दी','ਪੰਜਾਬੀ','বাংলা','ગુજરાતી','मराठी','தமிழ்','తెలుగు','ಕನ್ನಡ','മലയാളം','ଓଡ଼ିଆ','অসমীয়া','اردو'].includes(saved || '') ? saved as Language : 'English';
    } catch { return 'English'; }
  });
  const profileArtisan = (() => { try { return JSON.parse(localStorage.getItem('shilpsetu-profile-artisan') || 'null'); } catch { return null; } })();
  const [artisan, setArtisan] = useState<Artisan>(() => workspaceMode === 'profile' && profileArtisan ? { ...EMPTY_ARTISAN, ...profileArtisan } : DEMO_ARTISAN);
  const [product, setProduct] = useState<Product>(() => {
    try { return workspaceMode === 'profile' ? { ...EMPTY_PRODUCT, ...JSON.parse(localStorage.getItem('shilpsetu-profile-product') || '{}') } : DEMO_PRODUCT; } catch { return workspaceMode === 'profile' ? EMPTY_PRODUCT : DEMO_PRODUCT; }
  });
  const [photoReady, setPhotoReady] = useState(false);
  const [photoDataUrl, setPhotoDataUrl] = useState('');
  const [photoAnalysis, setPhotoAnalysis] = useState('');
  const [editedPhotoDataUrl, setEditedPhotoDataUrl] = useState('');
  const [orders, setOrders] = useState<Order[]>(() => {
    try { return workspaceMode === 'profile' ? JSON.parse(localStorage.getItem('shilpsetu-profile-orders') || '[]') : DEMO_ORDERS; } catch { return workspaceMode === 'profile' ? [] : DEMO_ORDERS; }
  });
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try { return workspaceMode === 'profile' ? JSON.parse(localStorage.getItem('shilpsetu-profile-inventory') || '[]') : DEMO_INVENTORY; } catch { return workspaceMode === 'profile' ? [] : DEMO_INVENTORY; }
  });
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer>(() => {
    try { return workspaceMode === 'profile' ? JSON.parse(localStorage.getItem('shilpsetu-profile-buyer') || 'null') || { name: '', location: '', interest: '', quantity: 0, budget: '', match: 0, initials: '' } : DEMO_BUYER; } catch { return workspaceMode === 'profile' ? { name: '', location: '', interest: '', quantity: 0, budget: '', match: 0, initials: '' } : DEMO_BUYER; }
  });

  const resetWorkspace = (mode: WorkspaceMode, nextArtisan: Artisan) => {
    setWorkspaceMode(mode);
    setArtisan(nextArtisan);
    setProduct(mode === 'demo' ? DEMO_PRODUCT : EMPTY_PRODUCT);
    setPhotoReady(false);
    setPhotoDataUrl('');
    setPhotoAnalysis('');
    setEditedPhotoDataUrl('');
    setOrders(mode === 'demo' ? DEMO_ORDERS : []);
    setInventory(mode === 'demo' ? DEMO_INVENTORY : []);
    setSelectedBuyer(mode === 'demo' ? DEMO_BUYER : { name: '', location: '', interest: '', quantity: 0, budget: '', match: 0, initials: '' });
  };
  const openDemo = () => resetWorkspace('demo', DEMO_ARTISAN);
  const startNewProfile = (nextArtisan = EMPTY_ARTISAN) => {
    try {
      localStorage.removeItem('shilpsetu-profile-artisan');
      localStorage.removeItem('shilpsetu-profile-product');
      localStorage.removeItem('shilpsetu-profile-orders');
      localStorage.removeItem('shilpsetu-profile-inventory');
      localStorage.removeItem('shilpsetu-profile-buyer');
    } catch {}
    resetWorkspace('profile', nextArtisan);
  };

  useEffect(() => {
    try {
      localStorage.setItem('shilpsetu-workspace-mode', workspaceMode);
      localStorage.setItem('shilpsetu-language', language);
      if (workspaceMode === 'profile') {
        localStorage.setItem('shilpsetu-profile-artisan', JSON.stringify(artisan));
        localStorage.setItem('shilpsetu-profile-product', JSON.stringify(product));
        localStorage.setItem('shilpsetu-profile-orders', JSON.stringify(orders));
        localStorage.setItem('shilpsetu-profile-inventory', JSON.stringify(inventory));
        localStorage.setItem('shilpsetu-profile-buyer', JSON.stringify(selectedBuyer));
      }
    } catch {}
  }, [workspaceMode, language, artisan, product, orders, inventory, selectedBuyer]);

  const t = useCallback((text: string) => localizeStaticText(text, language), [language]);

  const value = useMemo(() => ({
    workspaceMode, openDemo, startNewProfile,
    language, setLanguage, t, artisan, setArtisan, product, setProduct, photoReady, setPhotoReady, photoDataUrl, setPhotoDataUrl, photoAnalysis, setPhotoAnalysis, editedPhotoDataUrl, setEditedPhotoDataUrl,
    orders, setOrders, inventory, setInventory, selectedBuyer, setSelectedBuyer,
  }), [workspaceMode, language, artisan, product, photoReady, photoDataUrl, photoAnalysis, editedPhotoDataUrl, orders, inventory, selectedBuyer]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Real AI service layer. Secrets stay server-side; the browser only calls /api/ai.
type AIAction = 'coach' | 'description' | 'translate' | 'categorize' | 'price' | 'buyers' | 'photo-analysis' | 'photo-edit' | 'voice' | 'profile';

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
    return new Promise<string>((resolve, reject) => {
      const recognition = new SpeechRecognition();
      recognition.lang = languageToSpeechLocale(language);
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.maxAlternatives = 3;
      let settled = false;
      const timer = window.setTimeout(() => { if (!settled) recognition.stop(); }, 15000);
      const finish = (fn: (value: any) => void, value: any) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        fn(value);
      };
      recognition.onresult = (event: any) => {
        const text = Array.from(event.results || []).map((result: any) => result?.[0]?.transcript || '').join(' ').trim();
        if (text) finish(resolve, text); else finish(reject, new Error('no-speech'));
      };
      recognition.onerror = (event: any) => finish(reject, new Error(event?.error || 'voice-error'));
      recognition.onend = () => { if (!settled) finish(reject, new Error('no-speech')); };
      try { recognition.start(); } catch { finish(reject, new Error('start-failed')); }
    }).catch(async (error) => {
      // Only use the recording + Gemini fallback when browser recognition is unavailable.
      const code = error instanceof Error ? error.message : 'voice-error';
      if (['not-supported', 'start-failed'].includes(code)) return recordVoiceWithAI(language);
      throw new Error(voiceErrorMessage(code));
    });
  }
  return recordVoiceWithAI(language);
}

async function recordVoiceWithAI(language: Language): Promise<string> {
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') throw new Error(voiceErrorMessage('not-supported'));
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
export async function generateProfileFromVoice(transcript: string, language: Language = 'English'): Promise<Artisan> {
  const data = await callAI('profile', { transcript, language });
  return { ...EMPTY_ARTISAN, name: String(data.name || ''), place: String(data.place || ''), craft: String(data.craft || ''), experience: String(data.experience || ''), phone: String(data.phone || '') };
}
export async function translateCatalogue(language: Language, context: Record<string, unknown> = {}): Promise<string> {
  const data = await callAI('translate', { language, ...context });
  return data.text || '';
}
export async function translateCatalogueFields(language: Language, fields: Record<string, string>): Promise<Record<string, string>> {
  const data = await callAI('translate', { language, fields });
  return data.fields || {};
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
  const { language, setLanguage, openDemo, startNewProfile, t } = useApp();
  return <main className="welcome noise"><section className="welcome-panel animate-rise">
    <div className="welcome-story"><Logo light /><div className="story-copy"><div className="eyebrow" style={{ color: '#f1d797' }}>{t('Your craft. Your next chapter.')}</div><h1 className="display">{t('Make your hands')}<br />{t('count online.')}</h1><p>{t('AI-powered tools that help artisans create, price and sell their products.')}</p><div className="feature-grid"><span><Camera size={14} /> {t('Create better listings')}</span><span><IndianRupee size={14} /> {t('Price smarter')}</span><span><Store size={14} /> {t('Find buyers')}</span></div></div><div className="story-footer"><strong>01 / 04</strong><span>{t("Built for India's makers")}</span></div></div>
    <div className="welcome-form"><div className="eyebrow">{t('A warm start')}</div><h2 className="display">{t('Namaste, artisan.')}</h2><p>{t('Choose a language to begin. We will keep every step short, visual and in your control.')}</p><div className="language-grid">{LANGUAGES.map((item) => <button key={item.value} type="button" className={`language-button ${language === item.value ? 'selected' : ''}`} onClick={() => setLanguage(item.value)} data-testid={`button-language-${item.value}`}><strong>{item.native}</strong><span>{item.label}</span></button>)}</div><button type="button" className="primary-button full-button" onClick={() => { startNewProfile(); setLocation('/register?new=1'); }} data-testid="button-begin">{ui(language, 'start')} <ArrowRight size={16} /></button><button type="button" className="secondary-button full-button demo-button" onClick={() => { openDemo(); setLocation('/dashboard'); }} data-testid="button-explore-demo">{ui(language, 'demo')}</button><p className="form-note">{t('No bank details needed. This demo keeps your choices on this device.')}</p></div>
  </section></main>;
}

function RegistrationPage() {
  const [location, setLocation] = useLocation();
  const { artisan, language, startNewProfile, t } = useApp();
  const isNewProfile = location.includes('?new=1');
  const [form, setForm] = useState<Artisan>(() => isNewProfile ? EMPTY_ARTISAN : artisan);
  const [error, setError] = useState('');
  const update = (key: keyof Artisan, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError('');
  };


  const submit = (event: FormEvent) => {
    event.preventDefault();
    const cleaned = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, String(v).trim()])) as Artisan;
    if (!cleaned.name || !cleaned.place || !cleaned.craft || !cleaned.experience || !cleaned.phone) {
      setError('Please fill in every field so we can create your artisan profile.');
      return;
    }
    startNewProfile(cleaned);
    setLocation('/dashboard');
  };
  return <main className="welcome noise"><section className="welcome-panel animate-rise">
    <div className="welcome-story"><Logo light /><div className="story-copy"><div className="eyebrow" style={{ color: '#f1d797' }}>{isNewProfile ? t('Create a new workspace') : t('Step 02 / 04')}</div><h1 className="display">{t('Let us put')}<br />{t('a name to it.')}</h1><p>{t('Your name and craft help your catalogue sound like you, not a template.')}</p></div><div className="story-footer"><strong>{language}</strong><span>{t('Saved privately on this device')}</span></div></div>
    <form className="welcome-form" onSubmit={submit}><button type="button" className="icon-button" onClick={() => setLocation('/')} aria-label={t("Back")}><ArrowLeft size={18} /></button><div className="eyebrow" style={{ marginTop: '1.5rem' }}>{t('Your maker profile')}</div><h2 className="display">{t('Create your artisan profile.')}</h2><p>{t('Enter your own details. Meena Devi is only the demo profile.')}</p><div className="form-stack"><div className="field-group"><label htmlFor="artisan-name">{t("Name")}</label><input id="artisan-name" className="field-input" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Sunita Kumari" /></div><div className="field-group"><label htmlFor="artisan-place">{t("Village / City")}</label><input id="artisan-place" className="field-input" value={form.place} onChange={(e) => update('place', e.target.value)} placeholder="e.g. Sonipat, Haryana" /></div><div className="form-inline"><div className="field-group"><label htmlFor="artisan-craft">{t("Craft Type")}</label><input id="artisan-craft" className="field-input" value={form.craft} onChange={(e) => update('craft', e.target.value)} placeholder="e.g. Pottery" /></div><div className="field-group"><label htmlFor="artisan-experience">{t("Experience")}</label><input id="artisan-experience" className="field-input" value={form.experience} onChange={(e) => update('experience', e.target.value)} placeholder="e.g. 5 years" /></div></div><div className="field-group"><label htmlFor="artisan-phone">{t("Phone Number")}</label><input id="artisan-phone" className="field-input" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 98765 43210" /></div></div>{error && <div className="error-message" role="alert">{error}</div>}<button type="submit" className="primary-button full-button">{t('Create my profile')} <ArrowRight size={16} /></button></form>
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
  const { artisan, language, setLanguage, startNewProfile, workspaceMode, t } = useApp();
  return <div className="workspace noise"><aside className="sidebar"><Logo light /><nav aria-label={t("Main navigation")}>{navItems.map((item) => <NavItem path={item.path} icon={item.icon} label={ui(language, item.key)} current={current} />)}</nav><div className="sidebar-bottom"><div className="profile-row"><span className="avatar">{artisan.name ? artisan.name.split(/\s+/).map((p) => p[0]).join('').slice(0,2).toUpperCase() : 'AR'}</span><span><strong>{artisan.name || t('New Artisan')}</strong><small>{artisan.craft || t('Create your craft profile')}</small></span></div><div className="form-note" style={{ marginTop: '0.5rem' }}>{workspaceMode === 'demo' ? t('Demo data — kept separate') : t('New profile — data starts from 0')}</div><button type="button" className="secondary-button full-button" style={{ marginTop: '0.75rem' }} onClick={() => { startNewProfile(); setLocation('/register?new=1'); }}><Plus size={14} /> {ui(language, 'create')}</button></div></aside><div className="main-area"><header className="topbar"><div className="mobile-mark"><Logo /></div><div className="topbar-context eyebrow">{current === '/dashboard' ? `${localizeStaticText('Good morning', language)}, ${artisan.name.split(' ')[0]}` : localizeStaticText(navItems.find((item) => item.path === current)?.label || 'Home', language)}</div><div className="topbar-right"><label className="language-chip" title={t('Choose language')}><Languages size={13} /><select value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label={t("Choose language")}>{LANGUAGES.map((item) => <option key={item.value} value={item.value}>{item.native} — {item.label}</option>)}</select></label><button type="button" className="icon-button" onClick={() => setLocation('/profile')} aria-label={t("Open profile")}><Bell size={17} /></button></div></header>{children}<nav className="bottom-nav" aria-label={t("Mobile navigation")}>{navItems.map((item) => <BottomNav path={item.path} icon={item.icon} label={ui(language, item.key)} current={current} />)}</nav></div></div>;
}

function BottomNav({ path, label, icon, current }: { path: string; label: string; icon: ReactNode; current: string }) {
  const [, setLocation] = useLocation();
  return <button type="button" className={current === path ? 'active' : ''} onClick={() => setLocation(path)}>{icon}<span>{label}</span></button>;
}

function PageHeading({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) {
  const { language } = useApp();
  return <div className="page-heading"><div><div className="eyebrow">{localizeStaticText(eyebrow, language)}</div><h1 className="display">{localizeStaticText(title, language)}</h1><p>{localizeStaticText(description, language)}</p></div>{actions && <div className="heading-actions">{actions}</div>}</div>;
}

function DashboardPage() {
  const [, setLocation] = useLocation();
  const { artisan, product, orders, language, workspaceMode } = useApp();
  const t = (text: string) => localizeStaticText(text, language);
  const firstName = artisan.name ? artisan.name.split(' ')[0] : t('New Artisan');
  const sales = orders.reduce((sum, order) => sum + order.total, 0);
  const languagesSupported = workspaceMode === 'demo' ? '13' : '0';

  return <AppShell current="/dashboard">
    <main className="content animate-rise">
      <PageHeading
        eyebrow={t('Your artisan dashboard')}
        title={`${t('Good Morning')}, ${firstName}`}
        description={t("Let's grow your craft business.")}
        actions={
          <button
            type="button"
            className="primary-button"
            onClick={() => setLocation('/add-product')}
          >
            <Plus size={16} /> {t('Add new product')}
          </button>
        }
      />

      <div className="stats-grid">
        {[
          [String(product.name ? 1 : 0), t('Products Listed')],
          [String(orders.length ? 1 : 0), t('Buyer Enquiries')],
          [String(orders.length), t('Orders')],
          [`₹${sales.toLocaleString('en-IN')}`, t('Estimated Sales')],
        ].map(([value, label]) => (
          <div className="metric panel" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="dashboard-grid" style={{ marginTop: '1rem' }}>
        <section className="hero-card panel">
          <div>
            <div className="eyebrow">{t('Your featured craft')}</div>
            <h2 className="display">{product.name || t('No product yet')}</h2>
            <p>{t('Beautifully made. Clearly priced. Ready to meet its next home.')}</p>
          </div>

          <div className="hero-stat">
            <span /> {t('Catalogue strength')}
            <strong>{product.name ? '82 / 100' : '0 / 100'}</strong>
            <ChevronRight size={14} />
          </div>
        </section>

        <section className="ai-coach-card panel">
          <span className="coach-orb"><Bot size={21} /></span>
          <div className="eyebrow">{t('ShilpSetu AI Coach')}</div>
          <h2 className="serif">{t('Need help with pricing, products or customers?')}</h2>
          <button
            type="button"
            className="secondary-button"
            onClick={() => setLocation('/coach')}
          >
            {t('Ask AI Coach')} <ArrowRight size={14} />
          </button>
        </section>
      </div>

      <section className="panel panel-pad activity-panel">
        <div className="section-label">
          <h2>{t('Recent Activity')}</h2>
          <button
            type="button"
            className="text-link"
            onClick={() => setLocation('/orders')}
          >
            {t('View orders')}
          </button>
        </div>

        {orders.length ? (
          <div className="activity-list">
            <div>
              <span className="activity-icon green"><Store size={15} /></span>
              <span>{t('New buyer interested in your bamboo baskets')}</span>
              <small>{t('Today')}</small>
            </div>
            <div>
              <span className="activity-icon gold"><IndianRupee size={15} /></span>
              <span>{t('New pricing suggestion available')}</span>
              <small>{t('Yesterday')}</small>
            </div>
            <div>
              <span className="activity-icon terracotta"><Package size={15} /></span>
              <span>{t('Order #1024 received')}</span>
              <small>{t('Yesterday')}</small>
            </div>
          </div>
        ) : (
          <p className="aside-copy">{t('No activity yet. Add your first product to get started.')}</p>
        )}
      </section>

      <section className="impact-panel panel">
        <div>
          <div className="eyebrow" style={{ color: '#f1d797' }}>{t('Your impact')}</div>
          <h2 className="display">{t('Your digital presence is growing.')}</h2>
          <p>{t('Every listing makes your craft easier to find.')}</p>
        </div>

        <div className="impact-grid">
          {[
            [String(product.name ? 1 : 0), t('Products Listed')],
            [String(orders.length), t('Buyer Connections')],
            [String(orders.length), t('Orders Received')],
            [`₹${sales.toLocaleString('en-IN')}`, t('Estimated Revenue')],
            [languagesSupported, t('Languages Supported')],
          ].map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  </AppShell>;
}

function AddProductPage() {
  const [, setLocation] = useLocation();
  const { product, setProduct, setPhotoDataUrl, setPhotoReady, setPhotoAnalysis, setEditedPhotoDataUrl, photoDataUrl, language } = useApp();
  const t = (text: string) => localizeStaticText(text, language);
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
      setError(t(t('Camera access requires HTTPS. Open the deployed HTTPS link or use localhost on this computer.')));
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(t(t('Live camera is not supported by this browser. Please use the latest Chrome or Edge.')));
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
        ? t(t('Camera permission was blocked. Click the lock icon beside the Vercel URL, allow Camera, and try again.'))
        : t(t('Could not open the camera. Make sure no other app is using it and try again.')));
    }
  };

  const capturePhoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) {
      setError(t(t('Camera is not ready yet. Please wait a moment and try again.')));
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
      setError(error instanceof Error ? error.message : t(t('AI photo analysis failed.')));
    } finally {
      setWorking(false);
    }
  };

  const handleVoice = async () => {
    setSource('voice');
    setError('');
    setWorking(true);
    try {
      const transcript = await speechToText(language);
      const description = await generateProductDescription({ productName: form.name, description: transcript, language: 'English' });
      setForm((current) => ({ ...current, description: description || transcript }));
    } catch (error) {
      setError(error instanceof Error ? error.message : t(t('Voice capture failed. Please try again.')));
    } finally {
      setWorking(false);
    }
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError(t(t('Please choose an image file.'))); return; }
    if (file.size > 12 * 1024 * 1024) { setError(t(t('Please choose an image smaller than 12 MB.'))); return; }
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
    if (!form.name.trim() && !form.description.trim() && !photoDataUrl) { setError(t(t('Add a product name, description, or photo to continue.'))); return; }
    setWorking(true);
    try {
      const ai = await generateProductDescription({ productName: form.name, description: form.description, artisan: 'rural Indian artisan' });
      setProduct((current) => ({ ...current, name: form.name.trim() || current.name, description: ai || form.description.trim() }));
      setPhotoReady(false);
      setLocation('/photo-studio');
    } catch (error) {
      setError(error instanceof Error ? error.message : t(t('AI generation failed.')));
    } finally { setWorking(false); }
  };

  return <AppShell current="/add-product"><main className="content animate-rise">
    <PageHeading eyebrow={t("Create / 01")} title={t("Add Your Product")} description={t("Take a live photo, speak your description, and let AI prepare the listing.")} actions={<button type="button" className="secondary-button" onClick={() => setLocation('/dashboard')}><ArrowLeft size={15} />{t("Back")}</button>} />
    <form className="form-layout" onSubmit={submit}>
      <section className="panel panel-pad form-stack">
        <div className="input-options">
          <button type="button" className={`input-option ${source === 'camera' ? 'selected' : ''}`} onClick={() => void openCamera()} disabled={working}><Camera size={23} /><strong>{t("Take Product Photo")}</strong><small>{t("Open live camera")}</small></button>
          <button type="button" className={`input-option ${source.startsWith('photo:') ? 'selected' : ''}`} onClick={() => fileRef.current?.click()} disabled={working}><ImageIcon size={23} /><strong>{t("Upload Photo")}</strong><small>{t("Choose from gallery")}</small></button>
          <button type="button" className={`input-option ${source === 'voice' ? 'selected' : ''}`} onClick={() => void handleVoice()} disabled={working}><Mic size={23} /><strong>{working && source === 'voice' ? t(t('Listening…')) : t(t('Describe by Voice'))}</strong><small>{t("6-second AI voice capture")}</small></button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(event) => { void handleFile(event.target.files?.[0]); event.currentTarget.value = ''; }} />
        <canvas ref={canvasRef} hidden />
        {cameraOpen && <div className="camera-overlay" role="dialog" aria-modal="true" aria-label={t("Live product camera")}><div className="camera-modal"><div className="camera-header"><strong>{t("Live Product Camera")}</strong><button type="button" className="secondary-button" onClick={stopCamera}>{t("Close")}</button></div><video ref={videoRef} autoPlay playsInline muted className="camera-video" /><button type="button" className="primary-button camera-capture" onClick={() => void capturePhoto()}><Camera size={18} />{t("Capture Photo")}</button></div></div>}
        {photoDataUrl && <div className="photo-preview"><img src={photoDataUrl} alt={t("Selected product")} style={{ width: '100%', maxHeight: 260, objectFit: 'contain', borderRadius: 12 }} /></div>}
        <div className="field-group"><label htmlFor="product-name">{t("Product name")}</label><input id="product-name" className="field-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
        <div className="field-group"><label htmlFor="product-description">{t("Describe your product")}</label><div className="input-with-action"><textarea id="product-description" className="field-input" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder={t("Example: Ye bamboo ki handmade basket hai...")} /><button type="button" className="mic-button" onClick={() => void handleVoice()} disabled={working} aria-label={t("Describe product by voice")}><Mic size={16} /></button></div><small>{working ? (source === 'voice' ? t('Listening and transcribing with AI…') : t('AI is analysing your product…')) : source ? `${t('Selected:')} ${source}` : t('A few words or a photo are enough.')}</small></div>
        {error && <div className="error-message" role="alert">{error}</div>}
        <div className="form-actions"><button type="button" className="secondary-button" onClick={() => setLocation('/dashboard')}>{t("Cancel")}</button><button type="submit" className="primary-button" disabled={working}>{working ? t('AI is working…') : t('Generate with AI')} <ArrowRight size={15} /></button></div>
      </section>
      <aside className="panel panel-pad"><div className="eyebrow">{t("AI product understanding")}</div><BasketArt small /><p className="aside-copy">{t("Use the live camera or upload a photo. AI can identify the product, suggest a category and create marketplace-ready copy.")}</p></aside>
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
  const { photoReady, setPhotoReady, photoDataUrl, editedPhotoDataUrl, setEditedPhotoDataUrl, photoAnalysis, setPhotoAnalysis, product, t } = useApp();
  const [processing, setProcessing] = useState(false);
  const [tool, setTool] = useState('Warm daylight');
  const [error, setError] = useState('');

  const editPhoto = async (style = tool) => {
    if (!photoDataUrl) {
      setError(t('Please capture or upload a product photo first.'));
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
      if (!result.image) throw new Error(t('AI did not return an edited image. Please try again.'));
      setEditedPhotoDataUrl(result.image);
      setPhotoReady(true);
    } catch (e) {
      try {
        const localEdited = await localPhotoEdit(photoDataUrl, style);
        setEditedPhotoDataUrl(localEdited);
        setPhotoReady(true);
        setError(''); setPhotoAnalysis(t('Local smart photo enhancement applied because generative image AI is not configured.'));
      } catch (localError) {
        setError(localError instanceof Error ? localError.message : (e instanceof Error ? e.message : t('Photo editing failed.')));
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
    <PageHeading eyebrow={t('Create / 02')} title={t('AI Photo Studio')} description={t('Use your captured or uploaded product photo and let AI create a marketplace-ready visual.')} actions={<button type="button" className="secondary-button" onClick={() => setLocation('/add-product')}><ArrowLeft size={15} /> {t('Back')}</button>} />
    <section className="panel panel-pad">
      {!photoDataUrl ? <div className="empty-photo-state"><Camera size={32} /><strong>{t('No product photo yet')}</strong><p>{t('Go back and capture a live photo or upload one from your gallery.')}</p><button type="button" className="primary-button" onClick={() => setLocation('/add-product')}>{t('Add Product Photo')}</button></div> : <>
        <div className="studio-comparison">
          <div className="studio-frame before"><span className="studio-label">{t('Original')}</span><img src={photoDataUrl} alt="Original product" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }} /></div>
          <div className="studio-arrow"><WandSparkles size={18} /></div>
          <div className="studio-frame after"><span className="studio-label">{t('AI Edited')}</span>{processing ? <div className="studio-loading"><Sparkles size={24} /><strong>{t('AI is editing your photo…')}</strong><small>{t('Preparing a clean marketplace presentation')}</small></div> : editedPhotoDataUrl ? <img src={editedPhotoDataUrl} alt="AI edited product" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }} /> : <div className="studio-loading"><Sparkles size={24} /><strong>{t('Choose an AI style')}</strong><small>{t('Your edited photo will appear here.')}</small></div>}</div>
        </div>
        <div className="tool-row">{['Warm daylight', 'Clean paper', 'Village courtyard'].map((name) => <button type="button" key={name} className={`tool-chip ${tool === name ? 'active' : ''}`} disabled={processing} onClick={() => chooseStyle(name)}><Sparkles size={13} />{name}</button>)}</div>
        <div className="checklist"><span><Check size={14} /> {t('Original photo kept')}</span><span><Check size={14} /> {t('AI product analysis')}</span><span><Check size={14} /> {t('AI visual edit')}</span><span><Check size={14} /> {t('Marketplace-ready image')}</span></div>
        {photoAnalysis && <div className="panel panel-pad" style={{ marginTop: '1rem' }}><div className="eyebrow">{t('AI product analysis')}</div><p>{photoAnalysis}</p></div>}
        {error && <div className="error-message" role="alert" style={{ marginTop: '1rem' }}>{error}</div>}
        <div className="form-actions"><button type="button" className="secondary-button" onClick={() => setLocation('/add-product')}>{t('Change Photo')}</button><button type="button" className="primary-button" disabled={processing || !editedPhotoDataUrl} onClick={() => setLocation('/catalogue')}>{processing ? t('AI is editing…') : t('Use AI Result')} <ArrowRight size={15} /></button></div>
      </>}
    </section>
  </main></AppShell>;
}

function CataloguePage() {
  const [, setLocation] = useLocation();

  const { product, setProduct, editedPhotoDataUrl, photoDataUrl, language: appLanguage, workspaceMode } = useApp();

  const [language, setLanguage] = useState<Language>(appLanguage);

  const [fields, setFields] = useState({ name: product.name, category: product.category, material: product.material, craftType: product.craftType, origin: product.origin, description: product.description, story: product.story });

  const [baseFields, setBaseFields] = useState({ name: product.name, category: product.category, material: product.material, craftType: product.craftType, origin: product.origin, description: product.description, story: product.story });

  const [notice, setNotice] = useState('');
  const [translating, setTranslating] = useState(false);

  const text = (value: string) => localizeStaticText(value, language);

  const update = (key: keyof typeof fields, value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
    if (language === 'English') setBaseFields((current) => ({ ...current, [key]: value }));
  };

  const selectLanguage = async (item: Language) => {
    setLanguage(item);
    setNotice('');

    if (item === 'English') {
      setFields(baseFields);
      return;
    }

    setTranslating(true);

    try {
      const translated = await translateCatalogueFields(item, baseFields);
      setFields((current) => ({ ...current, ...translated, description: baseFields.description }));
      setNotice(`${localizeStaticText('Catalogue translated to', item)} ${item}.`);
    } catch (e) {
      setNotice(e instanceof Error ? e.message : localizeStaticText('Translation failed. Please try again.', item));
    } finally {
      setTranslating(false);
    }
  };

  const refresh = async () => {
    await selectLanguage(language);
  };

  const save = () => {
    if (!fields.name.trim() || !fields.description.trim()) {
      setNotice(text('Please add a product name and description before continuing.'));
      return;
    }

    setProduct((current) => ({
      ...current,
      name: baseFields.name.trim(),
      category: baseFields.category,
      material: baseFields.material,
      craftType: baseFields.craftType,
      origin: baseFields.origin,
      description: baseFields.description.trim(),
      story: baseFields.story.trim(),
    }));

    setLocation('/pricing');
  };

  return <AppShell current="/add-product">
    <main className="content animate-rise">
      <PageHeading
        eyebrow={text('Create / 03')}
        title={text('AI Generated Catalogue')}
        description={text('Created from your photo and voice description.')}
        actions={
          <button type="button" className="secondary-button" onClick={() => setLocation('/photo-studio')}>
            <ArrowLeft size={15} /> {text('Back')}
          </button>
        }
      />

      <div className="form-layout">
        <section className="panel panel-pad">
          <div className="section-label">
            <h2>{text('Edit your catalogue')}</h2>
            <button type="button" className="secondary-button" onClick={() => void refresh()} disabled={translating}>
              <Sparkles size={14} /> {translating ? text('Translating…') : text('Refresh with AI')}
            </button>
          </div>

          <div className="language-tabs">
            {LANGUAGES.map((item) => (
              <button
                type="button"
                key={item.value}
                className={`language-tab ${language === item.value ? 'active' : ''}`}
                onClick={() => void selectLanguage(item.value)}
              >
                {item.native}
              </button>
            ))}
          </div>

          <p className="ai-source">
            <WandSparkles size={13} /> {text('AI generated in seconds from your photo + voice description')}
          </p>

          <div className="catalogue-fields">
            <div className="field-group">
              <label htmlFor="catalogue-name">{text('Product Name')}</label>
              <input id="catalogue-name" className="field-input" value={fields.name} onChange={(event) => update('name', event.target.value)} />
            </div>

            <div className="form-inline">
              <div className="field-group">
                <label htmlFor="catalogue-category">{text('Category')}</label>
                <input id="catalogue-category" className="field-input" value={fields.category} onChange={(event) => update('category', event.target.value)} />
              </div>

              <div className="field-group">
                <label htmlFor="catalogue-material">{text('Material')}</label>
                <input id="catalogue-material" className="field-input" value={fields.material} onChange={(event) => update('material', event.target.value)} />
              </div>
            </div>

            <div className="form-inline">
              <div className="field-group">
                <label htmlFor="catalogue-craft">{text('Craft Type')}</label>
                <input id="catalogue-craft" className="field-input" value={fields.craftType} onChange={(event) => update('craftType', event.target.value)} />
              </div>

              <div className="field-group">
                <label htmlFor="catalogue-origin">{text('Origin')}</label>
                <input id="catalogue-origin" className="field-input" value={fields.origin} onChange={(event) => update('origin', event.target.value)} />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="catalogue-description">{text('Description')}</label>
              <textarea id="catalogue-description" className="field-input" value={fields.description} onChange={(event) => update('description', event.target.value)} />
            </div>

            <div className="field-group">
              <label htmlFor="catalogue-story">{text('Craft Story')}</label>
              <textarea id="catalogue-story" className="field-input" value={fields.story} onChange={(event) => update('story', event.target.value)} />
            </div>

            <div className="tag-row">
              {product.tags.map((tag) => <span className="pill pill-green" key={tag}>{tag}</span>)}
            </div>
          </div>

          {notice && (
            <p className="success-inline">
              <CircleCheck size={14} />{notice}
            </p>
          )}

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={() => setNotice(text('All fields are ready to edit.'))}>
              {text('Edit')}
            </button>

            <button type="button" className="primary-button" onClick={save}>
              {text('Continue to Smart Pricing')} <ArrowRight size={15} />
            </button>
          </div>
        </section>

        <aside className="catalogue-preview panel">
          <div className="eyebrow">{text('Live preview')} / {language}</div>

          {(editedPhotoDataUrl || photoDataUrl) ? (
            <img
              src={editedPhotoDataUrl || photoDataUrl}
              alt={text('AI prepared product')}
              style={{ width: '100%', height: 220, objectFit: 'contain', borderRadius: 12, marginBottom: '1rem' }}
            />
          ) : workspaceMode === 'demo' ? (
            <img
              src={DEMO_PRODUCT_IMAGE}
              alt={product.name}
              style={{ width: '100%', height: 220, objectFit: 'contain', borderRadius: 12, marginBottom: '1rem' }}
            />
          ) : (
            <BasketArt />
          )}

          <div className="eyebrow" style={{ color: '#6b786e' }}>
            {fields.category} · {fields.origin}
          </div>

          <h2 className="serif">{fields.name}</h2>
          <p>{fields.description}</p>

          <div className="tag-row">
            {product.tags.slice(0, 3).map((tag) => <span key={tag} className="pill pill-green">{tag}</span>)}
          </div>

          <div className="preview-meta">
            <span className="price">₹{product.price.toLocaleString('en-IN')}</span>
            <span className="pill pill-yellow">
              <Check size={12} /> {fields.craftType}
            </span>
          </div>
        </aside>
      </div>
    </main>
  </AppShell>;
}

function PricingPage() {
  const [, setLocation] = useLocation();
  const { product, setProduct, language } = useApp();

  const [costs, setCosts] = useState({ material: 300, labour: 400, packaging: 50 });
  const [recommendation, setRecommendation] = useState(0);
  const [reason, setReason] = useState(localizeStaticText('Enter your costs and let AI suggest a fair selling price.', language));
  const [loading, setLoading] = useState(false);
  const costRef = useRef<HTMLInputElement>(null);

  const text = (value: string) => localizeStaticText(value, language);
  const total = costs.material + costs.labour + costs.packaging;

  const update = (key: keyof typeof costs, value: string) => {
    const nextValue = Math.max(0, Number(value) || 0);
    setCosts((current) => ({ ...current, [key]: nextValue }));
    setRecommendation(0);
    setReason(text('Recalculating from your current costs…'));
  };

  const getPrice = async () => {
    setLoading(true);

    try {
      const data = await suggestPrice({
        product,
        costs,
        totalCost: total,
        artisan: 'rural Indian artisan',
        language,
      });

      const aiPrice = Number(data) || 0;

      if (aiPrice > 0) {
        setRecommendation(Math.max(total, Math.round(aiPrice)));
        setReason(text('AI recommendation based on your product and the costs you entered.'));
      } else {
        const localPrice = Math.max(total, Math.round(total * 1.35 / 10) * 10);
        setRecommendation(localPrice);
        setReason(`${text('Smart pricing estimate')}: ₹${localPrice.toLocaleString('en-IN')} ${text('based on your costs and a prototype margin.')}`);
      }
    } catch (e) {
      const fallbackPrice = Math.max(total, Math.round(total * 1.35 / 10) * 10);
      setRecommendation(fallbackPrice);
      setReason(`${text('AI is temporarily unavailable')}. ${text('A 35% prototype margin estimate was used')}: ₹${fallbackPrice.toLocaleString('en-IN')}. ${text('You can recalculate when AI is available.')}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => { void getPrice(); }, 450);
    return () => window.clearTimeout(timer);
  }, [costs.material, costs.labour, costs.packaging, product.name, product.description, language]);

  const usePrice = () => {
    setProduct((current) => ({ ...current, price: recommendation || total }));
    setLocation('/product-preview');
  };

  return <AppShell current="/add-product">
    <main className="content animate-rise">
      <PageHeading
        eyebrow={text('Create / 04')}
        title={text('Smart Pricing Assistant')}
        description={text('Know your costs. Let AI help you price your craft fairly.')}
        actions={
          <button type="button" className="secondary-button" onClick={() => setLocation('/catalogue')}>
            <ArrowLeft size={15} /> {text('Back')}
          </button>
        }
      />

      <div className="form-layout">
        <section className="panel panel-pad form-stack">
          <div className="price-intro">
            <div className="eyebrow">{text('AI recommendation')}</div>
            <h2 className="serif">{text('A fair price respects your time.')}</h2>
            <p>{reason}</p>
          </div>

          <div className="cost-grid">
            <div className="field-group">
              <label htmlFor="material-cost">{text('Material Cost')}</label>
              <div className="rupee-input">
                <span>₹</span>
                <input ref={costRef} id="material-cost" type="number" min="0" value={costs.material} onChange={(event) => update('material', event.target.value)} />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="labour-cost">{text('Labour Cost')}</label>
              <div className="rupee-input">
                <span>₹</span>
                <input id="labour-cost" type="number" min="0" value={costs.labour} onChange={(event) => update('labour', event.target.value)} />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="packaging-cost">{text('Packaging')}</label>
              <div className="rupee-input">
                <span>₹</span>
                <input id="packaging-cost" type="number" min="0" value={costs.packaging} onChange={(event) => update('packaging', event.target.value)} />
              </div>
            </div>
          </div>

          <div className="total-row">
            <span>{text('Total Cost')}</span>
            <strong>₹{total.toLocaleString('en-IN')}</strong>
          </div>

          <div className="recommendation">
            <span className="eyebrow">{text('AI Recommended Selling Price')}</span>
            <strong>{recommendation ? `₹${recommendation.toLocaleString('en-IN')}` : '—'}</strong>
            <p>{text('AI uses the product context and your supplied material, labour and packaging costs. Confirm the final price before selling.')}</p>
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={() => void getPrice()} disabled={loading}>
              {loading ? text('AI calculating…') : text('Recalculate with AI')}
            </button>

            <button type="button" className="primary-button" disabled={!recommendation || loading} onClick={usePrice}>
              {text('Use')} ₹{recommendation || '—'} <ArrowRight size={15} />
            </button>
          </div>
        </section>

        <aside className="panel panel-pad">
          <div className="eyebrow">{text('Transparent pricing')}</div>

          <div className="impact-list" style={{ marginTop: '1rem' }}>
            <div className="impact-item"><span>{text('Material Cost')}</span><strong>₹{costs.material}</strong></div>
            <div className="impact-item"><span>{text('Labour Cost')}</span><strong>₹{costs.labour}</strong></div>
            <div className="impact-item"><span>{text('Packaging')}</span><strong>₹{costs.packaging}</strong></div>
            <div className="impact-item"><span>{text('AI price')}</span><strong>₹{recommendation || '—'}</strong></div>
          </div>

          <p className="aside-copy">{text('The artisan remains in control. AI recommends; you decide.')}</p>
        </aside>
      </div>
    </main>
  </AppShell>;
}

function ProductPreviewPage() {
  const [, setLocation] = useLocation();
  const { product, setProduct, artisan, editedPhotoDataUrl, photoDataUrl, workspaceMode } = useApp();
  return <AppShell current="/add-product"><main className="content animate-rise"><PageHeading eyebrow="Last look" title="Your Product Listing" description="Check the details once. You will be able to edit them later." actions={<button type="button" className="secondary-button" onClick={() => setLocation('/pricing')}><ArrowLeft size={15} /> Adjust price</button>} /><section className="panel product-card listing-card">{(editedPhotoDataUrl || photoDataUrl) ? <img src={editedPhotoDataUrl || photoDataUrl} alt={product.name} style={{ width: '100%', height: '100%', minHeight: 180, objectFit: 'contain', borderRadius: 12 }} /> : workspaceMode === 'demo' ? <img src={DEMO_PRODUCT_IMAGE} alt={product.name} style={{ width: '100%', height: 220, objectFit: 'contain', borderRadius: 12, marginBottom: '1rem' }} /> : <BasketArt />}<div className="product-copy"><div className="eyebrow">By {artisan.name} · {artisan.place}</div><h3>{product.name}</h3><div className="detail-pills"><span className="pill pill-green"><Check size={11} /> {product.craftType}</span><span className="pill pill-green"><Leaf size={11} /> {product.material}</span><span className="pill pill-yellow"><MapPin size={11} /> {product.origin}</span></div><p>{product.description}</p></div><span className="price">₹{product.price.toLocaleString('en-IN')}</span></section><section className="panel panel-pad story-section"><div className="eyebrow">Meet the Artisan</div><h2 className="serif">The human story behind the craft.</h2><p>{product.story}</p><div className="form-actions"><button type="button" className="secondary-button" onClick={() => setLocation('/catalogue')}><Pencil size={14} /> Edit Listing</button><button type="button" className="primary-button" onClick={() => { setProduct((current) => ({ ...current, published: true })); setLocation('/publish-success'); }}>Publish Product <Send size={15} /></button></div></section></main></AppShell>;
}

function PublishSuccessPage() {
  const [, setLocation] = useLocation();
  const { product, language } = useApp();

  const text = (value: string) => localizeStaticText(value, language);

  return <AppShell current="/dashboard">
    <main className="content animate-rise">
      <section className="panel publish-card">
        <span className="success-mark"><CircleCheck size={37} /></span>

        <div className="eyebrow">{text('Product Published Successfully!')}</div>

        <h1 className="display">{text('Your craft is ready to travel.')}</h1>

        <p>
          <strong>{product.name}</strong> {text('is now ready to reach potential buyers through ShilpSetu AI.')}
        </p>

        <div className="link-card" style={{ marginTop: '1.3rem' }}>
          <Store size={18} />
          <span>
            <strong>{text('Public catalogue listing')}</strong>
            {text('Your product is now visible to potential buyers')} · ₹{product.price.toLocaleString('en-IN')}
          </span>
        </div>

        <button type="button" className="primary-button full-button" onClick={() => setLocation('/market')}>
          {text('Find Potential Buyers')} <ArrowRight size={15} />
        </button>
      </section>
    </main>
  </AppShell>;
}

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
  const { selectedBuyer, product, language } = useApp();
  const [sent, setSent] = useState(false);
  const [contacted, setContacted] = useState(false);
  const [quantity, setQuantity] = useState(String(selectedBuyer.quantity));
  const [price, setPrice] = useState(String(product.price));
  const [message, setMessage] = useState(`I can supply ${selectedBuyer.quantity} handmade bamboo baskets at ₹${product.price} each.`);
  const [error, setError] = useState('');

  const text = (value: string) => localizeStaticText(value, language);

  const submit = (event: FormEvent) => {
    event.preventDefault();

    if (Number(quantity) < 1 || Number(price) < 1 || !message.trim()) {
      setError(text('Add a quantity, your price and a short message before sending.'));
      return;
    }

    setSent(true);
  };

  if (sent) {
    return <AppShell current="/market">
      <main className="content animate-rise">
        <section className="panel publish-card">
          <span className="success-mark"><CircleCheck size={37} /></span>
          <div className="eyebrow">{text('Offer sent successfully')}</div>
          <h1 className="display">{text('A thoughtful hello is on its way.')}</h1>
          <p>{text('Your offer has been shared with')} <strong>{selectedBuyer.name}</strong>.</p>
          <button type="button" className="primary-button full-button" onClick={() => setLocation('/market')}>
            {text('Back to Market Linkage')} <ArrowRight size={15} />
          </button>
        </section>
      </main>
    </AppShell>;
  }

  return <AppShell current="/market">
    <main className="content animate-rise">
      <PageHeading
        eyebrow={text('Grow / buyer details')}
        title={text('Buyer Details')}
        description={text('Send the right product, a clear price and a human note.')}
        actions={<button type="button" className="secondary-button" onClick={() => setLocation('/market')}>
          <ArrowLeft size={15} /> {text('Back')}
        </button>}
      />

      <div className="detail-layout">
        <section className="panel detail-card">
          <div className="buyer-card-head">
            <span className="buyer-avatar">{selectedBuyer.initials}</span>
            <span>
              <h2>{selectedBuyer.name}</h2>
              <small><MapPin size={12} /> {selectedBuyer.location}</small>
            </span>
            <span className="match-score">
              {selectedBuyer.match}%<small>{text('AI Match')}</small>
            </span>
          </div>

          <div className="eyebrow" style={{ marginTop: '1.5rem' }}>{text('Buyer Requirement')}</div>

          <div className="detail-grid">
            <div>
              <span>{text('Product')}</span>
              <strong>{text('Handmade Bamboo Basket')}</strong>
            </div>
            <div>
              <span>{text('Quantity')}</span>
              <strong>{selectedBuyer.quantity} {text('units')}</strong>
            </div>
            <div>
              <span>{text('Budget')}</span>
              <strong>{selectedBuyer.budget}</strong>
            </div>
            <div>
              <span>{text('Delivery')}</span>
              <strong>{text('Within 7–10 days')}</strong>
            </div>
          </div>

          <div className="button-row" style={{ marginTop: '1.5rem' }}>
            <button
              type="button"
              className="secondary-button"
              onClick={() => setContacted(true)}
            >
              {contacted ? text('Buyer contact noted') : text('Contact Buyer')}
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={() => document.getElementById('offer-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {text('Send Offer')}
            </button>
          </div>

          {contacted && (
            <p className="form-note" style={{ marginTop: '0.8rem' }}>
              {text('You can contact this buyer after preparing your offer.')}
            </p>
          )}
        </section>

        <form id="offer-form" className="panel form-card" onSubmit={submit}>
          <div className="section-heading">
            <div>
              <div className="eyebrow">{text('Send Offer')}</div>
              <h2>{text('Make your offer')}</h2>
            </div>
            <span className="pill pill-green">{selectedBuyer.match}% {text('match')}</span>
          </div>

          <label>
            {text('Quantity')}
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </label>

          <label>
            {text('Your Price')}
            <div className="input-prefix">
              <span>₹</span>
              <input
                type="number"
                min="1"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </div>
          </label>

          <label>
            {text('Message')}
            <textarea
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </label>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="primary-button full-button">
            {text('Send Offer')} <Send size={15} />
          </button>
        </form>
      </div>
    </main>
  </AppShell>;
}

function OrdersPage() {
  const { orders, setOrders, inventory, setInventory, language } = useApp();
  const [tab, setTab] = useState<'orders' | 'inventory'>('orders');
  const [notice, setNotice] = useState('');

  const text = (value: string) => localizeStaticText(value, language);

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order));
  };

  const addInventory = () => {
    setInventory((current) => [
      ...current,
      { name: 'Bamboo Basket', available: 1 },
    ]);
    setNotice(text('One Bamboo Basket added to inventory.'));
  };

  return <AppShell current="/orders">
    <main className="content animate-rise">
      <PageHeading
        eyebrow={text('Run / daily movement')}
        title={text('My Business')}
        description={text('Keep orders moving and know what is ready to travel.')}
        actions={
          <button
            type="button"
            className="secondary-button"
            onClick={() => setTab(tab === 'orders' ? 'inventory' : 'orders')}
          >
            {tab === 'orders' ? text('View Inventory') : text('View Orders')}
          </button>
        }
      />

      <section className="panel">
        <div className="tabs">
          <button
            type="button"
            className={tab === 'orders' ? 'active' : ''}
            onClick={() => setTab('orders')}
          >
            {text('Orders')} ({orders.length})
          </button>

          <button
            type="button"
            className={tab === 'inventory' ? 'active' : ''}
            onClick={() => setTab('inventory')}
          >
            {text('Inventory')}
          </button>
        </div>

        {tab === 'orders' ? (
          orders.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{text('Order')}</th>
                    <th>{text('Product')}</th>
                    <th>{text('Quantity')}</th>
                    <th>{text('Amount')}</th>
                    <th>{text('Status')}</th>
                    <th>{text('Action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td><strong>#{order.id}</strong></td>
                      <td>{order.product}</td>
                      <td>{order.quantity} {text('units')}</td>
                      <td>₹{order.total.toLocaleString('en-IN')}</td>
                      <td><span className="pill">{text(order.status)}</span></td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(event) => updateStatus(order.id, event.target.value as OrderStatus)}
                          aria-label={`${text('Update status for order')} #${order.id}`}
                        >
                          <option value="Pending">{text('Pending')}</option>
                          <option value="Confirmed">{text('Confirmed')}</option>
                          <option value="Shipped">{text('Shipped')}</option>
                          <option value="Delivered">{text('Delivered')}</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="eyebrow">{text('No orders yet')}</div>
              <h2>{text('Your orders will appear here.')}</h2>
              <p>{text('When a buyer places an order, you can track its progress from this workspace.')}</p>
            </div>
          )
        ) : (
          <div className="inventory-section">
            {inventory.length ? (
              <div className="inventory-grid">
                {inventory.map((item, index) => (
                  <article className="inventory-card" key={`${item.name}-${index}`}>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.available} {text('available')}</span>
                    </div>

                    <div className="inventory-controls">
                      <button
                        type="button"
                        className="icon-button"
                        onClick={() => setInventory((current) => current.map((entry, itemIndex) => itemIndex === index ? { ...entry, available: Math.max(0, entry.available - 1) } : entry))}
                        aria-label={text('Decrease')}
                      >
                        −
                      </button>

                      <strong>{item.available}</strong>

                      <button
                        type="button"
                        className="icon-button"
                        onClick={() => setInventory((current) => current.map((entry, itemIndex) => itemIndex === index ? { ...entry, available: entry.available + 1 } : entry))}
                        aria-label={text('Increase')}
                      >
                        +
                      </button>
                    </div>

                    {item.available <= 5 && <span className="pill pill-red">{text('Low Stock')}</span>}
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="eyebrow">{text('No inventory yet')}</div>
                <h2>{text('Your stock will appear here.')}</h2>
                <p>{text('Add products and keep quantities updated so you always know what is ready to sell.')}</p>
              </div>
            )}

            <div className="button-row" style={{ marginTop: '1.5rem' }}>
              <button type="button" className="primary-button" onClick={addInventory}>
                <Plus size={15} /> {text('Add Inventory')}
              </button>
            </div>

            {notice && <p className="form-note">{notice}</p>}
          </div>
        )}
      </section>
    </main>
  </AppShell>;
}

function CoachPage() {
  const { product, artisan, language } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<{ from: 'coach' | 'you'; text: string }[]>([
    {
      from: 'coach',
      text: localizeStaticText(
        'Namaste Meena! I am your AI business assistant. Ask me about pricing, products, customers, inventory, sales or your next business step.',
        language
      ),
    },
  ]);

  const prompts = [
    'How should I price my product?',
    'Which product should I make more?',
    'How can I improve my listing?',
    'How can I get more buyers?',
    'How much stock should I keep?',
  ];

  const text = (value: string) => localizeStaticText(value, language);

  const send = async (value = input) => {
    if (!value.trim() || loading) return;

    const question = value.trim();

    setMessages((current) => [...current, { from: 'you', text: question }]);
    setInput('');
    setLoading(true);

    try {
      const answer = await businessCoach(question, { product, artisan, language });

      setMessages((current) => [
        ...current,
        { from: 'coach', text: answer },
      ]);
    } catch (e) {
      setMessages((current) => [
        ...current,
        {
          from: 'coach',
          text: e instanceof Error
            ? e.message
            : text('I could not reach the AI service. Please try again.'),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return <AppShell current="/profile">
    <main className="content animate-rise">
      <PageHeading
        eyebrow={text('Your digital business assistant')}
        title={text('ShilpSetu AI Coach')}
        description={text('Ask plainly. Get advice powered by AI and tailored to your craft business.')}
        actions={
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              setMessages([
                {
                  from: 'coach',
                  text: text('Fresh start. What would make today’s business easier?'),
                },
              ])
            }
          >
            <RefreshCw size={14} /> {text('New thought')}
          </button>
        }
      />

      <div className="coach-shell">
        <section className="panel panel-pad coach-chat">
          <div className="chat-head">
            <span className="coach-orb"><Bot size={20} /></span>
            <span>
              <strong>{text('Setu, your business coach')}</strong>
              <small>{loading ? text('Thinking…') : text('AI assistant is ready')}</small>
            </span>
          </div>

          <div className="messages" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={`${message.from}-${index}`}
                className={`message ${message.from}`}
              >
                {message.text}
              </div>
            ))}

            {loading && (
              <div className="message coach">
                {text('Thinking about your business…')}
              </div>
            )}
          </div>

          <div className="prompt-grid">
            {prompts.map((prompt) => (
              <button
                type="button"
                className="prompt-chip"
                key={prompt}
                onClick={() => void send(prompt)}
              >
                {text(prompt)}
              </button>
            ))}
          </div>

          <div className="chat-input">
            <button
              type="button"
              className="voice-button"
              onClick={async () => {
                try {
                  setInput(await speechToText(language));
                } catch (error) {
                  setMessages((current) => [
                    ...current,
                    {
                      from: 'coach',
                      text: error instanceof Error
                        ? error.message
                        : text('Voice capture failed. Please try again.'),
                    },
                  ]);
                }
              }}
            >
              <Mic size={15} /> {text('Ask by Voice')}
            </button>

            <input
              className="field-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') void send();
              }}
              placeholder={text('Ask about your craft business...')}
            />

            <button
              type="button"
              className="primary-button"
              onClick={() => void send()}
              disabled={loading}
              aria-label={text('Send message')}
            >
              <Send size={15} />
            </button>
          </div>
        </section>

        <aside className="coach-side">
          <section className="panel panel-pad">
            <div className="eyebrow">{text('AI can help with')}</div>
            <h3>{text('More than chat')}</h3>

            <div className="coach-tip">
              <IndianRupee size={15} />
              <span>{text('Smart pricing based on your product context.')}</span>
            </div>

            <div className="coach-tip">
              <Camera size={15} />
              <span>{text('Photo understanding and listing creation.')}</span>
            </div>

            <div className="coach-tip">
              <Store size={15} />
              <span>{text('Buyer and sales suggestions.')}</span>
            </div>
          </section>

          <section className="panel panel-pad">
            <div className="eyebrow">{text('Your craft')}</div>
            <h3>{artisan.craft}</h3>
            <p className="aside-copy">
              {text('Setu uses the information in your workspace to make its advice more relevant to your business.')}
            </p>
          </section>
        </aside>
      </div>
    </main>
  </AppShell>;
}

function ProfilePage() {
  const { artisan, openDemo, startNewProfile, workspaceMode, product, orders, language } = useApp();

  const [, setLocation] = useLocation();

  const profileSales = orders.reduce((sum, order) => sum + order.total, 0);

  const impactStats = workspaceMode === 'demo'
    ? [
        ['12', 'Products Listed'],
        ['27', 'Buyer Connections'],
        ['7', 'Orders Received'],
        ['₹18,500', 'Estimated Revenue'],
        ['3', 'Languages Supported'],
      ]
    : [
        [String(product.name ? 1 : 0), 'Products Listed'],
        [String(orders.length), 'Buyer Connections'],
        [String(orders.length), 'Orders Received'],
        [`₹${profileSales.toLocaleString('en-IN')}`, 'Estimated Revenue'],
        ['0', 'Languages Supported'],
      ];

  const t = (text: string) => localizeStaticText(text, language);

  const initials = artisan.name
    ? artisan.name.split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase()
    : 'AR';

  return <AppShell current="/profile">
    <main className="content animate-rise">
      <PageHeading
        eyebrow={t('Your artisan profile')}
        title={t('Profile & Impact')}
        description={t('Your artisan identity powers your catalogue, AI advice and buyer suggestions.')}
        actions={
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                openDemo();
                setLocation('/dashboard');
              }}
            >
              {t('Demo Profile')}
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={() => {
                startNewProfile();
                setLocation('/register?new=1');
              }}
            >
              <Plus size={15} /> {t('Create New Profile')}
            </button>
          </div>
        }
      />

      <section className="panel panel-pad profile-card">
        <span className="profile-large">{initials}</span>

        <div>
          <div className="eyebrow">{t('Active Artisan')}</div>
          <h2 className="serif">{artisan.name}</h2>
          <p><MapPin size={14} /> {artisan.place}</p>
          <p><Leaf size={14} /> {artisan.craft} · {artisan.experience}</p>
          <p><Phone size={14} /> {artisan.phone}</p>
        </div>
      </section>

      <section className="impact-panel panel" style={{ marginTop: '1rem' }}>
        <div>
          <div className="eyebrow" style={{ color: '#f1d797' }}>{t('Your impact')}</div>
          <h2 className="display">{t('Your digital presence is growing.')}</h2>
        </div>

        <div className="impact-grid">
          {impactStats.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{t(label)}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  </AppShell>;
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