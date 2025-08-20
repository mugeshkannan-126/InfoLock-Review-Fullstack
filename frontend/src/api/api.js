import axios from 'axios';
import {FiArchive, FiFile, FiFileText, FiFilm, FiImage, FiMusic} from "react-icons/fi";

// Create a single axios instance with base configuration
const Api = axios.create({
    baseURL: 'http://localhost:8080/api', // Your Spring Boot backend URL
    withCredentials: true,
});





// Add this to your interceptors
Api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token if you have a refresh token endpoint
                // const refreshResponse = await Api.post('/auth/refresh', {
                //     refreshToken: localStorage.getItem('refreshToken')
                // });
                // const newToken = refreshResponse.data.token;
                // localStorage.setItem('token', newToken);

                // Retry the original request
                // originalRequest.headers.Authorization = `Bearer ${newToken}`;
                // return Api(originalRequest);

                // For now, just redirect to login
                localStorage.removeItem('token');
                window.location.href = '/login';
                return Promise.reject(error);
            } catch (refreshError) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle other errors
        if (error.response) {
            // Server responded with error status (4xx, 5xx)
            const message = error.response.data?.message ||
                error.response.data?.error ||
                'An error occurred';
            return Promise.reject(new Error(message));
        } else if (error.request) {
            // Request was made but no response received
            return Promise.reject(new Error('Network error. Please check your connection.'));
        } else {
            // Something happened in setting up the request
            return Promise.reject(new Error('Request configuration error.'));
        }
    }
);

// Helper functions
const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Request interceptor to add JWT token
Api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle errors
Api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized (e.g., redirect to login)
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Authentication Api
export const authAPI = {
    register: async (username, email, password) => {
        try {
            const response = await Api.post('/auth/register', {
                username,
                email,
                password,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Registration failed' };
        }
    },

    login: async (email, password) => {
        try {
            const response = await Api.post('/auth/login', { email, password });
            const { token, username } = response.data; // Assuming backend returns username
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            return token;
        } catch (error) {
            throw error.response?.data || { error: 'Login failed' };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
    },
};

// Document Api
export const documentAPI = {
    getAllDocuments: async () => {
        try {
            const response = await Api.get('/documents');
            return response.data.map((doc) => ({
                ...doc,
                id: doc.id.toString(),
                size: formatFileSize(doc.fileSize),
                uploaded: formatDate(doc.uploadDate),
                name: doc.fileName,
                type: doc.fileType,
            }));
        } catch (error) {
            console.error('Error fetching documents:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch documents');
        }
    },

    shareDocument: async (documentId, isPublic = true, expiryDays = 30, maxViews = 100) => {
        try {
            const response = await Api.post('/documents/share', {
                documentId,
                isPublic,
                expiryDays,
                maxViews
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message ||
            error.response?.status === 403 ?
                'You do not have permission to share this document' :
                'Failed to share document';
            throw new Error(message);
        }
    },

    uploadDocument: async (file, category, filename) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);
        formData.append('filename', filename || file.name);

        try {
            const response = await Api.post('/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            return {
                ...response.data,
                id: response.data.id.toString(),
                size: formatFileSize(response.data.fileSize),
                uploaded: formatDate(response.data.uploadDate),
                name: response.data.fileName,
                type: response.data.fileType,
            };
        } catch (error) {
            console.error('Error uploading document:', error);
            throw new Error(error.response?.data?.message || 'Failed to upload document');
        }
    },

    updateDocument: async (id, file, category, filename) => {
        if (!id) throw new Error('Document ID is required');

        const formData = new FormData();
        if (file) formData.append('file', file);
        if (category) formData.append('category', category);
        if (filename) formData.append('filename', filename);

        try {
            const response = await Api.put(`/documents/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            return {
                ...response.data,
                id: response.data.id.toString(),
                size: formatFileSize(response.data.fileSize),
                uploaded: formatDate(response.data.uploadDate),
                name: response.data.fileName,
                type: response.data.fileType,
            };
        } catch (error) {
            console.error('Error updating document:', error);
            throw new Error(error.response?.data?.message || 'Failed to update document');
        }
    },

    deleteDocument: async (id) => {
        if (!id) throw new Error('Document ID is required');

        try {
            await Api.delete(`/documents/${id}`);
        } catch (error) {
            console.error('Error deleting document:', error);
            throw new Error(error.response?.data?.message || 'Failed to delete document');
        }
    },

    downloadDocument: async (id, fileName) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Please login to download files');

            const response = await Api.get(`/documents/download/${id}`, {
                responseType: 'blob',
                headers: { Authorization: `Bearer ${token}` },
            });

            // Extract filename from content-disposition or use provided name
            const contentDisposition = response.headers['content-disposition'];
            let downloadFileName = fileName || `document-${id}`;
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (fileNameMatch && fileNameMatch[1]) {
                    downloadFileName = fileNameMatch[1];
                }
            }

            // Create blob URL
            const blob = new Blob([response.data], {
                type: response.headers['content-type'],
            });
            const url = window.URL.createObjectURL(blob);

            // Create download link
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', downloadFileName);

            // Append to body and trigger download
            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            return true;
        } catch (error) {
            console.error('Download error:', error);
            if (error.response?.status === 403) {
                throw new Error("You don't have permission to download this file");
            }
            throw new Error(error.response?.data?.message || 'Download failed');
        }
    },
    // In documentAPI object
    getDocumentById: async (id) => {
        try {
            const response = await Api.get(`/documents/${id}`);
            return {
                ...response.data,
                id: response.data.id.toString(),
                size: formatFileSize(response.data.fileSize),
                uploaded: formatDate(response.data.uploadDate),
                name: response.data.fileName,
                type: response.data.fileType,
            };
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch document');
        }
    },


    getDocumentsByCategory: async (category) => {
        try {
            const response = await Api.get(`/documents/category/${category}`);
            return response.data.map(doc => ({
                ...doc,
                id: doc.id.toString(),
                size: formatFileSize(doc.fileSize),
                uploaded: formatDate(doc.uploadDate),
                name: doc.fileName,
                type: doc.fileType,
            }));
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch documents by category');
        }
    },
};
