# AI Jewelry Designer 💎✨

> Transform your vision into stunning jewelry designs with the power of AI

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://ai-jewelry-designer.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Storage-ffca28)](https://firebase.google.com/)

![AI Jewelry Designer Preview](https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&h=400&fit=crop)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎨 **AI Design Generation** | Describe your dream jewelry and get multiple unique concepts |
| 🔄 **Iterative Refinement** | Fine-tune designs with natural language instructions |
| 💾 **Save & Share** | Save favorites to your collection and share via unique links |
| 📱 **Responsive Design** | Beautiful experience on desktop, tablet, and mobile |
| 🔐 **User Authentication** | Secure Firebase authentication with email/password |
| 🖼️ **Multiple Variations** | Generate 2-4 design variations per request |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) 
- **AI**: [Google Gemini 2.0 Flash](https://ai.google.dev/) for image generation
- **Auth**: [Firebase Authentication](https://firebase.google.com/products/auth)
- **Storage**: [Firebase Storage](https://firebase.google.com/products/storage)
- **Hosting**: [Vercel](https://vercel.com/)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API key
- Firebase project

### Installation

```bash
# Clone the repository
git clone https://github.com/Akil-Dikshan/ai-jewelry-design.git
cd ai-jewelry-design

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## ⚙️ Environment Variables

Create a `.env.local` file with the following:

```env
# Google Gemini API
GEMINI_API_KEY=your_key_here

# Firebase (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx

# Firebase (Server-side)
FIREBASE_PROJECT_ID=xxx
FIREBASE_CLIENT_EMAIL=xxx@xxx.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=xxx.appspot.com
```

---

## 📁 Project Structure

```
ai-jewelry-design/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   └── design/            # Design flow pages
│   ├── components/            # React components
│   │   ├── design/           # Design-specific components
│   │   ├── forms/            # Form components
│   │   ├── layout/           # Layout components
│   │   ├── refine/           # Refinement components
│   │   └── ui/               # Reusable UI components
│   ├── contexts/              # React contexts
│   ├── lib/                   # Utilities & API clients
│   └── types/                 # TypeScript types
├── Documentation/             # Project documentation
└── public/                    # Static assets
```

---

## 🎯 How It Works

1. **Describe Your Gem** - Select gem type, cut, color, and size
2. **Add Your Vision** - Describe the jewelry style you want
3. **Generate Designs** - AI creates multiple unique concepts
4. **Refine & Iterate** - Fine-tune with natural language
5. **Save & Share** - Download or share your favorites

---

## 🔒 Security

- ✅ Security headers configured
- ✅ API keys server-side only
- ✅ Firebase security rules
- ✅ Input validation on all forms
- ✅ HTTPS enforced

---

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate-design` | POST | Generate jewelry designs |
| `/api/refine-design` | POST | Refine existing design |
| `/api/health` | GET | Health check endpoint |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 👨‍💻 Author

**Akil Dikshan**

- GitHub: [@Akil-Dikshan](https://github.com/Akil-Dikshan)

---

<p align="center">
  Made with ❤️
</p>
