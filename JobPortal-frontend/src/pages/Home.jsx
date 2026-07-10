import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <Navbar />
 <ChatBot />
            {/* Hero Section */}
            <section id="home" className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-6 animate-fade-in">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-gray-700">Over 1000+ new jobs posted today</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 animate-slide-up">
                            Find Your{' '}
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Dream Job
                            </span>
                            <br />
                            Today
                        </h1>

                        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto animate-slide-up animation-delay-200">
                            Discover thousands of job opportunities with all the information you need.
                            It's your future. Come find it.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-4 animate-slide-up animation-delay-400">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-xl">
                                    <Search className="w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Job title, keywords, or company"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                                    />
                                </div>
                                <div className="flex-1 flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-xl">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="City or remote"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                                    />
                                </div>
                                <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                                    <span>Search Jobs</span>
                                    {/* <ArrowRight className="w-5 h-5" /> */}
                                </button>
                            </div>
                        </div>

                        <p className="text-sm text-gray-500 mt-6">
                            Popular searches: Designer, Developer, Manager, Marketing, Sales
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className={`inline-flex p-3 bg-gradient-to-r ${stat.color} rounded-xl mb-4`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                                <p className="text-gray-600">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50"></div>

                <div className="relative max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full mb-6 animate-fade-in">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">Choose Your Plan</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Flexible{' '}
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Pricing Plans
                            </span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Choose the perfect plan for your job search journey. Upgrade or downgrade anytime.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
                        {pricingPlans.map((plan, index) => (
                            <div
                                key={index}
                                className={`relative bg-white rounded-3xl shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl animate-fade-in ${plan.popular ? 'ring-4 ring-blue-500 scale-105 md:scale-110' : ''
                                    }`}
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-2">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span>Most Popular</span>
                                        </div>
                                    </div>
                                )}

                                <div className="p-8">
                                    {/* Icon */}
                                    <div className={`inline-flex p-4 bg-gradient-to-r ${plan.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <plan.icon className="w-8 h-8 text-white" />
                                    </div>

                                    {/* Plan Name */}
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                    <p className="text-gray-600 mb-6">{plan.description}</p>

                                    {/* Price */}
                                    <div className="mb-8">
                                        <div className="flex items-baseline">
                                            <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                                            <span className="text-gray-600 ml-2">/{plan.period}</span>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => navigate('/auth')}
                                        className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl mb-8 ${plan.popular
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                            }`}
                                    >
                                        {plan.price === '$0' ? 'Get Started Free' : 'Start Free Trial'}
                                    </button>

                                    {/* Features List */}
                                    <div className="space-y-4">
                                        <p className="text-sm font-semibold text-gray-900 mb-4">What's included:</p>
                                        {plan.features.map((feature, featureIndex) => (
                                            <div
                                                key={featureIndex}
                                                className="flex items-start space-x-3"
                                            >
                                                {feature.included ? (
                                                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                                        <Check className="w-3 h-3 text-green-600" />
                                                    </div>
                                                ) : (
                                                    <div className="flex-shrink-0 w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center mt-0.5">
                                                        <X className="w-3 h-3 text-gray-400" />
                                                    </div>
                                                )}
                                                <span
                                                    className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'
                                                        }`}
                                                >
                                                    {feature.text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Decorative gradient border */}
                                {plan.popular && (
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Additional Info */}
                    <div className="mt-16 text-center">
                        <p className="text-gray-600 mb-4">
                            All plans include a 14-day free trial. No credit card required.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Cancel anytime</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Secure payment</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Money-back guarantee</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-600">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Why Choose JobPortal?
                        </h2>
                        <p className="text-blue-100 text-lg">Everything you need to find your perfect job</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className={`inline-flex p-4 bg-gradient-to-r ${feature.color} rounded-xl mb-6`}>
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                                <p className="text-blue-100">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full mb-6 animate-fade-in">
                            <HiSparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">Success Stories</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            What Our{' '}
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Users Say
                            </span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Real success stories from job seekers who found their dream careers
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group animate-fade-in"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                {/* Quote Icon */}
                                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FaQuoteLeft className="w-12 h-12 text-blue-600" />
                                </div>

                                {/* Rating Stars */}
                                <div className="flex items-center mb-6 space-x-1">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <BsFillStarFill key={i} className="w-5 h-5 text-yellow-400" />
                                    ))}
                                </div>

                                {/* Testimonial Text */}
                                <p className="text-gray-700 mb-8 text-base leading-relaxed relative z-10">
                                    "{testimonial.text}"
                                </p>

                                {/* User Info */}
                                <div className="flex items-center space-x-4 pt-6 border-t border-gray-100">
                                    {/* Avatar with Icon */}
                                    <div className={`relative flex-shrink-0 w-14 h-14 bg-gradient-to-r ${testimonial.iconColor} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <testimonial.icon className="w-7 h-7 text-white" />
                                        {/* Online indicator */}
                                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                    </div>

                                    {/* User Details */}
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-600 font-medium">{testimonial.role}</p>
                                        <p className="text-xs text-gray-500">{testimonial.company}</p>
                                    </div>
                                </div>

                                {/* Hover gradient effect */}
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                        ))}
                    </div>

                    {/* Trust Badge */}
                    <div className="mt-16 text-center">
                        <p className="text-gray-600 text-lg font-medium mb-4">
                            Join 2M+ professionals who trust JobPortal
                        </p>
                        <div className="flex justify-center items-center space-x-2">
                            {[...Array(5)].map((_, i) => (
                                <BsFillStarFill key={i} className="w-6 h-6 text-yellow-400" />
                            ))}
                            <span className="ml-3 text-gray-700 font-semibold text-lg">4.9/5.0</span>
                            <span className="text-gray-500">from 50,000+ reviews</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Take the Next Step?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join thousands of job seekers who found their dream careers through JobPortal
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/auth')}
                            className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            Create Free Account
                        </button>
                        <button
                            onClick={() => navigate('/auth')}
                            className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
                        >
                            Post a Job
                        </button>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};
export default Home;
