import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ feature, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.5, 
        delay: index * 0.1,
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0 },
    visible: { 
      scale: 1, 
      transition: { 
        duration: 0.5, 
        delay: index * 0.1 + 0.2,
        type: "spring",
        stiffness: 200
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        delay: index * 0.1 + 0.3
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative overflow-hidden rounded-2xl p-8 shadow-xl backdrop-blur-md border border-gray-700/50 group cursor-pointer bg-[#1f2937]/80 transition-all duration-300"
      style={{
        boxShadow: isHovered ? `0 20px 40px -12px ${feature.color}30` : `0 10px 30px -10px rgba(0,0,0,0.5)`,
        borderColor: isHovered ? `${feature.color}50` : 'rgba(75,85,99,0.5)'
      }}
    >
      {/* Subtle Background Glow on Hover */}
      <div 
        className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, ${feature.color}15, transparent 60%)`,
          opacity: isHovered ? 1 : 0
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Icon Area */}
        <motion.div 
          variants={iconVariants}
          className="mb-6"
        >
          <div 
            className="inline-flex items-center justify-center p-4 rounded-xl shadow-lg transition-transform duration-300 ease-in-out"
            style={{
              background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}05)`,
              transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)'
            }}
          >
            <feature.icon 
              size={36} 
              style={{ color: feature.color }}
              className="drop-shadow-md"
            />
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div variants={contentVariants} className="flex-1 flex flex-col mt-auto">
          <h3 
            className="text-2xl font-bold mb-3 transition-colors duration-300"
            style={{ color: isHovered ? feature.color : '#ffffff' }}
          >
            {feature.title}
          </h3>
          
          <p className="text-gray-300 leading-relaxed text-[15px] transition-colors duration-300">
            {feature.description}
          </p>
        </motion.div>
      </div>

    </motion.div>
  );
};

export default FeatureCard;