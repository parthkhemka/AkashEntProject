# Azure Blob Storage Setup Guide (SAS Token)

This guide will help you set up Azure Blob Storage for the File Portal using SAS tokens for secure browser-based authentication.

## Prerequisites

- Azure account with an active subscription
- Basic knowledge of Azure portal navigation

## Step 1: Create Storage Account

1. **Sign in to Azure Portal**
   - Go to [portal.azure.com](https://portal.azure.com)
   - Sign in with your Azure credentials

2. **Create a new Storage Account**
   - Click "Create a resource"
   - Search for "Storage account"
   - Click "Create"

3. **Configure Storage Account**
   - **Subscription**: Select your Azure subscription
   - **Resource Group**: Create new or select existing
   - **Storage Account Name**: Enter a unique name (e.g., `myfileportal2025`)
   - **Region**: Choose a region close to your users
   - **Performance**: Standard
   - **Redundancy**: LRS (Locally Redundant Storage) for demo

4. **Review and Create**
   - Click "Review + create"
   - Click "Create" after validation passes

## Step 2: Generate SAS Token

1. **Navigate to your Storage Account**
   - Go to your newly created storage account

2. **Shared Access Signature**
   - In the left menu, click "Security + networking" > "Shared access signature"

3. **Configure SAS Token Settings**
   - **Allowed services**: ✅ Blob
   - **Allowed resource types**: ✅ Service, ✅ Container, ✅ Object
   - **Allowed permissions**: ✅ Read, ✅ Write, ✅ Delete, ✅ List, ✅ Add, ✅ Create
   - **Start time**: Current date/time
   - **Expiry time**: Set to a future date (e.g., 1 year from now)
   - **Allowed protocols**: HTTPS only
   - **Signing key**: key1

4. **Generate SAS Token**
   - Click "Generate SAS and connection string"
   - Copy the **SAS token** (the part after the "?" - do NOT include the "?")
   - Example: `sv=2022-11-02&ss=b&srt=sco&sp=rwdlacx&se=2025-12-31T23:59:59Z&st=2024-01-01T00:00:00Z&spr=https&sig=yourSignatureHere`

## Step 3: Configure CORS (CRITICAL)

**⚠️ This step is essential for the application to work from a browser!**

1. **Resource Sharing (CORS)**
   - In your storage account, go to "Settings" > "Resource sharing (CORS)"
   - Click on "Blob service" tab

2. **Add CORS Rule**
   For development (allows all origins):
   ```
   Allowed origins: *
   Allowed methods: GET, POST, PUT, DELETE, HEAD, OPTIONS
   Allowed headers: *
   Exposed headers: *
   Max age: 3600
   ```

   For production (more secure):
   ```
   Allowed origins: https://yourdomain.com,http://localhost:5173,http://localhost:5181
   Allowed methods: GET, POST, PUT, DELETE, HEAD, OPTIONS
   Allowed headers: *
   Exposed headers: *
   Max age: 3600
   ```

3. **Save** the CORS settings

4. **Wait 1-2 minutes** for the settings to propagate

## Step 4: Configure Application

1. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Update with your Azure Storage details:

   ```env
   VITE_AZURE_STORAGE_ACCOUNT_NAME=myfileportal2025
   VITE_AZURE_STORAGE_CONTAINER_NAME=documents
   VITE_AZURE_STORAGE_SAS_TOKEN=sv=2022-11-02&ss=b&srt=sco&sp=rwdlacx&se=2025-12-31T23:59:59Z&st=2024-01-01T00:00:00Z&spr=https&sig=yourSignatureHere
   ```

2. **Start the Application**
   ```bash
   npm install
   npm run dev
   ```

## Step 5: Test the Application

1. **Login to the portal**
   - Email: `admin`
   - Password: `admin@123`

2. **Test file operations**
   - Upload a file
   - Check Azure portal to see if files appear in your container
   - Try downloading and deleting files

## Container Management

The application will automatically:
- Create the `documents` container if it doesn't exist
- Set the container to allow public blob access
- Organize files by category (tax-documents, receipts, reports, other)

## Security Benefits of SAS Tokens

- **Limited Permissions**: Only grant the specific permissions needed
- **Time-Limited**: Tokens expire automatically
- **Revocable**: Can be regenerated if compromised
- **Browser-Safe**: No account keys exposed in client-side code
- **Granular Control**: Can restrict to specific services, resources, and operations

## Troubleshooting

1. **"Connection failed"**
   - Verify your SAS token is correct and not expired
   - Check that the storage account name is correct
   - Ensure CORS is properly configured

2. **"Upload failed"**
   - Check CORS settings allow your domain
   - Verify SAS token has write permissions
   - Ensure token hasn't expired

3. **"Download failed"**
   - Ensure SAS token has read permissions
   - Check file exists in storage account
   - Verify CORS allows the requested origin

4. **"Token expired"**
   - Generate a new SAS token with extended expiry
   - Update the .env file with the new token
   - Restart the development server

## Production Considerations

For production deployment:
- Use shorter-lived SAS tokens (refresh automatically)
- Implement Azure Active Directory authentication
- Consider using Azure Key Vault to store tokens securely
- Set up monitoring and alerting for token expiry
- Use Azure CDN for better performance
- Implement proper user roles and permissions

## Cost Considerations

- SAS tokens don't incur additional costs
- Storage accounts have minimal cost for small amounts of data
- Consider using cool or archive tiers for long-term storage
- Monitor usage through Azure Cost Management

## Next Steps

- Set up automatic SAS token renewal
- Implement proper user authentication
- Configure Azure CDN for better performance
- Set up monitoring and logging
- Implement backup and disaster recovery
