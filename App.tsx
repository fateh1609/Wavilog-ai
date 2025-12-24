
import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import WhatsAppWidget from './components/WhatsAppWidget';
import HeroBackground from './components/HeroBackground';
import CookieBanner from './components/CookieBanner';

// Custom Hook for Scroll Animations
const useScrollReveal = () => {
  const revealRefs = useRef<HTMLElement[]>([]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.1 });

    revealRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return { addToRefs };
};

const App: React.FC = () => {
  const { addToRefs } = useScrollReveal();
  const gapSectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  
  const [parallaxY, setParallaxY] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    // Initialize Lenis for smooth momentum scrolling
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const checkScrollState = () => {
      // Parallax for Gap Section
      if (gapSectionRef.current) {
        const rect = gapSectionRef.current.getBoundingClientRect();
        const speed = 0.3;
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setParallaxY(rect.top * speed);
        }
      }

      // Detect if scrolled past Hero for WhatsApp Widget
      if (heroRef.current) {
        const heroRect = heroRef.current.getBoundingClientRect();
        // The widget appears as soon as the bottom of the hero reaches the top of the viewport
        setScrolledPastHero(heroRect.bottom < 50);
      }
    };

    lenis.on('scroll', checkScrollState);

    const handleLoad = () => {
      setIsFullyLoaded(true);
      checkScrollState();
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    const safetyTimer = setTimeout(() => {
      setIsFullyLoaded(true);
      checkScrollState();
    }, 5000);

    return () => {
      lenis.destroy();
      window.removeEventListener('load', handleLoad);
      clearTimeout(safetyTimer);
    };
  }, []);

  useEffect(() => {
    if (isRevealed) {
      const initialCheck = () => {
        if (heroRef.current) {
          const heroRect = heroRef.current.getBoundingClientRect();
          setScrolledPastHero(heroRect.bottom < 50);
        }
      };
      initialCheck();
    }
  }, [isRevealed]);

  return (
    <div className="relative min-h-screen">
      <Loader 
        triggerExit={isFullyLoaded}
        onRevealStart={() => setIsRevealed(true)} 
      />
      
      <CookieBanner />

      <div className={`transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isRevealed ? 'opacity-100 scale-100 blur-0 translate-y-0' : 'opacity-0 scale-[0.98] blur-xl translate-y-10'
      }`}>
        <Navbar />
        
        <WhatsAppWidget isVisible={scrolledPastHero} />

        <main>
          {/* --- Section 1: Hero --- */}
          <section ref={heroRef} aria-labelledby="hero-title" className="relative pt-32 pb-20 px-6 min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
            <HeroBackground />
            
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full -z-10" aria-hidden="true"></div>
            
            <div ref={addToRefs} className="relative z-10 opacity-0 translate-y-10 transition-all duration-1000">
              <span className="inline-block px-4 py-1.5 rounded-full glass border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-6">
                Future-Proof Your Business
              </span>
              <h1 id="hero-title" className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter">
                Your Business, <br />
                <span className="text-gradient">Powered by AI</span>
              </h1>
              <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl mb-10 leading-relaxed font-medium">
                Wavilog bridges the gap between businesses and customers with ultra-fast, 
                SEO-optimized websites and custom AI agents that scale while you sleep.
              </p>
              <nav className="flex flex-col sm:flex-row gap-4 justify-center" aria-label="Hero Actions">
                <a 
                  href="https://wa.me/447577254566?text=Hey%20Wavilog%20I%20need%20Help!"
                  className="px-10 py-5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-2xl text-lg transition-all shadow-[0_0_40px_rgba(0,255,255,0.4)] hover:scale-105 active:scale-95"
                  aria-label="Start conversation with Wavilog via WhatsApp"
                >
                  Get Started via WhatsApp
                </a>
                <a href="#agents" className="px-10 py-5 glass border border-white/10 hover:border-white/20 text-white font-bold rounded-2xl text-lg transition-all">
                  Explore AI Agents
                </a>
              </nav>
            </div>
          </section>

          {/* --- Section 2: Visibility Engine --- */}
          <section ref={gapSectionRef} aria-labelledby="gap-title" className="relative py-24 px-6 bg-[#080808] overflow-hidden" id="services">
            <div 
              className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none transition-transform duration-75 ease-out"
              style={{ transform: `translateY(${parallaxY}px)` }}
              aria-hidden="true"
            ></div>
            <div 
              className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none transition-transform duration-75 ease-out"
              style={{ transform: `translateY(${-parallaxY * 0.5}px)` }}
              aria-hidden="true"
            ></div>

            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
              <div ref={addToRefs} className="opacity-0 translate-y-10 transition-all duration-1000 delay-100">
                <h2 id="gap-title" className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                  Dominating <span className="text-cyan-400 underline decoration-cyan-400/30">Google Rankings</span> with AI Speed.
                </h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  In a mobile-first world, visibility is everything. Wavilog moves your business to the forefront using clean, ultra-high-performance architecture that is highly SEO compliant.
                </p>
                <div className="space-y-6">
                  {[
                    { title: "Technical SEO Excellence", desc: "Advanced semantic markup and schema.org integration." },
                    { title: "Ultra-Low Latency", desc: "Server-side performance that scores 100 on Core Web Vitals." },
                    { title: "Mobile Dominance", desc: "Optimized for the modern thumb-scrolling consumer." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-12 h-12 glass rounded-xl flex items-center justify-center text-cyan-400 font-bold border border-white/5" aria-hidden="true">0{i+1}</div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{item.title}</h3>
                        <p className="text-gray-500 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div ref={addToRefs} className="opacity-0 translate-y-10 transition-all duration-1000 delay-300 relative">
                <div className="aspect-square glass rounded-[2.5rem] border border-white/10 overflow-hidden relative p-12 flex flex-col justify-end shadow-2xl">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-cyan-500/5 blur-[100px] rounded-full" aria-hidden="true"></div>
                   <div className="space-y-6 relative z-10">
                      <div className="h-4 w-1/2 bg-white/5 rounded-full"></div>
                      <div className="h-4 w-3/4 bg-cyan-400/20 rounded-full"></div>
                      <div className="h-4 w-2/3 bg-white/5 rounded-full"></div>
                      <div className="h-48 w-full glass rounded-3xl border border-cyan-400/20 flex items-center justify-center text-cyan-400 font-black text-3xl tracking-tighter shadow-[inset_0_0_20px_rgba(0,255,255,0.05)]">SEO POWERED</div>
                   </div>
                </div>
              </div>
            </div>
          </section>

          {/* --- Section 3: AI Agents --- */}
          <section className="py-24 px-6" id="agents" aria-labelledby="agents-title">
            <div className="max-w-7xl mx-auto text-center mb-16">
              <h2 id="agents-title" ref={addToRefs} className="opacity-0 translate-y-10 transition-all duration-1000 text-4xl md:text-6xl font-bold mb-6">
                Autonomous <span className="text-gradient">Workforce</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Our custom agents are built on enterprise-grade LLMs to qualify leads, handle support, and close sales without human intervention.
              </p>
            </div>
            <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Lead Qualification", desc: "Smart filtering of incoming traffic to identify hot prospects instantly.", icon: "🎯" },
                { title: "Omnichannel Nurture", desc: "Automated engagement via Email, WhatsApp, and SMS triggered by behavior.", icon: "🔄" },
                { title: "AI Voice Concierge", desc: "Human-like voice agents that book meetings directly into your CRM.", icon: "📅" }
              ].map((card, i) => (
                <article key={i} ref={addToRefs} className="opacity-0 translate-y-10 transition-all duration-1000 glass p-10 rounded-[2rem] border border-white/10 hover:border-cyan-500/40 group transition-all duration-500 hover:-translate-y-2">
                  <div className="text-5xl mb-8 transform group-hover:scale-110 transition-transform" aria-hidden="true">{card.icon}</div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors">{card.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm md:text-base">{card.desc}</p>
                </article>
              ))}
            </div>
          </section>

          {/* --- Section 4: AI Voice --- */}
          <section className="py-24 px-6 bg-cyan-950/20" aria-labelledby="voice-title">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
              <div ref={addToRefs} className="opacity-0 translate-y-10 transition-all duration-1000 md:w-1/2 order-2 md:order-1">
                 <div className="relative group cursor-pointer" aria-label="Simulated AI Voice Activity">
                   <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000" aria-hidden="true"></div>
                   <div className="relative px-8 py-20 glass rounded-[2.5rem] border border-white/10 flex items-center justify-center overflow-hidden">
                      <div className="flex gap-3">
                        {[1,2,3,4,5,4,3,2,1].map((h, i) => (
                          <div key={i} className="w-3 bg-cyan-400 rounded-full animate-pulse" style={{ height: `${h * 15}px`, animationDelay: `${i * 0.1}s` }}></div>
                        ))}
                      </div>
                   </div>
                 </div>
              </div>
              <div ref={addToRefs} className="opacity-0 translate-y-10 transition-all duration-1000 md:w-1/2 order-1 md:order-2">
                <h2 id="voice-title" className="text-4xl md:text-6xl font-bold mb-8">24/7 Human-Level <br />Voice Sales</h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  Eliminate missed calls. Wavilog AI voice agents answer every inquiry instantly with perfect brand tone and objective focus.
                </p>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-center gap-4 text-lg"><span className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold" aria-hidden="true">✓</span> Zero Latency Response</li>
                  <li className="flex items-center gap-4 text-lg"><span className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold" aria-hidden="true">✓</span> Unlimited Concurrent Calls</li>
                  <li className="flex items-center gap-4 text-lg"><span className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold" aria-hidden="true">✓</span> CRM Deep Integration</li>
                </ul>
              </div>
            </div>
          </section>

          {/* --- Section 5: Specialists --- */}
          <section className="py-24 px-6" id="specialists" aria-labelledby="specialists-title">
            <div className="max-w-7xl mx-auto">
              <h2 id="specialists-title" ref={addToRefs} className="opacity-0 translate-y-10 transition-all duration-1000 text-4xl font-bold mb-16 text-center">Niche Expert Intelligence</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { role: "Strategic Analyst", trait: "Analytical", color: "from-blue-500", icon: "📊" },
                  { role: "Legal Navigator", trait: "Compliant", color: "from-amber-500", icon: "⚖️" },
                  { role: "Growth Architect", trait: "Optimized", color: "from-cyan-500", icon: "🚀" }
                ].map((persona, i) => (
                  <article key={i} ref={addToRefs} className="opacity-0 translate-y-10 transition-all duration-1000 glass group relative overflow-hidden rounded-3xl border border-white/10 p-1 hover:border-white/20 transition-all duration-500">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${persona.color} to-transparent opacity-50`} aria-hidden="true"></div>
                    <div className="p-8">
                      <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform" aria-hidden="true">{persona.icon}</div>
                      <h3 className="text-2xl font-bold text-white mb-2">{persona.role}</h3>
                      <p className="text-cyan-400 font-mono text-sm mb-4">[{persona.trait.toUpperCase()}]</p>
                      <p className="text-gray-500 text-sm leading-relaxed">Trained on specialized industry logic to provide professional-grade interactions that maintain your brand's authority.</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* --- Section 6: Support --- */}
          <section className="py-24 px-6 bg-[#080808]" aria-labelledby="support-title">
            <div className="max-w-5xl mx-auto glass rounded-[3rem] p-12 md:p-20 text-center border border-white/10 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[120px]" aria-hidden="true"></div>
              <h2 id="support-title" ref={addToRefs} className="opacity-0 translate-y-10 transition-all duration-1000 text-4xl md:text-5xl font-bold mb-8">Intelligent Deflection</h2>
              <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
                Reduce support overhead by 80%. Our custom-trained widgets act as your 24/7 first line of defense, resolving queries using your company's actual knowledge base.
              </p>
              <div className="flex justify-center" aria-label="Interactive AI Chat Preview">
                <div className="w-full max-w-md glass rounded-[2rem] p-8 text-left border border-white/5 shadow-2xl">
                  <div className="flex gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-cyan-500 flex-shrink-0 flex items-center justify-center text-sm font-bold text-black" aria-hidden="true">U</div>
                    <div className="glass px-5 py-3 rounded-2xl text-sm text-gray-300">How do I track my order?</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex-shrink-0 flex items-center justify-center text-sm font-bold text-white" aria-hidden="true">AI</div>
                    <div className="bg-cyan-900/40 px-5 py-3 rounded-2xl text-sm text-cyan-100 border border-cyan-500/30">Hi! I've sent a real-time tracking link to your registered email. Need anything else?</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* --- Section 7: Workflows --- */}
          <section className="py-24 px-6" id="automation" aria-labelledby="workflow-title">
            <div className="max-w-7xl mx-auto text-center">
              <h2 id="workflow-title" ref={addToRefs} className="opacity-0 translate-y-10 transition-all duration-1000 text-4xl md:text-6xl font-bold mb-8">Autonomous Workflows</h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-20 text-lg">
                We design "Set and Forget" automations. From lead scraping to complex data synchronization—receive results directly where you work.
              </p>
              <div className="grid md:grid-cols-4 gap-6">
                {["Ingest", "Logic", "Action", "Report"].map((step, i) => (
                  <div key={i} className="glass p-10 rounded-[2rem] border border-white/5 flex flex-col items-center hover:border-cyan-500/20 transition-all duration-500 group">
                    <div className="w-14 h-14 rounded-full border-2 border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 font-black text-xl group-hover:bg-cyan-500 group-hover:text-black transition-all" aria-hidden="true">{i+1}</div>
                    <h3 className="font-bold text-xl tracking-tight">{step}</h3>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* --- Section 8: Control --- */}
          <section className="py-24 px-6 bg-gradient-to-b from-transparent to-cyan-950/10" aria-labelledby="control-title">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
              <div ref={addToRefs} className="opacity-0 translate-y-10 transition-all duration-1000">
                <h2 id="control-title" className="text-4xl md:text-6xl font-bold mb-10">WhatsApp as Your Command Center</h2>
                <p className="text-gray-400 text-lg mb-12 leading-relaxed">
                  Manage your entire AI workforce via the world's most popular messaging app. No complex dashboards required. Just text your agent to trigger any operation.
                </p>
                <div className="flex items-center gap-10">
                   <div className="text-center">
                      <div className="text-4xl font-black text-cyan-400 mb-1">99%</div>
                      <div className="text-xs uppercase tracking-[0.25em] text-gray-500 font-bold">Open Rate</div>
                   </div>
                   <div className="w-[1px] h-12 bg-white/10" aria-hidden="true"></div>
                   <div className="text-center">
                      <div className="text-4xl font-black text-cyan-400 mb-1">&lt;1s</div>
                      <div className="text-xs uppercase tracking-[0.25em] text-gray-500 font-bold">Latency</div>
                   </div>
                </div>
              </div>
              <div ref={addToRefs} className="opacity-0 translate-y-10 transition-all duration-1000 flex justify-center">
                 <div className="w-80 h-[560px] glass rounded-[3.5rem] border-8 border-white/5 p-5 shadow-[0_50px_100px_rgba(0,0,0,0.6)] relative overflow-hidden" role="img" aria-label="Smartphone showing WhatsApp AI interaction">
                    <div className="absolute top-0 left-0 w-full h-10 bg-white/5 flex items-center justify-center" aria-hidden="true">
                       <div className="w-16 h-1 bg-white/10 rounded-full"></div>
                    </div>
                    <div className="mt-10 space-y-5">
                       <div className="ml-auto w-3/4 bg-cyan-600 p-4 rounded-[1.25rem] rounded-tr-none text-sm font-medium shadow-lg">Run market sentiment scan</div>
                       <div className="w-3/4 glass p-4 rounded-[1.25rem] rounded-tl-none text-sm border-cyan-500/20 leading-relaxed">Scan complete. Positive trend detected in SaaS. Shall I prepare the outreach campaign?</div>
                       <div className="ml-auto w-1/4 bg-cyan-600 p-4 rounded-[1.25rem] rounded-tr-none text-sm text-center font-bold">Yes</div>
                    </div>
                    <div className="absolute bottom-8 left-0 w-full px-8">
                       <div className="h-12 bg-white/5 rounded-full border border-white/10 flex items-center px-6 text-sm text-gray-500 font-medium">Type a message...</div>
                    </div>
                 </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="py-24 px-6 bg-[#030303] border-t border-white/5" aria-labelledby="footer-heading">
          <h2 id="footer-heading" className="sr-only">Footer</h2>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-16">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center font-bold text-black text-3xl" aria-hidden="true">W</div>
                <span className="text-3xl font-black tracking-tighter">WAVILOG</span>
              </div>
              <p className="text-gray-500 max-w-xs text-base leading-relaxed">
                The next generation of business intelligence. Bridging the gap between human creativity and autonomous execution.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
              <nav aria-labelledby="footer-services">
                <h3 id="footer-services" className="font-bold mb-6 text-xs uppercase tracking-[0.3em] text-cyan-400">Services</h3>
                <ul className="text-sm text-gray-500 space-y-3 font-medium">
                  <li><a href="#services" className="hover:text-cyan-400 cursor-pointer transition-colors">SEO Performance</a></li>
                  <li><a href="#agents" className="hover:text-cyan-400 cursor-pointer transition-colors">AI Workforce</a></li>
                  <li><a href="#automation" className="hover:text-cyan-400 cursor-pointer transition-colors">Workflow Sync</a></li>
                </ul>
              </nav>
              <nav aria-labelledby="footer-company">
                <h3 id="footer-company" className="font-bold mb-6 text-xs uppercase tracking-[0.3em] text-cyan-400">Company</h3>
                <ul className="text-sm text-gray-500 space-y-3 font-medium">
                  <li><a href="#" className="hover:text-cyan-400 cursor-pointer transition-colors">About Wavilog</a></li>
                  <li><a href="#" className="hover:text-cyan-400 cursor-pointer transition-colors">Our Ethos</a></li>
                  <li><a href="https://wa.me/447577254566" className="hover:text-cyan-400 cursor-pointer transition-colors">Contact Support</a></li>
                </ul>
              </nav>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between text-xs text-gray-600 font-medium">
            <p>© 2025 Wavilog. Built for high performance.</p>
            <nav className="flex gap-10 mt-6 sm:mt-0" aria-label="Legal Links">
              <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
