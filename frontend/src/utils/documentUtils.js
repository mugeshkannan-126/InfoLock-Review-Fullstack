// documentUtils.js
export const formatFileSize = (bytes, decimals = 1) => {
    if (bytes === 0 || isNaN(bytes)) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.min(
        Math.floor(Math.log(bytes) / Math.log(k)),
        sizes.length - 1
    );

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

export const formatDate = (dateString, locale = undefined, options = {}) => {
    if (!dateString) return 'Recently';

    try {
        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        const date = new Date(dateString);

        return isNaN(date.getTime())
            ? 'Recently'
            : date.toLocaleDateString(locale, { ...defaultOptions, ...options });
    } catch {
        return 'Recently';
    }
};

import { getFileIcon, getFileColor } from '../api/FileIcon.jsx';

export const getFileIconProps = (fileType) => {
    return {
        bg: getFileColor(fileType).replace('text-', 'bg-') + '-100',
        text: getFileColor(fileType),
        icon: getFileIcon(fileType).type
    };
};