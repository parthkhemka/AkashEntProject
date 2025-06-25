# Deploy to Azure Web App via VS Code

## Prerequisites
- Azure App Service extension installed ✓
- Built app in `dist/` folder ✓
- Azure account with active subscription

## Step-by-Step Deployment

### 1. Sign in to Azure
```
Ctrl+Shift+P → "Azure: Sign In"
```
Follow the browser authentication flow.

### 2. Deploy via Context Menu
1. **Right-click** on the `dist` folder in VS Code Explorer
2. Select **"Deploy to Web App..."**
3. Follow the prompts:
   - **Subscription**: Choose your Azure subscription
   - **Create new Web App**: Select this option
   - **Web App name**: Enter unique name (e.g., `file-portal-app-unique123`)
   - **Resource Group**: Create new (e.g., `rg-file-portal`)
   - **Location**: Choose nearest region
   - **Pricing tier**: F1 (Free) or B1 (Basic)

### 3. Alternative: Command Palette Method
```
Ctrl+Shift+P → "Azure App Service: Deploy to Web App"
```
Select the `dist` folder when prompted.

### 4. Post-Deployment Configuration

After deployment completes:

#### A. Set Environment Variables
1. Go to Azure Portal → Your Web App → Configuration
2. Add Application Settings:
   ```
   AZURE_STORAGE_SAS_TOKEN = your_actual_sas_token_here
   ```

#### B. Configure CORS (if needed)
1. Go to Azure Portal → Your Web App → CORS
2. Add allowed origins or use `*` for testing

#### C. Test the Application
1. Click the provided URL from VS Code notification
2. Or go to Azure Portal → Your Web App → Overview → URL

### 5. Troubleshooting

#### If deployment fails:
- Check VS Code Output panel → Azure App Service
- Ensure you're signed in to Azure
- Verify `dist` folder exists and contains built files

#### If app doesn't load:
- Check Azure Portal → Your Web App → Log stream
- Verify environment variables are set
- Check that `web.config` is in the dist folder

#### If file upload doesn't work:
- Verify SAS token is set in App Settings
- Check CORS configuration
- Ensure blob storage container exists

### 6. Continuous Deployment (Optional)

To set up GitHub Actions for automatic deployment:
1. Go to Azure Portal → Your Web App → Deployment Center
2. Choose GitHub as source
3. Authorize GitHub access
4. Select repository and branch
5. Azure will create the workflow file automatically

## Quick Commands Reference

| Action | Command |
|--------|---------|
| Sign in | `Ctrl+Shift+P` → "Azure: Sign In" |
| Deploy | Right-click `dist` → "Deploy to Web App..." |
| View logs | Azure Portal → Web App → Log stream |
| Set env vars | Azure Portal → Web App → Configuration |

## Important Notes

- Always deploy the `dist` folder, not the project root
- Set the SAS token in Azure App Settings, not in code
- Use HTTPS URLs for production
- Monitor costs in Azure Portal
