'use client';

import Link from 'next/link';
import { Gem, Sparkles, Palette, Download, Shield, ArrowRight, Star } from 'lucide-react';
import { UserMenu } from '@/components/layout';

export default function Home() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-navy text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gem className="w-8 h-8 text-gold" />
            <h1 className="text-xl font-serif font-semibold">AI Jewelry Designer</h1>
          </div>
          <UserMenu />
        </div>
      </header>

      {/* Hero Section */}
      <section id="main-content" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy/5 via-transparent to-gold/10" />
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Jewelry Design
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-navy mb-6 leading-tight">
              Transform Your Vision Into
              <span className="block text-gold">Stunning Jewelry Designs</span>
            </h2>
            <p className="text-lg md:text-xl text-slate max-w-2xl mx-auto mb-8">
              Describe your dream jewelry piece and watch AI bring it to life.
              Create unique rings, necklaces, and more in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/design/create"
                className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
              >
                Start Designing
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/auth/sign-up"
                className="btn-secondary inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
              >
                Create Free Account
              </Link>
            </div>
          </div>

          {/* Sample Designs Showcase */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { color: 'from-blue-500 to-blue-600', gem: 'Sapphire Ring' },
              { color: 'from-red-500 to-pink-600', gem: 'Ruby Pendant' },
              { color: 'from-emerald-500 to-green-600', gem: 'Emerald Earrings' },
              { color: 'from-purple-500 to-violet-600', gem: 'Amethyst Bracelet' },
            ].map((item, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-gradient-to-br shadow-lg overflow-hidden group cursor-pointer transition-transform hover:scale-105"
                style={{ background: `linear-gradient(135deg, var(--color-cream), var(--color-light-gray))` }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} opacity-80 group-hover:opacity-100 transition-opacity shadow-lg`} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-medium">{item.gem}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-4">
              Design Jewelry Like Never Before
            </h3>
            <p className="text-slate max-w-2xl mx-auto">
              Our AI understands your vision and creates stunning, photorealistic jewelry concepts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-gold" />
              </div>
              <h4 className="text-xl font-serif font-semibold text-navy mb-2">
                Describe Your Vision
              </h4>
              <p className="text-slate">
                Tell us about your gem, preferred style, and design ideas. Our AI understands natural language.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-gold" />
              </div>
              <h4 className="text-xl font-serif font-semibold text-navy mb-2">
                AI Creates Designs
              </h4>
              <p className="text-slate">
                Advanced AI generates multiple unique jewelry concepts based on your specifications.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-gold" />
              </div>
              <h4 className="text-xl font-serif font-semibold text-navy mb-2">
                Refine & Download
              </h4>
              <p className="text-slate">
                Iterate on your favorite designs, refine the details, and download high-resolution images.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-navy text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                Why Choose AI Jewelry Designer?
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Star className="w-4 h-4 text-navy" />
                  </div>
                  <div>
                    <h5 className="font-semibold mb-1">Unlimited Creative Possibilities</h5>
                    <p className="text-white/70">Generate as many design variations as you need until you find the perfect one.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Star className="w-4 h-4 text-navy" />
                  </div>
                  <div>
                    <h5 className="font-semibold mb-1">Save Time & Money</h5>
                    <p className="text-white/70">See your ideas visualized instantly without expensive prototype costs.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Star className="w-4 h-4 text-navy" />
                  </div>
                  <div>
                    <h5 className="font-semibold mb-1">Work With Any Gemstone</h5>
                    <p className="text-white/70">From diamonds to sapphires, rubies to emeralds - design with any stone.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="w-4 h-4 text-navy" />
                  </div>
                  <div>
                    <h5 className="font-semibold mb-1">Your Designs, Your Privacy</h5>
                    <p className="text-white/70">All your designs are saved securely and private to your account.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                <Gem className="w-32 h-32 text-gold/50" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white text-navy p-4 rounded-xl shadow-xl">
                <p className="text-2xl font-bold">1000+</p>
                <p className="text-sm text-slate">Designs Created</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-4">
            Ready to Design Your Dream Jewelry?
          </h3>
          <p className="text-lg text-slate mb-8">
            Start creating stunning jewelry designs in minutes. No design experience required.
          </p>
          <Link
            href="/design/create"
            className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-10 py-4"
          >
            <Gem className="w-5 h-5" />
            Start Designing Now
          </Link>
          <p className="text-sm text-slate mt-4">
            Free to try • No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Gem className="w-6 h-6 text-gold" />
              <span className="font-serif font-semibold">AI Jewelry Designer</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/70">
              <Link href="/design/create" className="hover:text-white transition-colors">
                Create Design
              </Link>
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/settings" className="hover:text-white transition-colors">
                Settings
              </Link>
            </div>
            <p className="text-sm text-white/50">
              © 2026 AI Jewelry Designer
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
