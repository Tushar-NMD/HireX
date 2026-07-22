import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Briefcase } from 'lucide-react';

const Navbar = ({ variant = 'default' }) => {
  const isFloating = variant === 'floating';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/', isRoute: true },
    { name: 'Pricing', href: '#pricing', isRoute: false },
    { name: 'About', href: '/about', isRoute: true },
    { name: 'Contact', href: '#contact', isRoute: false },
  ];

  return (
    <nav
      className={`fixed z-50 transition-all duration-500 ${
        isFloating
          ? `top-4 left-0 right-0 mx-auto w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-6xl rounded-2xl home-glass home-shimmer-border ${
              isScrolled ? 'bg-black/50 shadow-[0_16px_48px_rgba(0,0,0,0.6)]' : ''
            }`
          : `top-0 left-0 right-0 ${
              isScrolled
                ? 'bg-white/95 backdrop-blur-md shadow-lg'
                : 'bg-transparent'
            }`
      }`}
    >
      <div className={isFloating ? 'px-5 sm:px-8' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
        <div className={`flex items-center justify-between ${isFloating ? 'h-16' : 'h-20'}`}>
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group cursor-pointer">
            <div className="relative">
              <div className={`absolute inset-0 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300 ${
                isFloating ? 'bg-amber-500/40' : 'bg-gradient-to-r from-blue-600 to-purple-600'
              }`}></div>
              <div className={`relative p-2 rounded-lg ${
                isFloating
                  ? 'bg-gradient-to-br from-amber-400/90 to-amber-600/90 border border-amber-300/20'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600'
              }`}>
                <Briefcase className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className={`text-2xl font-bold ${
              isFloating
                ? 'home-gold-text tracking-wide'
                : `bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${!isScrolled && 'drop-shadow-lg'}`
            }`}>
              HireX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-sm font-medium transition-all duration-300 hover:scale-110 ${
                    isFloating
                      ? 'text-zinc-300 hover:text-amber-200'
                      : isScrolled
                        ? 'text-gray-700 hover:text-blue-600'
                        : 'text-white hover:text-blue-200'
                  }`}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-300 hover:scale-110 ${
                    isFloating
                      ? 'text-zinc-300 hover:text-amber-200'
                      : isScrolled
                        ? 'text-gray-700 hover:text-blue-600'
                        : 'text-white hover:text-blue-200'
                  }`}
                >
                  {link.name}
                </a>
              )
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/auth"
              className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                isFloating
                  ? 'text-zinc-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                  : isScrolled
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white hover:bg-white/10'
              }`}
            >
              Sign In
            </Link>
            <Link 
              to="/auth"
              className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                isFloating
                  ? 'bg-gradient-to-r from-amber-500/90 to-amber-700/90 text-black font-semibold border border-amber-400/30 hover:from-amber-400 hover:to-amber-600'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
              }`}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isFloating ? 'text-zinc-300 hover:text-white' : isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? 'max-h-screen opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className={`px-4 py-6 space-y-4 ${
          isFloating
            ? 'border-t border-white/10 bg-black/40 backdrop-blur-xl rounded-b-2xl'
            : 'bg-white/95 backdrop-blur-md shadow-lg'
        }`}>
          {navLinks.map((link) => (
            link.isRoute ? (
              <Link
                key={link.name}
                to={link.href}
                className={`block font-medium transition-colors py-2 ${
                  isFloating ? 'text-zinc-300 hover:text-amber-200' : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className={`block font-medium transition-colors py-2 ${
                  isFloating ? 'text-zinc-300 hover:text-amber-200' : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
              
            )
          ))}
          <div className={`pt-4 space-y-3 border-t ${isFloating ? 'border-white/10' : 'border-gray-200'}`}>
            <Link 
              to="/auth"
              className={`block w-full px-5 py-2 text-center font-medium rounded-lg transition-colors ${
                isFloating
                  ? 'text-zinc-300 hover:bg-white/5 border border-white/10'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link 
              to="/auth"
              className={`block w-full px-5 py-2 text-center rounded-lg font-medium hover:shadow-xl transition-all ${
                isFloating
                  ? 'bg-gradient-to-r from-amber-500 to-amber-700 text-black font-semibold'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;









