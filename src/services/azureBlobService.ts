import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

// Azure Storage configuration using SAS token
const AZURE_STORAGE_ACCOUNT_NAME = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_NAME || '';
const AZURE_STORAGE_CONTAINER_NAME = import.meta.env.VITE_AZURE_STORAGE_CONTAINER_NAME || 'documents';
const AZURE_STORAGE_SAS_TOKEN = import.meta.env.VITE_AZURE_STORAGE_SAS_TOKEN || '';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  url: string;
  directory: string;
  fullPath: string;
}

export interface DirectoryItem {
  name: string;
  path: string;
  fileCount: number;
}

export class AzureBlobService {
  private blobServiceClient: BlobServiceClient | null = null;
  private containerClient: ContainerClient | null = null;
  private containerName: string;
  private isInitialized = false;

  constructor() {
    this.containerName = AZURE_STORAGE_CONTAINER_NAME;
    this.initializeService();
  }

  private async initializeService() {
    try {
      console.log('🔧 Initializing Azure Blob Service with SAS token...');
      
      if (!AZURE_STORAGE_ACCOUNT_NAME || !AZURE_STORAGE_SAS_TOKEN) {
        console.warn('❌ Azure Storage account name or SAS token not configured');
        return;
      }

      console.log('Storage Account:', AZURE_STORAGE_ACCOUNT_NAME);
      console.log('SAS Token Present:', !!AZURE_STORAGE_SAS_TOKEN);
      console.log('Container Name:', this.containerName);

      // Create BlobServiceClient using SAS token
      const accountUrl = `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`;
      const sasUrl = `${accountUrl}?${AZURE_STORAGE_SAS_TOKEN}`;
      
      this.blobServiceClient = new BlobServiceClient(sasUrl);
      this.containerClient = this.blobServiceClient.getContainerClient(this.containerName);

      // Ensure container exists
      await this.containerClient.createIfNotExists({
        access: 'blob' // Allow public read access to blobs
      });

      this.isInitialized = true;
      console.log('✅ Azure Blob Service initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize Azure Blob Service:', error);
      this.isInitialized = false;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!this.isInitialized || !this.containerClient) {
        await this.initializeService();
      }

      if (!this.containerClient) {
        return false;
      }

      // Test connection by checking if container exists
      const exists = await this.containerClient.exists();
      console.log(`📡 Connection test: Container exists = ${exists}`);
      return exists;
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
  }

  async uploadFile(
    file: File, 
    directory: string = '',
    onProgress?: (progress: number) => void
  ): Promise<FileItem> {
    if (!this.isInitialized || !this.containerClient) {
      throw new Error('Azure Blob Service not initialized');
    }

    try {
      // Use directory path with original filename
      const directoryPath = directory ? `${directory}/` : '';
      const fileName = `${directoryPath}${file.name}`;
      
      console.log(`📤 Uploading file: ${fileName}`);

      const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
      
      // Upload with progress tracking
      const uploadOptions = {
        blobHTTPHeaders: {
          blobContentType: file.type,
        },
        onProgress: onProgress ? (ev: any) => {
          const progress = Math.round((ev.loadedBytes / file.size) * 100);
          onProgress(progress);
        } : undefined,
      };

      await blockBlobClient.uploadData(file, uploadOptions);

      const fileItem: FileItem = {
        id: fileName, // Use the full blob path as ID
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date(),
        url: blockBlobClient.url,
        directory: directory,
        fullPath: fileName,
      };

      console.log(`✅ File uploaded successfully: ${fileName}`);
      return fileItem;
      
    } catch (error) {
      console.error('❌ Upload failed:', error);
      throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async listFiles(directory: string = ''): Promise<FileItem[]> {
    if (!this.isInitialized || !this.containerClient) {
      throw new Error('Azure Blob Service not initialized');
    }

    try {
      console.log(`📋 Listing files from directory: ${directory || 'root'}`);
      const files: FileItem[] = [];

      const prefix = directory ? `${directory}/` : '';

      for await (const blob of this.containerClient.listBlobsFlat({ prefix })) {
        // Skip if this is a subdirectory (we only want files in the current directory)
        const relativePath = blob.name.substring(prefix.length);
        if (relativePath.includes('/')) {
          continue; // This is in a subdirectory, skip it
        }

        // Skip .keep files (directory placeholders)
        if (relativePath === '.keep' || relativePath.endsWith('/.keep')) {
          continue;
        }

        const fileItem: FileItem = {
          id: blob.name, // Use full blob name as ID
          name: relativePath, // Just the filename without path
          size: blob.properties.contentLength || 0,
          type: blob.properties.contentType || 'application/octet-stream',
          uploadDate: blob.properties.lastModified || new Date(),
          url: `${this.containerClient.url}/${blob.name}`,
          directory: directory,
          fullPath: blob.name,
        };

        files.push(fileItem);
      }

      console.log(`📁 Found ${files.length} files`);
      return files;
      
    } catch (error) {
      console.error('❌ Failed to list files:', error);
      throw new Error(`Failed to list files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async downloadFile(fileId: string): Promise<Blob> {
    if (!this.isInitialized || !this.containerClient) {
      throw new Error('Azure Blob Service not initialized');
    }

    try {
      console.log(`📥 Downloading file: ${fileId}`);
      
      const blockBlobClient = this.containerClient.getBlockBlobClient(fileId);
      // For simplicity, we'll use downloadToBuffer instead
      const downloadResponse = await blockBlobClient.downloadToBuffer();
      const blob = new Blob([downloadResponse], { type: 'application/octet-stream' });
      
      console.log(`✅ File downloaded successfully: ${fileId}`);
      return blob;
      
    } catch (error) {
      console.error('❌ Download failed:', error);
      throw new Error(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    if (!this.isInitialized || !this.containerClient) {
      throw new Error('Azure Blob Service not initialized');
    }

    try {
      console.log(`🗑️ Deleting file: ${fileId}`);
      
      const blockBlobClient = this.containerClient.getBlockBlobClient(fileId);
      await blockBlobClient.delete();
      
      console.log(`✅ File deleted successfully: ${fileId}`);
      
    } catch (error) {
      console.error('❌ Delete failed:', error);
      throw new Error(`Delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async listDirectories(parentDirectory: string = ''): Promise<DirectoryItem[]> {
    if (!this.isInitialized || !this.containerClient) {
      throw new Error('Azure Blob Service not initialized');
    }

    try {
      console.log(`📁 Listing directories in: ${parentDirectory || 'root'}`);
      const directories = new Map<string, number>();
      const prefix = parentDirectory ? `${parentDirectory}/` : '';

      for await (const blob of this.containerClient.listBlobsFlat({ prefix })) {
        const relativePath = blob.name.substring(prefix.length);
        const pathParts = relativePath.split('/');
        
        if (pathParts.length > 1) {
          // This file is in a subdirectory
          const directoryName = pathParts[0];
          const currentCount = directories.get(directoryName) || 0;
          directories.set(directoryName, currentCount + 1);
        }
      }

      const directoryItems: DirectoryItem[] = Array.from(directories.entries()).map(([name, fileCount]) => ({
        name,
        path: parentDirectory ? `${parentDirectory}/${name}` : name,
        fileCount,
      }));

      console.log(`📁 Found ${directoryItems.length} directories`);
      return directoryItems;
      
    } catch (error) {
      console.error('❌ Failed to list directories:', error);
      throw new Error(`Failed to list directories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createDirectory(directoryPath: string): Promise<void> {
    if (!this.isInitialized || !this.containerClient) {
      throw new Error('Azure Blob Service not initialized');
    }

    try {
      // In Azure Blob Storage, directories don't exist until they contain files
      // We'll create a placeholder file to establish the directory
      const placeholderName = `${directoryPath}/.keep`;
      const blockBlobClient = this.containerClient.getBlockBlobClient(placeholderName);
      
      // Upload a tiny placeholder file
      const placeholderContent = '# This file maintains the directory structure';
      await blockBlobClient.upload(placeholderContent, placeholderContent.length, {
        blobHTTPHeaders: {
          blobContentType: 'text/plain',
        },
      });

      console.log(`✅ Directory created: ${directoryPath}`);
      
    } catch (error) {
      console.error('❌ Failed to create directory:', error);
      throw new Error(`Failed to create directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteDirectory(directoryPath: string): Promise<void> {
    if (!this.isInitialized || !this.containerClient) {
      throw new Error('Azure Blob Service not initialized');
    }

    try {
      console.log(`🗑️ Deleting directory: ${directoryPath}`);
      const prefix = `${directoryPath}/`;
      
      // Delete all blobs in the directory
      for await (const blob of this.containerClient.listBlobsFlat({ prefix })) {
        await this.containerClient.deleteBlob(blob.name);
      }

      console.log(`✅ Directory deleted: ${directoryPath}`);
      
    } catch (error) {
      console.error('❌ Failed to delete directory:', error);
      throw new Error(`Failed to delete directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const azureBlobService = new AzureBlobService();
