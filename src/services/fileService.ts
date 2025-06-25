// Simple local file service - no Azure complexity
export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  url: string;
  category: 'tax-documents' | 'receipts' | 'reports' | 'other';
}

class LocalFileService {
  private files: FileItem[] = [];

  // Simulate file upload (stores in memory for demo)
  async uploadFile(
    file: File, 
    category: string = 'other',
    onProgress?: (progress: number) => void
  ): Promise<FileItem> {
    // Simulate upload progress
    if (onProgress) {
      onProgress(0);
      await new Promise(resolve => setTimeout(resolve, 200));
      onProgress(50);
      await new Promise(resolve => setTimeout(resolve, 200));
      onProgress(100);
    }

    const fileItem: FileItem = {
      id: `${category}-${Date.now()}-${file.name}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date(),
      url: URL.createObjectURL(file), // Create blob URL for preview
      category: category as any,
    };

    this.files.push(fileItem);
    console.log('📁 File uploaded:', fileItem.name);
    return fileItem;
  }

  // Get all uploaded files
  async listFiles(): Promise<FileItem[]> {
    return [...this.files].sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());
  }

  // Download file (open in new tab)
  async downloadFile(fileId: string): Promise<void> {
    const file = this.files.find(f => f.id === fileId);
    if (file) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      link.click();
      console.log('💾 File downloaded:', file.name);
    }
  }

  // Delete file
  async deleteFile(fileId: string): Promise<void> {
    const index = this.files.findIndex(f => f.id === fileId);
    if (index > -1) {
      const file = this.files[index];
      URL.revokeObjectURL(file.url); // Clean up blob URL
      this.files.splice(index, 1);
      console.log('🗑️ File deleted:', file.name);
    }
  }

  // Get download URL (already have it)
  async getDownloadUrl(fileId: string): Promise<string> {
    const file = this.files.find(f => f.id === fileId);
    return file?.url || '';
  }

  // Test connection (always true for local)
  async testConnection(): Promise<boolean> {
    console.log('✅ Local file service ready');
    return true;
  }
}

// Export singleton
export const fileService = new LocalFileService();
