import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simple validation
      if (!email) {
        throw new Error('Please enter your email address');
      }
      
      if (!/\S+@\S+\.\S+/.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
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
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--primary)_0%,_transparent_70%)] opacity-10"></div>
      
      <div className="w-full max-w-md z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-800 bg-opacity-90 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-2xl"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <Link 
              to="/login" 
              className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 mb-6 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Login
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isSubmitted ? 'Check Your Email' : 'Reset Your Password'}
            </h1>
            <p className="text-gray-400">
              {isSubmitted 
                ? `We've sent a password reset link to ${email}`
                : 'Enter your email address and we\'ll send you a link to reset your password'
              }
            </p>
          </motion.div>

          {!isSubmitted ? (
            <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
                >
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
              </div>
              
              <p className="text-gray-300 mb-6">
                If an account exists with this email, you'll receive a password reset link shortly.
              </p>
              
              <div className="text-sm text-gray-500 bg-gray-900/50 p-4 rounded-lg">
                <p className="mb-2">Didn't receive the email?</p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-blue-400 hover:text-blue-300 underline transition-colors"
                >
                  Click here to try again
                </button>
              </div>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-sm">
              Remember your password?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Sign in here
              </Link>
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="mt-6 text-center text-gray-500 text-sm"
        >
          <p>© 2025 CodeSync. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;