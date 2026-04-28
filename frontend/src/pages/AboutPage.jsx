import React from 'react';
import Navbar from '../components/common/Navbar';
import AboutSection from '../components/home/AboutSection';
import Footer from '../components/common/Footer';
import HelpButton from '../components/common/HelpButton';
import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { 
  Target, 
  Eye, 
  Lightbulb, 
  Users, 
  Globe, 
  Shield,
  ArrowRight,
  Mail,
  MapPin,
  Phone
} from 'lucide-react';

const AboutPage = () => {
  const [heroRef, heroVisible] = useScrollReveal({ threshold: 0.1 });
  const [valuesRef, valuesVisible] = useScrollReveal({ threshold: 0.1 });
  const [contactRef, contactVisible] = useScrollReveal({ threshold: 0.1 });

  const coreValues = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "We're focused on solving real problems that developers face every day",
      color: "#3b82f6"
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "Open communication, clear roadmaps, and honest feedback with our community",
      color: "#10b981"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Constantly pushing boundaries to create better development experiences",
      color: "#f59e0b"
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building with and for our developer community at every step",
      color: "#8b5cf6"
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Making development tools accessible to developers worldwide",
      color: "#06b6d4"
    },
    {
      icon: Shield,
      title: "Security & Trust",
      description: "Your code is sacred. We protect it with enterprise-grade security",
      color: "#ef4444"
    }
  ];

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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted');
  };

  return (
    <div className="about-page min-h-screen bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        variants={containerVariants}
        initial="hidden"
        animate={heroVisible ? "visible" : "hidden"}
        className="about-hero py-30 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-center relative overflow-hidden"
      >
        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <motion.div variants={itemVariants} className="hero-content">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About CodeSync</h1>
            <p className="hero-description text-xl text-gray-400 max-w-3xl mx-auto mb-15 leading-relaxed">
              We're building the future of collaborative development. 
              Our mission is to make coding more social, productive, and enjoyable 
              for developers around the world.
            </p>
            <div className="hero-stats flex justify-center gap-15 flex-wrap">
              <div className="stat text-center">
                <span className="stat-number block text-3xl font-bold text-blue-500 mb-2">50K+</span>
                <span className="stat-label text-gray-400">Developers</span>
              </div>
              <div className="stat text-center">
                <span className="stat-number block text-3xl font-bold text-blue-500 mb-2">180+</span>
                <span className="stat-label text-gray-400">Countries</span>
              </div>
              <div className="stat text-center">
                <span className="stat-number block text-3xl font-bold text-blue-500 mb-2">1M+</span>
                <span className="stat-label text-gray-400">Code Sessions</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section 
        ref={valuesRef}
        variants={containerVariants}
        initial="hidden"
        animate={valuesVisible ? "visible" : "hidden"}
        className="values-section py-25 bg-gray-950"
      >
        <div className="container max-w-7xl mx-auto px-4">
          <motion.div variants={itemVariants} className="section-header text-center mb-15">
            <h2 className="text-3xl font-bold text-white mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-400">The principles that guide everything we do</p>
          </motion.div>
          
          <div className="values-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      duration: 0.6, 
                      delay: index * 0.1 
                    }
                  }
                }}
                className="value-card bg-gray-800/30 backdrop-blur-md border border-gray-700/30 p-8 rounded-2xl text-center transition-all cursor-pointer hover:-translate-y-1 hover:scale-102"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="value-icon mb-6" style={{ color: value.color }}>
                  <value.icon size={28} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Main About Section */}
      <AboutSection />

      {/* Contact Section */}
      <motion.section 
        ref={contactRef}
        variants={containerVariants}
        initial="hidden"
        animate={contactVisible ? "visible" : "hidden"}
        className="contact-section py-25 bg-gradient-to-br from-gray-900 to-gray-800"
      >
        <div className="container max-w-7xl mx-auto px-4">
          <motion.div variants={itemVariants} className="section-header text-center mb-15">
            <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-400">We'd love to hear from you. Reach out anytime!</p>
          </motion.div>
          
          <div className="contact-content grid grid-cols-1 lg:grid-cols-2 gap-15">
            <motion.div variants={itemVariants} className="contact-info flex flex-col gap-10">
              <div className="contact-item flex items-start gap-4">
                <Mail size={20} className="text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Email Us</h4>
                  <p className="text-gray-400">hello@codesync.dev</p>
                  <p className="text-gray-400">support@codesync.dev</p>
                </div>
              </div>
              
              <div className="contact-item flex items-start gap-4">
                <Phone size={20} className="text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Call Us</h4>
                  <p className="text-gray-400">+1 (555) 123-4567</p>
                  <p className="text-gray-400">Mon-Fri, 9am-6pm PST</p>
                </div>
              </div>
              
              <div className="contact-item flex items-start gap-4">
                <MapPin size={20} className="text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Visit Us</h4>
                  <p className="text-gray-400">123 Developer Street</p>
                  <p className="text-gray-400">San Francisco, CA 94105</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="contact-form bg-gray-800/30 backdrop-blur-md border border-gray-700/30 p-10 rounded-2xl">
              <h3 className="text-2xl font-semibold text-white mb-8">Send us a message</h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="form-row flex gap-4">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    required 
                    className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    required 
                    className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Subject" 
                  required 
                  className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
                <textarea 
                  placeholder="Your Message" 
                  rows="5" 
                  required 
                  className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-vertical"
                ></textarea>
                <motion.button 
                  type="submit"
                  className="submit-btn bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-7 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 self-start transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Send Message
                  <ArrowRight size={18} />
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <Footer />
      <HelpButton />
    </div>
  );
};

export default AboutPage;