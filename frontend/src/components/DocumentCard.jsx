import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiEdit2, FiTrash2, FiDownload, FiMoreVertical, FiFile, FiEye, FiClock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const DocumentCard = ({ document: doc, onEdit, onDelete, onDownload }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const dropdownRef = useRef(null);
    const API_BASE_URL = 'http://localhost:8080/api/documents';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Memoized helper functions
    const formatFileType = useCallback((type) => {
        if (!type) return 'FILE';
        const parts = type.split('/');
        return parts[parts.length - 1].toUpperCase();
    }, []);

    const formatDate = useCallback((dateString) => {
        if (!dateString) return 'Recently';
        try {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        } catch {
            return 'Recently';
        }
    }, []);

    const formatFileSize = useCallback((bytes) => {
        if (!bytes) return 'Unknown size';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }, []);

    const getFileIconColor = useCallback((type) => {
        const formattedType = formatFileType(type).toLowerCase();
        switch(formattedType) {
            case 'pdf': return { bg: 'bg-gradient-to-br from-red-100 to-red-200', text: 'text-red-600', border: 'border-red-200', glow: 'shadow-red-200/50' };
            case 'doc':
            case 'docx': return { bg: 'bg-gradient-to-br from-blue-100 to-blue-200', text: 'text-blue-600', border: 'border-blue-200', glow: 'shadow-blue-200/50' };
            case 'xls':
            case 'xlsx': return { bg: 'bg-gradient-to-br from-green-100 to-green-200', text: 'text-green-600', border: 'border-green-200', glow: 'shadow-green-200/50' };
            case 'jpg':
            case 'jpeg':
            case 'png': return { bg: 'bg-gradient-to-br from-purple-100 to-purple-200', text: 'text-purple-600', border: 'border-purple-200', glow: 'shadow-purple-200/50' };
            case 'txt': return { bg: 'bg-gradient-to-br from-gray-100 to-gray-200', text: 'text-gray-600', border: 'border-gray-200', glow: 'shadow-gray-200/50' };
            case 'zip':
            case 'rar': return { bg: 'bg-gradient-to-br from-yellow-100 to-yellow-200', text: 'text-yellow-600', border: 'border-yellow-200', glow: 'shadow-yellow-200/50' };
            default: return { bg: 'bg-gradient-to-br from-indigo-100 to-indigo-200', text: 'text-indigo-600', border: 'border-indigo-200', glow: 'shadow-indigo-200/50' };
        }
    }, [formatFileType]);

    const handleDownloadClick = useCallback((e) => {
        e?.stopPropagation();
        onDownload(doc.id, doc.fileName || doc.name);
    }, [doc.id, doc.fileName, doc.name, onDownload]);

    const handleEditClick = useCallback((e) => {
        e?.stopPropagation();
        onEdit(doc);
        setDropdownOpen(false);
    }, [doc, onEdit]);

    const handleDeleteClick = useCallback((e) => {
        e?.stopPropagation();
        if (window.confirm(`Are you sure you want to delete "${doc.fileName || doc.name}"?`)) {
            onDelete(doc.id);
        }
        setDropdownOpen(false);
    }, [doc.id, doc.fileName, doc.name, onDelete]);

    const fileColors = getFileIconColor(doc.fileType);
    const fileName = doc.fileName || doc.name || 'Untitled Document';
    const category = doc.category || 'Uncategorized';

    return (
        <motion.div
            className="group relative bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-500 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{
                y: -8,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Gradient Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-transparent pointer-events-none" />

            {/* Animated Border */}
            <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100"
                initial={false}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />

            <div className="relative p-6">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-4">
                    {/* Enhanced File Type Badge */}
                    <motion.div
                        className={`${fileColors.bg} ${fileColors.border} border-2 rounded-xl p-4 shadow-lg ${fileColors.glow}`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <div className="flex items-center space-x-2">
                            <FiFile className={`w-5 h-5 ${fileColors.text}`} />
                            <span className={`font-bold text-sm uppercase tracking-wide ${fileColors.text}`}>
                                {formatFileType(doc.fileType)}
                            </span>
                        </div>
                    </motion.div>

                    {/* Enhanced Action Menu */}
                    <div className="relative" ref={dropdownRef}>
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                setDropdownOpen(!dropdownOpen);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100/50 backdrop-blur-sm transition-all duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Document actions"
                        >
                            <FiMoreVertical className="w-5 h-5" />
                        </motion.button>

                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 z-20 overflow-hidden"
                                >
                                    {[
                                        { icon: FiEye, label: 'View Details', onClick: () => setDropdownOpen(false), color: 'text-blue-600' },
                                        { icon: FiEdit2, label: 'Edit Document', onClick: handleEditClick, color: 'text-green-600' },
                                        { icon: FiDownload, label: 'Download', onClick: handleDownloadClick, color: 'text-indigo-600' },
                                        { icon: FiTrash2, label: 'Delete', onClick: handleDeleteClick, color: 'text-red-600' },
                                    ].map((item, index) => (
                                        <motion.button
                                            key={item.label}
                                            onClick={item.onClick}
                                            className={`w-full flex items-center px-4 py-3 text-sm ${item.color} hover:bg-gray-50/80 transition-colors duration-200 group/item`}
                                            initial={{ x: -10, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{ x: 4 }}
                                        >
                                            <item.icon className="mr-3 w-4 h-4 group-hover/item:scale-110 transition-transform duration-200" />
                                            {item.label}
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Document Info Section */}
                <div className="space-y-4">
                    {/* Title */}
                    <div>
                        <motion.h3
                            className="text-xl font-bold text-gray-900 truncate group-hover:text-blue-800 transition-colors duration-300"
                            title={fileName}
                            initial={{ opacity: 0.8 }}
                            animate={{ opacity: 1 }}
                        >
                            {fileName}
                        </motion.h3>

                        {/* Category Badge */}
                        <motion.div
                            className="mt-2 inline-flex items-center"
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs font-semibold rounded-full border border-blue-200/50">
                                {category}
                            </span>
                        </motion.div>
                    </div>

                    {/* File Stats */}
                    <motion.div
                        className="flex items-center justify-between pt-2"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center text-gray-600">
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                <span className="text-sm font-medium">
                                    {formatFileSize(doc.fileSize)}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center text-gray-500">
                            <FiClock className="w-4 h-4 mr-1" />
                            <span className="text-xs">
                                {formatDate(doc.uploadDate)}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Enhanced Footer */}
            <motion.div
                className="relative px-6 py-4 bg-gradient-to-r from-gray-50/80 to-white/60 backdrop-blur-sm border-t border-white/30"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
            >
                <div className="flex justify-between items-center">
                    <motion.div
                        className="flex items-center space-x-2 text-gray-600"
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span className="text-xs font-medium">
                            Uploaded {formatDate(doc.uploadDate)}
                        </span>
                    </motion.div>

                    <motion.button
                        onClick={handleDownloadClick}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group/download"
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`Download ${fileName}`}
                    >
                        <FiDownload className="mr-2 w-4 h-4 group-hover/download:rotate-12 transition-transform duration-300" />
                        Download
                        <motion.div
                            className="ml-2 w-1 h-1 bg-white/40 rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </motion.button>
                </div>
            </motion.div>

            {/* Hover Glow Effect */}
            <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-pink-400/5 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />
        </motion.div>
    );
};

// Update propTypes to match backend DTO
DocumentCard.propTypes = {
    document: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        fileName: PropTypes.string,
        fileType: PropTypes.string,
        category: PropTypes.string,
        fileSize: PropTypes.number,
        uploadDate: PropTypes.string,
        // Add any additional fields from your DocumentDTO
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onDownload: PropTypes.func.isRequired,
};

export default React.memo(DocumentCard);