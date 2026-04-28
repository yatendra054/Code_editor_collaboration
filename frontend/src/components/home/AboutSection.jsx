import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { 
  Users, 
  Code, 
  Award, 
  TrendingUp, 
  Clock, 
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  Heart,
  Sparkles,
  Zap
} from 'lucide-react';

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('about-stats');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      const startTime = Date.now();
      const startValue = 0;
      
      // Extract the numeric value, handling decimals
      const numericMatch = end.match(/(\d+\.?\d*)/);
      const endValue = numericMatch ? parseFloat(numericMatch[1]) : 0;
      const suffix = end.replace(/[\d.]/g, ''); // Extract suffix like "K+", "M+", "%"

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (endValue - startValue) * easeOutQuart;
        
        setCount(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, end, duration, delay]);

  const formatNumber = (num) => {
    if (end.includes('K+')) {
      return `${Math.floor(num)}K+`;
    } else if (end.includes('M+')) {
      return `${Math.floor(num)}M+`;
    } else if (end.includes('%')) {
      return `${num.toFixed(1)}%`;
    }
    return `${Math.floor(num)}+`;
  };

  return <span>{formatNumber(count)}</span>;
};

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start("visible");
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('about');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [controls]);

  const statsData = [
    { icon: Users, number: "50K+", label: "Active Developers", color: "#3b82f6", gradient: "from-blue-400 to-cyan-400" },
    { icon: Code, number: "1M+", label: "Lines of Code", color: "#10b981", gradient: "from-green-400 to-emerald-400" },
    { icon: Globe, number: "180+", label: "Countries", color: "#f59e0b", gradient: "from-yellow-400 to-orange-400" },
    { icon: Clock, number: "99.9%", label: "Uptime", color: "#ef4444", gradient: "from-red-400 to-pink-400" }
  ];

  const achievements = [
    "Real-time collaborative editing with zero conflicts",
    "Advanced syntax highlighting for 50+ languages",
    "Enterprise-grade security and compliance",
    "Seamless integration with popular development tools",
    "24/7 customer support and community",
    "Scalable infrastructure handling millions of sessions"
  ];

  const teamMembers = [
    {
      name: "Alex Chen",
      role: "Founder & CEO",
      description: "Former Google engineer with 10+ years in distributed systems",
      avatar: "👨‍💻",
      color: "#3b82f6"
    },
    {
      name: "Sarah Johnson",
      role: "CTO",
      description: "Ex-Microsoft architect specializing in real-time applications",
      avatar: "👩‍💼",
      color: "#8b5cf6"
    },
    {
      name: "Marcus Rodriguez",
      role: "Lead Designer",
      description: "Award-winning UX designer focused on developer tools",
      avatar: "🎨",
      color: "#f59e0b"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden" id="about">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(59,130,246,0.1)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(139,92,246,0.1)_0%,transparent_50%)]"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{
              y: [null, -30, null],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Infinity,
              repeatDelay: 4
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="text-center mb-16"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/40 px-4 py-2 rounded-full text-blue-400 text-sm font-medium mb-6 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Heart size={16} />
            </motion.div>
            <span>About CodeSync</span>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Built by Developers,{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              for Developers
            </span>
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-gray-300 text-lg max-w-2xl mx-auto"
          >
            We're on a mission to revolutionize how developers collaborate. 
            CodeSync was born from the frustration of traditional development workflows 
            and the need for seamless real-time collaboration.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold text-white mb-6">
              Our{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Story
              </span>
            </h3>
            <p className="text-gray-300 mb-4">
              Founded in 2023 by a team of passionate engineers from leading tech companies, 
              CodeSync emerged from a simple observation: coding is inherently social, 
              yet most development tools are designed for isolation.
            </p>
            <p className="text-gray-300 mb-8">
              We envisioned a world where developers could collaborate as naturally as 
              they think - in real-time, without barriers, with the full power of 
              modern development tools at their fingertips.
            </p>
            
            <div className="mt-10">
              <h4 className="text-xl font-semibold text-white mb-4">What Makes Us Different</h4>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
                    className="flex items-center gap-3 text-green-400 text-sm group hover:text-green-300 transition-colors duration-300"
                  >
                    <motion.div
                      animate={isVisible ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
                    >
                      <CheckCircle size={16} />
                    </motion.div>
                    <span>{achievement}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-blue-600"></div>
            {[
              { year: "2023", text: "CodeSync founded with $2M seed funding", color: "#3b82f6" },
              { year: "Early 2024", text: "Beta launch with 1,000+ developers", color: "#8b5cf6" },
              { year: "Mid 2024", text: "Series A funding and global expansion", color: "#f59e0b" },
              { year: "2025", text: "50K+ active users worldwide", color: "#10b981" }
            ].map((item, index) => (
              <motion.div 
                key={index} 
                className="relative pl-16 mb-10 last:mb-0"
                initial={{ opacity: 0, x: 20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
              >
                <motion.div 
                  className="absolute left-0 top-2 w-4 h-4 rounded-full border-4 border-gray-900"
                  style={{ backgroundColor: item.color }}
                  animate={isVisible ? { scale: [0, 1.2, 1] } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                />
                <div className="ml-2">
                  <h4 className="font-semibold mb-2" style={{ color: item.color }}>{item.year}</h4>
                  <p className="text-gray-300 text-sm">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          id="about-stats"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mb-20"
        >
          <h3 className="text-3xl font-bold text-white mb-12">
            By the{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Numbers
            </span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-7">
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center group hover:border-gray-600/50 transition-all duration-300"
              >
                <motion.div 
                  className="mb-6 flex justify-center"
                  animate={isVisible ? { rotate: [0, 360] } : {}}
                  transition={{ duration: 1, delay: 0.8 + (index * 0.1) }}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <stat.icon size={24} style={{ color: stat.color }} />
                  </div>
                </motion.div>
                <motion.div 
                  className={`text-3xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                  animate={isVisible ? { 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  } : {}}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: 1 + (index * 0.2)
                  }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  <AnimatedCounter 
                    end={stat.number} 
                    duration={2500} 
                    delay={index * 300} 
                  />
                </motion.div>
                <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mb-20"
        >
          <h3 className="text-3xl font-bold text-white mb-12">
            Meet the{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Team
            </span>
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 1.0 + (index * 0.2) }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center group hover:border-gray-600/50 transition-all duration-300"
              >
                <motion.div 
                  className="text-5xl mb-6"
                  animate={isVisible ? { scale: [0, 1.2, 1] } : {}}
                  transition={{ duration: 0.5, delay: 1.0 + (index * 0.2) }}
                >
                  {member.avatar}
                </motion.div>
                <h4 className="text-xl font-semibold text-white mb-2  group-hover:bg-clip-text transition-all duration-300"
                    >
                  {member.name}
                </h4>
                <p className="text-sm font-medium mb-4" style={{ color: member.color }}>{member.role}</p>
                <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-12 text-center mb-16 backdrop-blur-sm"
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">
              Our{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Mission
              </span>
            </h3>
            <p className="text-gray-300 text-lg mb-8">
              To empower every developer with tools that make collaboration effortless, 
              creativity boundless, and coding more enjoyable than ever before.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              {[
                { icon: Award, text: "Excellence in every detail", color: "#f59e0b" },
                { icon: Users, text: "Community-driven development", color: "#3b82f6" },
                { icon: TrendingUp, text: "Continuous innovation", color: "#10b981" }
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center gap-2 group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    animate={isVisible ? { rotate: [0, 360] } : {}}
                    transition={{ duration: 1, delay: 1.2 + (index * 0.2) }}
                  >
                    <item.icon size={20} style={{ color: item.color }} />
                  </motion.div>
                  <span className="text-sm font-medium group-hover:text-white transition-colors" style={{ color: item.color }}>
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Join Our{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Community?
            </span>
          </h3>
          <p className="text-gray-300 text-lg mb-8">
            Become part of the CodeSync family and experience the future of collaborative development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 justify-center relative overflow-hidden"
              onClick={() => window.location.href = '/signup'}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <span className="relative z-10">Get Started Free</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group border-2 border-blue-500 text-blue-400 px-8 py-4 rounded-xl font-semibold backdrop-blur-sm relative overflow-hidden"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <motion.div
                className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <span className="relative z-10">Contact Sales</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;