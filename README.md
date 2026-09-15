# ShilpSetu AI 🧵

### AI-Powered Digital Platform for Indian Artisans

ShilpSetu AI is an AI-driven prototype designed to help marginalized Indian artisans digitally showcase their products, organize their catalogues, improve product descriptions, explore smart pricing, and connect with potential buyers.

The project was developed as part of **Smart India Hackathon 2026** by **Team InnoVeda**.

## 🚀 Live Demo

🔗 https://ship-setu-ai-shilpsetu-ai.vercel.app

## 🎯 Problem

Many traditional artisans have limited access to digital tools and wider markets. Challenges such as creating digital catalogues, describing products, deciding suitable prices, and discovering potential buyers can make it difficult for artisans to grow beyond local markets.

ShilpSetu AI aims to make these processes simpler through an accessible, AI-assisted platform.

## 💡 Our Solution

ShilpSetu AI provides a digital workspace where artisans can:

- Create and manage their digital profiles
- Add and organize handmade products
- Generate product descriptions with AI
- Translate catalogue content
- Categorize products automatically
- Get smart pricing suggestions
- Receive buyer-matching suggestions
- Analyze product photographs using AI
- Access an AI business coach
- Manage their product catalogue digitally

## 🤖 AI Features

The prototype integrates AI through a server-side `/api/ai` endpoint.

Current AI-assisted features include:

- AI Business Coach
- Product Description Generation
- Catalogue Translation
- Product Categorization
- Smart Pricing Suggestions
- Buyer Matching Suggestions
- Product Photo Analysis

The Gemini API key is kept server-side and is not exposed directly to the browser.

## 🛠️ Technology

### Frontend
- React
- TypeScript
- Vite
- HTML
- CSS

### Backend / API
- Server-side API endpoints
- TypeScript
- Gemini API integration

### Development & Deployment
- pnpm
- Git & GitHub
- Vercel
- Replit

## 🌐 Multilingual Approach

ShilpSetu AI is designed with multilingual accessibility in mind so that artisans can interact with the platform in multiple Indian languages.

Supported languages include:

- English
- हिन्दी
- ਪੰਜਾਬੀ
- বাংলা
- ગુજરાતી
- मराठी
- தமிழ்
- తెలుగు
- ಕನ್ನಡ
- മലയാളം
- ଓଡ଼ିଆ
- অসমীয়া
- اردو

## 📸 Product Understanding

The platform can use AI-based photo analysis to understand uploaded product images and assist with product-related information.

## 🔐 AI Configuration

For local development, configure the Gemini API key through an environment variable.

```text
GEMINI_API_KEY=your_api_key_here