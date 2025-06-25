# Azure Blob Storage File Portal

A modern, secure file management portal built with React, TypeScript, and Azure Blob Storage. Perfect for businesses needing cloud-based document management with a clean, professional interface.

## Features

### 🔐 Simple Authentication
- Demo login system (admin/admin@123)
- Loading states and error handling  
- Clean, modern login interface

### ☁️ Azure Blob Storage Integration
- **Secure Cloud Storage**: Files stored in Azure Blob Storage
- **SAS Token Authentication**: Secure, time-limited access tokens
- **Auto-Container Creation**: Automatically creates storage container if needed
- **CORS Support**: Configured for web browser access
- **Browser-Safe**: No account keys exposed in client code

### 📁 Complete File Management
- **Upload**: Drag & drop or click to browse files with progress tracking
- **Download**: Secure downloads directly from Azure storage
- **Preview**: Built-in file preview for images, text, and PDFs
- **Delete**: Remove files with confirmation
- **Categories**: Organize files by type (Tax Documents, Receipts, Reports, Other)

### 🎨 Modern UI
- Responsive design with Tailwind CSS
- Grid and List view modes
- Real-time search and filtering
- File type icons and metadata display
- Beautiful animations and transitions
- Connection status indicators

## Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd project
npm install
```

### 2. Set Up Azure Storage
Follow the detailed guide in [AZURE_SETUP.md](./AZURE_SETUP.md) to:
- Create an Azure Storage Account
- Generate a SAS token with appropriate permissions
- Configure CORS settings

### 3. Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Azure Storage details
VITE_AZURE_STORAGE_ACCOUNT_NAME=yourstorageaccount
VITE_AZURE_STORAGE_CONTAINER_NAME=documents
VITE_AZURE_STORAGE_SAS_TOKEN=sv=2022-11-02&ss=b&srt=sco&sp=rwdlacx&se=2025-12-31T23:59:59Z&st=2024-01-01T00:00:00Z&spr=https&sig=yourSignature
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Login and Test
- Email: `admin`
- Password: `admin@123`
VITE_AZURE_STORAGE_CONTAINER_NAME=documents
VITE_AZURE_STORAGE_SAS_TOKEN=yourSAStoken
```

## Application Features

### 📋 File Categories
- **Tax Documents**: Tax returns, forms, and related documents
- **Receipts**: Business expense receipts and invoices
- **Reports**: Financial reports and statements
- **Other**: Miscellaneous documents

### 📄 Supported File Types
- **Documents**: PDF, DOC, DOCX, TXT
- **Spreadsheets**: XLS, XLSX
- **Images**: JPG, JPEG, PNG, GIF
- **Archives**: ZIP, RAR

### 🔧 Development Features
- **TypeScript**: Full type safety
- **React 18**: Modern React features
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast development and building
- **ESLint**: Code quality assurance

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

## File Structure

```
src/
├── components/
│   ├── Login.tsx           # Authentication component
│   ├── FileDashboard.tsx   # Main file management interface
│   └── FilePreview.tsx     # File preview modal
├── services/
│   └── fileService.ts      # Local file management service
├── App.tsx                 # Main application component
└── main.tsx               # Application entry point
```

## Customization

This portal can be easily customized for different use cases:

- **Branding**: Update colors, logos, and styling in Tailwind config
- **Categories**: Modify file categories in `fileService.ts`
- **Authentication**: Replace demo auth with real authentication system
- **Storage**: Integrate with cloud storage services if needed
- **File Types**: Add support for additional file formats

## Deployment

### Netlify/Vercel
```bash
npm run build
# Deploy the dist/ folder
```

### GitHub Pages
```bash
npm run build
# Push dist/ folder to gh-pages branch
```

This portal serves as an excellent starting point for file management applications and can be extended with backend services, real authentication, and cloud storage integration as needed.
- **Loading States**: User feedback during operations

## Demo Mode

When Azure Storage is not configured or connection fails:
- Mock data is displayed
- File operations are simulated
- No actual files are stored
- Warning banner shows connection status

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

© 2024 Aakash Enterprise. All rights reserved.

## Support

For technical support or questions about the document portal, please contact the development team.
