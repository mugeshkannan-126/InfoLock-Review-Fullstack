import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiFile, FiAlertTriangle, FiLoader, FiDownload, FiEye, FiShare2, FiClock, FiXCircle } from 'react-icons/fi';

const SharedDocument = () => {
    const { token } = useParams();
    const [documentUrl, setDocumentUrl] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fileType, setFileType] = useState(null);
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState('');
    const [activeTab, setActiveTab] = useState('preview');

    // Backend base URL - use environment variable for flexibility
    const backendUrl = 'http://localhost:8080';

    useEffect(() => {
        const fetchSharedDocument = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${backendUrl}/api/documents/share/${token}`, {
                    method: 'GET',
                    headers: {
                        // No auth needed for shared links
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Shared document not found or expired');
                    }
                    throw new Error('Failed to load shared document');
                }

                // Get content type and filename from headers
                const contentType = response.headers.get('Content-Type');
                const contentDisposition = response.headers.get('Content-Disposition');
                const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || 'Shared Document';

                setFileType(contentType);
                setFileName(filename);

                // Create blob and get file size
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setDocumentUrl(url);
                setFileSize(formatFileSize(blob.size));

                // Optional: Revoke URL after some time to free memory
                setTimeout(() => URL.revokeObjectURL(url), 3600000); // 1 hour
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSharedDocument();
    }, [token]);

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileType) => {
        if (fileType?.startsWith('image/')) return '🖼️';
        if (fileType === 'application/pdf') return '📄';
        if (fileType === 'text/plain') return '📝';
        if (fileType?.includes('word')) return '📄';
        if (fileType?.includes('excel') || fileType?.includes('spreadsheet')) return '📊';
        if (fileType?.includes('powerpoint') || fileType?.includes('presentation')) return '📊';
        return '📁';
    };

    const isImage = fileType?.startsWith('image/');
    const isPdf = fileType === 'application/pdf';
    const isText = fileType === 'text/plain';
    const isDisplayable = isImage || isPdf || isText;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
            {/* Floating background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-gradient-to-tr from-indigo-400/15 to-purple-600/15 rounded-full blur-3xl"></div>
            </div>

            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 max-w-6xl w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-2xl mr-4">
                            <FiShare2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                Shared Document
                            </h1>
                            <p className="text-gray-500 text-sm mt-1 flex items-center">
                                <FiClock className="w-4 h-4 mr-1" />
                                Secure share link
                            </p>
                        </div>
                    </div>

                    {!loading && !error && (
                        <div className="flex gap-3 self-center sm:self-auto">
                            <button
                                onClick={() => setActiveTab('preview')}
                                className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${activeTab === 'preview' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                            >
                                <FiEye className="w-4 h-4" />
                                Preview
                            </button>
                            {documentUrl && (
                                <a
                                    href={documentUrl}
                                    download={fileName}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    <FiDownload className="w-4 h-4" />
                                    Download
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-indigo-600 rounded-full animate-ping"></div>
                        </div>
                        <p className="mt-6 text-gray-600 text-lg font-medium">Loading document...</p>
                        <p className="mt-2 text-gray-400 text-sm">Please wait while we fetch your file</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="bg-red-50 p-6 rounded-2xl mb-6">
                            <FiAlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
                        </div>
                        <h2 className="text-2xl font-bold text-red-600 mb-2">{error}</h2>
                        <p className="text-gray-600 text-center max-w-md">
                            The share link may have expired or been deactivated. Please contact the person who shared this document for a new link.
                        </p>
                        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm text-gray-500 text-center">
                                Share links are temporary and may expire for security reasons
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* File Info Card */}
                        {fileName && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 mb-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center">
                                        <span className="text-3xl mr-4">{getFileIcon(fileType)}</span>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">{fileName}</h3>
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-1">
                                                <span className="text-sm text-gray-600">Size: {fileSize}</span>
                                                <span className="text-sm text-gray-600">Type: {fileType?.split('/')[1]?.toUpperCase() || 'Unknown'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 self-center sm:self-auto">
                                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-sm text-gray-600 font-medium">Ready to view</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Document Viewer */}
                        <div className="bg-gray-50/50 rounded-2xl border border-gray-200/50 overflow-hidden">
                            {isDisplayable ? (
                                <>
                                    {isPdf || isImage ? (
                                        <div className="relative">
                                            <iframe
                                                src={documentUrl}
                                                title="Shared Document"
                                                className="w-full h-[600px] border-0 rounded-2xl"
                                                style={{ minHeight: '600px' }}
                                            />
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-lg">
                                                <span className="text-xs font-medium text-gray-700">
                                                    {isPdf ? 'PDF Document' : 'Image File'}
                                                </span>
                                            </div>
                                        </div>
                                    ) : isText ? (
                                        <div className="p-6">
                                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                                <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                                                    <span className="text-sm font-medium text-gray-700">Text Content</span>
                                                </div>
                                                <pre className="p-6 overflow-auto max-h-[600px] whitespace-pre-wrap text-sm leading-relaxed">
                                                    {documentUrl && <object data={documentUrl} type="text/plain" width="100%" height="600px" />}
                                                </pre>
                                            </div>
                                        </div>
                                    ) : null}
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <div className="bg-gray-100 p-8 rounded-2xl mb-6">
                                        <FiFile className="w-16 h-16 text-gray-400 mx-auto" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Preview Not Available</h3>
                                    <p className="text-gray-600 text-center max-w-md mb-6">
                                        This file type cannot be previewed directly in the browser. You can download it to view with the appropriate application.
                                    </p>
                                    <a
                                        href={documentUrl}
                                        download={fileName}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl"
                                    >
                                        <FiDownload className="w-5 h-5" />
                                        Download File
                                    </a>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-center text-sm text-gray-400">
                        🔒 This document was shared securely • Links may expire for your protection
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SharedDocument;