import React, { useState, useEffect, useCallback } from 'react';
import { FiUpload, FiFolder, FiSearch, FiGrid, FiList, FiFilter, FiTrendingUp, FiFile } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import DocumentCard from '../components/DocumentCard';
import DocumentList from '../components/DocumentList';
import DocumentForm from '../components/DocumentForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { documentAPI } from '../api/api.js';
import { toast } from 'react-toastify';
import {formatDate, formatFileSize} from "../utils/documentUtils.js";

const Dashboard = () => {
    // ===== State Management =====
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDocument, setCurrentDocument] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('uploadDate');
    const [uploading, setUploading] = useState(false);
    const [downloadingId, setDownloadingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const API_BASE_URL = 'http://localhost:8080/api/documents';

    // ===== Helper Functions =====
    // const formatFileSize = useCallback((bytes) => {
    //     if (!bytes) return '0 Bytes';
    //     const k = 1024;
    //     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    //     const i = Math.floor(Math.log(bytes) / Math.log(k));
    //     return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    // }, []);
    //
    // const formatDate = useCallback((dateString) => {
    //     if (!dateString) return 'Recently';
    //     try {
    //         const options = { year: 'numeric', month: 'short', day: 'numeric' };
    //         return new Date(dateString).toLocaleDateString(undefined, options);
    //     } catch {
    //         return 'Recently';
    //     }
    // }, []);

    // ===== Fetch Documents on Mount =====
    useEffect(() => {
        const fetchDocuments = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setDocuments([]); // Empty array for unauthenticated users
                setIsLoading(false);
                toast.info('Please log in to view and manage your documents');
                return;
            }

            try {
                setIsLoading(true);
                const data = await documentAPI.getAllDocuments();
                const formattedDocs = data.map(doc => ({
                    id: doc.id,
                    fileName: doc.filename || doc.name,
                    fileType: doc.fileType,
                    category: doc.category,
                    fileSize: doc.fileSize,
                    uploadDate: doc.uploadDate,
                    name: doc.filename || doc.name,
                    type: doc.fileType,
                    size: doc.size || formatFileSize(doc.fileSize),
                    uploaded: doc.uploaded || formatDate(doc.uploadDate),
                    tags: doc.tags || []
                }));
                setDocuments(formattedDocs);
            } catch (error) {
                console.error('Failed to fetch documents:', error);
                toast.error(error.message || 'Failed to load documents');
                if (error.message.includes('Access denied') || error.message.includes('Unauthorized')) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchDocuments();
    }, [formatDate, formatFileSize]);

    // ===== Filter and Sort Documents =====
    const filteredAndSortedDocuments = useCallback(() => {
        let filtered = documents.filter(doc => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                doc.fileName?.toLowerCase().includes(searchLower) ||
                doc.category?.toLowerCase().includes(searchLower) ||
                doc.tags?.some(tag => tag?.toLowerCase().includes(searchLower));

            const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        // Sort documents
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return (a.fileName || '').localeCompare(b.fileName || '');
                case 'size':
                    return (b.fileSize || 0) - (a.fileSize || 0);
                case 'uploadDate':
                default:
                    return new Date(b.uploadDate || 0) - new Date(a.uploadDate || 0);
            }
        });

        return filtered;
    }, [documents, searchTerm, selectedCategory, sortBy]);

    const filteredDocuments = filteredAndSortedDocuments();

    // ===== Get Categories for Filter =====
    const categories = useCallback(() => {
        const cats = [...new Set(documents.map(doc => doc.category).filter(Boolean))];
        return cats.length ? cats : ['Personal', 'Professional', 'Financial', 'Legal', 'Medical', 'Other'];
    }, [documents]);

    // ===== Get Statistics =====
    const stats = useCallback(() => {
        const totalSize = documents.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);
        const categoryCount = {};
        documents.forEach(doc => {
            categoryCount[doc.category] = (categoryCount[doc.category] || 0) + 1;
        });

        return {
            total: documents.length,
            totalSize: formatFileSize(totalSize),
            categories: Object.keys(categoryCount).length,
            mostUsedCategory: Object.keys(categoryCount).reduce((a, b) =>
                categoryCount[a] > categoryCount[b] ? a : b, 'None'
            )
        };
    }, [documents, formatFileSize]);

    // Update your handleUpload function
    const handleUpload = async (newDoc, file) => {
        setUploading(true);
        try {
            const uploadedDoc = await documentAPI.uploadDocument(
                file,
                newDoc.category,
                newDoc.name || file.name
            );

            setDocuments(prev => [{
                ...uploadedDoc,
                id: uploadedDoc.id.toString(),
                fileName: uploadedDoc.name,
                fileType: uploadedDoc.type || file.type,
                fileSize: file.size,
                uploadDate: new Date().toISOString(),
                size: formatFileSize(file.size),
                uploaded: formatDate(new Date()),
            }, ...prev]);

            toast.success('Document uploaded successfully');
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleUpdate = async (updatedDoc, file) => {
        try {
            await documentAPI.updateDocument(
                updatedDoc.id,
                file,
                updatedDoc.category,
                updatedDoc.name
            );

            setDocuments(documents.map(doc =>
                doc.id === updatedDoc.id
                    ? {
                        ...doc,
                        fileName: updatedDoc.name,
                        name: updatedDoc.name,
                        category: updatedDoc.category,
                        ...(file && {
                            fileType: file.type,
                            type: file.name.split('.').pop().toUpperCase(),
                            fileSize: file.size,
                            size: formatFileSize(file.size),
                            uploadDate: new Date().toISOString()
                        })
                    }
                    : doc
            ));

            setIsModalOpen(false);
            setCurrentDocument(null);
            toast.success('Document updated successfully');
        } catch (error) {
            console.error('Error updating document:', error);
            toast.error(error.message || 'Failed to update document');
        }
    };

    // Update your delete handler
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;

        setDeletingId(id);
        try {
            await documentAPI.deleteDocument(id);
            setDocuments(prev => prev.filter(doc => doc.id !== id));
            toast.success('Document deleted successfully');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setDeletingId(null);
        }
    };

    // Update your download handler
    const handleDownload = async (id, fileName) => {
        setDownloadingId(id);
        try {
            await documentAPI.downloadDocument(id, fileName);
            toast.success('Download started');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setDownloadingId(null);
        }
    };

    // ===== Animation Variants =====
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        }
    };

    // ===== Loading State =====
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <LoadingSpinner />
            </div>
        );
    }

    const currentStats = stats();

    // ===== JSX Layout =====
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Enhanced Header */}
            <motion.div
                className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <motion.div
                            className="flex-1"
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                                    <FiFolder className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                                        Document Vault
                                    </h1>
                                    <p className="text-lg text-gray-600 mt-1">
                                        Manage your digital documents with ease
                                    </p>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <motion.div
                                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {[
                                    { label: 'Total Documents', value: currentStats.total, icon: FiFile, color: 'blue' },
                                    { label: 'Storage Used', value: currentStats.totalSize, icon: FiTrendingUp, color: 'green' },
                                    { label: 'Categories', value: currentStats.categories, icon: FiFolder, color: 'purple' },
                                    { label: 'Filtered', value: filteredDocuments.length, icon: FiFilter, color: 'orange' }
                                ].map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        className={`bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white/30 hover:shadow-md transition-all duration-300`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                                                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                                <p className="text-sm text-gray-600">{stat.label}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Upload Button */}
                        <motion.div
                            className="mt-6 lg:mt-0 lg:ml-8"
                            initial={{ x: 30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 group"
                            >
                                <FiUpload className="mr-3 group-hover:rotate-12 transition-transform duration-300" />
                                Upload Document
                                <div className="ml-2 w-2 h-2 bg-white/30 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                            </button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Enhanced Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Enhanced Search & Controls */}
                <motion.div
                    className="mb-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Search Box */}
                        <div className="relative flex-grow max-w-xl">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400 w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search documents, categories, or tags..."
                                className="block w-full pl-12 pr-4 py-4 border-0 rounded-xl bg-white/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm text-gray-900 transition-all duration-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Category Filter */}
                            <div className="relative">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="appearance-none bg-white/80 backdrop-blur-sm border-0 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all duration-300"
                                >
                                    <option value="all">All Categories</option>
                                    {categories().map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                            </div>

                            {/* Sort Dropdown */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-white/80 backdrop-blur-sm border-0 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all duration-300"
                            >
                                <option value="uploadDate">Sort by Date</option>
                                <option value="name">Sort by Name</option>
                                <option value="size">Sort by Size</option>
                            </select>

                            {/* View Toggle */}
                            <div className="flex space-x-1 bg-gray-100/80 p-1 rounded-xl backdrop-blur-sm">
                                <motion.button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-4 py-3 rounded-lg flex items-center transition-all duration-300 ${
                                        viewMode === 'grid'
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiGrid className="mr-2 w-4 h-4" /> Grid
                                </motion.button>
                                <motion.button
                                    onClick={() => setViewMode('list')}
                                    className={`px-4 py-3 rounded-lg flex items-center transition-all duration-300 ${
                                        viewMode === 'list'
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiList className="mr-2 w-4 h-4" /> List
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Documents Section */}
                <AnimatePresence mode="wait">
                    {filteredDocuments.length === 0 ? (
                        <motion.div
                            className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-300/50"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <FiFolder className="mx-auto h-20 w-20 text-gray-400" />
                            </motion.div>
                            <h3 className="mt-6 text-2xl font-semibold text-gray-900">
                                {searchTerm.length > 0 ? 'No documents match your search' : 'Your document vault awaits'}
                            </h3>
                            <p className="mt-3 text-gray-600 max-w-md mx-auto">
                                {searchTerm.length > 0 ? 'Try different search terms or adjust your filters' : 'Upload your first document to begin organizing your digital life'}
                            </p>
                            {searchTerm.length === 0 && (
                                <motion.div
                                    className="mt-8"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <motion.button
                                        onClick={() => setIsModalOpen(true)}
                                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiUpload className="mr-3 w-5 h-5" />
                                        Upload Your First Document
                                    </motion.button>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key={viewMode}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            {viewMode === 'grid' ? (
                                <motion.div
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {filteredDocuments.map((document, index) => (
                                        <motion.div
                                            key={document.id}
                                            variants={itemVariants}
                                            initial={{ opacity: 0, y: 50 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                delay: index * 0.1,
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 24
                                            }}
                                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                        >
                                            <DocumentCard
                                                document={document}
                                                onEdit={() => {
                                                    setCurrentDocument(document);
                                                    setIsModalOpen(true);
                                                }}
                                                onDelete={handleDelete}
                                                onDownload={handleDownload}
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <DocumentList
                                        documents={filteredDocuments}
                                        onEdit={(doc) => {
                                            setCurrentDocument(doc);
                                            setIsModalOpen(true);
                                        }}
                                        onDelete={handleDelete}
                                        onDownload={handleDownload}
                                    />
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Modal for Upload/Edit */}
            <DocumentForm
                isOpen={isModalOpen || !!currentDocument}
                onClose={() => {
                    setIsModalOpen(false);
                    setCurrentDocument(null);
                }}
                onSubmit={currentDocument ? handleUpdate : handleUpload}
                document={currentDocument}
            />
        </div>
    );
};

export default Dashboard;