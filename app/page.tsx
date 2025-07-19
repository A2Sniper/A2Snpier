'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Shield, Target, Users, Star, Check, ArrowRight, Play, ExternalLink } from 'lucide-react';
import { pricingPlans } from '@/lib/mock-data';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthModal } from '@/components/ui/auth-modal';
import { CandlestickAnimation } from '@/components/ui/candlestick-animation';
import { useAppStore } from '@/lib/store';

export default function HomePage() {
  const router = useRouter();
  const { setUser, setAuthenticated } = useAppStore();
  const [selectedPlan, setSelectedPlan] = useState(1);
  const [showDemo, setShowDemo] = useState(false);
  const [email, setEmail] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Signaux IA en temps réel",
      description: "Algorithmes d'apprentissage automatique analysant les marchés 24/7"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "90% de précision",
      description: "Taux de réussite confirmé par des milliers de trades"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Gestion des risques",
      description: "Stratégies optimisées pour protéger votre capital"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Communauté VIP",
      description: "Rejoignez plus de 10,000 traders actifs"
    }
  ];

  const testimonials = [
    {
      name: "Marc Dubois",
      role: "Trader Professionnel",
      avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150",
      content: "J'ai doublé mon capital en 3 mois avec A2Sniper. Les signaux sont d'une précision remarquable.",
      rating: 5
    },
    {
      name: "Sarah Martin",
      role: "Investisseuse",
      avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
      content: "Interface intuitive et résultats exceptionnels. Je recommande vivement cette plateforme.",
      rating: 5
    },
    {
      name: "Thomas Bernard",
      role: "Day Trader",
      avatar: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150",
      content: "Les signaux arrivent au bon moment avec une précision incroyable. Parfait pour le trading rapide.",
      rating: 5
    }
  ];

  const stats = [
    { value: "90%", label: "Taux de réussite" },
    { value: "50+", label: "Signaux par jour" },
    { value: "10K+", label: "Traders actifs" },
    { value: "24/7", label: "Surveillance marché" }
  ];

  const handleStartDemo = useCallback(() => {
    setShowDemo(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  }, []);

  const handleSubscribeNewsletter = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = `Merci ${email} ! Vous êtes maintenant inscrit à notre newsletter.`;
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);
      setEmail('');
    }
  }, [email]);

  const handleSelectPlan = useCallback((planIndex: number) => {
    setSelectedPlan(planIndex);
    router.push(`/pricing?plan=${planIndex}`);
  }, [router]);

  const handleAuth = (user: any) => {
    setUser(user);
    setAuthenticated(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <CandlestickAnimation />
      
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm sticky top-0 z-40 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">A2Sniper</h1>
                <p className="text-xs text-blue-400">AI Trading Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Connexion
              </button>
              <Link 
                href="/dashboard" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Trading Algorithmique
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                  Propulsé par l'IA
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Générez des profits constants avec nos signaux de trading alimentés par l'intelligence artificielle. 
                90% de précision, signaux temps réel, communauté VIP.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
                >
                  Commencer maintenant
                </button>
                <button 
                  onClick={handleStartDemo}
                  disabled={showDemo}
                  className="border-2 border-blue-500 text-blue-400 px-8 py-4 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  {showDemo ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                      <span>Chargement...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      <span>Voir la démo</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Pourquoi choisir A2Sniper ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une plateforme complète pour optimiser vos trades avec l'intelligence artificielle
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card text-card-foreground border border-border p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Choisissez votre plan
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des plans adaptés à tous les niveaux de trading
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative bg-card text-card-foreground p-8 rounded-xl shadow-lg hover:shadow-xl transition-all ${
                  plan.popular ? 'border-2 border-primary scale-105' : 'border border-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Plus populaire
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-foreground mb-1">
                    ${plan.price}
                    <span className="text-lg font-normal text-muted-foreground">/mois</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-400" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleSelectPlan(index)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  Choisir ce plan
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ce que disent nos traders
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Plus de 10,000 traders nous font confiance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card text-card-foreground border border-border p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Prêt à révolutionner votre trading ?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de traders qui génèrent des profits constants avec A2Sniper
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg"
              >
                <span>Commencer maintenant</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link 
                href="/telegram" 
                className="inline-flex items-center space-x-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
              >
                <span>Bot Telegram</span>
                <ExternalLink className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 text-foreground py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Newsletter */}
          <div className="mb-12 text-center">
            <h3 className="text-2xl font-bold mb-4">Restez informé</h3>
            <p className="text-muted-foreground mb-6">Recevez nos dernières analyses et signaux directement dans votre boîte mail</p>
            <form onSubmit={handleSubscribeNewsletter} className="max-w-md mx-auto flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                className="flex-1 px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                S'inscrire
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">A2Sniper</span>
              </div>
              <p className="text-muted-foreground">
                Plateforme de trading algorithmique propulsée par l'IA
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                <li><Link href="/signals" className="hover:text-foreground transition-colors">Signaux</Link></li>
                <li><Link href="/performance" className="hover:text-foreground transition-colors">Performance</Link></li>
                <li><Link href="/analytics" className="hover:text-foreground transition-colors">Analytics</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="mailto:support@a2sniper.ai" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><Link href="/telegram" className="hover:text-foreground transition-colors">Bot Telegram</Link></li>
                <li><a href="mailto:support@a2sniper.ai" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><Link href="/telegram" className="hover:text-foreground transition-colors">Communauté</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Conditions</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Avertissement risques</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 A2Sniper. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuth={handleAuth}
      />
    </div>
  );
}