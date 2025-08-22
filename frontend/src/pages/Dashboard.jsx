    import React, { useState, useEffect, useCallback, useRef } from 'react';
    import { FiUpload, FiFolder, FiSearch, FiGrid, FiList, FiFilter, FiTrendingUp, FiFile } from 'react-icons/fi';
    import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
    import { toast } from 'react-toastify';
    import DocumentCard from '../components/DocumentCard';
    import DocumentForm from '../components/DocumentForm';
    import DocumentList from '../components/DocumentList';
    import LoadingSpinner from '../components/LoadingSpinner';
    import { documentAPI } from '../api/api.js';
    import { formatDate, formatFileSize } from '../utils/documentUtils.js';
    
    const Dashboard = () => {
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
        const [currentUser, setCurrentUser] = useState(null);
        const [togglingPrivacyId, setTogglingPrivacyId] = useState(null);
        const [isHovering, setIsHovering] = useState(false);
        const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
        // Use a single ref for both scroll tracking and mouse tracking
        const dashboardRef = useRef(null);
    
        // Conditionally use scroll effects only when the ref is available
        const { scrollYProgress } = useScroll({
            target: dashboardRef.current ? dashboardRef : undefined,
            offset: ["start end", "end end"]
        });
        const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
        const y = useTransform(scrollYProgress, [0, 1], [50, 0]);
    
        // Mouse tracking
        useEffect(() => {
            const updateMousePosition = (e) => {
                if (dashboardRef.current) {
                    const rect = dashboardRef.current.getBoundingClientRect();
                    setMousePosition({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top
                    });
                }
            };
    
            const dashboard = dashboardRef.current;
            if (dashboard) {
                dashboard.addEventListener('mousemove', updateMousePosition);
                return () => dashboard.removeEventListener('mousemove', updateMousePosition);
            }
        }, []);
    
        useEffect(() => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    setCurrentUser({
                        username: payload.sub || payload.username,
                        id: payload.userId || payload.id,
                    });
                } catch (error) {
                    console.error('Error parsing token:', error);
                    fetchCurrentUser();
                }
            }
        }, []);
    
        const fetchCurrentUser = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/users/me', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (response.ok) {
                    const userData = await response.json();
                    setCurrentUser(userData);
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
                toast.error('Failed to fetch user information');
            }
        };
    
        useEffect(() => {
            const fetchDocuments = async () => {
                const token = localStorage.getItem('token');
                if (!token) {
                    setDocuments([]);
                    setIsLoading(false);
                    toast.info('Please log in to view and manage your documents');
                    return;
                }
    
                try {
                    setIsLoading(true);
                    const data = await documentAPI.getAllDocuments();
    
                    // Ensure consistent data structure
                    const formattedDocs = data.map((doc) => {
                        // Extract filename from various possible fields
                        const fileName = doc.filename || doc.name || doc.fileName || 'Untitled Document';
    
                        // Extract fileType from various possible fields
                        const fileType = doc.fileType || doc.type ||
                            (fileName.includes('.') ? fileName.split('.').pop().toUpperCase() : 'UNKNOWN');
    
                        // Extract fileSize ensuring it's a number
                        const fileSize = doc.fileSize || doc.size || 0;
    
                        // Extract uploadDate from various possible fields
                        const uploadDate = doc.uploadDate || doc.uploaded || doc.createdAt || new Date().toISOString();
    
                        return {
                            id: doc.id?.toString() || Math.random().toString(36).substr(2, 9),
                            fileName: fileName,
                            fileType: fileType,
                            category: doc.category || 'Uncategorized',
                            fileSize: fileSize,
                            uploadDate: uploadDate,
                            name: fileName, // For backward compatibility
                            type: fileType, // For backward compatibility
                            size: formatFileSize(fileSize),
                            uploaded: formatDate(uploadDate),
                            tags: doc.tags || [],
                            owner: doc.owner || { username: doc.ownerUsername || 'Unknown' },
                            isPublic: doc.isPublic || false,
                        };
                    });
    
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
        }, []);
    
        const filteredAndSortedDocuments = useCallback(() => {
            let filtered = documents.filter((doc) => {
                const searchLower = searchTerm.toLowerCase();
                const matchesSearch =
                    doc.fileName?.toLowerCase().includes(searchLower) ||
                    doc.category?.toLowerCase().includes(searchLower) ||
                    doc.tags?.some((tag) => tag?.toLowerCase().includes(searchLower));
    
                const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    
                return matchesSearch && matchesCategory;
            });
    
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
    
        const isDocumentOwner = useCallback(
            (document) => {
                if (!currentUser || !document) return false;
                if (document.owner) {
                    return document.owner.username === currentUser.username;
                }
                return true;
            },
            [currentUser],
        );
    
        const categories = useCallback(() => {
            const cats = [...new Set(documents.map((doc) => doc.category).filter(Boolean))];
            return cats.length ? cats : ['Personal', 'Professional', 'Financial', 'Legal', 'Medical', 'Other'];
        }, [documents]);
    
        const stats = useCallback(() => {
            const totalSize = documents.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);
            const categoryCount = {};
            documents.forEach((doc) => {
                categoryCount[doc.category] = (categoryCount[doc.category] || 0) + 1;
            });
    
            return {
                total: documents.length,
                totalSize: formatFileSize(totalSize),
                categories: Object.keys(categoryCount).length,
                mostUsedCategory: Object.keys(categoryCount).reduce(
                    (a, b) => (categoryCount[a] > categoryCount[b] ? a : b),
                    'None',
                ),
            };
        }, [documents]);
    
        const handleTogglePrivacy = async (documentId, isPublic) => {
            setTogglingPrivacyId(documentId);
            try {
                // Update the document's privacy state locally only
                setDocuments((prev) =>
                    prev.map((doc) =>
                        doc.id === documentId ? { ...doc, isPublic } : doc,
                    ),
                );
    
                toast.success(`Document is now ${isPublic ? 'public' : 'private'}`);
            } catch (error) {
                console.error('Error toggling privacy:', error);
                toast.error('Failed to update privacy');
                // Revert the change
                setDocuments((prev) =>
                    prev.map((doc) =>
                        doc.id === documentId ? { ...doc, isPublic: !isPublic } : doc,
                    ),
                );
            } finally {
                setTogglingPrivacyId(null);
            }
        };
    
        const handleUpload = async (newDoc, file) => {
            setUploading(true);
            try {
                const uploadedDoc = await documentAPI.uploadDocument(
                    file,
                    newDoc.category,
                    newDoc.name || file.name
                );
    
                console.log('Upload response:', uploadedDoc); // Debug log
    
                setDocuments((prev) => [
                    {
                        id: uploadedDoc.id?.toString() || Math.random().toString(36).substr(2, 9),
                        fileName: uploadedDoc.filename || uploadedDoc.name || file.name,
                        fileType: uploadedDoc.fileType || file.type ||
                            (file.name.includes('.') ? file.name.split('.').pop().toUpperCase() : 'UNKNOWN'),
                        category: uploadedDoc.category || newDoc.category || 'Uncategorized',
                        fileSize: uploadedDoc.fileSize || file.size,
                        uploadDate: uploadedDoc.uploadDate || new Date().toISOString(),
                        name: uploadedDoc.filename || uploadedDoc.name || file.name,
                        type: uploadedDoc.fileType || file.type ||
                            (file.name.includes('.') ? file.name.split('.').pop().toUpperCase() : 'UNKNOWN'),
                        size: formatFileSize(uploadedDoc.fileSize || file.size),
                        uploaded: formatDate(uploadedDoc.uploadDate || new Date()),
                        tags: uploadedDoc.tags || [],
                        owner: currentUser,
                        isPublic: uploadedDoc.isPublic || false,
                    },
                    ...prev,
                ]);
    
                toast.success('Document uploaded successfully');
                setIsModalOpen(false);
            } catch (error) {
                console.error('Error uploading document:', error);
                toast.error(error.message || 'Failed to upload document');
            } finally {
                setUploading(false);
            }
        };
    
        const handleUpdate = async (updatedDoc, file) => {
            try {
                await documentAPI.updateDocument(updatedDoc.id, file, updatedDoc.category, updatedDoc.name);
    
                setDocuments((prev) =>
                    prev.map((doc) =>
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
                                    uploadDate: new Date().toISOString(),
                                }),
                            }
                            : doc,
                    ),
                );
    
                setIsModalOpen(false);
                setCurrentDocument(null);
                toast.success('Document updated successfully');
            } catch (error) {
                console.error('Error updating document:', error);
                toast.error(error.message || 'Failed to update document');
            }
        };
    
        const handleDelete = async (id) => {
            if (!window.confirm('Are you sure you want to delete this document?')) return;
    
            setDeletingId(id);
            try {
                await documentAPI.deleteDocument(id);
                setDocuments((prev) => prev.filter((doc) => doc.id !== id));
                toast.success('Document deleted successfully');
            } catch (error) {
                console.error('Error deleting document:', error);
                toast.error(error.message || 'Failed to delete document');
            } finally {
                setDeletingId(null);
            }
        };
    
        const handleDownload = async (id, fileName) => {
            setDownloadingId(id);
            try {
                await documentAPI.downloadDocument(id, fileName);
                toast.success('Download started');
            } catch (error) {
                console.error('Error downloading document:', error);
                toast.error(error.message || 'Failed to download document');
            } finally {
                setDownloadingId(null);
            }
        };
    
        const containerVariants = {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.1,
                },
            },
        };
    
        const itemVariants = {
            hidden: { y: 20, opacity: 0 },
            visible: {
                y: 0,
                opacity: 1,
                transition: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 24,
                },
            },
        };
    
        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
                    <LoadingSpinner />
                </div>
            );
        }
    
        const currentStats = stats();
    
        return (
            <motion.div
                ref={dashboardRef}
                style={{ y, opacity }}
                className="relative min-h-screen overflow-hidden"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.08),transparent_50%)] opacity-60" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(168,85,247,0.06),transparent_50%)] opacity-40" />
                    {[...Array(10)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            animate={{
                                x: [0, Math.random() * 40 - 20],
                                y: [0, Math.random() * 40 - 20],
                                rotate: [0, 360],
                                scale: [0.9, 1.1, 0.9],
                            }}
                            transition={{
                                duration: Math.random() * 6 + 4,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                                ease: "easeInOut"
                            }}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                        >
                            <div className="w-2 h-2 bg-blue-200 rounded-full opacity-20" />
                        </motion.div>
                    ))}
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
    
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-16"
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 px-6 py-3 mb-6 text-sm font-medium text-blue-700 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-full shadow-sm backdrop-blur-sm"
                            whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)" }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <FiFolder className="w-4 h-4" />
                            Your Secure Document Vault
                        </motion.div>
                        <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text mb-4">
                            Document Vault
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl">
                            Manage your digital documents with military-grade security and seamless organization.
                        </p>
                    </motion.div>
    
                    {/* Stats Section */}
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {[
                            { label: 'Total Documents', value: currentStats.total, icon: FiFile, color: 'blue' },
                            { label: 'Storage Used', value: currentStats.totalSize, icon: FiTrendingUp, color: 'green' },
                            { label: 'Categories', value: currentStats.categories, icon: FiFolder, color: 'purple' },
                            { label: 'Filtered', value: filteredDocuments.length, icon: FiFilter, color: 'orange' },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
                                whileHover={{ y: -8, scale: 1.02 }}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-xl bg-${stat.color}-100 shadow-inner`}>
                                        <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                        <p className="text-sm text-gray-600">{stat.label}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
    
                    {/* Upload Button */}
                    <motion.div
                        className="mb-12 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <motion.button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiUpload className="mr-3 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                            Upload Document
                            <div className="ml-2 w-2 h-2 bg-white/30 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                        </motion.button>
                    </motion.div>
    
                    {/* Filters and Search */}
                    <motion.div
                        className="mb-12 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="relative flex-grow max-w-xl">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FiSearch className="text-gray-400 w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search documents, categories, or tags..."
                                    className="block w-full pl-12 pr-4 py-4 border-0 rounded-xl bg-white/90 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm text-gray-800 transition-all duration-300"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="appearance-none bg-white/90 border-0 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all duration-300"
                                    >
                                        <option value="all">All Categories</option>
                                        {categories().map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                    <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                </div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-white/90 border-0 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all duration-300"
                                >
                                    <option value="uploadDate">Sort by Date</option>
                                    <option value="name">Sort by Name</option>
                                    <option value="size">Sort by Size</option>
                                </select>
                                <div className="flex space-x-1 bg-gray-100/80 p-1 rounded-xl backdrop-blur-sm">
                                    <motion.button
                                        onClick={() => setViewMode('grid')}
                                        className={`px-4 py-3 rounded-lg flex items-center transition-all duration-300 ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiGrid className="mr-2 w-4 h-4" /> Grid
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setViewMode('list')}
                                        className={`px-4 py-3 rounded-lg flex items-center transition-all duration-300 ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiList className="mr-2 w-4 h-4" /> List
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
    
                    {/* Documents Display */}
                    <AnimatePresence mode="wait">
                        {filteredDocuments.length === 0 ? (
                            <motion.div
                                className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200/50"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                                    <FiFolder className="mx-auto h-20 w-20 text-gray-400" />
                                </motion.div>
                                <h3 className="mt-6 text-2xl font-semibold text-gray-800">
                                    {searchTerm.length > 0 ? 'No documents match your search' : 'Your document vault awaits'}
                                </h3>
                                <p className="mt-3 text-gray-600 max-w-md mx-auto">
                                    {searchTerm.length > 0
                                        ? 'Try different search terms or adjust your filters'
                                        : 'Upload your first document to begin organizing your digital life'}
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
                                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
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
                                                    type: 'spring',
                                                    stiffness: 300,
                                                    damping: 24,
                                                }}
                                                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
                                            >
                                                <DocumentCard
                                                    document={document}
                                                    onEdit={() => {
                                                        setCurrentDocument(document);
                                                        setIsModalOpen(true);
                                                    }}
                                                    onDelete={handleDelete}
                                                    onDownload={handleDownload}
                                                    onTogglePrivacy={handleTogglePrivacy}
                                                    isTogglingPrivacy={togglingPrivacyId === document.id}
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
                                            isOwnerCheck={isDocumentOwner}
                                            onEdit={(doc) => {
                                                setCurrentDocument(doc);
                                                setIsModalOpen(true);
                                            }}
                                            onDelete={handleDelete}
                                            onDownload={handleDownload}
                                            onTogglePrivacy={handleTogglePrivacy}
                                            isTogglingPrivacy={togglingPrivacyId}
                                        />
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
    
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
    
                {/* Subtle Accent Elements */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full filter blur-3xl opacity-60" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/30 rounded-full filter blur-3xl opacity-40" />
            </motion.div>
        );
    };
    
    export default Dashboard;