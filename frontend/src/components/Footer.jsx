import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

// Icons (using Lucide React for consistent styling)
import { Github, Twitter, Linkedin, Mail, MessageCircle, ArrowRight, Sparkles, Zap, Star } from 'lucide-react';

const Footer = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const footerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: footerRef,
        offset: ["start end", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [50, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

    // Mouse tracking
    useEffect(() => {
        const updateMousePosition = (e) => {
            if (footerRef.current) {
                const rect = footerRef.current.getBoundingClientRect();
                setMousePosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            }
        };

        const footer = footerRef.current;
        if (footer) {
            footer.addEventListener('mousemove', updateMousePosition);
            return () => footer.removeEventListener('mousemove', updateMousePosition);
        }
    }, []);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setTimeout(() => setIsSubscribed(false), 3000);
            setEmail('');
        }
    };

    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: Github, url: "https://github.com", color: "#1f2937", label: "GitHub" },
        { icon: Twitter, url: "https://twitter.com", color: "#1DA1F2", label: "Twitter" },
        { icon: Linkedin, url: "https://linkedin.com", color: "#0A66C2", label: "LinkedIn" },
        { icon: MessageCircle, url: "https://discord.com", color: "#5865F2", label: "Discord" },
        { icon: Mail, url: "mailto:contact@infolock.com", color: "#EA4335", label: "Email" },
    ];

    const quickLinks = [
        { label: "Home", path: "/" },
        { label: "Features", path: "/features" },
        { label: "Pricing", path: "/pricing" },
        { label: "Documentation", path: "/docs" },
    ];

    const resources = [
        { label: "Blog", path: "/blog" },
        { label: "Tutorials", path: "/tutorials" },
        { label: "Support", path: "/support" },
        { label: "API Status", path: "/status" },
    ];

    return (
        <motion.footer
            ref={footerRef}
            style={{ y, opacity }}
            className="relative mt-20 overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Sophisticated Light Background */}
            <div className="absolute inset-0">
                {/* Primary gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20" />

                {/* Subtle mesh overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.08),transparent_50%)] opacity-60" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(168,85,247,0.06),transparent_50%)] opacity-40" />

                {/* Floating geometric shapes */}
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        animate={{
                            x: [0, Math.random() * 60 - 30],
                            y: [0, Math.random() * 60 - 30],
                            rotate: [0, 360],
                            scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                            duration: Math.random() * 8 + 6,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                            ease: "easeInOut"
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    >
                        {i % 3 === 0 ? (
                            <Star className="w-3 h-3 text-blue-200 opacity-30" />
                        ) : i % 3 === 1 ? (
                            <div className="w-2 h-2 bg-purple-200 rounded-full opacity-20" />
                        ) : (
                            <div className="w-1 h-6 bg-gradient-to-b from-blue-200 to-transparent opacity-15 rotate-45" />
                        )}
                    </motion.div>
                ))}

                {/* Mouse-following subtle highlight */}
                {isHovering && (
                    <motion.div
                        className="absolute w-80 h-80 bg-gradient-radial from-blue-100/30 via-purple-50/20 to-transparent rounded-full blur-2xl pointer-events-none"
                        animate={{
                            x: mousePosition.x - 160,
                            y: mousePosition.y - 160,
                        }}
                        transition={{ type: "spring", damping: 25, stiffness: 150 }}
                    />
                )}
            </div>

            <div className="relative z-10 px-6 py-16 mx-auto max-w-7xl">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 text-center"
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-6 py-3 mb-6 text-sm font-medium text-blue-700 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-full shadow-sm backdrop-blur-sm"
                        whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)" }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Sparkles className="w-4 h-4" />
                        Stay Connected with INFOLOCK
                    </motion.div>
                    <h2 className="mb-4 text-4xl font-bold text-transparent bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text">
                        Ready to Transform Your Workflow?
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Join thousands of professionals who trust INFOLOCK for secure, intelligent document management.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                    {/* Company Info - Light Theme */}
                    <div className="lg:col-span-4">
                        <motion.div
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="mb-8"
                        >
                            <div className="flex items-center mb-6">
                                <motion.div
                                    className="w-14 h-14 mr-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/25"
                                    whileHover={{
                                        rotate: [0, -5, 5, 0],
                                        scale: 1.05,
                                        boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.4)"
                                    }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <div className="flex items-center justify-center w-full h-full">
                                        <Zap className="w-7 h-7 text-white" />
                                    </div>
                                </motion.div>
                                <div>
                                    <h3 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                                        INFOLOCK
                                    </h3>
                                    <p className="text-sm text-blue-600/70 font-medium">Security Redefined</p>
                                </div>
                            </div>
                        </motion.div>

                        <p className="mb-8 text-gray-600 leading-relaxed">
                            Experience next-generation document management with military-grade security,
                            AI-powered organization, and seamless collaboration tools.
                        </p>

                        {/* Social Links - Light Theme Cards */}
                        <div className="flex gap-3 flex-wrap">
                            {socialLinks.map((social, index) => {
                                const Icon = social.icon;
                                return (
                                    <motion.a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
                                        whileHover={{
                                            y: -8,
                                            scale: 1.05,
                                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Icon
                                            className="w-5 h-5 text-gray-600 group-hover:scale-110 transition-all duration-300"
                                            style={{ color: social.color }}
                                        />

                                        {/* Tooltip */}
                                        <motion.div
                                            className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-2 text-xs text-white bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                                            initial={{ opacity: 0, y: 5 }}
                                            whileHover={{ opacity: 1, y: 0 }}
                                        >
                                            {social.label}
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
                                        </motion.div>
                                    </motion.a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-2">
                        <h4 className="mb-6 text-lg font-semibold text-gray-800">Navigation</h4>
                        <div className="space-y-4">
                            {quickLinks.map((link, index) => (
                                <motion.a
                                    key={index}
                                    href={link.path}
                                    className="group flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300"
                                    whileHover={{ x: 8 }}
                                >
                                    <ArrowRight className="w-4 h-4 mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 text-blue-500" />
                                    <span className="group-hover:font-medium transition-all duration-300">{link.label}</span>
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Resources */}
                    <div className="lg:col-span-2">
                        <h4 className="mb-6 text-lg font-semibold text-gray-800">Resources</h4>
                        <div className="space-y-4">
                            {resources.map((link, index) => (
                                <motion.a
                                    key={index}
                                    href={link.path}
                                    className="group flex items-center text-gray-600 hover:text-purple-600 transition-colors duration-300"
                                    whileHover={{ x: 8 }}
                                >
                                    <ArrowRight className="w-4 h-4 mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 text-purple-500" />
                                    <span className="group-hover:font-medium transition-all duration-300">{link.label}</span>
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter - Light Theme */}
                    <div className="lg:col-span-4">
                        <h4 className="mb-6 text-lg font-semibold text-gray-800">Stay Updated</h4>
                        <p className="mb-6 text-gray-600">
                            Get the latest features, security updates, and productivity tips delivered straight to your inbox.
                        </p>

                        <motion.form
                            onSubmit={handleSubscribe}
                            className="relative"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="relative flex shadow-sm">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address..."
                                    className="flex-1 px-4 py-4 text-gray-800 bg-white border border-gray-200 rounded-l-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400 shadow-sm"
                                    required
                                />
                                <motion.button
                                    type="submit"
                                    className="px-8 py-4 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-r-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg"
                                    whileHover={{
                                        scale: 1.02,
                                        boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)"
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isSubscribed}
                                >
                                    {isSubscribed ? (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex items-center gap-2"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            Success!
                                        </motion.span>
                                    ) : (
                                        "Subscribe"
                                    )}
                                </motion.button>
                            </div>

                            {isSubscribed && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                    className="absolute top-full left-0 mt-3 px-4 py-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl shadow-sm"
                                >
                                    🎉 Welcome to our community! Check your inbox for confirmation.
                                </motion.div>
                            )}
                        </motion.form>
                    </div>
                </div>

                {/* Bottom Section - Light Theme */}
                <motion.div
                    className="mt-16 pt-8 border-t border-gray-100"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="flex items-center gap-3 text-gray-600">
                            <span>© {currentYear} INFOLOCK.</span>
                            <motion.span
                                className="text-blue-600 font-medium"
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                Crafted with Excellence
                            </motion.span>
                        </div>

                        <div className="flex gap-8">
                            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item, index) => (
                                <motion.a
                                    key={index}
                                    href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="text-gray-500 hover:text-blue-600 transition-colors duration-300 text-sm font-medium"
                                    whileHover={{ y: -1, color: "#2563eb" }}
                                >
                                    {item}
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Subtle accent elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full filter blur-3xl opacity-60" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/30 rounded-full filter blur-3xl opacity-40" />
        </motion.footer>
    );
};

export default Footer;