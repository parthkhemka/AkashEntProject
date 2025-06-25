# Azure CORS Configuration Script
# Run these commands in Azure CLI or Cloud Shell

# Login to Azure (if not already logged in)
az login

# Set your subscription (replace with your subscription ID)
az account set --subscription "your-subscription-id"

# Configure CORS for blob service
az storage cors add \
    --account-name akashenterprisestg \
    --services b \
    --methods GET POST PUT DELETE HEAD OPTIONS \
    --origins "*" \
    --allowed-headers "*" \
    --exposed-headers "*" \
    --max-age 3600

# Verify CORS configuration
az storage cors list --account-name akashenterprisestg --services b
