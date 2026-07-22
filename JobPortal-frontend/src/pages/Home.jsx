import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBackground from '../components/PageBackground';
import ChatBot from "../components/ChatBot";
import { FaUserTie, FaUserNinja, FaUserGraduate, FaQuoteLeft } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { BsFillStarFill } from "react-icons/bs";
import authService from '../services/authService';

import {
    Search, MapPin, Briefcase, TrendingUp, Users, Building2,
    CheckCircle, ArrowRight, Star, Zap, Shield, Clock, Check, X, Crown, Sparkles
} from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');

    // Check if user is already logged in and redirect to dashboard
    useEffect(() => {
        const token = authService.getToken();
        const userData = authService.getUserData();
        
        if (token && userData) {
            // Redirect based on role
            if (userData.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                // For employees/users (role: 'employee' or 'user')
                navigate('/employee/jobs');
            }
        }
    }, [navigate]);

    const stats = [
        { icon: Briefcase, value: '50,000+', label: 'Jobs Available', color: 'from-blue-500 to-blue-600' },
        { icon: Building2, value: '10,000+', label: 'Companies', color: 'from-purple-500 to-purple-600' },
        { icon: Users, value: '2M+', label: 'Candidates', color: 'from-pink-500 to-pink-600' },
        { icon: CheckCircle, value: '100K+', label: 'Jobs Filled', color: 'from-green-500 to-green-600' },
    ];

    const pricingPlans = [
        {
            name: 'Free',
            price: '$0',
            period: 'forever',
            description: 'Perfect for getting started',
            icon: Briefcase,
            color: 'from-gray-400 to-gray-500',
            popular: false,
            features: [
                { text: 'Browse all jobs', included: true },
                { text: 'Apply to 5 jobs/month', included: true },
                { text: 'Basic profile', included: true },
                { text: 'Email notifications', included: true },
                { text: 'Priority support', included: false },
                { text: 'Resume builder', included: false },
                { text: 'Profile analytics', included: false },
                { text: 'Featured profile', included: false },
            ],
        },
        {
            name: 'Professional',
            price: '$29',
            period: 'per month',
            description: 'Best for active job seekers',
            icon: Zap,
            color: 'from-blue-500 to-purple-600',
            popular: true,
            features: [
                { text: 'Browse all jobs', included: true },
                { text: 'Unlimited applications', included: true },
                { text: 'Advanced profile', included: true },
                { text: 'Email & SMS notifications', included: true },
                { text: 'Priority support', included: true },
                { text: 'Resume builder', included: true },
                { text: 'Profile analytics', included: true },
                { text: 'Featured profile', included: false },
            ],
        },
        {
            name: 'Premium',
            price: '$79',
            period: 'per month',
            description: 'For serious professionals',
            icon: Crown,
            color: 'from-yellow-500 to-orange-500',
            popular: false,
            features: [
                { text: 'Browse all jobs', included: true },
                { text: 'Unlimited applications', included: true },
                { text: 'Premium profile', included: true },
                { text: 'All notifications', included: true },
                { text: 'VIP support 24/7', included: true },
                { text: 'Advanced resume builder', included: true },
                { text: 'Detailed analytics', included: true },
                { text: 'Featured profile', included: true },
            ],
        },
    ];

    const features = [
        {
            icon: Zap,
            title: 'Quick Apply',
            description: 'Apply to multiple jobs with one click using your saved profile.',
            color: 'from-yellow-500 to-orange-500',
        },
        {
            icon: Shield,
            title: 'Verified Companies',
            description: 'All companies are verified to ensure legitimate job opportunities.',
            color: 'from-green-500 to-emerald-500',
        },
        {
            icon: Clock,
            title: 'Real-time Updates',
            description: 'Get instant notifications about new jobs matching your profile.',
            color: 'from-blue-500 to-cyan-500',
        },
    ];

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Software Engineer',
            company: 'Tech Corp',
            icon: FaUserNinja,
            iconColor: 'from-blue-500 to-cyan-500',
            rating: 5,
            text: 'Found my dream job within 2 weeks! The platform is incredibly easy to use.',
        },
        {
            name: 'Michael Chen',
            role: 'Marketing Manager',
            company: 'Digital Agency',
            icon: FaUserTie,
            iconColor: 'from-purple-500 to-pink-500',
            rating: 5,
            text: 'Best job portal I\'ve used. The job recommendations were spot on!',
        },
        {
            name: 'Emily Davis',
            role: 'UX Designer',
            company: 'Creative Studio',
            icon: FaUserGraduate,
            iconColor: 'from-orange-500 to-red-500',
            rating: 5,
            text: 'Professional interface and great support. Highly recommended!',
        },
    ];

    return (
        <PageBackground>
            <Navbar variant="floating" />
            <ChatBot />
            {/* Hero Section */}
            <section id="home" className="relative pt-36 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="relative max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        {/* Left Side Content */}
                        <div className="lg:col-span-7 text-left">
                            <div className="inline-flex items-center space-x-2 home-glass px-5 py-2.5 rounded-full mb-8 animate-fade-in">
                                <TrendingUp className="w-4 h-4 text-amber-400" />
                                <span className="text-sm font-medium text-zinc-300">Over 1000+ new jobs posted today</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up tracking-tight leading-none">
                                <span className="inline-block py-2">Elevate Your </span>
                                <br className="sm:hidden" />
                                <span className="relative inline-block overflow-hidden h-[1.15em] align-bottom py-2">
                                    <span className="inline-flex flex-col animate-[word-scroll_10s_infinite] text-left">
                                        <span className="home-gold-text">Career</span>
                                        <span className="home-gold-text">Talent</span>
                                        <span className="home-gold-text">Future</span>
                                        <span className="home-gold-text">Legacy</span>
                                        <span className="home-gold-text">Career</span>
                                    </span>
                                </span>
                                <br />
                                <span className="inline-block py-2">Today</span>
                            </h1>

                            <p className="text-xl text-zinc-400 mb-3 animate-slide-up animation-delay-200 leading-relaxed max-w-xl">
                                Discover thousands of job opportunities with all the information you need.
                                It's your future. Come find it.
                            </p>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-zinc-500 mt-2 animate-slide-up animation-delay-200">
                                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-amber-500" /> Verified Companies</span>
                                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-amber-500" /> Real-time Updates</span>
                                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-amber-500" /> AI-Matching</span>
                            </div>
                        </div>

                        {/* Right Side Search Bar Container */}
                        <div className="lg:col-span-5 animate-slide-up animation-delay-400">
                            <div className="home-glass-strong rounded-3xl p-6 md:p-8 border border-amber-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                                <div className="flex items-center space-x-2 mb-6">
                                    <Sparkles className="w-5 h-5 text-amber-400" />
                                    <h3 className="text-2xl font-bold text-white">Quick Search</h3>
                                </div>
                                <div className="flex flex-col gap-5">
                                    <div className="flex items-center space-x-3 px-4 py-3 bg-black/40 rounded-xl border border-white/5 focus-within:border-amber-500/50 transition-all">
                                        <Search className="w-5 h-5 text-amber-500/70" />
                                        <input
                                            type="text"
                                            placeholder="Job title, keywords, or company"
                                            value={searchQuery}
                                            onFocus={() => navigate('/auth')}
                                            onChange={() => navigate('/auth')}
                                            className="flex-1 bg-transparent outline-none text-zinc-200 placeholder-zinc-500"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-3 px-4 py-3 bg-black/40 rounded-xl border border-white/5 focus-within:border-amber-500/50 transition-all">
                                        <MapPin className="w-5 h-5 text-amber-500/70" />
                                        <input
                                            type="text"
                                            placeholder="City or remote"
                                            value={location}
                                            onFocus={() => navigate('/auth')}
                                            onChange={() => navigate('/auth')}
                                            className="flex-1 bg-transparent outline-none text-zinc-200 placeholder-zinc-500"
                                        />
                                    </div>
                                    <button 
                                        onClick={() => navigate('/auth')}
                                        className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-700 text-black rounded-xl font-semibold hover:shadow-[0_0_30px_rgba(212,175,55,0.35)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 border border-amber-400/30 cursor-pointer"
                                    >
                                        <span>Search Jobs</span>
                                    </button>
                                </div>
                                <p className="text-xs text-zinc-500 mt-4 text-center">
                                    Popular searches: Designer, Developer, Manager, Marketing
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="text-center p-6 home-glass rounded-2xl hover:border-amber-500/20 transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="inline-flex p-3 bg-gradient-to-r from-amber-500/80 to-amber-700/80 rounded-xl mb-4 border border-amber-400/20">
                                    <stat.icon className="w-6 h-6 text-black" />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                                <p className="text-zinc-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="relative max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-2 home-glass px-4 py-2 rounded-full mb-6 animate-fade-in border-amber-500/20">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-medium text-zinc-300">Choose Your Plan</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Flexible{' '}
                            <span className="home-gold-text">
                                Pricing Plans
                            </span>
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            Choose the perfect plan for your job search journey. Upgrade or downgrade anytime.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
                        {pricingPlans.map((plan, index) => (
                            <div
                                key={index}
                                className={`relative home-glass rounded-3xl transition-all duration-500 hover:-translate-y-3 hover:border-amber-500/25 animate-fade-in ${plan.popular ? 'home-glass-strong ring-1 ring-amber-500/40 scale-105 md:scale-110' : ''
                                    }`}
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-gradient-to-r from-amber-500 to-amber-700 text-black px-6 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-2 border border-amber-400/30">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span>Most Popular</span>
                                        </div>
                                    </div>
                                )}

                                <div className="p-8">
                                    {/* Icon */}
                                    <div className={`inline-flex p-4 rounded-2xl mb-6 transition-transform duration-300 ${
                                        plan.popular
                                            ? 'bg-gradient-to-r from-amber-500/90 to-amber-700/90 border border-amber-400/20'
                                            : 'bg-white/5 border border-white/10'
                                    }`}>
                                        <plan.icon className={`w-8 h-8 ${plan.popular ? 'text-black' : 'text-amber-400'}`} />
                                    </div>

                                    {/* Plan Name */}
                                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                    <p className="text-zinc-400 mb-6">{plan.description}</p>

                                    {/* Price */}
                                    <div className="mb-8">
                                        <div className="flex items-baseline">
                                            <span className="text-5xl font-bold home-gold-text">{plan.price}</span>
                                            <span className="text-zinc-500 ml-2">/{plan.period}</span>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => navigate('/auth')}
                                        className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 mb-8 ${plan.popular
                                            ? 'bg-gradient-to-r from-amber-500 to-amber-700 text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] border border-amber-400/30'
                                            : 'bg-white/5 text-zinc-200 hover:bg-white/10 border border-white/10'
                                            }`}
                                    >
                                        {plan.price === '$0' ? 'Get Started Free' : 'Start Free Trial'}
                                    </button>

                                    {/* Features List */}
                                    <div className="space-y-4">
                                        <p className="text-sm font-semibold text-zinc-300 mb-4">What's included:</p>
                                        {plan.features.map((feature, featureIndex) => (
                                            <div
                                                key={featureIndex}
                                                className="flex items-start space-x-3"
                                            >
                                                {feature.included ? (
                                                    <div className="flex-shrink-0 w-5 h-5 bg-amber-500/15 rounded-full flex items-center justify-center mt-0.5 border border-amber-500/30">
                                                        <Check className="w-3 h-3 text-amber-400" />
                                                    </div>
                                                ) : (
                                                    <div className="flex-shrink-0 w-5 h-5 bg-white/5 rounded-full flex items-center justify-center mt-0.5 border border-white/10">
                                                        <X className="w-3 h-3 text-zinc-600" />
                                                    </div>
                                                )}
                                                <span
                                                    className={`text-sm ${feature.included ? 'text-zinc-300' : 'text-zinc-600'
                                                        }`}
                                                >
                                                    {feature.text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Additional Info */}
                    <div className="mt-16 text-center">
                        <p className="text-zinc-400 mb-4">
                            All plans include a 14-day free trial. No credit card required.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-500">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-amber-500" />
                                <span>Cancel anytime</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-amber-500" />
                                <span>Secure payment</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-amber-500" />
                                <span>Money-back guarantee</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto home-glass-strong rounded-3xl p-10 md:p-14 border border-amber-500/10">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Why Choose <span className="home-gold-text">JobPortal</span>?
                        </h2>
                        <p className="text-zinc-400 text-lg">Everything you need to find your perfect job</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="home-glass p-8 rounded-2xl hover:border-amber-500/20 transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className="inline-flex p-4 bg-gradient-to-r from-amber-500/80 to-amber-700/80 rounded-xl mb-6 border border-amber-400/20">
                                    <feature.icon className="w-8 h-8 text-black" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                                <p className="text-zinc-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-2 home-glass px-4 py-2 rounded-full mb-6 animate-fade-in">
                            <HiSparkles className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-medium text-zinc-300">Success Stories</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            What Our{' '}
                            <span className="home-gold-text">
                                Users Say
                            </span>
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            Real success stories from job seekers who found their dream careers
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="relative home-glass p-8 rounded-3xl hover:border-amber-500/20 transition-all duration-500 hover:-translate-y-3 group animate-fade-in"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                {/* Quote Icon */}
                                <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity">
                                    <FaQuoteLeft className="w-12 h-12 text-amber-500" />
                                </div>

                                {/* Rating Stars */}
                                <div className="flex items-center mb-6 space-x-1">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <BsFillStarFill key={i} className="w-5 h-5 text-amber-400" />
                                    ))}
                                </div>

                                {/* Testimonial Text */}
                                <p className="text-zinc-300 mb-8 text-base leading-relaxed relative z-10">
                                    "{testimonial.text}"
                                </p>

                                {/* User Info */}
                                <div className="flex items-center space-x-4 pt-6 border-t border-white/10">
                                    {/* Avatar with Icon */}
                                    <div className="relative flex-shrink-0 w-14 h-14 bg-gradient-to-r from-amber-500/80 to-amber-700/80 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 border border-amber-400/20">
                                        <testimonial.icon className="w-7 h-7 text-black" />
                                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-zinc-900"></div>
                                    </div>

                                    {/* User Details */}
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white text-lg">{testimonial.name}</h4>
                                        <p className="text-sm text-zinc-400 font-medium">{testimonial.role}</p>
                                        <p className="text-xs text-zinc-500">{testimonial.company}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Trust Badge */}
                    <div className="mt-16 text-center">
                        <p className="text-zinc-400 text-lg font-medium mb-4">
                            Join 2M+ professionals who trust JobPortal
                        </p>
                        <div className="flex justify-center items-center space-x-2">
                            {[...Array(5)].map((_, i) => (
                                <BsFillStarFill key={i} className="w-6 h-6 text-amber-400" />
                            ))}
                            <span className="ml-3 text-white font-semibold text-lg">4.9/5.0</span>
                            <span className="text-zinc-500">from 50,000+ reviews</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center home-glass-strong rounded-3xl p-12 md:p-16 border border-amber-500/15">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Take the <span className="home-gold-text">Next Step</span>?
                    </h2>
                    <p className="text-xl text-zinc-400 mb-8">
                        Join thousands of job seekers who found their dream careers through JobPortal
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/auth')}
                            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-700 text-black rounded-xl font-semibold hover:shadow-[0_0_30px_rgba(212,175,55,0.35)] hover:scale-105 transition-all duration-300 border border-amber-400/30"
                        >
                            Create Free Account
                        </button>
                        <button
                            onClick={() => navigate('/auth')}
                            className="px-8 py-4 bg-transparent border border-white/20 text-zinc-200 rounded-xl font-semibold hover:bg-white/5 hover:border-amber-500/30 hover:text-white transition-all duration-300"
                        >
                            Post a Job
                        </button>
                    </div>
                </div>
            </section>
            <Footer />
        </PageBackground>
    );
};
export default Home;
