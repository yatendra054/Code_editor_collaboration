import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { Code, ArrowRight, Play, Sparkles, Zap, Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Dynamic Code Animation Component
const DynamicCodeEditor = () => {
  const [currentCode, setCurrentCode] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const codeSnippets = [
    `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + 
         fibonacci(n - 2);
}

console.log(fibonacci(10));
// Output: 55`,
    `const quickSort = (arr) => {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), pivot, ...quickSort(right)];
};`,
    `class CodeSyncRoom {
  constructor(roomId, participants = []) {
    this.roomId = roomId;
    this.participants = participants;
    this.code = '';
  }
  
  addParticipant(user) {
    this.participants.push(user);
  }
  
  updateCode(newCode) {
    this.code = newCode;
    this.broadcast('codeUpdate', newCode);
  }
}`,
    `const express = require('express');
const socketIo = require('socket.io');

const app = express();
const server = require('http').createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('userJoined', socket.id);
  });
});`
  ];

  useEffect(() => {
    let currentCharIndex = 0;
    let isDeleting = false;
    let timeoutId;
    
    const typeCode = () => {
      const currentSnippet = codeSnippets[currentIndex];
      
      if (isDeleting) {
        setCurrentCode(currentSnippet.substring(0, currentCharIndex - 1));
        currentCharIndex--;
        
        if (currentCharIndex === 0) {
          isDeleting = false;
          setCurrentIndex((prev) => (prev + 1) % codeSnippets.length);
        }
      } else {
        setCurrentCode(currentSnippet.substring(0, currentCharIndex + 1));
        currentCharIndex++;
        
        if (currentCharIndex === currentSnippet.length) {
          timeoutId = setTimeout(() => {
            isDeleting = true;
          }, 2000);
        }
      }
      
      timeoutId = setTimeout(typeCode, isDeleting ? 50 : 100);
    };
    
    typeCode();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentIndex]);

  return (
    <div className="relative">
      <pre className="text-gray-200 text-sm font-mono p-6 bg-gray-900/50 rounded-lg overflow-x-auto min-h-[200px] leading-relaxed">
        <code className="text-blue-400">{currentCode}</code>
      </pre>
    </div>
  );
};

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

    const element = document.getElementById('hero-stats');
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
      const suffix = end.replace(/[\d.]/g, ''); // Extract suffix like "K+", "%"

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
    } else if (end.includes('%')) {
      return `${num.toFixed(1)}%`;
    }
    return `${Math.floor(num)}+`;
  };

  return <span>{formatNumber(count)}</span>;
};

const HeroSection = () => {
  const { user } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const controls = useAnimation();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const floatingElements = [
    { icon: Code, delay: 0, x: "10%", y: "20%" },
    { icon: Zap, delay: 0.5, x: "85%", y: "30%" },
    { icon: Star, delay: 1, x: "15%", y: "70%" },
    { icon: Sparkles, delay: 1.5, x: "80%", y: "80%" },
  ];

  return (
    <section className="pt-20 pb-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden min-h-screen flex items-center">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(66,153,225,0.15)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(139,92,246,0.15)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(236,72,153,0.1)_0%,transparent_50%)]"></div>

      {/* Interactive Mouse Follower */}
      <div
        className="absolute w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Floating Elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0.8, 1],
            scale: [0, 1.2, 1],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 3,
            delay: element.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="absolute pointer-events-none"
          style={{ left: element.x, top: element.y }}
        >
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
            <element.icon size={20} className="text-blue-400" />
          </div>
        </motion.div>
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 px-4 py-2 rounded-full text-blue-400 text-sm font-medium mb-6 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={16} />
              </motion.div>
              <span>Next-Gen Collaborative Coding</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Collaborate, Code, and{" "}
              <motion.span
                className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Compile in Real-Time
              </motion.span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              CodeSync lets developers work together instantly in the cloud.
              Experience seamless collaboration with real-time synchronization,
              multi-language support, and powerful debugging tools.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-14"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
              <Link
                to={user ? "/editor" : "/signup"}
                  className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 justify-center transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 relative overflow-hidden"
                >
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Play size={20} className="relative z-10" />
                  <span className="relative z-10">Get Started</span>
                  <ArrowRight
                    size={20}
                    className="relative z-10 group-hover:translate-x-1 transition-transform duration-300"
                  />
              </Link>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="group border-2 border-blue-500 text-blue-400 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-blue-500 hover:text-white backdrop-blur-sm relative overflow-hidden"
              >
                <motion.div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">Learn More</span>
              </motion.button>
            </motion.div>

            {/* Enhanced Stats */}
            <motion.div
              id="hero-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center lg:justify-start gap-10"
            >
              {[
                {
                  number: "5K+",
                  label: "Active Developers",
                  color: "from-blue-400 to-cyan-400",
                },
                {
                  number: "10+",
                  label: "Languages Supported",
                  color: "from-purple-400 to-pink-400",
                },
                {
                  number: "99.9%",
                  label: "Uptime",
                  color: "from-green-400 to-emerald-400",
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center lg:text-left group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                      delay: index * 0.5,
                    }}
                    style={{ backgroundSize: "200% 200%" }}
                  >
                    <AnimatedCounter 
                      end={stat.number} 
                      duration={2000} 
                      delay={index * 200} 
                    />
                  </motion.div>
                  <div className="text-gray-400 text-sm font-medium group-hover:text-gray-300 transition-colors">
                    {stat.label}
                </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Enhanced Code Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: 15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative group"
          >
            <motion.div
              whileHover={{ scale: 1.02, rotateY: 5 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 relative"
            >
              <div className="bg-gray-700/80 px-6 py-4 flex items-center justify-between backdrop-blur-sm">
                <div className="flex gap-2">
                  <motion.div
                    className="w-3 h-3 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="w-3 h-3 bg-yellow-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-3 h-3 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
                <div className="text-gray-300 text-sm font-medium">main.js</div>
                <div className="w-6"></div>
              </div>
                <div className="p-6 bg-gray-900/50 rounded-lg">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <DynamicCodeEditor />
                  </motion.div>
                </div>
            </motion.div>

            {/* Floating Code Icons */}
            <motion.div
              className="absolute -top-4 -right-4 bg-blue-500/20 backdrop-blur-sm rounded-lg p-3 border border-blue-500/30"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Code size={24} className="text-blue-400" />
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 bg-purple-500/20 backdrop-blur-sm rounded-lg p-3 border border-purple-500/30"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <motion.div
                className="w-6 h-6 bg-purple-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl -z-10 group-hover:opacity-100 opacity-50 transition-opacity duration-300" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
