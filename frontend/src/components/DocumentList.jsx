// src/components/DocumentList.jsx
import React from 'react';
import { FiEdit2, FiTrash2, FiDownload, FiFile, FiClock, FiFolder, FiTrendingUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { formatFileType, formatDate, formatFileSize } from '../utils/documentUtils';

const DocumentList = ({ documents, onEdit, onDelete, onDownload, onTogglePrivacy, isTogglingPrivacy, isOwnerCheck }) => {
    const getFileIconColor = (type) => {
        const formattedType = formatFileType(type).toLowerCase();
        switch (formattedType) {
            case 'pdf': return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' };
            case 'doc':
            case 'docx': return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' };
            case 'xls':
            case 'xlsx': return { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' };
            case 'jpg':
            case 'jpeg':
            case 'png': return { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' };
            case 'txt': return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' };
            case 'zip':
            case 'rar': return { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200' };
            default: return { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' };
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20, scale: 0.95 },
        visible: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24, duration: 0.4 } }
    };

    return (
        <motion.div
            className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="bg-gradient-to-r from-gray-50/80 to-white/60 px-6 py-4 border-b border-white/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
                            <FiFolder className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Document List</h3>
                            <p className="text-sm text-gray-500">{documents.length} documents</p>
                        </div>
                    </div>
                    <div className="hidden lg:flex items-center space-x-8 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        <span className="w-20 text-center">Type</span>
                        <span className="w-24 text-center">Size</span>
                        <span className="w-32 text-center">Modified</span>
                        <span className="w-24 text-center">Actions</span>
                    </div>
                </div>
            </div>
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <ul className="divide-y divide-gray-100/50">
                    <AnimatePresence mode="popLayout">
                        {documents.map((document, index) => {
                            const fileColors = getFileIconColor(document.fileType || document.type);
                            const fileName = document.fileName || document.name;
                            const category = document.category || 'Uncategorized';
                            const isOwner = isOwnerCheck(document);

                            return (
                                <motion.li
                                    key={document.id}
                                    variants={itemVariants}
                                    layout
                                    whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.02)", scale: 1.01, x: 4 }}
                                    className="group transition-colors duration-300"
                                >
                                    <div className="px-6 py-5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 flex-1 min-w-0">
                                                <motion.div
                                                    className={`${fileColors.bg} ${fileColors.border} border-2 rounded-xl p-3 shadow-sm`}
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <FiFile className={`w-4 h-4 ${fileColors.text}`} />
                                                        <span className={`font-bold text-xs uppercase ${fileColors.text}`}>
                                                            {formatFileType(document.fileType || document.type)}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-3">
                                                        <h4 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-800 transition-colors duration-300">
                                                            {fileName}
                                                        </h4>
                                                        <motion.span
                                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200/50"
                                                            initial={{ scale: 0.8, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            transition={{ delay: index * 0.05 }}
                                                        >
                                                            {category}
                                                        </motion.span>
                                                        {document.isPublic !== undefined && (
                                                            <span
                                                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                                    document.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                                }`}
                                                            >
                                                                {document.isPublic ? 'Public' : 'Private'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="mt-2 flex items-center space-x-6 text-sm text-gray-500">
                                                        <div className="flex items-center space-x-1">
                                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                            <span>{formatFileSize(document.fileSize)}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <FiClock className="w-4 h-4" />
                                                            <span>{formatDate(document.uploadDate || document.uploaded)}</span>
                                                        </div>
                                                        {document.owner && (
                                                            <div className="flex items-center space-x-1">
                                                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                                <span>{document.owner.username}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <motion.div
                                                className="flex items-center space-x-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                                                initial={{ x: 10, opacity: 0 }}
                                                animate={{ x: 0, opacity: 0.6 }}
                                                whileHover={{ opacity: 1 }}
                                                transition={{ delay: index * 0.02 }}
                                            >
                                                {[
                                                    {
                                                        icon: FiEdit2,
                                                        onClick: () => onEdit(document),
                                                        className: "text-green-600 hover:text-green-700 hover:bg-green-50",
                                                        label: "Edit document",
                                                        show: isOwner
                                                    },
                                                    {
                                                        icon: FiDownload,
                                                        onClick: () => onDownload(document.id, fileName),
                                                        className: "text-blue-600 hover:text-blue-700 hover:bg-blue-50",
                                                        label: "Download document",
                                                        show: true
                                                    },
                                                    {
                                                        icon: FiTrendingUp,
                                                        onClick: () => onTogglePrivacy(document.id, !document.isPublic),
                                                        className: document.isPublic ? "text-purple-600 hover:text-purple-700 hover:bg-purple-50" : "text-gray-600 hover:text-gray-700 hover:bg-gray-50",
                                                        label: document.isPublic ? "Make private" : "Make public",
                                                        show: isOwner,
                                                        loading: isTogglingPrivacy === document.id
                                                    },
                                                    {
                                                        icon: FiTrash2,
                                                        onClick: () => {
                                                            if (window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
                                                                onDelete(document.id);
                                                            }
                                                        },
                                                        className: "text-red-600 hover:text-red-700 hover:bg-red-50",
                                                        label: "Delete document",
                                                        show: isOwner
                                                    }
                                                ].map((action, actionIndex) => (
                                                    action.show && (
                                                        <motion.button
                                                            key={actionIndex}
                                                            onClick={action.onClick}
                                                            disabled={action.loading}
                                                            className={`p-3 rounded-xl transition-all duration-200 ${action.className} group/action`}
                                                            aria-label={action.label}
                                                            whileHover={{ scale: 1.1, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                                                            whileTap={{ scale: 0.95 }}
                                                            initial={{ scale: 0.8, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            transition={{ delay: (index * 0.05) + (actionIndex * 0.1) }}
                                                        >
                                                            {action.loading ? (
                                                                <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
                                                            ) : (
                                                                <action.icon className="w-4 h-4 group-hover/action:scale-110 transition-transform duration-200" />
                                                            )}
                                                        </motion.button>
                                                    )
                                                ))}
                                            </motion.div>
                                        </div>
                                    </div>
                                    <motion.div
                                        className="h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100"
                                        initial={{ scaleX: 0 }}
                                        whileHover={{ scaleX: 1 }}
                                        transition={{ duration: 0.3 }}
                                        style={{ originX: 0 }}
                                    />
                                </motion.li>
                            );
                        })}
                    </AnimatePresence>
                </ul>
            </motion.div>

            {/* Footer section matching the dashboard style */}
            {documents.length > 0 && (
                <motion.div
                    className="bg-gradient-to-r from-gray-50/60 to-white/40 px-6 py-4 border-t border-white/30"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                            <span className="font-medium">
                                {documents.length} document{documents.length !== 1 ? 's' : ''}
                            </span>
                            <div className="w-1 h-1 bg-gray-400 rounded-full hidden sm:block"></div>
                            <span className="hidden sm:block">
                                {formatFileSize(documents.reduce((sum, doc) => sum + (doc.fileSize || 0), 0))} total size
                            </span>
                        </div>

                        <motion.div
                            className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-gray-100"
                            initial={{ x: 10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center space-x-2">
                                <div className="flex space-x-1">
                                    {[1, 2, 3].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="w-2 h-2 bg-blue-400 rounded-full"
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500">Live sync enabled</span>
                            </div>

                            <div className="w-px h-4 bg-gray-300"></div>

                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-xs text-gray-500">All systems operational</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default React.memo(DocumentList);