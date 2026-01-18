# AI Jewelry Designer 💎

AI-powered jewelry design platform using Google Gemini for image generation. Create stunning jewelry concepts from your gem descriptions.

## Features

- 🎨 **Design Generation** - Describe your vision, get multiple concepts
- ✨ **Refinement** - Iterate on designs with AI-powered editing
- 💾 **Save & Share** - Save designs to localStorage, share with unique links
- 🔐 **Authentication** - Firebase Auth with email/password
- 📱 **Responsive** - Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: Next.js 16, React, Tailwind CSS
- **AI**: Google Gemini 2.0 Flash
- **Auth & Storage**: Firebase
- **Deployment**: Vercel

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/Akil-Dikshan/ai-jewelry-design.git
cd ai-jewelry-design
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `GEMINI_API_KEY` - Get from [Google AI Studio](https://aistudio.google.com/)
- Firebase config - Get from [Firebase Console](https://console.firebase.google.com/)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment to Vercel

### Quick Deploy

1. **Create Vercel Account**: Sign up at [vercel.com](https://vercel.com) with GitHub
2. **Import Project**: Click "New Project" → Select `ai-jewelry-design` repo
3. **Set Environment Variables**: In project settings, add all variables from `.env.example`
4. **Deploy**: Click Deploy

### Environment Variables for Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `FIREBASE_PROJECT_ID` | Same as above (server-side) |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email |
| `FIREBASE_PRIVATE_KEY` | Firebase private key (with quotes) |
| `FIREBASE_STORAGE_BUCKET` | Same as above (server-side) |

### Health Check

After deployment, verify: `https://your-app.vercel.app/api/health`

---

## Post-Deployment Checklist

- [ ] Health endpoint returns status: healthy
- [ ] Homepage loads correctly
- [ ] Design generation works
- [ ] Authentication works
- [ ] Images save to Firebase Storage
- [ ] Share/Save features work

---

## Project Structure

```
src/
├── app/                 # Next.js pages
│   ├── api/            # API routes
│   ├── auth/           # Auth pages
│   └── design/         # Design pages
├── components/         # React components
├── contexts/           # React contexts
├── lib/               # Utilities
└── types/             # TypeScript types
```

---

## License

MIT
