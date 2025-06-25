# 🚀 GitHub to Azure Web App Deployment (Simplified)

## Quick Setup Guide

### **Step 1: Create GitHub Repository**

1. Go to [GitHub.com](https://github.com) and create a new repository
2. Name it something like `file-portal-app`
3. Make it public or private (your choice)
4. **Don't** initialize with README (we have files already)

### **Step 2: Upload Your Code to GitHub**

Since Git isn't installed locally, use GitHub's web interface:

1. **Option A: Upload via GitHub Web Interface**
   - In your new GitHub repo, click **"uploading an existing file"**
   - Drag and drop ALL files from your project folder:
     ```
     src/
     public/
     .github/
     package.json
     package-lock.json
     vite.config.ts
     tsconfig.json
     tailwind.config.js
     web.config
     staticwebapp.config.yml
     etc.
     ```
   - **Important**: Upload the SOURCE CODE, not the dist folder
   - Commit the files

2. **Option B: Download GitHub Desktop**
   - Download [GitHub Desktop](https://desktop.github.com/)
   - Clone your repository
   - Copy your project files to the cloned folder
   - Commit and push

### **Step 3: Create Azure Web App with GitHub Integration**

1. **Create Web App in Azure Portal**
   - Go to [Azure Portal](https://portal.azure.com)
   - **Create a resource** → **Web App**
   - Fill in basic details:
     - **Name**: `your-file-portal-app`
     - **Runtime**: **Node.js 18 LTS**
     - **Operating System**: Linux or Windows
     - **Region**: Choose closest to you

2. **Configure GitHub Deployment (During Creation)**
   - In the **"Deployment"** tab:
   - Enable **"Continuous deployment"**
   - **Source**: GitHub
   - **Organization**: Your GitHub username
   - **Repository**: `file-portal-app`
   - **Branch**: `main`

3. **Azure will automatically**:
   - Connect to your GitHub repo
   - Create GitHub Actions workflow
   - Build and deploy your app
   - Set up CI/CD pipeline

### **Step 4: Configure Environment Variables**

After the Web App is created:

1. Go to your Web App in Azure Portal
2. **Configuration** → **Application settings**
3. Add these variables:
   ```
   VITE_AZURE_STORAGE_ACCOUNT_NAME = your_storage_account
   VITE_AZURE_STORAGE_CONTAINER_NAME = your_container
   VITE_AZURE_STORAGE_SAS_TOKEN = your_sas_token
   ```

### **Step 5: Configure GitHub Secrets**

1. Go to your GitHub repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Add these secrets:
   ```
   VITE_AZURE_STORAGE_ACCOUNT_NAME
   VITE_AZURE_STORAGE_CONTAINER_NAME  
   VITE_AZURE_STORAGE_SAS_TOKEN
   ```

## ✅ What Happens Next

1. **GitHub Actions will trigger** when you push code
2. **Azure will build** your React app automatically
3. **Deployment happens** within 5-10 minutes
4. **Your app will be live** at `https://your-file-portal-app.azurewebsites.net`

## 🎯 Benefits of This Approach

- ✅ **No manual uploads** needed
- ✅ **Automatic builds** on every code change  
- ✅ **Version control** with Git
- ✅ **Rollback capability** if issues occur
- ✅ **Professional CI/CD pipeline**

## 🔍 Monitor Deployment

- **GitHub**: Check Actions tab for build status
- **Azure**: Deployment Center shows deployment logs
- **Live Site**: Visit your Azure Web App URL

This approach is much more reliable than manual uploads and sets you up for professional development practices!
