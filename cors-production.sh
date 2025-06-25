# Production CORS Configuration
# Replace 'yourdomain.com' with your actual domain

az storage cors add \
    --account-name akashenterprisestg \
    --services b \
    --methods GET POST PUT DELETE HEAD OPTIONS \
    --origins "https://yourdomain.com,http://localhost:5173,http://localhost:5174,http://localhost:5180,http://localhost:5181" \
    --allowed-headers "*" \
    --exposed-headers "*" \
    --max-age 3600
