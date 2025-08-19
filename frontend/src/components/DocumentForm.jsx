import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiUploadCloud, FiFile, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const DocumentForm = ({ isOpen, onClose, onSubmit, document }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Personal');
    const [file, setFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (document) {
            setName(document.fileName || document.name || '');
            setCategory(document.category || 'Personal');
            setIsEditing(true);
        } else {
            setName('');
            setCategory('Personal');
            setFile(null);
            setIsEditing(false);
        }
        setErrors({});
        setUploadProgress(0);
    }, [document, isOpen]);

    const validateForm = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = 'Document name is required';
        if (!isEditing && !file) newErrors.file = 'File is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setUploadProgress(0);

        try {
            const docData = {
                id: document?.id,
                name: name.trim(),
                category
            };

            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + Math.random() * 20;
                });
            }, 200);

            await onSubmit(docData, file);

            clearInterval(progressInterval);
            setUploadProgress(100);

            setTimeout(() => {
                setUploadProgress(0);
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
            setErrors({...errors, file: 'File size must be less than 10MB'});
            return;
        }

        const validTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'image/jpeg',
            'image/png'
        ];

        if (!validTypes.includes(selectedFile.type)) {
            setErrors({...errors, file: 'Only PDF, DOC, DOCX, XLS, XLSX, JPG, PNG files are allowed'});
            return;
        }

        setFile(selectedFile);
        setErrors({...errors, file: null});

        if (!isEditing && !name) {
            setName(selectedFile.name.replace(/\.[^/.]+$/, ""));
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

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
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
        hidden: {
            opacity: 0,
            scale: 0.95,
            y: 20
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                duration: 0.3,
                bounce: 0.2
            }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: 20,
            transition: {
                duration: 0.2
            }
        }
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
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
                <motion.div
                    className="bg-white rounded-xl shadow-xl w-full max-w-sm border border-gray-200 overflow-hidden my-4"
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Compact Header */}
                    <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 text-white">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold flex items-center">
                                <FiUploadCloud className="w-4 h-4 mr-2" />
                                {isEditing ? 'Edit Document' : 'Upload Document'}
                            </h3>
                            <motion.button
                                onClick={onClose}
                                className="p-1 text-white/80 hover:text-white rounded-full transition-all"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Close modal"
                            >
                                <FiX className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {isSubmitting && (
                            <motion.div
                                className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: `${uploadProgress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="p-5 space-y-4">
                        {/* Document Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Document Name *
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="name"
                                    className={`w-full px-3 py-2 border ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (errors.name) setErrors({...errors, name: null});
                                    }}
                                    required
                                    maxLength={100}
                                    disabled={isSubmitting}
                                    placeholder="Enter document name"
                                />
                                {name && !errors.name && (
                                    <motion.div
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                    >
                                        <FiCheck className="w-4 h-4 text-green-500" />
                                    </motion.div>
                                )}
                            </div>
                            <AnimatePresence>
                                {errors.name && (
                                    <motion.p
                                        className="mt-1 text-xs text-red-600 flex items-center"
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

                        {/* Category Field */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                Category *
                            </label>
                            <select
                                id="category"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                disabled={isSubmitting}
                            >
                                {['Personal', 'Professional', 'Financial', 'Legal', 'Medical', 'Other'].map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* File Upload Field */}
                        {(!isEditing || file) && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Document File {!isEditing && '*'}
                                </label>

                                <motion.div
                                    className={`relative border-2 border-dashed rounded-lg transition-all ${
                                        isDragOver
                                            ? 'border-blue-400 bg-blue-50'
                                            : errors.file
                                                ? 'border-red-300 bg-red-50'
                                                : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    animate={{
                                        scale: isDragOver ? 1.01 : 1,
                                        backgroundColor: isDragOver ? "#eff6ff" : "transparent"
                                    }}
                                >
                                    <div className="p-4 text-center">
                                        {file ? (
                                            <motion.div
                                                className="space-y-2"
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                            >
                                                <div className="flex items-center justify-center">
                                                    <div className="p-2 bg-green-100 rounded-lg">
                                                        <FiFile className={`w-5 h-5 ${getFileTypeColor(file.name)}`} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 truncate px-2">{file.name}</p>
                                                    <p className="text-xs text-gray-600 mt-1">{formatFileSize(file.size)}</p>
                                                </div>
                                                <motion.button
                                                    type="button"
                                                    onClick={() => {
                                                        setFile(null);
                                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                                    }}
                                                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    Remove file
                                                </motion.button>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                className="space-y-2"
                                                animate={{
                                                    y: isDragOver ? -2 : 0
                                                }}
                                            >
                                                <motion.div
                                                    animate={{
                                                        scale: isDragOver ? 1.05 : 1,
                                                        rotate: isDragOver ? 3 : 0
                                                    }}
                                                >
                                                    <FiUploadCloud className={`mx-auto w-8 h-8 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
                                                </motion.div>
                                                <div className="space-y-1">
                                                    <label
                                                        htmlFor="file-upload"
                                                        className={`relative cursor-pointer text-xs font-medium rounded-md px-2 py-1 transition-all ${
                                                            isSubmitting
                                                                ? 'opacity-50 cursor-not-allowed text-gray-400'
                                                                : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                                                        }`}
                                                    >
                                                        <span>Choose a file</span>
                                                        <input
                                                            ref={fileInputRef}
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file"
                                                            className="sr-only"
                                                            onChange={(e) => handleFileChange(e.target.files[0])}
                                                            required={!isEditing}
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
                                            className="mt-1 text-xs text-red-600 flex items-center"
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

                        {/* Form Error */}
                        <AnimatePresence>
                            {errors.form && (
                                <motion.div
                                    className="p-2 bg-red-50 border border-red-200 rounded-md"
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

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-2 pt-3">
                            <motion.button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-3 py-2 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-4 py-2 border border-transparent rounded-md text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                                }`}
                                whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
                                whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
                            >
                                <AnimatePresence mode="wait">
                                    {isSubmitting ? (
                                        <motion.span
                                            className="flex items-center justify-center"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {isEditing ? 'Saving...' : 'Uploading...'}
                                        </motion.span>
                                    ) : (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            {isEditing ? 'Save' : 'Upload'}
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