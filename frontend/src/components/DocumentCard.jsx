import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiEdit2, FiTrash2, FiDownload, FiMoreVertical, FiFile, FiEye, FiClock, FiShare2, FiCopy, FiGlobe, FiLock, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import {documentAPI} from "../api/api.js";

const DocumentCard = ({ document: doc, onEdit, onDelete, onDownload, onTogglePrivacy }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);
    const [shareLink, setShareLink] = useState('');
    const [showShareTooltip, setShowShareTooltip] = useState(false);
    const [isPublic, setIsPublic] = useState(doc.isPublic || false);
    const [copied, setCopied] = useState(false);
    const dropdownRef = useRef(null);

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

    // Update isPublic state when doc prop changes
    useEffect(() => {
        setIsPublic(doc.isPublic || false);
    }, [doc.isPublic]);

    // Format file type
    const formatFileType = useCallback((type) => {
        if (!type) return 'FILE';
        const parts = type.split('/');
        return parts[parts.length - 1].toUpperCase();
    }, []);

    // Format date
    const formatDate = useCallback((dateString) => {
        if (!dateString) return 'Recently';
        try {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        } catch {
            return 'Recently';
        }
    }, []);

    // View document
    const viewDocument = async (documentId) => {
        try {
            setIsViewing(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/documents/view/${documentId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch document');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');

            // Clean up after a delay
            setTimeout(() => URL.revokeObjectURL(url), 10000);
        } catch (error) {
            console.error('Error viewing document:', error);
            alert('Unable to view this file. Please try downloading instead.');
        } finally {
            setIsViewing(false);
            setDropdownOpen(false);
        }
    };

    const handleViewClick = useCallback((e) => {
        e?.stopPropagation();
        viewDocument(doc.id);
    }, [doc.id]);

    // Format file size
    const formatFileSize = useCallback((bytes) => {
        if (!bytes) return 'Unknown size';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }, []);

    // Get file icon color based on type
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
            case 'png':
            case 'gif':
            case 'webp': return { bg: 'bg-gradient-to-br from-purple-100 to-purple-200', text: 'text-purple-600', border: 'border-purple-200', glow: 'shadow-purple-200/50' };
            case 'txt': return { bg: 'bg-gradient-to-br from-gray-100 to-gray-200', text: 'text-gray-600', border: 'border-gray-200', glow: 'shadow-gray-200/50' };
            case 'zip':
            case 'rar': return { bg: 'bg-gradient-to-br from-yellow-100 to-yellow-200', text: 'text-yellow-600', border: 'border-yellow-200', glow: 'shadow-yellow-200/50' };
            default: return { bg: 'bg-gradient-to-br from-indigo-100 to-indigo-200', text: 'text-indigo-600', border: 'border-indigo-200', glow: 'shadow-indigo-200/50' };
        }
    }, [formatFileType]);

    // Download handler
    const handleDownloadClick = useCallback((e) => {
        e?.stopPropagation();
        onDownload(doc.id, doc.fileName || doc.name);
        setDropdownOpen(false);
    }, [doc.id, doc.fileName, doc.name, onDownload]);

    // Edit handler
    const handleEditClick = useCallback((e) => {
        e?.stopPropagation();
        onEdit(doc);
        setDropdownOpen(false);
    }, [doc, onEdit]);

    // Delete handler
    const handleDeleteClick = useCallback((e) => {
        e?.stopPropagation();
        if (window.confirm(`Are you sure you want to delete "${doc.fileName || doc.name}"?`)) {
            onDelete(doc.id);
        }
        setDropdownOpen(false);
    }, [doc.id, doc.fileName, doc.name, onDelete]);



    // Toggle privacy
    const handleTogglePrivacy = useCallback(async () => {
        const newPrivacyState = !isPublic;
        setIsPublic(newPrivacyState);

        if (onTogglePrivacy) {
            try {
                await onTogglePrivacy(doc.id, newPrivacyState);
            } catch (error) {
                // Revert if there's an error
                setIsPublic(!newPrivacyState);
                console.error('Error toggling privacy:', error);
                alert('Failed to update document privacy. Please try again.');
            }
        }
    }, [doc.id, isPublic, onTogglePrivacy]);

    const shareDocument = async (documentId, isPublic, expiryDays, maxViews) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/documents/share', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    documentId,
                    isPublic,
                    expiryDays,
                    maxViews
                })
            });

            if (response.status === 403) {
                throw new Error('You do not have permission to share this document');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to share document');
            }

            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Failed to share document');
        }
    };



    // Generate share link
    // Replace the generateShareLink function with this version
    const generateShareLink = useCallback(async () => {
        try {
            setIsGeneratingLink(true);
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:8080/api/documents/share', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    documentId: doc.id,
                    isPublic: true,
                    expiryDays: 30,
                    maxViews: 100
                })
            });

            // Handle 403 error specifically
            if (response.status === 403) {
                throw new Error('You do not have permission to share this document');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to generate share link');
            }

            const shareResponse = await response.json();

            // Use the correct URL format for shared documents
            const fullShareUrl = `${window.location.origin}/shared/${shareResponse.token}`;
            setShareLink(fullShareUrl);

            navigator.clipboard.writeText(fullShareUrl);
            setShowShareTooltip(true);
            setCopied(true);
            setTimeout(() => {
                setShowShareTooltip(false);
                setCopied(false);
            }, 3000);

        } catch (error) {
            console.error('Error generating share link:', error);
            alert(`Unable to generate share link: ${error.message}`);
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
            className="group relative bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-500 overflow-hidden"
            style={{ minHeight: '340px' }}
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
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 z-20 overflow-hidden"
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
                                            className={`w-full flex items-center px-4 py-3 text-sm ${item.color} hover:bg-gray-50/80 transition-colors duration-200 group/item disabled:opacity-50 disabled:cursor-not-allowed`}
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

                {/* Document Info Section */}
                <div className="space-y-4">
                    {/* Title */}
                    <div>
                        <motion.h3
                            className="text-xl font-bold text-gray-900 truncate group-hover:text-blue-800 transition-colors duration-300 cursor-pointer"
                            title={fileName}
                            initial={{ opacity: 0.8 }}
                            animate={{ opacity: 1 }}
                            onClick={handleViewClick}
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

            {/* Enhanced Footer with more space for buttons */}
            <motion.div
                className="relative px-6 py-4 bg-gradient-to-r from-gray-50/80 to-white/60 backdrop-blur-sm border-t border-white/30"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
            >
                <div className="flex flex-col space-y-3">
                    {/* Privacy Toggle and Upload Info */}
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

                        {/* Privacy Toggle Switch */}
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
                                        onChange={handleTogglePrivacy}
                                    />
                                    <div className={`block w-12 h-6 rounded-full transition-colors ${isPublic ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${isPublic ? 'translate-x-6' : ''}`}>
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
                        {/* Share status indicator */}
                        <div className="flex items-center">
                            {isPublic ? (
                                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                    <FiShare2 className="mr-1 w-3 h-3" />
                                    Public - Shareable
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                                    <FiLock className="mr-1 w-3 h-3" />
                                    Private
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {/* Share Button - Only shown when document is public */}
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

                            {/* View Button */}
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

                            {/* Download Button - Made more prominent */}
                            <motion.button
                                onClick={handleDownloadClick}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group/download relative"
                                whileHover={{ scale: 1.05, y: -1 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label={`Download ${fileName}`}
                            >
                                <FiDownload className="mr-2 w-4 h-4 group-hover/download:rotate-12 transition-transform duration-300" />
                                Download
                                {/* Subtle highlight effect */}
                                <span className="absolute inset-0 flex justify-center items-center opacity-0 group-hover/download:opacity-100 transition-opacity">
                                    <FiDownload className="w-4 h-4 animate-ping" />
                                </span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Share Link Tooltip */}
            <AnimatePresence>
                {showShareTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200 z-10 max-w-xs"
                    >
                        <div className="flex items-center">
                            <FiCopy className="text-green-500 mr-2" />
                            <span className="text-sm font-medium">Shareable link copied to clipboard!</span>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 break-all">
                            {shareLink}
                        </div>
                        <div className="mt-2 text-xs text-blue-500">
                            Anyone with this link can view this document
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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

export default React.memo(DocumentCard);