import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Download,
  Eye,
  Trash2,
  File,
  FileText,
  Image,
  FileSpreadsheet,
  Search,
  Grid3X3,
  List,
  LogOut,
  CheckCircle,
  AlertCircle,
  Clock,
  FileVideo,
  FileAudio,
  Archive,
  Folder,
  FolderPlus,
  ArrowLeft,
  Home,
} from 'lucide-react';
import { azureBlobService, FileItem, DirectoryItem } from '../services/azureBlobService';
import FilePreview from './FilePreview';

interface FileDashboardProps {
  onLogout: () => void;
  userEmail: string;
}

function FileDashboard({ onLogout, userEmail }: FileDashboardProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [directories, setDirectories] = useState<DirectoryItem[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]);
  const [currentDirectory, setCurrentDirectory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showCreateDirectory, setShowCreateDirectory] = useState(false);
  const [newDirectoryName, setNewDirectoryName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check connection and load files on mount
  useEffect(() => {
    const initializeService = async () => {
      try {
        const isConnected = await azureBlobService.testConnection();
        setConnectionStatus(isConnected ? 'connected' : 'disconnected');
        if (isConnected) {
          await loadCurrentDirectory();
        }
      } catch (error) {
        console.error('Failed to initialize file service:', error);
        setConnectionStatus('disconnected');
      }
    };

    initializeService();
  }, []);

  // Reload when directory changes
  useEffect(() => {
    if (connectionStatus === 'connected') {
      loadCurrentDirectory();
    }
  }, [currentDirectory, connectionStatus]);

  // Load files and directories from current directory
  const loadCurrentDirectory = async () => {
    try {
      const [fileList, directoryList] = await Promise.all([
        azureBlobService.listFiles(currentDirectory),
        azureBlobService.listDirectories(currentDirectory)
      ]);
      setFiles(fileList);
      setDirectories(directoryList);
    } catch (error) {
      console.error('Failed to load directory contents:', error);
    }
  };

  // Filter files based on search
  useEffect(() => {
    let filtered = files;

    if (searchTerm) {
      filtered = filtered.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFiles(filtered);
  }, [files, searchTerm]);

  // Handle file upload
  const handleFileUpload = async (selectedFiles: FileList) => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (const file of Array.from(selectedFiles)) {
        const uploadedFile = await azureBlobService.uploadFile(
          file,
          currentDirectory,
          (progress: number) => setUploadProgress(progress)
        );

        setFiles(prev => [uploadedFile, ...prev]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle directory creation
  const handleCreateDirectory = async () => {
    if (!newDirectoryName.trim()) return;

    try {
      const directoryPath = currentDirectory 
        ? `${currentDirectory}/${newDirectoryName.trim()}`
        : newDirectoryName.trim();
      
      await azureBlobService.createDirectory(directoryPath);
      await loadCurrentDirectory();
      setNewDirectoryName('');
      setShowCreateDirectory(false);
    } catch (error) {
      console.error('Failed to create directory:', error);
      alert('Failed to create directory. Please try again.');
    }
  };

  // Navigate to directory
  const navigateToDirectory = (directoryPath: string) => {
    setCurrentDirectory(directoryPath);
  };

  // Navigate back to parent directory
  const navigateBack = () => {
    const parentPath = currentDirectory.split('/').slice(0, -1).join('/');
    setCurrentDirectory(parentPath);
  };

  // Navigate to root
  const navigateToRoot = () => {
    setCurrentDirectory('');
  };

  // Handle download
  const handleDownload = async (file: FileItem) => {
    try {
      const blob = await azureBlobService.downloadFile(file.id);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  // Handle preview
  const handlePreview = (file: FileItem) => {
    setPreviewFile(file);
  };

  // Handle delete
  const handleDelete = async (fileId: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      try {
        await azureBlobService.deleteFile(fileId);
        setFiles(prev => prev.filter(f => f.id !== fileId));
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Delete failed. Please try again.');
      }
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (fileType.startsWith('video/')) return <FileVideo className="w-5 h-5" />;
    if (fileType.startsWith('audio/')) return <FileAudio className="w-5 h-5" />;
    if (fileType.includes('pdf')) return <FileText className="w-5 h-5" />;
    if (fileType.includes('sheet') || fileType.includes('excel')) return <FileSpreadsheet className="w-5 h-5" />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <Archive className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <File className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">File Portal</h1>
                <p className="text-sm text-gray-500">Welcome, {userEmail}</p>
              </div>
            </div>

            {/* Connection Status */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {connectionStatus === 'checking' && (
                  <>
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-yellow-600">Checking...</span>
                  </>
                )}
                {connectionStatus === 'connected' && (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">Connected</span>
                  </>
                )}
                {connectionStatus === 'disconnected' && (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-600">Disconnected</span>
                  </>
                )}
              </div>

              <button
                onClick={onLogout}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Area */}
        <div
          className={`mb-8 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Upload Files
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop files here, or click to select files
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isUploading ? `Uploading... ${uploadProgress}%` : 'Select Files'}
          </button>
        </div>

        {/* Navigation Breadcrumb */}
        <div className="mb-4 flex items-center space-x-2 text-sm text-gray-600">
          <button
            onClick={navigateToRoot}
            className="flex items-center hover:text-blue-600 transition-colors"
          >
            <Home className="w-4 h-4 mr-1" />
            Root
          </button>
          {currentDirectory && (
            <>
              {currentDirectory.split('/').map((dir, index, array) => {
                const path = array.slice(0, index + 1).join('/');
                return (
                  <React.Fragment key={path}>
                    <span>/</span>
                    <button
                      onClick={() => navigateToDirectory(path)}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {dir}
                    </button>
                  </React.Fragment>
                );
              })}
            </>
          )}
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Back Button */}
            {currentDirectory && (
              <button
                onClick={navigateBack}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
            )}

            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Create Directory Button */}
            <button
              onClick={() => setShowCreateDirectory(true)}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              New Folder
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Files and Directories Display */}
        {directories.length === 0 && filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files or folders found</h3>
            <p className="text-gray-600">
              {files.length === 0
                ? 'Upload some files or create folders to get started'
                : 'Try adjusting your search'}
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            {/* Directories */}
            {directories.map((directory) => (
              <div
                key={directory.path}
                onClick={() => navigateToDirectory(directory.path)}
                className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border-l-4 border-blue-500 ${
                  viewMode === 'list' ? 'flex items-center p-4' : 'p-6'
                }`}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4 mx-auto">
                      <Folder className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 truncate">
                      {directory.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      {directory.fileCount} file{directory.fileCount !== 1 ? 's' : ''}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center w-12 h-12 bg-blue-50 rounded-lg mr-4">
                      <Folder className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {directory.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {directory.fileCount} file{directory.fileCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Files */}
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'flex items-center p-4' : 'p-6'
                }`}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4 mx-auto">
                      {getFileIcon(file.type)}
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 truncate">
                      {file.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString()}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePreview(file)}
                        className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-md hover:bg-blue-100 transition-colors text-xs"
                      >
                        <Eye className="w-4 h-4 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleDownload(file)}
                        className="flex-1 bg-green-50 text-green-600 py-2 px-3 rounded-md hover:bg-green-100 transition-colors text-xs"
                      >
                        <Download className="w-4 h-4 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-md hover:bg-red-100 transition-colors text-xs"
                      >
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center w-12 h-12 bg-blue-50 rounded-lg mr-4">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePreview(file)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(file)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreview
          file={previewFile}
          onClose={() => setPreviewFile(null)}
          onDownload={() => handleDownload(previewFile)}
        />
      )}

      {/* Create Directory Modal */}
      {showCreateDirectory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Folder</h3>
            <input
              type="text"
              placeholder="Folder name"
              value={newDirectoryName}
              onChange={(e) => setNewDirectoryName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateDirectory()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCreateDirectory(false);
                  setNewDirectoryName('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDirectory}
                disabled={!newDirectoryName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileDashboard;
