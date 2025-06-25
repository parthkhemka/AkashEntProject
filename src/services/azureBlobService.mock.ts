// Temporary simplified version without Azure dependencies
export interface BlobFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  url: string;
  category: 'tax-documents' | 'receipts' | 'reports' | 'other';
}

export class AzureBlobService {
  constructor() {
    console.log('Azure Blob Service initialized (mock version)');
  }

  async uploadFile(
    file: File, 
    category: string = 'other',
    onProgress?: (progress: number) => void
  ): Promise<BlobFile> {
    console.log('Mock upload:', file.name);
    
    // Simulate progress
    if (onProgress) {
      setTimeout(() => onProgress(50), 500);
      setTimeout(() => onProgress(100), 1000);
    }
    
    return {
      id: `${category}/${Date.now()}-${file.name}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date(),
      url: URL.createObjectURL(file),
      category: category as any,
    };
  }

  async listFiles(): Promise<BlobFile[]> {
    console.log('Mock listFiles called');
    return [];
  }

  async downloadFile(blobName: string): Promise<Blob> {
    console.log('Mock download:', blobName);
    return new Blob(['Mock file content'], { type: 'text/plain' });
  }

  async deleteFile(blobName: string): Promise<void> {
    console.log('Mock delete:', blobName);
  }

  async getDownloadUrl(blobName: string): Promise<string> {
    console.log('Mock getDownloadUrl:', blobName);
    return '#';
  }

  async testConnection(): Promise<boolean> {
    console.log('Mock testConnection called');
    return true;
  }
}

export const azureBlobService = new AzureBlobService();
