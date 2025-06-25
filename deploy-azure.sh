# Azure CLI Deployment Script
# Run these commands in order

# Login to Azure
az login

# Create a resource group (if you don't have one)
az group create --name file-portal-rg --location "East US"

# Create an App Service plan
az appservice plan create --name file-portal-plan --resource-group file-portal-rg --sku F1 --is-linux

# Create the web app
az webapp create --resource-group file-portal-rg --plan file-portal-plan --name your-file-portal-app --runtime "NODE|18-lts"

# Deploy the dist folder
az webapp deployment source config-zip --resource-group file-portal-rg --name your-file-portal-app --src dist.zip

# Set environment variables (replace with your actual values)
az webapp config appsettings set --resource-group file-portal-rg --name your-file-portal-app --settings VITE_AZURE_STORAGE_ACCOUNT_NAME="your_storage_account"
az webapp config appsettings set --resource-group file-portal-rg --name your-file-portal-app --settings VITE_AZURE_STORAGE_CONTAINER_NAME="your_container"
az webapp config appsettings set --resource-group file-portal-rg --name your-file-portal-app --settings VITE_AZURE_STORAGE_SAS_TOKEN="your_sas_token"
