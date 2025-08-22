import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiUploadCloud, FiFile, FiCheck, FiAlertCircle, FiStar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { formatFileSize } from '../utils/documentUtils';

const DocumentForm = ({ isOpen, onClose, onSubmit, document }) => {
    const [formData, setFormData] = useState({ name: '', category: 'Personal', file: null });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (document) {
            setFormData({
                name: document.fileName || document.name || '',
                category: document.category || 'Personal',
                file: null,
            });
        } else {
            setFormData({ name: '', category: 'Personal', file: null });
        }
        setErrors({});
        setUploadProgress(0);
    }, [document, isOpen]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Document name is required';
        if (!document && !formData.file) newErrors.file = 'File is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setUploadProgress(0);

        try {
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + Math.random() * 20;
                });
            }, 200);

            await onSubmit({ id: document?.id, ...formData }, formData.file);

            clearInterval(progressInterval);
            setUploadProgress(100);
            setTimeout(() => {
                setUploadProgress(0);
                onClose();
            }, 500);
        } catch (error) {
            console.error('Form submission error:', error);
            setErrors({ ...errors, form: error.message || 'An error occurred' });
            setUploadProgress(0);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (selectedFile) => {
        if (!selectedFile) return;

        const maxSize = 10 * 1024 * 1024; // 10MB
        if (selectedFile.size > maxSize) {
            setErrors({ ...errors, file: 'File size must be less than 10MB' });
            return;
        }

        const validTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'image/jpeg',
            'image/png',
        ];

        if (!validTypes.includes(selectedFile.type)) {
            setErrors({ ...errors, file: 'Only PDF, DOC, DOCX, XLS, XLSX, JPG, PNG files are allowed' });
            return;
        }

        setFormData({ ...formData, file: selectedFile });
        setErrors({ ...errors, file: null });

        if (!document && !formData.name) {
            setFormData({ ...formData, name: selectedFile.name.replace(/\.[^/.]+$/, ""), file: selectedFile });
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileChange(droppedFile);
        }
    };

    const getFileTypeColor = (fileName) => {
        if (!fileName) return 'text-gray-600';
        const parts = fileName.split('.');
        const ext = (parts.length > 1 ? parts.pop() : "").toLowerCase();
        switch (ext) {
            case 'pdf': return 'text-red-600';
            case 'doc':
            case 'docx': return 'text-blue-600';
            case 'xls':
            case 'xlsx': return 'text-green-600';
            case 'jpg':
            case 'jpeg':
            case 'png': return 'text-purple-600';
            default: return 'text-indigo-600';
        }
    };

    if (!isOpen) return null;

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 20 } },
        exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.target === e.currentTarget && !isSubmitting && onClose()}
            >
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/40 to-gray-50/30" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(59,130,246,0.15),transparent_50%)] opacity-70" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(168,85,247,0.1),transparent_50%)] opacity-50" />
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            animate={{
                                x: [0, Math.random() * 40 - 20],
                                y: [0, Math.random() * 40 - 20],
                                rotate: [0, 360],
                                scale: [0.8, 1.2, 0.8],
                            }}
                            transition={{
                                duration: Math.random() * 6 + 4,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                                ease: "easeInOut",
                            }}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                        >
                            <FiStar className="w-3 h-3 text-blue-200/50" />
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="relative bg-white/90 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100/50 backdrop-blur-sm my-6 overflow-hidden"
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-4 text-white">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold flex items-center">
                                <FiUploadCloud className="w-5 h-5 mr-3" />
                                {document ? 'Edit Document' : 'Upload Document'}
                            </h3>
                            <motion.button
                                onClick={onClose}
                                className="p-2 text-white/80 hover:text-white rounded-full bg-gray-900/20 transition-all"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Close modal"
                            >
                                <FiX className="w-5 h-5" />
                            </motion.button>
                        </div>
                        {isSubmitting && (
                            <motion.div
                                className="absolute bottom-0 left-0 h-1 bg-white/40 rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: `${uploadProgress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        )}
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-1.5">
                                Document Name *
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="name"
                                    className={`w-full px-4 py-3 border border-gray-200/50 rounded-xl shadow-sm bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-gray-800 placeholder-gray-400 text-sm font-medium transition-all duration-300 ${errors.name ? 'border-red-300 bg-red-50/50' : ''}`}
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData({ ...formData, name: e.target.value });
                                        if (errors.name) setErrors({ ...errors, name: null });
                                    }}
                                    required
                                    maxLength={100}
                                    disabled={isSubmitting}
                                    placeholder="Enter document name"
                                />
                                {formData.name && !errors.name && (
                                    <motion.div
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                    >
                                        <FiCheck className="w-4 h-4 text-emerald-600" />
                                    </motion.div>
                                )}
                            </div>
                            <AnimatePresence>
                                {errors.name && (
                                    <motion.p
                                        className="mt-1.5 text-xs text-red-600 flex items-center"
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                    >
                                        <FiAlertCircle className="w-3 h-3 mr-1" />
                                        {errors.name}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-semibold text-gray-800 mb-1.5">
                                Category *
                            </label>
                            <select
                                id="category"
                                className="w-full px-4 py-3 border border-gray-200/50 rounded-xl shadow-sm bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-gray-800 text-sm font-medium transition-all duration-300"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                                disabled={isSubmitting}
                            >
                                {['Personal', 'Professional', 'Financial', 'Legal', 'Medical', 'Other'].map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        {(!document || formData.file) && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                    Document File {!document && '*'}
                                </label>
                                <motion.div
                                    className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ${isDragOver ? 'border-blue-400 bg-blue-50/50' : errors.file ? 'border-red-300 bg-red-50/50' : 'border-gray-200/50 hover:border-blue-400/50 bg-white/80 backdrop-blur-sm'}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    animate={{ scale: isDragOver ? 1.02 : 1, backgroundColor: isDragOver ? "rgba(59, 130, 246, 0.05)" : "rgba(255, 255, 255, 0.8)" }}
                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                >
                                    <div className="p-5 text-center">
                                        {formData.file ? (
                                            <motion.div
                                                className="space-y-3"
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                            >
                                                <div className="flex items-center justify-center">
                                                    <div className="p-3 bg-gradient-to-br from-blue-100/70 to-purple-100/70 rounded-xl shadow-md backdrop-blur-sm">
                                                        <FiFile className={`w-6 h-6 ${getFileTypeColor(formData.file.name)}`} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 truncate px-4">{formData.file.name}</p>
                                                    <p className="text-xs text-gray-600 mt-1">{formatFileSize(formData.file.size)}</p>
                                                </div>
                                                <motion.button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, file: null });
                                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                                    }}
                                                    className="text-xs font-semibold text-red-600 hover:text-red-700"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    Remove file
                                                </motion.button>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                className="space-y-3"
                                                animate={{ y: isDragOver ? -3 : 0 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                            >
                                                <motion.div
                                                    animate={{ scale: isDragOver ? 1.1 : 1, rotate: isDragOver ? 5 : 0 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                                >
                                                    <FiUploadCloud className={`mx-auto w-10 h-10 ${isDragOver ? 'text-blue-600' : 'text-gray-400'}`} />
                                                </motion.div>
                                                <div className="space-y-1.5">
                                                    <label
                                                        htmlFor="file-upload"
                                                        className={`relative cursor-pointer text-sm font-semibold rounded-xl px-3 py-1.5 transition-all duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed text-gray-400' : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50/50'}`}
                                                    >
                                                        <span>Choose a file</span>
                                                        <input
                                                            ref={fileInputRef}
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file"
                                                            className="sr-only"
                                                            onChange={(e) => handleFileChange(e.target.files[0])}
                                                            required={!document}
                                                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                                                            disabled={isSubmitting}
                                                        />
                                                    </label>
                                                    <p className="text-xs text-gray-500">
                                                        or drag and drop here
                                                    </p>
                                                </div>
                                                <p className="text-[0.65rem] text-gray-500">
                                                    PDF, DOC, XLS, JPG, PNG (Max 10MB)
                                                </p>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                                <AnimatePresence>
                                    {errors.file && (
                                        <motion.p
                                            className="mt-1.5 text-xs text-red-600 flex items-center"
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                        >
                                            <FiAlertCircle className="w-3 h-3 mr-1" />
                                            {errors.file}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                        <AnimatePresence>
                            {errors.form && (
                                <motion.div
                                    className="p-3 bg-red-50/90 border border-red-200/50 rounded-xl shadow-sm backdrop-blur-sm"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <p className="text-xs text-red-600 flex items-center">
                                        <FiAlertCircle className="w-3 h-3 mr-1" />
                                        {errors.form}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div className="flex justify-end space-x-3 pt-4">
                            <motion.button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-4 py-2.5 border border-gray-200/50 rounded-xl text-sm font-semibold text-gray-700 bg-white/80 backdrop-blur-sm hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-gray-500/30 disabled:opacity-50 transition-all duration-300"
                                whileHover={{ scale: 1.03, boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)" }}
                                whileTap={{ scale: 0.97 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-5 py-2.5 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                                whileHover={{ scale: isSubmitting ? 1 : 1.03, boxShadow: isSubmitting ? "none" : "0 12px 24px rgba(59, 130, 246, 0.3)" }}
                                whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
                            >
                                <AnimatePresence mode="wait">
                                    {isSubmitting ? (
                                        <motion.span
                                            className="flex items-center justify-center"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                        >
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {document ? 'Saving...' : 'Uploading...'}
                                        </motion.span>
                                    ) : (
                                        <motion.span
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                        >
                                            {document ? 'Save' : 'Upload'}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default React.memo(DocumentForm);