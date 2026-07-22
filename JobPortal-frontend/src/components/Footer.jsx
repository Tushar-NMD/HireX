import { Briefcase, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    'For Candidates': ['Browse Jobs', 'Browse Categories', 'Candidate Dashboard', 'Saved Jobs', 'Apply Job'],
    'For Employers': ['Post a Job', 'Browse Candidates', 'Employer Dashboard', 'Applications', 'Pricing'],
    'About Us': ['About Company', 'Contact Us', 'Terms & Conditions', 'Privacy Policy', 'FAQs'],
    'Support': ['Help Center', 'Career Advice', 'Support Portal', 'Community', 'Resources'],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:text-amber-400' },
    { icon: Twitter, href: '#', color: 'hover:text-amber-300' },
    { icon: Linkedin, href: '#', color: 'hover:text-amber-400' },
    { icon: Instagram, href: '#', color: 'hover:text-amber-300' },
  ];

  return (
    <footer className="relative border-t border-white/10 home-glass mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-amber-400/90 to-amber-700/90 p-2 rounded-lg border border-amber-400/20">
                <Briefcase className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-bold home-gold-text tracking-wide">HireX</span>
            </div>
            <p className="text-zinc-400 mb-6 leading-relaxed">
              Your gateway to thousands of job opportunities. Connect with top employers and build your dream career.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-zinc-400">
                <Phone className="w-4 h-4 text-amber-500" />
                <span>1234567890</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-zinc-400">
                <Mail className="w-4 h-4 text-amber-500" />
                <span>contact@jobportal.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-zinc-400">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>Ayodhya Ram ki nagri (UP)</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-semibold mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-zinc-500 hover:text-amber-300 transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-zinc-500 text-sm">Get the latest job updates and career tips delivered to your inbox.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:border-amber-500/50 text-zinc-200 placeholder-zinc-600 transition-colors"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-700 text-black rounded-lg font-semibold hover:shadow-[0_0_24px_rgba(212,175,55,0.3)] hover:scale-105 transition-all duration-300 border border-amber-400/30">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-zinc-500">
              © 2025 HireX. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`text-zinc-500 ${social.color} transition-all duration-300 hover:scale-110`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
