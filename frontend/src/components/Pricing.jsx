
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Check,
    Star,
    Zap,
    Shield,
    Cloud,
    Users,
    Database,
    Lock,
    Sparkles,
    ArrowRight,
    Crown
} from 'lucide-react';

const Pricing = () => {
    const [billingPeriod, setBillingPeriod] = useState('monthly');

    const plans = [
        {
            id: 'starter',
            name: 'Starter',
            description: 'Perfect for individuals getting started',
            icon: Zap,
            popular: false,
            price: {
                monthly: 299,
                yearly: 2990
            },
            storage: '10 GB',
            features: [
                '10 GB secure storage',
                'Basic file encryption',
                'Mobile & web access',
                '2-factor authentication',
                'Email support',
                'Basic file sharing'
            ],
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-50 to-cyan-50',
            borderColor: 'border-blue-200'
        },
        {
            id: 'professional',
            name: 'Professional',
            description: 'For professionals and growing teams',
            icon: Shield,
            popular: true,
            price: {
                monthly: 599,
                yearly: 5990
            },
            storage: '100 GB',
            features: [
                '100 GB secure storage',
                'Advanced encryption (AES-256)',
                'Priority support',
                'Advanced sharing controls',
                'Document versioning',
                'Collaboration tools',
                'API access',
                'Custom branding'
            ],
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-50 to-pink-50',
            borderColor: 'border-purple-200'
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            description: 'For large organizations with advanced needs',
            icon: Crown,
            popular: false,
            price: {
                monthly: 1299,
                yearly: 12990
            },
            storage: '1 TB',
            features: [
                '1 TB secure storage',
                'Military-grade encryption',
                'Dedicated support manager',
                'Advanced admin controls',
                'Audit logs & compliance',
                'SSO integration',
                'Custom integrations',
                'White-label solution',
                'Advanced analytics'
            ],
            gradient: 'from-amber-500 to-orange-500',
            bgGradient: 'from-amber-50 to-orange-50',
            borderColor: 'border-amber-200'
        }
    ];

    const features = [
        {
            icon: Lock,
            title: 'Bank-Level Security',
            description: 'Your documents are protected with military-grade encryption'
        },
        {
            icon: Cloud,
            title: 'Global Access',
            description: 'Access your files securely from anywhere in the world'
        },
        {
            icon: Users,
            title: 'Team Collaboration',
            description: 'Share and collaborate with team members seamlessly'
        },
        {
            icon: Database,
            title: 'Smart Organization',
            description: 'AI-powered categorization and intelligent search'
        }
    ];

    return (
        <div className="relative py-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.08),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(168,85,247,0.06),transparent_50%)]" />

                {/* Floating Elements */}
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 180, 360],
                            scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                            duration: Math.random() * 8 + 6,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    >
                        <Star className="w-2 h-2 text-blue-200 opacity-30" />
                    </motion.div>
                ))}
            </div>

            <div className="relative z-10 px-6 mx-auto max-w-7xl">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 text-center"
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-6 py-3 mb-6 text-sm font-medium text-blue-700 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-full shadow-sm backdrop-blur-sm"
                        whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)" }}
                    >
                        <Sparkles className="w-4 h-4" />
                        Secure • Intelligent • Scalable
                    </motion.div>

                    <h1 className="mb-6 text-5xl font-bold text-transparent bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text">
                        Choose Your Perfect Plan
                    </h1>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Transform how you store, organize, and secure your digital documents.
                        Join thousands of professionals who trust INFOLOCK for their digital storage needs.
                    </p>

                    {/* Billing Toggle */}
                    <motion.div
                        className="flex items-center justify-center mt-8 p-1 bg-white border border-gray-200 rounded-full shadow-sm"
                        whileHover={{ boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)" }}
                    >
                        <button
                            onClick={() => setBillingPeriod('monthly')}
                            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                                billingPeriod === 'monthly'
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingPeriod('yearly')}
                            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 relative ${
                                billingPeriod === 'yearly'
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Yearly
                            <span className="absolute -top-2 -right-2 px-2 py-1 text-xs font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                Save 17%
              </span>
                        </button>
                    </motion.div>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {plans.map((plan, index) => {
                        const Icon = plan.icon;
                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{
                                    y: -10,
                                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)"
                                }}
                                className={`relative p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden ${
                                    plan.popular ? 'ring-2 ring-purple-500 ring-opacity-50' : ''
                                }`}
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg"
                                    >
                                        <Sparkles className="inline w-4 h-4 mr-1" />
                                        Most Popular
                                    </motion.div>
                                )}

                                {/* Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${plan.bgGradient} opacity-30`} />

                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Plan Header */}
                                    <div className="flex items-center mb-6">
                                        <motion.div
                                            className={`w-16 h-16 mr-4 bg-gradient-to-br ${plan.gradient} rounded-2xl shadow-lg flex items-center justify-center`}
                                            whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <Icon className="w-8 h-8 text-white" />
                                        </motion.div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-800">{plan.name}</h3>
                                            <p className="text-gray-600 text-sm">{plan.description}</p>
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div className="mb-8">
                                        <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-800">
                        ₹{plan.price[billingPeriod].toLocaleString()}
                      </span>
                                            <span className="text-gray-600 ml-2">
                        /{billingPeriod === 'yearly' ? 'year' : 'month'}
                      </span>
                                        </div>
                                        {billingPeriod === 'yearly' && (
                                            <p className="text-sm text-green-600 font-medium mt-1">
                                                Save ₹{((plan.price.monthly * 12) - plan.price.yearly).toLocaleString()} annually
                                            </p>
                                        )}
                                        <div className="mt-2 flex items-center text-sm text-gray-600">
                                            <Database className="w-4 h-4 mr-1" />
                                            {plan.storage} secure storage
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="mb-8">
                                        <h4 className="font-semibold text-gray-800 mb-4">Everything included:</h4>
                                        <ul className="space-y-3">
                                            {plan.features.map((feature, featureIndex) => (
                                                <motion.li
                                                    key={featureIndex}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 + featureIndex * 0.05 }}
                                                    className="flex items-center text-gray-600"
                                                >
                                                    <div className={`w-5 h-5 mr-3 bg-gradient-to-br ${plan.gradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                                                        <Check className="w-3 h-3 text-white" />
                                                    </div>
                                                    {feature}
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* CTA Button */}
                                    <motion.button
                                        className={`w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r ${plan.gradient} shadow-lg hover:shadow-xl transition-all duration-300 group`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                    <span className="flex items-center justify-center">
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Features Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-20"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Why Choose INFOLOCK?
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Experience the future of digital document management with features designed for security, efficiency, and peace of mind.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                                >
                                    <div className="w-12 h-12 mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Trust Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl border border-blue-100"
                >
                    <div className="text-center">
                        <div className="flex justify-center items-center mb-4">
                            <Shield className="w-8 h-8 text-blue-600 mr-3" />
                            <span className="text-2xl font-bold text-gray-800">30-Day Money-Back Guarantee</span>
                        </div>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Try INFOLOCK risk-free. If you're not completely satisfied within 30 days, we'll refund your payment—no questions asked.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Pricing;