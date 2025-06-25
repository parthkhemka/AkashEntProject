# 📤 Azure Web App Manual Upload Guide

## 🎯 Step-by-Step Upload Process

### **Method 1: Via Deployment Center (Recommended)**

1. **Navigate to Your Web App**
   - Go to [Azure Portal](https://portal.azure.com)
   - Search for your Web App name
   - Click on your Web App

2. **Access Deployment Center**
   - In the left sidebar, scroll down to **"Deployment"** section
   - Click **"Deployment Center"**

3. **Configure Deployment Source**
   - Click **"Settings"** tab at the top
   - Under **"Source"**, select **"External Git"** or **"Local Git"**
   - If you don't see upload option, continue to Method 2

### **Method 2: Via App Service Editor (Kudu)**

1. **Access Advanced Tools**
   - In your Web App, go to **"Development Tools"** → **"Advanced Tools"**
   - Click **"Go"** (this opens Kudu)

2. **Upload Files via Kudu**
   - In Kudu interface, click **"Debug console"** → **"CMD"**
   - Navigate to `site/wwwroot` folder
   - Drag and drop your `dist.zip` file
   - Right-click the zip file → **"Extract"**
   - Delete the zip file after extraction

### **Method 3: Via FTP/FTPS**

1. **Get FTP Credentials**
   - In your Web App → **"Deployment Center"** → **"FTPS credentials"**
   - Copy FTP endpoint and credentials

2. **Upload via FTP Client**
   - Use FileZilla or similar FTP client
   - Connect using the credentials
   - Upload contents of `dist` folder to `/site/wwwroot/`

### **Method 4: Via Azure CLI (If you have it installed)**

```bash
# Login to Azure
az login

# Deploy the zip file
az webapp deployment source config-zip --resource-group "your-rg" --name "your-webapp" --src "dist.zip"
```

### **Method 5: Via Visual Studio Code**

1. **Install Azure Extension**
   - Install "Azure App Service" extension in VS Code
   
2. **Deploy from VS Code**
   - Right-click on `dist` folder
   - Select **"Deploy to Web App"**
   - Choose your Azure Web App

## ⚠️ Alternative: Create Web App with GitHub Integration

If upload isn't working, create a new Web App with GitHub integration:

1. **Create Web App**
   - In Azure Portal → **"Create a resource"** → **"Web App"**
   - Choose **"Publish: Code"**
   - **Runtime**: Node.js 18 LTS

2. **Configure GitHub Deployment**
   - In **"Deployment"** tab during creation
   - Enable **"Continuous deployment"**
   - Connect to your GitHub repository
   - Select the branch with your code

3. **GitHub Actions will handle the build and deployment automatically**

## 🔧 Troubleshooting Upload Issues

### If you can't find upload option:
1. **Check Web App Type**: Ensure it's an "App Service" not "Static Web App"
2. **Check Runtime**: Should be Node.js, not Static sites
3. **Try Kudu Method**: Most reliable for manual uploads
4. **Use GitHub Integration**: Easier and more reliable long-term

### Common Upload Locations:
- **Kudu Console**: Most direct method
- **Deployment Center**: May require Git setup first
- **FTP**: Always available but requires credentials

## 🎯 Recommended Approach

For easiest deployment, I recommend using **GitHub Actions**:

1. Push your code to GitHub
2. Create Web App with GitHub integration
3. Let Azure handle build and deployment automatically

This avoids manual upload issues and provides CI/CD benefits!
