import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Shield, Cloud, Lock, Star, Sparkles, Zap, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Home = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { scrollYProgress } = useScroll();
    const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.7]);

    const heroSlides = [
        {
            title: 'Secure Your Digital Life with',
            highlight: 'INFOLOCK',
            description: 'The most trusted platform for secure document storage and sharing. Military-grade encryption with effortless usability.',
            gradient: 'from-blue-600 to-purple-600',
        },
        {
            title: 'Enterprise-Grade',
            highlight: 'Security',
            description: 'End-to-end encryption with zero-knowledge architecture ensures your data remains private and secure.',
            gradient: 'from-purple-600 to-indigo-600',
        },
        {
            title: 'Access Your Files',
            highlight: 'Anywhere',
            description: 'Secure cloud infrastructure with fast, reliable access from anywhere in the world at any time.',
            gradient: 'from-indigo-600 to-blue-600',
        },
    ];

    const sliderSettings = {
        autoplaySpeed: 5000,
        totalSlides: heroSlides.length,
    };

    // Auto-advance slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, sliderSettings.autoplaySpeed);
        return () => clearInterval(interval);
    }, [heroSlides.length]);

    // Mouse tracking for interactive effects
    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', updateMousePosition);
        return () => window.removeEventListener('mousemove', updateMousePosition);
    }, []);

    // Close login modal with ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') setShowLogin(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    // Form submission handler
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        console.log('Login attempt:', { email, password });
        setShowLogin(false);
        setEmail('');
        setPassword('');
        window.location.href = '/dashboard';
    };

    const features = [
        {
            icon: Shield,
            title: 'Military-Grade Security',
            description: 'End-to-end encryption with zero-knowledge architecture ensures your data remains completely private and secure.',
            color: 'blue',
        },
        {
            icon: Cloud,
            title: 'Smart Cloud Sync',
            description: 'Access your files from any device, anywhere with our intelligent cloud infrastructure and real-time synchronization.',
            color: 'indigo',
        },
        {
            icon: Lock,
            title: 'Advanced Permission Control',
            description: 'Granular sharing permissions and access controls for complete authority over your sensitive documents.',
            color: 'purple',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 overflow-hidden">
            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        animate={{
                            x: [0, Math.random() * 50 - 25],
                            y: [0, Math.random() * 50 - 25],
                            rotate: [0, 360],
                            scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 5,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                            ease: 'easeInOut',
                        }}
                        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                    >
                        {i % 2 === 0 ? (
                            <Star className="w-3 h-3 text-blue-200 opacity-20" />
                        ) : (
                            <Sparkles className="w-3 h-3 text-indigo-200 opacity-15" />
                        )}
                    </motion.div>
                ))}
                <motion.div
                    className="absolute w-96 h-96 bg-gradient-radial from-blue-100/20 via-purple-50/10 to-transparent rounded-full blur-3xl"
                    animate={{ x: mousePosition.x - 192, y: mousePosition.y - 192 }}
                    transition={{ type: 'spring', damping: 30, stiffness: 100 }}
                />
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full filter blur-3xl opacity-50" />
                <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-100/25 rounded-full filter blur-3xl opacity-40" />
            </div>

            {/* Hero Carousel Section */}
            <motion.section
                style={{ y: heroY, opacity: heroOpacity }}
                className="relative w-full h-screen flex items-center overflow-hidden"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-blue-50/90 to-purple-50/85" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.08),transparent_50%)]" />
                </div>

                <div className="relative z-10 container mx-auto px-[20%] max-w-7xl h-full flex items-center">
                    <div className="w-full">
                        <AnimatePresence mode="wait">
                            {heroSlides.map(
                                (slide, index) =>
                                    index === currentSlide && (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: 100 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                                        >
                                            <div className="flex items-center min-h-[80vh] py-20">
                                                <div className="max-w-4xl mx-auto text-center">
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 50 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.8, delay: 0.2 }}
                                                        className="mb-8"
                                                    >
                                                        <div className="inline-flex items-center gap-2 px-6 py-3 mb-8 text-sm font-medium text-blue-700 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-full shadow-sm backdrop-blur-sm">
                                                            <Sparkles className="w-4 h-4" />
                                                            Welcome to the Future of Security
                                                        </div>
                                                    </motion.div>
                                                    <motion.h1
                                                        initial={{ opacity: 0, y: 30 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.8, delay: 0.4 }}
                                                        className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
                                                    >
                                                        {slide.title}{' '}
                                                        <span className={`text-transparent bg-gradient-to-r ${slide.gradient} bg-clip-text`}>
                              {slide.highlight}
                            </span>
                                                    </motion.h1>
                                                    <motion.p
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.8, delay: 0.6 }}
                                                        className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
                                                    >
                                                        {slide.description}
                                                    </motion.p>
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.8, delay: 0.8 }}
                                                        className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                                                    >
                                                        <motion.div
                                                            whileHover={{ scale: 1.05, boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.4)' }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <Link
                                                                to="/signup"
                                                                className="group inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                                                                aria-label="Sign up for INFOLOCK"
                                                            >
                                                                Get Started Free
                                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                            </Link>
                                                        </motion.div>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ),
                            )}
                        </AnimatePresence>
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
                            {heroSlides.map((_, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'
                                    }`}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Features Section */}
            <motion.section
                className="relative py-32 px-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
            >
                <div className="container mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 px-6 py-3 mb-8 text-sm font-medium text-purple-700 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-full shadow-sm backdrop-blur-sm">
                            <Star className="w-4 h-4" />
                            Premium Features
                        </div>
                        <h2 className="text-5xl md:text-6xl font-bold mb-8 text-transparent bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text">
                            Why Choose INFOLOCK?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Experience unparalleled security and functionality with our comprehensive suite of advanced features designed for modern professionals.
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            const colorClasses = {
                                blue: 'from-blue-500 to-blue-600 text-blue-600 bg-blue-50 border-blue-100',
                                indigo: 'from-indigo-500 to-indigo-600 text-indigo-600 bg-indigo-50 border-indigo-100',
                                purple: 'from-purple-500 to-purple-600 text-purple-600 bg-purple-50 border-purple-100',
                            };
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ y: -10, scale: 1.02, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
                                    className="group relative p-8 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                                        transition={{ duration: 0.6 }}
                                        className={`inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br ${colorClasses[feature.color]} rounded-2xl shadow-lg`}
                                    >
                                        <Icon className="w-8 h-8 text-white" />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-gray-900 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-gray-50/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section
                className="relative py-32 px-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
            >
                <div className="container mx-auto max-w-5xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="p-12 bg-gradient-to-br from-white/90 to-blue-50/80 backdrop-blur-sm border border-gray-100 rounded-3xl shadow-2xl"
                    >
                        <div className="inline-flex items-center gap-2 px-6 py-3 mb-8 text-sm font-medium text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-full shadow-sm">
                            <Zap className="w-4 h-4" />
                            Join 50,000+ Professionals
                        </div>
                        <h3 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text">
                            Ready to Secure Your Documents?
                        </h3>
                        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                            Join thousands of professionals who trust INFOLOCK with their sensitive data. Experience enterprise-grade security with consumer-friendly simplicity.
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.5)' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/dashboard"
                                className="group inline-flex items-center gap-3 px-12 py-6 text-xl font-semibold text-white bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                                aria-label="Start free trial with INFOLOCK"
                            >
                                Start Your Free Trial
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Login Modal */}
            {showLogin && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
                    onClick={() => setShowLogin(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-gray-100 rounded-3xl p-8 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                            <p className="text-gray-600">Sign in to your secure account</p>
                        </div>
                        <form onSubmit={handleLoginSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        aria-label="Email address"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        aria-label="Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <div className="text-right">
                                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    Forgot password?
                                </Link>
                            </div>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                aria-label="Sign in"
                            >
                                Sign In
                            </motion.button>
                            <p className="text-center text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Create one now
                                </Link>
                            </p>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default Home;