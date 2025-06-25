import React, { useState } from 'react';
import { 
  Calculator, 
  FileText, 
  TrendingUp, 
  Shield, 
  Users, 
  Award,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import Login from './components/Login';
import FileDashboard from './components/FileDashboard';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your inquiry! We will contact you soon.');
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
  };

  const services = [
    {
      icon: <Calculator className="w-8 h-8" />,
      title: "Tax Planning & Preparation",
      description: "Comprehensive tax services to minimize your liability and ensure compliance with all regulations."
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Bookkeeping Services",
      description: "Accurate financial record keeping and monthly reconciliation to keep your business organized."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Financial Consulting",
      description: "Strategic financial advice to help your business grow and make informed decisions."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Audit & Assurance",
      description: "Independent auditing services to ensure accuracy and compliance with financial standards."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Payroll Management",
      description: "Complete payroll processing, tax filings, and compliance management for your employees."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Business Registration",
      description: "Complete business setup services including company registration and licensing assistance."
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      company: "Kumar Industries",
      text: "Aakash Enterprise has been handling our accounts for 5 years. Their expertise in tax planning saved us significant costs."
    },
    {
      name: "Priya Sharma",
      company: "Sharma Retail Chain",
      text: "Professional, reliable, and always available when we need them. Best accounting firm we've worked with."
    },
    {
      name: "Amit Patel",
      company: "Patel Construction",
      text: "Their bookkeeping services keep our finances organized and compliant. Highly recommend their services."
    }
  ];

  // Handle successful login
  const handleLoginSuccess = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setShowLogin(false);
  };

  // Show file dashboard if logged in
  if (isLoggedIn) {
    return <FileDashboard onLogout={handleLogout} userEmail={userEmail} />;
  }

  // Show login page if showLogin is true
  if (showLogin) {
    return <Login onBack={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Calculator className="w-8 h-8 text-blue-800 mr-3" />
              <span className="text-xl font-bold text-gray-900">Aakash Enterprise</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-800 transition-colors">Home</a>
              <a href="#services" className="text-gray-700 hover:text-blue-800 transition-colors">Services</a>
              <a href="#about" className="text-gray-700 hover:text-blue-800 transition-colors">About</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-800 transition-colors">Contact</a>
              <a href="#contact" className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors">
                Get Started
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-800"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-blue-800">Home</a>
              <a href="#services" className="block px-3 py-2 text-gray-700 hover:text-blue-800">Services</a>
              <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-blue-800">About</a>
              <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-blue-800">Contact</a>
              <a href="#contact" className="block px-3 py-2 bg-blue-800 text-white rounded-lg">Get Started</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-16 bg-gradient-to-br from-blue-50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Professional Accounting Services You Can Trust
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                With over 15 years of experience, Aakash Enterprise provides comprehensive financial solutions 
                to help your business thrive. From tax planning to bookkeeping, we've got you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#contact" 
                  className="bg-blue-800 text-white px-8 py-3 rounded-lg hover:bg-blue-900 transition-colors inline-flex items-center justify-center"
                >
                  Schedule Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
                <a 
                  href="#services" 
                  className="border border-blue-800 text-blue-800 px-8 py-3 rounded-lg hover:bg-blue-800 hover:text-white transition-colors inline-flex items-center justify-center"
                >
                  View Services
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-8 rounded-xl shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-800">500+</div>
                    <div className="text-gray-600">Happy Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-800">15+</div>
                    <div className="text-gray-600">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-800">98%</div>
                    <div className="text-gray-600">Client Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-800">24/7</div>
                    <div className="text-gray-600">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Financial Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer a complete range of accounting and financial services tailored to meet 
              your business needs and help you achieve your financial goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-blue-800 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <a href="#contact" className="text-blue-800 font-medium hover:text-blue-900 inline-flex items-center">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About Aakash Enterprise
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 2008, Aakash Enterprise has been a trusted partner for businesses 
                across various industries. Our team of certified professionals brings expertise, 
                integrity, and personalized service to every client relationship.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  <span className="text-gray-700">Certified Public Accountants</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  <span className="text-gray-700">15+ Years of Industry Experience</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  <span className="text-gray-700">500+ Satisfied Clients</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  <span className="text-gray-700">Latest Technology & Software</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us?</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Expertise You Can Trust</h4>
                  <p className="text-gray-600">Our certified professionals stay updated with the latest regulations and best practices.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Personalized Service</h4>
                  <p className="text-gray-600">We understand that every business is unique and provide tailored solutions.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Timely Delivery</h4>
                  <p className="text-gray-600">We value your time and ensure all deadlines are met without compromising quality.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-blue-800">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get Started Today
            </h2>
            <p className="text-xl text-blue-100">
              Ready to take your business finances to the next level? Contact us for a free consultation.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <Phone className="w-6 h-6 mr-4" />
                  <div>
                    <div className="font-semibold">Phone</div>
                    <div className="text-blue-100">+91 98765 43210</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-6 h-6 mr-4" />
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-blue-100">info@aakashenterprise.com</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 mr-4" />
                  <div>
                    <div className="font-semibold">Address</div>
                    <div className="text-blue-100">123 Business District, Mumbai, Maharashtra 400001</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-6 h-6 mr-4" />
                  <div>
                    <div className="font-semibold">Business Hours</div>
                    <div className="text-blue-100">Mon-Fri: 9:00 AM - 6:00 PM</div>
                    <div className="text-blue-100">Sat: 9:00 AM - 2:00 PM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Request a Consultation</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                    Service Interest
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a service</option>
                    <option value="tax-planning">Tax Planning & Preparation</option>
                    <option value="bookkeeping">Bookkeeping Services</option>
                    <option value="financial-consulting">Financial Consulting</option>
                    <option value="audit">Audit & Assurance</option>
                    <option value="payroll">Payroll Management</option>
                    <option value="business-registration">Business Registration</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about your requirements"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-800 text-white py-3 px-6 rounded-lg hover:bg-blue-900 transition-colors font-medium"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Calculator className="w-8 h-8 text-blue-400 mr-3" />
                <span className="text-xl font-bold">Aakash Enterprise</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your trusted partner for comprehensive accounting and financial services.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Tax Planning</li>
                <li>Bookkeeping</li>
                <li>Financial Consulting</li>
                <li>Audit Services</li>
                <li>Payroll Management</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <div>+91 98765 43210</div>
                <div>info@aakashenterprise.com</div>
                <div>Mumbai, Maharashtra</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Aakash Enterprise. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Logo Button */}
      <button
        onClick={() => setShowLogin(true)}
        className="fixed bottom-6 right-6 bg-blue-800 hover:bg-blue-900 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-40 group"
        aria-label="Login"
      >
        <Calculator className="w-6 h-6" />
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Client Login
        </div>
      </button>
    </div>
  );
}

export default App;