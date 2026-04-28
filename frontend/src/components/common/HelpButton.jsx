import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, MessageCircle, Book, Video, Mail } from 'lucide-react';

const HelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const helpOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      action: () => alert("Live chat feature coming soon!")
    },
    {
      icon: Book,
      title: "Documentation",
      description: "Browse our comprehensive guides",
      action: () => window.open('#docs', '_blank')
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch step-by-step tutorials",
      action: () => window.open('#tutorials', '_blank')
    },
    {
      icon: Mail,
      title: "Contact Support",
      description: "Send us an email for detailed help",
      action: () => window.location.href = 'mailto:support@codesync.dev'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 180 : 0 }}
      >
        {isOpen ? <X size={20} /> : <HelpCircle size={20} />}
        <span className="font-medium">Help</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-14 right-0 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-white font-semibold mb-4">How can we help?</h3>
            <div className="space-y-2">
              {helpOptions.map((option, index) => (
                <motion.button
                  key={index}
                  className="w-full flex items-start gap-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
                  onClick={() => {
                    option.action();
                    setIsOpen(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <option.icon size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium text-sm">{option.title}</h4>
                    <p className="text-gray-400 text-xs">{option.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HelpButton;