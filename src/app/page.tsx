'use client';

import Link from 'next/link';
import { Gem, Sparkles, Palette, Download, Shield, ArrowRight, Star, Zap, Clock, Users, ChevronRight, CheckCircle, Heart } from 'lucide-react';
import { UserMenu } from '@/components/layout';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-[#0a0a0f] to-blue-900/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center shadow-lg shadow-gold/20">
              <Gem className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-serif font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              AI Jewelry Designer
            </span>
          </div>
          <UserMenu />
        </div>
      </header>

      {/* Hero Section */}
      <section id="main-content" className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Powered by Google Gemini AI
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                Transform Your Vision Into
              </span>
              <br />
              <span className="bg-gradient-to-r from-gold via-amber-400 to-gold bg-clip-text text-transparent">
                Stunning Jewelry
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10">
              Describe your dream jewelry piece and watch AI bring it to life.
              Create unique rings, necklaces, and more in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/design/create"
                className="group inline-flex items-center justify-center gap-2 text-lg px-8 py-4 bg-gradient-to-r from-gold to-amber-600 text-navy font-semibold rounded-xl shadow-lg shadow-gold/25 hover:shadow-gold/40 transition-all hover:scale-105"
              >
                Start Designing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center justify-center gap-2 text-lg px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-all"
              >
                Create Free Account
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-white/40 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Free to try
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Instant results
              </div>
            </div>
          </div>

          {/* Sample Designs Showcase */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop', gem: 'Diamond Ring' },
              { image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop', gem: 'Gold Necklace' },
              { image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop', gem: 'Pearl Earrings' },
              { image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&h=400&fit=crop', gem: 'Gemstone Bracelet' },
            ].map((item, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl overflow-hidden group cursor-pointer transition-all hover:scale-105 hover:-translate-y-2 shadow-xl relative border border-white/10"
              >
                <img
                  src={item.image}
                  alt={item.gem}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm font-medium">{item.gem}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-24 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm mb-4">
              Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Design Jewelry in 3 Easy Steps
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Our AI understands your vision and creates stunning, photorealistic jewelry concepts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Palette, title: 'Describe Your Vision', desc: 'Tell us about your gem, preferred style, and design ideas. Our AI understands natural language.', step: '01' },
              { icon: Sparkles, title: 'AI Creates Designs', desc: 'Advanced AI generates multiple unique jewelry concepts based on your specifications.', step: '02' },
              { icon: Download, title: 'Refine & Download', desc: 'Iterate on your favorite designs, refine the details, and download high-resolution images.', step: '03' },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/30 transition-colors">
                  <div className="text-5xl font-bold text-white/10 mb-4">{item.step}</div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-4">
                    <item.icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-white/50">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 border-t border-b border-white/10 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10,000+', label: 'Designs Created', icon: Sparkles },
              { value: '5,000+', label: 'Happy Users', icon: Users },
              { value: '<30s', label: 'Generation Time', icon: Clock },
              { value: '4.9/5', label: 'User Rating', icon: Star },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-6 h-6 text-gold mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm mb-4">
                Why AI Jewelry Designer
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                The Future of Jewelry Design is Here
              </h2>
              <p className="text-white/50 text-lg mb-8">
                Harness the power of AI to visualize your dream jewelry before committing to costly production.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Zap, title: 'Lightning Fast Results', desc: 'Get multiple design variations in under 30 seconds' },
                  { icon: Star, title: 'Unlimited Creativity', desc: 'Generate as many designs as you need until you find the perfect one' },
                  { icon: Heart, title: 'Any Gemstone, Any Style', desc: 'From diamonds to emeralds, classic to modern - design with any stone' },
                  { icon: Shield, title: 'Private & Secure', desc: 'Your designs are saved securely and private to your account' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center flex-shrink-0 group-hover:from-gold/30 group-hover:to-gold/10 transition-colors">
                      <item.icon className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-white/50">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Design Preview - Right Side */}
            <div className="relative">
              {/* Main showcase card */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-1">
                <div className="rounded-[22px] overflow-hidden bg-[#0a0a0f]">
                  <img
                    src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop"
                    alt="Stunning diamond ring design"
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/40 text-sm">AI Generated</p>
                        <p className="text-white font-semibold">Diamond Halo Ring</p>
                      </div>
                      <div className="flex items-center gap-1 text-gold">
                        <Star className="w-4 h-4 fill-gold" />
                        <span className="text-sm font-medium">4.9</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs">Round Brilliant</span>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs">Platinum</span>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs">2.5ct</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Design Saved</p>
                    <p className="text-white/50 text-xs">Just now</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-purple-500/20 to-purple-500/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">3 Variations</p>
                    <p className="text-white/50 text-xs">Ready to view</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-24 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-white mb-4">
              Loved by Designers & Jewelers
            </h2>
            <p className="text-white/50">See what our users have to say</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah M.', role: 'Jewelry Designer', text: 'This tool has revolutionized my design process. I can visualize client requests instantly before creating the actual piece.', rating: 5 },
              { name: 'Michael R.', role: 'Custom Jeweler', text: 'The AI understands exactly what I describe. My clients love seeing realistic previews of their custom orders.', rating: 5 },
              { name: 'Emma L.', role: 'Bride-to-be', text: 'I designed my dream engagement ring here! The visualization helped me communicate exactly what I wanted to my jeweler.', rating: 5 },
            ].map((testimonial, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-white/70 mb-6 italic">&quot;{testimonial.text}&quot;</p>
                <div>
                  <p className="text-white font-medium">{testimonial.name}</p>
                  <p className="text-white/40 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gold/20 via-amber-500/20 to-gold/20" />
            <div className="absolute inset-0 backdrop-blur-3xl" />
            <div className="relative p-12 md:p-16 text-center">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                Ready to Design Your Dream Jewelry?
              </h2>
              <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
                Start creating stunning jewelry designs in minutes. Join thousands of designers and jewelers already using AI Jewelry Designer.
              </p>
              <Link
                href="/design/create"
                className="group inline-flex items-center justify-center gap-2 text-lg px-10 py-4 bg-white text-navy font-semibold rounded-xl hover:bg-white/90 transition-all hover:scale-105 shadow-xl"
              >
                <Gem className="w-5 h-5" />
                Start Designing Now
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-sm text-white/50 mt-4">
                Free to try • No credit card required • Instant access
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center">
                <Gem className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif font-semibold text-white">AI Jewelry Designer</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-white/50">
              <Link href="/design/create" className="hover:text-white transition-colors">Create Design</Link>
              <Link href="/design/saved" className="hover:text-white transition-colors">My Designs</Link>
              <Link href="/auth/sign-in" className="hover:text-white transition-colors">Sign In</Link>
            </div>
            <p className="text-sm text-white/30">
              © 2026 AI Jewelry Designer
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
