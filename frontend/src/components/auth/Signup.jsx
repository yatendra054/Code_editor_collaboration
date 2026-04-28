import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Code, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 2) {
      newErrors.username = 'Username must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = () => {
    const { password } = formData;
    if (password.length === 0) return { strength: 0, text: '', color: '#ef4444' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const levels = [
      { strength: 0, text: 'Very Weak', color: '#ef4444' },
      { strength: 25, text: 'Weak', color: '#f97316' },
      { strength: 50, text: 'Fair', color: '#eab308' },
      { strength: 75, text: 'Good', color: '#22c55e' },
      { strength: 100, text: 'Strong', color: '#16a34a' }
    ];
    
    return levels[score] || levels[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await signup(formData);
      toast.success('Account created successfully! Welcome to CodeSync');
      navigate('/editor');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-5 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(66,153,225,0.1)_0%,transparent_50%)] animate-pulse"></div>
      
      <div className="w-full max-w-md z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-800 bg-opacity-90 backdrop-blur-md border border-gray-700 rounded-2xl p-10 shadow-2xl"
        >
          <motion.div variants={itemVariants} className="text-center mb-10">
            <Link to="/" className="flex items-center justify-center gap-2 text-2xl font-bold text-blue-500 mb-5 no-underline">
              <Code size={32} />
              CodeSync
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">Create Your Account</h1>
            <p className="text-gray-400">Join thousands of developers coding together</p>
          </motion.div>

          <motion.form variants={itemVariants} onSubmit={handleSubmit} className="mb-8">
            <div className="mb-6">
              <label htmlFor="username" className="flex items-center gap-2 mb-2 font-medium text-gray-300 text-sm">
                <User size={18} />
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className={`w-full px-4 py-3 rounded-xl border-2 bg-gray-900 bg-opacity-60 text-white text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:bg-gray-900 focus:bg-opacity-80 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-10 ${
                  errors.username ? 'border-red-500' : 'border-gray-700'
                }`}
              />
              {errors.username && <span className="text-red-500 text-xs mt-1 block">{errors.username}</span>}
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="flex items-center gap-2 mb-2 font-medium text-gray-300 text-sm">
                <Mail size={18} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 rounded-xl border-2 bg-gray-900 bg-opacity-60 text-white text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:bg-gray-900 focus:bg-opacity-80 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-10 ${
                  errors.email ? 'border-red-500' : 'border-gray-700'
                }`}
              />
              {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="flex items-center gap-2 mb-2 font-medium text-gray-300 text-sm">
                <Lock size={18} />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-gray-900 bg-opacity-60 text-white text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:bg-gray-900 focus:bg-opacity-80 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-10 pr-12 ${
                    errors.password ? 'border-red-500' : 'border-gray-700'
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none text-gray-400 cursor-pointer transition-colors duration-300 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formData.password && (
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 h-1 bg-gray-700 rounded overflow-hidden">
                    <div 
                      className="h-full transition-all duration-300" 
                      style={{ 
                        width: `${passwordStrength.strength}%`,
                        backgroundColor: passwordStrength.color 
                      }}
                    ></div>
                  </div>
                  <span className="text-xs" style={{ color: passwordStrength.color }}>
                    {passwordStrength.text}
                  </span>
                </div>
              )}
              {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>}
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="flex items-center gap-2 mb-2 font-medium text-gray-300 text-sm">
                <Check size={18} />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`w-full px-4 py-3 rounded-xl border-2 bg-gray-900 bg-opacity-60 text-white text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:bg-gray-900 focus:bg-opacity-80 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-10 pr-12 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none text-gray-400 cursor-pointer transition-colors duration-300 hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="text-red-500 text-xs mt-1 block">{errors.confirmPassword}</span>}
            </div>

            <div className="mb-6">
              <label className="flex items-start gap-3 text-gray-400 text-sm cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="flex-1">
                  I agree to the <Link to="#terms" className="text-blue-500 no-underline hover:underline font-medium">Terms of Service</Link> and <Link to="#privacy" className="text-blue-500 no-underline hover:underline font-medium">Privacy Policy</Link>
                </span>
              </label>
              {errors.terms && <span className="text-red-500 text-xs mt-1 block">{errors.terms}</span>}
            </div>

            <motion.button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none py-4 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </motion.form>

          <motion.div variants={itemVariants} className="pt-5 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account? <Link to="/login" className="text-blue-500 no-underline font-medium hover:underline">Sign in here</Link>
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8">
            <div className="relative text-center mb-5">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-700"></div>
              <span className="bg-gray-800 bg-opacity-90 px-5 text-gray-400 text-sm">Or sign up with</span>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-gray-700 rounded-xl bg-transparent text-gray-400 cursor-pointer transition-all duration-300 text-sm hover:border-blue-500 hover:bg-blue-500 hover:bg-opacity-10 hover:text-white">
                <img src="/api/placeholder/20/20" alt="GitHub" />
                GitHub
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;