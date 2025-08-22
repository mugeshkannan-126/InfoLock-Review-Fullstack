// src/components/DocumentCard.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiEdit2, FiTrash2, FiDownload, FiMoreVertical, FiFile, FiEye, FiClock, FiShare2, FiCopy, FiGlobe, FiLock, FiCheck, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { formatFileType, formatDate, formatFileSize } from '../utils/documentUtils';
// Frontend share link generator
const generateFrontendShareLink = (document) => {
    // Get current origin (localhost:3000 or your domain)
    const baseUrl = window.location.origin;

    // Create a URL-friendly document name
    const urlFriendlyName = (document.fileName || document.name || 'document')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    // Generate a simple share token (you can customize this)
    const shareToken = btoa(`${document.id}:${Date.now()}`)
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    // Choose your preferred URL format:

    // Option 1: Simple format
    // return `${baseUrl}/share/${shareToken}`;

    // Option 2: With document name
    // return `${baseUrl}/share/${shareToken}/${urlFriendlyName}`;

    // Option 3: Query parameter format
    // return `${baseUrl}/view?doc=${shareToken}&name=${urlFriendlyName}`;

    // Option 4: Document ID format (simplest)
    return `${baseUrl}/document/${document.id}`;
};

// Optional: Add this function to validate/share documents later
const getDocumentFromShareLink = (shareUrl) => {
    // This would parse the share URL and return document info
    // For now, it's just a placeholder since we're not implementing actual sharing
    return null;
};

const DocumentCard = ({ document: doc, onEdit, onDelete, onDownload, onTogglePrivacy, isTogglingPrivacy }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);
    const [shareLink, setShareLink] = useState('');
    const [showShareTooltip, setShowShareTooltip] = useState(false);
    const [isPublic, setIsPublic] = useState(doc?.isPublic || false);
    const [copied, setCopied] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setIsPublic(doc?.isPublic || false);
    }, [doc?.isPublic]);

    const viewDocument = async (documentId) => {
        try {
            setIsViewing(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/documents/view/${documentId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch document');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
            setTimeout(() => URL.revokeObjectURL(url), 10000);
        } catch (error) {
            console.error('Error viewing document:', error);
            toast.error('Unable to view this file. Please try downloading instead.');
        } finally {
            setIsViewing(false);
            setDropdownOpen(false);
        }
    };

    const handleViewClick = useCallback((e) => {
        e?.stopPropagation();
        viewDocument(doc.id);
    }, [doc.id]);

    const getFileIconColor = useCallback((type) => {
        const formattedType = formatFileType(type).toLowerCase();
        switch (formattedType) {
            case 'pdf': return { bg: 'bg-gradient-to-br from-red-100 to-red-200', text: 'text-red-600', border: 'border-red-200', glow: 'shadow-red-200/50' };
            case 'doc':
            case 'docx': return { bg: 'bg-gradient-to-br from-blue-100 to-blue-200', text: 'text-blue-600', border: 'border-blue-200', glow: 'shadow-blue-200/50' };
            case 'xls':
            case 'xlsx': return { bg: 'bg-gradient-to-br from-green-100 to-green-200', text: 'text-green-600', border: 'border-green-200', glow: 'shadow-green-200/50' };
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'webp': return { bg: 'bg-gradient-to-br from-purple-100 to-purple-200', text: 'text-purple-600', border: 'border-purple-200', glow: 'shadow-purple-200/50' };
            case 'txt': return { bg: 'bg-gradient-to-br from-gray-100 to-gray-200', text: 'text-gray-600', border: 'border-gray-200', glow: 'shadow-gray-200/50' };
            case 'zip':
            case 'rar': return { bg: 'bg-gradient-to-br from-yellow-100 to-yellow-200', text: 'text-yellow-600', border: 'border-yellow-200', glow: 'shadow-yellow-200/50' };
            default: return { bg: 'bg-gradient-to-br from-indigo-100 to-indigo-200', text: 'text-indigo-600', border: 'border-indigo-200', glow: 'shadow-indigo-200/50' };
        }
    }, [formatFileType]);

    const handleDownloadClick = useCallback((e) => {
        e?.stopPropagation();
        onDownload(doc.id, doc.fileName || doc.name);
        setDropdownOpen(false);
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

    const handleTogglePrivacyClick = useCallback(async (e) => {
        e?.stopPropagation();
        const newPrivacyState = !isPublic;
        setIsPublic(newPrivacyState);

        try {
            // This will now only update the local state
            await onTogglePrivacy(doc.id, newPrivacyState);
        } catch (error) {
            setIsPublic(!newPrivacyState);
            toast.error('Failed to update document privacy');
        }
        setDropdownOpen(false);
    }, [doc.id, isPublic, onTogglePrivacy]);

    const generateShareLink = useCallback(async () => {
        try {
            setIsGeneratingLink(true);

            // Super simple - just use the document ID
            const fullShareUrl = `http://localhost:5173/doc/${doc.id}`;

            setShareLink(fullShareUrl);

            // Copy to clipboard
            navigator.clipboard.writeText(fullShareUrl);
            setShowShareTooltip(true);
            setCopied(true);

            setTimeout(() => {
                setShowShareTooltip(false);
                setCopied(false);
            }, 3000);

        } catch (error) {
            console.error('Error generating share link:', error);
            toast.error('Unable to copy share link');
        } finally {
            setIsGeneratingLink(false);
            setDropdownOpen(false);
        }
    }, [doc.id]);

    const fileColors = getFileIconColor(doc.fileType);
    const fileName = doc.fileName || doc.name || 'Untitled Document';
    const category = doc.category || 'Uncategorized';

    return (
        <motion.div
            className="group relative bg-white/80 backdrop-blur-lg rounded-2xl border border-white/30 hover:border-white/50 transition-all duration-500 overflow-hidden shadow-lg hover:shadow-2xl"
            style={{ minHeight: '340px' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{
                y: -8,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
            }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Gradient Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-transparent pointer-events-none" />
            <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100"
                initial={false}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />

            {/* Floating Particles Effect */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-blue-300/30"
                        animate={{
                            y: [0, 15, 0],
                            x: [0, 5, 0],
                            opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{
                            duration: 3 + i,
                            repeat: Infinity,
                            delay: i * 0.5,
                        }}
                        style={{
                            top: `${20 + i * 15}%`,
                            left: `${10 + i * 15}%`,
                        }}
                    />
                ))}
            </div>

            <div className="relative p-6 z-10">
                <div className="flex items-start justify-between mb-4">
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
                    <div className="relative" ref={dropdownRef}>
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                setDropdownOpen(!dropdownOpen);
                            }}
                            className="p-2 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100/70 backdrop-blur-sm transition-all duration-300"
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(243, 244, 246, 0.7)" }}
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
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 z-20 overflow-hidden"
                                >
                                    {[
                                        {
                                            icon: FiEye,
                                            label: isViewing ? 'Viewing...' : 'View Document',
                                            onClick: handleViewClick,
                                            color: 'text-blue-600',
                                            disabled: isViewing
                                        },
                                        { icon: FiEdit2, label: 'Edit Document', onClick: handleEditClick, color: 'text-green-600' },
                                        { icon: FiDownload, label: 'Download', onClick: handleDownloadClick, color: 'text-indigo-600' },
                                        {
                                            icon: FiShare2,
                                            label: isGeneratingLink ? 'Generating...' : 'Share Public Link',
                                            onClick: generateShareLink,
                                            color: 'text-purple-600',
                                            disabled: isGeneratingLink || !isPublic
                                        },
                                        { icon: FiTrash2, label: 'Delete', onClick: handleDeleteClick, color: 'text-red-600' },
                                    ].map((item, index) => (
                                        <motion.button
                                            key={item.label}
                                            onClick={item.onClick}
                                            disabled={item.disabled}
                                            className={`w-full flex items-center px-4 py-3 text-sm ${item.color} hover:bg-gray-50/90 transition-colors duration-200 group/item disabled:opacity-50 disabled:cursor-not-allowed`}
                                            initial={{ x: -10, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{ x: item.disabled ? 0 : 4 }}
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
                <div className="space-y-4">
                    <motion.h3
                        className="text-xl font-bold text-gray-900 truncate group-hover:text-blue-800 transition-colors duration-300 cursor-pointer"
                        title={fileName}
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 1 }}
                        onClick={handleViewClick}
                    >
                        {fileName}
                    </motion.h3>
                    <motion.div
                        className="mt-2 inline-flex items-center"
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs font-semibold rounded-full border border-blue-200/50 shadow-sm">
                            {category}
                        </span>
                    </motion.div>
                    <motion.div
                        className="flex items-center justify-between pt-2"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center text-gray-600">
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 shadow-sm"></div>
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
            <motion.div
                className="relative px-6 py-4 bg-gradient-to-r from-gray-50/90 to-white/70 backdrop-blur-sm border-t border-white/30"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
            >
                <div className="flex flex-col space-y-3">
                    <div className="flex justify-between items-center">
                        <motion.div
                            className="flex items-center space-x-2 text-gray-600"
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full shadow-sm"></div>
                            <span className="text-xs font-medium">
                                Uploaded {formatDate(doc.uploadDate)}
                            </span>
                        </motion.div>
                        <div className="flex items-center">
                            <label className="flex items-center cursor-pointer">
                                <div className="mr-2 text-xs font-medium text-gray-600">
                                    {isPublic ? 'Public' : 'Private'}
                                </div>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={isPublic}
                                        onChange={handleTogglePrivacyClick}
                                        disabled={isTogglingPrivacy}
                                    />
                                    <div className={`block w-12 h-6 rounded-full transition-colors ${isPublic ? 'bg-green-400' : 'bg-gray-400'} shadow-inner`}></div>
                                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${isPublic ? 'translate-x-6' : ''} shadow-md`}>
                                        {isPublic ? (
                                            <FiGlobe className="w-3 h-3 text-green-500 mx-auto mt-0.5" />
                                        ) : (
                                            <FiLock className="w-3 h-3 text-gray-500 mx-auto mt-0.5" />
                                        )}
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-between items-center">
                        <div className="flex items-center">
                            {isPublic ? (
                                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full shadow-sm">
                                    <FiShare2 className="mr-1 w-3 h-3" />
                                    Public - Shareable
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full shadow-sm">
                                    <FiLock className="mr-1 w-3 h-3" />
                                    Private
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {isPublic && (
                                <motion.button
                                    onClick={generateShareLink}
                                    disabled={isGeneratingLink}
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group/share disabled:opacity-50 disabled:cursor-not-allowed"
                                    whileHover={{ scale: isGeneratingLink ? 1 : 1.05, y: isGeneratingLink ? 0 : -1 }}
                                    whileTap={{ scale: isGeneratingLink ? 1 : 0.95 }}
                                    aria-label={`Share ${fileName}`}
                                >
                                    {copied ? (
                                        <>
                                            <FiCheck className="mr-2 w-4 h-4" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <FiShare2 className="mr-2 w-4 h-4 group-hover/share:scale-110 transition-transform duration-300" />
                                            {isGeneratingLink ? 'Generating...' : 'Share'}
                                        </>
                                    )}
                                </motion.button>
                            )}
                            <motion.button
                                onClick={handleViewClick}
                                disabled={isViewing}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group/view disabled:opacity-50 disabled:cursor-not-allowed"
                                whileHover={{ scale: isViewing ? 1 : 1.05, y: isViewing ? 0 : -1 }}
                                whileTap={{ scale: isViewing ? 1 : 0.95 }}
                                aria-label={`View ${fileName}`}
                            >
                                <FiEye className="mr-2 w-4 h-4 group-hover/view:scale-110 transition-transform duration-300" />
                                {isViewing ? 'Opening...' : 'View'}
                            </motion.button>
                            <motion.button
                                onClick={handleDownloadClick}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group/download relative"
                                whileHover={{ scale: 1.05, y: -1 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label={`Download ${fileName}`}
                            >
                                <FiDownload className="mr-2 w-4 h-4 group-hover/download:rotate-12 transition-transform duration-300" />
                                Download
                                <span className="absolute inset-0 flex justify-center items-center opacity-0 group-hover/download:opacity-100 transition-opacity">
                                    <FiDownload className="w-4 h-4 animate-ping" />
                                </span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>
            <AnimatePresence>
                {showShareTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-4 right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-200 z-10 max-w-xs"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                                <FiCheck className="text-green-500 mr-2" />
                                <span className="text-sm font-medium">Link copied to clipboard!</span>
                            </div>
                            <button
                                onClick={() => setShowShareTooltip(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FiX className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 break-all bg-gray-50 p-2 rounded-lg">
                            {shareLink}
                        </div>
                        <div className="mt-2 text-xs text-blue-500 flex items-center">
                            <FiGlobe className="mr-1 w-3 h-3" />
                            Anyone with this link can view this document
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-pink-400/5 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />
        </motion.div>
    );
};

export default React.memo(DocumentCard);