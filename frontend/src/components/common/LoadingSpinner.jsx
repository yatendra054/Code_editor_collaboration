import React from 'react';
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <motion.div
        className="text-blue-500 mb-5"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Code size={40} />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-400"
      >
        Loading CodeSync...
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;
