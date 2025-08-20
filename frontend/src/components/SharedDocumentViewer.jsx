// SharedDocumentViewer.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiDownload, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const SharedDocumentViewer = () => {
    const { token } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const accessSharedDocument = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/documents/share/${token}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Document not found or link expired');
                    }
                    throw new Error('Failed to access document');
                }

                // Get content type to determine how to handle the file
                const contentType = response.headers.get('content-type');
                const blob = await response.blob();

                if (contentType.includes('pdf') || contentType.includes('image')) {
                    // For PDFs and images, open in new tab
                    const url = URL.createObjectURL(blob);
                    window.open(url, '_blank');
                    setTimeout(() => URL.revokeObjectURL(url), 10000);
                    setSuccess(true);
                } else {
                    // For other file types, trigger download
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `document-${token}`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    setSuccess(true);
                }

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        accessSharedDocument();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading shared document...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-4">
                    <FiAlertCircle className="mx-auto h-12 w-12 text-red-500" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Unable to access document</h3>
                    <p className="mt-2 text-sm text-gray-500">{error}</p>
                    <p className="mt-4 text-xs text-gray-400">
                        This could be because the link has expired, the document has been deleted,
                        or you've reached the maximum view limit.
                    </p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-4">
                    <FiCheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Document accessed successfully</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        The document has been opened in a new tab. If it didn't open, check your pop-up settings.
                    </p>
                </div>
            </div>
        );
    }

    return null;
};

export default SharedDocumentViewer;