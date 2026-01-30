import { FileText, Image, Video, FileArchive, File } from 'lucide-react';

export type FileCategory = 'image' | 'pdf' | 'document' | 'video' | 'archive' | 'other';

export interface FileTypeInfo {
  category: FileCategory;
  icon: any;
  color: string;
  bgColor: string;
  canPreview: boolean;
}

/**
 * Get file category and display info based on MIME type
 */
export function getFileTypeInfo(mimeType: string): FileTypeInfo {
  const type = mimeType.toLowerCase();

  // Images
  if (type.startsWith('image/')) {
    return {
      category: 'image',
      icon: Image,
      color: '#22c55e',
      bgColor: '#22c55e15',
      canPreview: true,
    };
  }

  // PDF
  if (type === 'application/pdf') {
    return {
      category: 'pdf',
      icon: FileText,
      color: '#ef4444',
      bgColor: '#ef444415',
      canPreview: true,
    };
  }

  // Documents (Word, Excel, PowerPoint, etc.)
  if (
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || // .docx
    type === 'application/msword' || // .doc
    type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || // .xlsx
    type === 'application/vnd.ms-excel' || // .xls
    type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || // .pptx
    type === 'application/vnd.ms-powerpoint' || // .ppt
    type === 'text/plain' ||
    type === 'application/rtf'
  ) {
    return {
      category: 'document',
      icon: FileText,
      color: '#3b82f6',
      bgColor: '#3b82f615',
      canPreview: true, // Via Google Docs Viewer
    };
  }

  // Videos
  if (type.startsWith('video/')) {
    return {
      category: 'video',
      icon: Video,
      color: '#a855f7',
      bgColor: '#a855f715',
      canPreview: true,
    };
  }

  // Archives
  if (
    type === 'application/zip' ||
    type === 'application/x-rar-compressed' ||
    type === 'application/x-7z-compressed' ||
    type === 'application/x-tar' ||
    type === 'application/gzip'
  ) {
    return {
      category: 'archive',
      icon: FileArchive,
      color: '#f59e0b',
      bgColor: '#f59e0b15',
      canPreview: false,
    };
  }

  // Other files
  return {
    category: 'other',
    icon: File,
    color: '#6b7280',
    bgColor: '#6b728015',
    canPreview: false,
  };
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'FILE';
}

/**
 * Format file size to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
