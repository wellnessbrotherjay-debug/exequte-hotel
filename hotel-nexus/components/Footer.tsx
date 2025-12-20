import { Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-luxury text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      
      <div className="max-w-[1400px] mx-auto px-6 py-16 relative z-10">
        {/* Partner Logos Section */}
        <div className="mb-12 pb-12 border-b border-white/10">
          <p className="text-white/60 text-sm text-center mb-6">Trusted by leading hospitality brands</p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="px-6 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <span className="text-white/80 font-semibold">TS Suites</span>
            </div>
            <div className="px-6 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <span className="text-white/80 font-semibold">COMO Hotels</span>
            </div>
            <div className="px-6 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <span className="text-white/80 font-semibold">Marriott</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand */}
          <div>
            <h3 className="text-2xl font-cormorant font-bold mb-2 text-white">Hotel Fit Solutions</h3>
            <p className="text-luxury-gold text-xs font-semibold uppercase tracking-wider mb-4">powered by RaceFit</p>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              The All-in-One Wellness Operating System for Hotels
            </p>
            <p className="text-white/60 text-sm leading-relaxed">
              Connecting fitness, food, and operations into one intelligent platform.
            </p>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="/suite" className="text-white/70 hover:text-white transition-colors text-sm">
                  The Suite
                </a>
              </li>
              <li>
                <a href="/tech" className="text-white/70 hover:text-white transition-colors text-sm">
                  Technology
                </a>
              </li>
              <li>
                <a href="/partners" className="text-white/70 hover:text-white transition-colors text-sm">
                  Integrations
                </a>
              </li>
              <li>
                <a href="/#pricing" className="text-white/70 hover:text-white transition-colors text-sm">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="/demo" className="text-white/70 hover:text-white transition-colors text-sm">
                  Book a Demo
                </a>
              </li>
              <li>
                <a href="/#contact" className="text-white/70 hover:text-white transition-colors text-sm">
                  Contact Sales
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  Press Kit
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="space-y-3 mb-6">
              <p className="text-white/70 text-sm">
                <a href="mailto:hello@hotelfitsolutions.com" className="hover:text-white transition-colors">
                  hello@hotelfitsolutions.com
                </a>
              </p>
              <p className="text-white/70 text-sm">
                Enterprise inquiries: <a href="mailto:enterprise@hotelfitsolutions.com" className="hover:text-white transition-colors">enterprise@hotelfitsolutions.com</a>
              </p>
            </div>
            <div className="flex gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Technology Badge */}
        <div className="mb-8 text-center">
          <p className="text-white/50 text-sm mb-2">Built with</p>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            <span className="text-white/60">Next.js</span>
            <span className="text-white/40">•</span>
            <span className="text-white/60">React</span>
            <span className="text-white/40">•</span>
            <span className="text-white/60">Supabase</span>
            <span className="text-white/40">•</span>
            <span className="text-white/60">Vercel</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Hotel Fit Solutions. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
              Careers
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
