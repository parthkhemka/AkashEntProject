import React, { useState, useEffect } from 'react';
import { X, Download, FileType } from 'lucide-react';
import { FileItem } from '../services/azureBlobService';

interface FilePreviewProps {
  file: FileItem;
  onClose: () => void;
  onDownload: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onClose, onDownload }) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPreview = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!file.url) {
          throw new Error('No URL provided for file preview');
        }
        
        // For demo purposes, we'll skip actual loading in this example
        // In a real implementation, you would fetch from the URL
        
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set dummy content based on file type
        if (file.type.includes('image')) {
          // For images, we would normally set the URL
          setContent('image');
        } else if (file.type.includes('pdf')) {
          setContent('pdf');
        } else if (file.type.includes('text') || file.name.endsWith('.txt')) {
          setContent('text');
        } else {
          setContent('unsupported');
        }
      } catch (err) {
        setError('Failed to load file preview');
        console.error('Preview error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadPreview();
  }, [file]);
  
  const renderPreview = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-10">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-10 text-center">
          <FileType className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-gray-600 mb-6">Unable to preview this file</p>
          <button
            onClick={onDownload}
            className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Download File
          </button>
        </div>
      );
    }
    
    // Image preview
    if (content === 'image' && file.url) {
      return (
        <div className="flex items-center justify-center h-full p-4">
          <img 
            src={file.url} 
            alt={file.name} 
            className="max-h-full max-w-full object-contain"
          />
        </div>
      );
    }
    
    // PDF preview - in a real app, you would embed a PDF viewer
    if (content === 'pdf') {
      return (
        <div className="flex flex-col items-center justify-center h-full p-10 text-center">
          <FileType className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-gray-900 text-lg mb-2">PDF Preview</p>
          <p className="text-gray-600 mb-6">PDF preview requires a dedicated viewer component</p>
          <button
            onClick={onDownload}
            className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
        </div>
      );
    }
    
    // Text preview
    if (content === 'text') {
      return (
        <div className="h-full p-4 overflow-auto">
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {/* In a real implementation, you would fetch and display the text content */}
            Sample text content for {file.name}
            
            This is a text preview placeholder.
            In a real implementation, the actual file content would be loaded and displayed.
          </pre>
        </div>
      );
    }
    
    // Unsupported format
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center">
        <FileType className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-gray-900 text-lg mb-2">Preview not available</p>
        <p className="text-gray-600 mb-6">This file type cannot be previewed</p>
        <button
          onClick={onDownload}
          className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Download File
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900 truncate pr-4">{file.name}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={onDownload}
              className="p-2 text-gray-600 hover:text-blue-600 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-red-600 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
