import React from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FeatureCard from './FeatureCard';
import { 
  Zap, 
  Shield, 
  Puzzle, 
  Users, 
  Cloud, 
  Terminal,
  GitBranch,
  MessageSquare,
  Monitor,
  Smartphone,
  Globe,
  Lock
} from 'lucide-react';

const Features = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  const mainFeatures = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Real-time synchronization with minimal latency for seamless collaboration. Experience instant code updates across all connected devices.",
      color: "#fbbf24",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with end-to-end encryption, secure authentication, and comprehensive audit logs for your code.",
      color: "#10b981",
      gradient: "from-green-400 to-emerald-500"
    },
    {
      icon: Puzzle,
      title: "10+ Languages",
      description: "Support for all major programming languages with intelligent syntax highlighting, auto-completion, and error detection.",
      color: "#3b82f6",
      gradient: "from-blue-400 to-indigo-500"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Invite unlimited team members with granular permissions, role-based access control, and real-time presence indicators.",
      color: "#8b5cf6",
      gradient: "from-purple-400 to-violet-500"
    },
    {
      icon: Cloud,
      title: "Cloud Powered",
      description: "Access your projects from anywhere with automatic cloud synchronization, backup, and version history management.",
      color: "#06b6d4",
      gradient: "from-cyan-400 to-blue-500"
    },
    {
      icon: Terminal,
      title: "Integrated Terminal",
      description: "Built-in terminal with package management, debugging tools, and support for custom scripts and build processes.",
      color: "#ef4444",
      gradient: "from-red-400 to-pink-500"
    }
  ];

  const additionalFeatures = [
    {
      icon: GitBranch,
      title: "Git Integration",
      description: "Seamless Git workflow integration"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Built-in communication tools"
    },
    {
      icon: Monitor,
      title: "Split View",
      description: "Multiple file editing support"
    },
    {
      icon: Smartphone,
      title: "Mobile Support",
      description: "Code on any device, anywhere"
    },
    {
      icon: Globe,
      title: "Global CDN",
      description: "Fast loading worldwide"
    },
    {
      icon: Lock,
      title: "Private Rooms",
      description: "Secure collaboration spaces"
    }
  ];

  return (
    <motion.section 
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className="features-section py-30 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden" 
      id="features"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.1)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_100%,rgba(139,92,246,0.1)_0%,transparent_50%)]"></div>
      
      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <motion.div variants={headerVariants} className="features-header text-center mt-12 mb-20 max-w-3xl mx-auto">
          <div className="section-badge inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/40 px-4 py-2 rounded-full text-blue-400 text-sm font-medium mb-5 backdrop-blur-sm">
            <Zap size={16} />
            <span>Powerful Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Everything You Need for{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Collaborative Coding
            </span>
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            CodeSync provides a comprehensive suite of tools designed to enhance your 
            development workflow and boost team productivity.
          </p>
        </motion.div>

        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-25 relative z-10">
          {mainFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
            >
              <FeatureCard
                feature={feature}
                index={index}
                isVisible={isVisible}
              />
            </motion.div>
          ))}
        </div>

        <motion.div 
          variants={headerVariants}
          className="additional-features text-center mb-20"
        >
          <h3 className="text-3xl font-bold text-white mt-10 mb-10">
            And Much{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              More...
            </span>
          </h3>
          <div className="mini-features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      duration: 0.5, 
                      delay: 0.8 + (index * 0.1) 
                    }
                  }
                }}
                className="mini-feature flex items-start gap-4 bg-gray-800/40 p-6 rounded-xl border border-gray-700/50 transition-all hover:bg-gray-800/60 hover:-translate-y-1 hover:border-gray-600/50 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon size={18} className="text-blue-400" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          variants={headerVariants}
          className="features-cta text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-15 mb-8 rounded-2xl border border-blue-500/20 backdrop-blur-sm"
        >
          <h3 className="text-3xl font-bold text-white m-4">
            Ready to Experience the{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Future of Coding?
            </span>
          </h3>
          <p className="text-lg text-gray-300 mb-8">Join thousands of developers who are already coding smarter, not harder.</p>
          <motion.button 
            className="cta-button bg-gradient-to-r from-blue-500 to-indigo-600 text-white mb-4 px-8 py-4 rounded-xl font-semibold text-base transition-all hover:shadow-2xl hover:shadow-blue-500/25"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(user ? '/editor' : '/signup')}
          >
            Start Coding Now
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Features;