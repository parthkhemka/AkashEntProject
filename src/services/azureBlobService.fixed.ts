import { BlobServiceClient } from '@azure/storage-blob';

// Azure Storage configuration
const AZURE_STORAGE_CONNECTION_STRING = import.meta.env.VITE_AZURE_STORAGE_CONNECTION_STRING || '';
const AZURE_STORAGE_CONTAINER_NAME = import.meta.env.VITE_AZURE_STORAGE_CONTAINER_NAME || 'documents';

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
  private blobServiceClient: BlobServiceClient | null = null;
  private containerName: string;
  private isInitialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    this.containerName = AZURE_STORAGE_CONTAINER_NAME;
    
    // Don't throw errors in constructor, just log them
    if (!AZURE_STORAGE_CONNECTION_STRING) {
      console.warn('Azure Storage connection string not configured');
      return;
    }

    try {
      this.blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
      console.log('Azure Blob Service client created successfully');
    } catch (error) {
      console.error('Failed to create Azure Blob Service client:', error);
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (this.isInitialized) return;
    
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.initialize();
    return this.initializationPromise;
  }

  private async initialize(): Promise<void> {
    try {
      if (!this.blobServiceClient) {
        throw new Error('Blob service client not available');
      }

      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      await containerClient.createIfNotExists();
      this.isInitialized = true;
      console.log(`Container '${this.containerName}' is ready`);
    } catch (error) {
      console.error('Failed to initialize Azure container:', error);
      throw error;
    }
  }

  async uploadFile(
    file: File, 
    category: string = 'other',
    onProgress?: (progress: number) => void
  ): Promise<BlobFile> {
    try {
      await this.ensureInitialized();
      
      if (!this.blobServiceClient) {
        throw new Error('Azure Blob Service not initialized');
      }

      const fileName = `${category}/${Date.now()}-${file.name}`;
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);

      const blobHTTPHeaders = {
        blobContentType: file.type,
      };

      const metadata = {
        originalName: file.name,
        category: category,
        uploadDate: new Date().toISOString(),
      };

      await blockBlobClient.uploadData(file, {
        blobHTTPHeaders,
        metadata,
        onProgress: (ev) => {
          if (onProgress && ev.loadedBytes) {
            const progress = (ev.loadedBytes / file.size) * 100;
            onProgress(progress);
          }
        },
      });

      const blobFile: BlobFile = {
        id: fileName,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date(),
        url: blockBlobClient.url,
        category: category as any,
      };

      return blobFile;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file to Azure Blob Storage');
    }
  }

  async listFiles(): Promise<BlobFile[]> {
    try {
      await this.ensureInitialized();
      
      if (!this.blobServiceClient) {
        throw new Error('Azure Blob Service not initialized');
      }

      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const files: BlobFile[] = [];

      for await (const blob of containerClient.listBlobsFlat({
        includeMetadata: true,
      })) {
        const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
        
        const blobFile: BlobFile = {
          id: blob.name,
          name: blob.metadata?.originalName || blob.name.split('/').pop() || blob.name,
          size: blob.properties.contentLength || 0,
          type: blob.properties.contentType || 'application/octet-stream',
          uploadDate: blob.properties.lastModified || new Date(),
          url: blockBlobClient.url,
          category: (blob.metadata?.category as any) || 'other',
        };

        files.push(blobFile);
      }

      return files.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());
    } catch (error) {
      console.error('Error listing files:', error);
      return []; // Return empty array instead of throwing
    }
  }

  async downloadFile(blobName: string): Promise<Blob> {
    try {
      await this.ensureInitialized();
      
      if (!this.blobServiceClient) {
        throw new Error('Azure Blob Service not initialized');
      }

      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      const downloadResponse = await blockBlobClient.download();
      
      if (downloadResponse.blobBody) {
        return downloadResponse.blobBody;
      } else {
        throw new Error('No blob body in download response');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      throw new Error('Failed to download file from Azure Blob Storage');
    }
  }

  async deleteFile(blobName: string): Promise<void> {
    try {
      await this.ensureInitialized();
      
      if (!this.blobServiceClient) {
        throw new Error('Azure Blob Service not initialized');
      }

      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.delete();
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file from Azure Blob Storage');
    }
  }

  async getDownloadUrl(blobName: string): Promise<string> {
    try {
      await this.ensureInitialized();
      
      if (!this.blobServiceClient) {
        throw new Error('Azure Blob Service not initialized');
      }

      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      return blockBlobClient.url;
    } catch (error) {
      console.error('Error generating download URL:', error);
      throw new Error('Failed to generate download URL');
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.ensureInitialized();
      
      if (!this.blobServiceClient) {
        return false;
      }

      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      await containerClient.getProperties();
      return true;
    } catch (error) {
      console.error('Azure Blob Storage connection test failed:', error);
      return false;
    }
  }
}

// Singleton instance
export const azureBlobService = new AzureBlobService();
