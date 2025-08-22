// Create a new file: src/components/SharedDocument.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiFile, FiAlertTriangle, FiLoader } from 'react-icons/fi';

const SharedDocument = () => {
    const { token } = useParams();
    const [documentUrl, setDocumentUrl] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fileType, setFileType] = useState(null);

    // Backend base URL - use environment variable for flexibility
    const backendUrl = 'http://localhost:8080'; // Or use your IP: http://192.168.1.100:8080

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

                // Get content type from headers
                const contentType = response.headers.get('Content-Type');
                setFileType(contentType);

                // Create blob URL for display
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setDocumentUrl(url);

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

    const isImage = fileType?.startsWith('image/');
    const isPdf = fileType === 'application/pdf';
    const isText = fileType === 'text/plain';
    const isDisplayable = isImage || isPdf || isText;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 max-w-4xl w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <FiFile className="mr-3 text-blue-600" />
                    Shared Document
                </h1>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <FiLoader className="w-12 h-12 text-blue-500 animate-spin" />
                        <p className="mt-4 text-gray-600">Loading document...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-red-600">
                        <FiAlertTriangle className="w-16 h-16 mb-4" />
                        <p className="text-xl font-semibold">{error}</p>
                        <p className="mt-2 text-gray-600">The share link may have expired or been deactivated.</p>
                    </div>
                ) : (
                    <>
                        {isDisplayable ? (
                            <>
                                {isPdf || isImage ? (
                                    <iframe
                                        src={documentUrl}
                                        title="Shared Document"
                                        className="w-full h-[600px] border border-gray-200 rounded-lg"
                                        style={{ minHeight: '600px' }}
                                    />
                                ) : isText ? (
                                    <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-[600px] whitespace-pre-wrap">
                    {documentUrl && <object data={documentUrl} type="text/plain" width="100%" height="600px" />}
                  </pre>
                                ) : null}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20">
                                <FiFile className="w-16 h-16 text-gray-500 mb-4" />
                                <p className="text-xl font-semibold text-gray-800">Document Preview Not Available</p>
                                <p className="mt-2 text-gray-600">This file type cannot be previewed in the browser.</p>
                                <a
                                    href={documentUrl}
                                    download
                                    className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                >
                                    Download File
                                </a>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SharedDocument;