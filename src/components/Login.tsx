import React, { useState } from 'react';
import { Calculator, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onBack: () => void;
  onLoginSuccess: (email: string) => void;
}

function Login({ onBack, onLoginSuccess }: LoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Hardcoded credentials for testing: admin / admin@123
      if (formData.email === 'admin' && formData.password === 'admin@123') {
        console.log('Login successful with test credentials:', formData.email);
        onLoginSuccess(formData.email);
      } else if (formData.email.includes('@') && formData.password.length >= 6) {
        // Fallback: accept any valid-looking email with password for other testing
        console.log('Login successful:', formData.email);
        onLoginSuccess(formData.email);
      } else {
        setError('Invalid credentials. Use: admin / admin@123 or any email with 6+ char password.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-blue-800 hover:text-blue-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Calculator className="w-12 h-12 text-blue-800" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your Aakash Enterprise account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Test Credentials Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Test Credentials</h3>
              <div className="text-sm text-blue-700">
                <p><strong>Username:</strong> admin</p>
                <p><strong>Password:</strong> admin@123</p>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Username/Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter username or email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-800 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-800 hover:text-blue-900">
                Forgot password?
              </a>
            </div>

            {error && (
              <div className="text-red-600 text-sm py-2 px-3 bg-red-50 border border-red-100 rounded">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-800 text-white py-3 px-6 rounded-lg hover:bg-blue-900 transition-colors font-medium flex items-center justify-center ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Additional Options */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="text-blue-800 hover:text-blue-900 font-medium">
                Contact us for access
              </a>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Your data is protected with enterprise-grade security</p>
        </div>
      </div>
    </div>
  );
}

export default Login;