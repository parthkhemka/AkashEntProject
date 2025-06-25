# 🚀 Azure Web App Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. **Environment Variables Setup**
Before deploying, ensure you have:
- [ ] Azure Storage Account Name
- [ ] Azure Storage Container Name  
- [ ] Azure Storage SAS Token (with read/write permissions)

### 2. **Files Ready**
- [x] Production build created (`npm run build`)
- [x] `web.config` in dist folder
- [x] `dist.zip` created for deployment
- [x] GitHub Actions workflow (if using CI/CD)

## 🌐 Deployment Options

### **Option A: Manual Deployment via Azure Portal**
1. [ ] Create Azure Web App in portal
2. [ ] Set runtime to Node.js 18 LTS
3. [ ] Upload `dist.zip` via Deployment Center
4. [ ] Configure environment variables in Configuration

### **Option B: Azure CLI Deployment**
1. [ ] Install Azure CLI
2. [ ] Run `az login`
3. [ ] Execute commands in `deploy-azure.sh`
4. [ ] Replace placeholder values with actual ones

### **Option C: GitHub Actions CI/CD**
1. [ ] Push code to GitHub repository
2. [ ] Add secrets to GitHub repository:
   - `AZURE_WEBAPP_PUBLISH_PROFILE`
   - `VITE_AZURE_STORAGE_ACCOUNT_NAME`
   - `VITE_AZURE_STORAGE_CONTAINER_NAME`
   - `VITE_AZURE_STORAGE_SAS_TOKEN`
3. [ ] Update app name in `.github/workflows/deploy-azure.yml`
4. [ ] Push to main branch to trigger deployment

## ⚙️ Post-Deployment Configuration

### 1. **Azure Web App Settings**
In Azure Portal → Your Web App → Configuration → Application Settings:
```
VITE_AZURE_STORAGE_ACCOUNT_NAME = your_storage_account_name
VITE_AZURE_STORAGE_CONTAINER_NAME = your_container_name
VITE_AZURE_STORAGE_SAS_TOKEN = your_sas_token
```

### 2. **Azure Storage CORS Setup**
In Azure Storage Account → Settings → Resource sharing (CORS):
```
Allowed origins: https://your-file-portal-app.azurewebsites.net
Allowed methods: GET, POST, PUT, DELETE, OPTIONS
Allowed headers: *
Exposed headers: *
Max age: 86400
```

### 3. **Test Deployment**
- [ ] Visit `https://your-file-portal-app.azurewebsites.net`
- [ ] Test login functionality
- [ ] Test file upload
- [ ] Test directory creation
- [ ] Test file download
- [ ] Test file deletion

## 🔧 Troubleshooting

### Common Issues:
1. **CORS Errors**: Configure CORS in Azure Storage Account
2. **Environment Variables**: Ensure all VITE_ variables are set in Web App configuration
3. **Routing Issues**: Verify `web.config` is in the deployed files
4. **Build Errors**: Check that all dependencies are installed

### Useful URLs:
- Web App: `https://your-file-portal-app.azurewebsites.net`
- Deployment Logs: Portal → Deployment Center → Logs
- Application Logs: Portal → Monitoring → Log stream

## 💡 Production Tips

1. **Use Application Insights** for monitoring
2. **Enable logging** for debugging
3. **Set up custom domain** if needed
4. **Configure SSL certificate** for security
5. **Set up backup and disaster recovery**
6. **Monitor costs** and set spending alerts

## 🎯 Success Criteria
- [ ] App loads without errors
- [ ] Azure Storage connection successful
- [ ] File operations work (upload, download, delete)
- [ ] Directory navigation functions correctly
- [ ] Responsive design works on mobile devices
