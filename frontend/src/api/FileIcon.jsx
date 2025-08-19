// FileIcons.jsx
import {
    FiArchive,
    FiFile,
    FiFileText,
    FiFilm,
    FiImage,
    FiMusic
} from "react-icons/fi";

export const getFileIcon = (fileType) => {
    if (!fileType) return <FiFile />;

    const type = fileType.toLowerCase();
    if (type.includes('pdf')) return <FiFileText />;
    if (type.includes('word') || type.includes('doc')) return <FiFileText />;
    if (type.includes('excel') || type.includes('sheet')) return <FiFileText />;
    if (type.includes('image')) return <FiImage />;
    if (type.includes('video')) return <FiFilm />;
    if (type.includes('audio')) return <FiMusic />;
    if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return <FiArchive />;
    return <FiFile />;
};

export const getFileColor = (fileType) => {
    if (!fileType) return 'text-gray-500';

    const type = fileType.toLowerCase();
    if (type.includes('pdf')) return 'text-red-500';
    if (type.includes('word') || type.includes('doc')) return 'text-blue-500';
    if (type.includes('excel') || type.includes('sheet')) return 'text-green-500';
    if (type.includes('image')) return 'text-purple-500';
    if (type.includes('video')) return 'text-yellow-500';
    if (type.includes('audio')) return 'text-pink-500';
    return 'text-gray-500';
};