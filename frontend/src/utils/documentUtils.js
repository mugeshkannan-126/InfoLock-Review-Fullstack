// documentUtils.js
// export const formatFileSize = (bytes, decimals = 1) => {
//     if (bytes === 0 || isNaN(bytes)) return '0 Bytes';
//
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//     const i = Math.min(
//         Math.floor(Math.log(bytes) / Math.log(k)),
//         sizes.length - 1
//     );
//
//     return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
// };



// utils/documentUtils.js
export const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch (error) {
        return 'Invalid date';
    }
};

export const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '0 B';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// src/utils/documentUtils.js
export const formatFileType = (type) => {
    if (!type) return 'FILE';
    const parts = type.split('/');
    return parts[parts.length - 1].toUpperCase();
};


import { getFileIcon, getFileColor } from '../api/FileIcon.jsx';

export const getFileIconProps = (fileType) => {
    return {
        bg: getFileColor(fileType).replace('text-', 'bg-') + '-100',
        text: getFileColor(fileType),
        icon: getFileIcon(fileType).type
    };
};