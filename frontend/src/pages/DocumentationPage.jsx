import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, 
  Users, 
  Zap, 
  Code,
  ChevronRight,
  Menu,
  X,
  Star,
  MessageCircle,
  CheckCircle2,
  Terminal
} from 'lucide-react';

const DocumentationPage = () => {
  const [activeSection, setActiveSection] = useState('intro');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on mobile when section changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sections = [
    { id: 'intro', title: 'Introduction', icon: Book },
    { id: 'getting-started', title: 'Getting Started', icon: Zap },
    { id: 'features', title: 'Core Features', icon: Star },
    { id: 'collaboration', title: 'Collaboration', icon: Users },
    { id: 'languages', title: 'Supported Languages', icon: Code },
    { id: 'faq', title: 'FAQ', icon: MessageCircle }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'intro':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white mb-6">Welcome to CodeSync</h1>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              CodeSync is a next-generation real-time collaborative code editor designed to make pair programming, technical interviews, and team coding sessions seamless and conflict-free.
            </p>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-4">Why CodeSync?</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 mt-1 flex-shrink-0" size={18} />
                  <span>Zero-setup collaborative environment that works instantly in your browser.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 mt-1 flex-shrink-0" size={18} />
                  <span>Execute code directly in the cloud and see outputs in real-time.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 mt-1 flex-shrink-0" size={18} />
                  <span>Save your sessions automatically and revisit them anytime.</span>
                </li>
              </ul>
            </div>
          </motion.div>
        );

      case 'getting-started':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white mb-6">Getting Started</h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Start coding with your team in less than a minute. Follow these steps to launch your first collaborative room.
            </p>

            <div className="space-y-6">
              <div className="bg-gray-800/40 p-6 rounded-xl border border-gray-700/50">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="bg-blue-500/20 text-blue-400 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                  Create a Room
                </h3>
                <p className="text-gray-300 ml-11">
                  Navigate to the <strong>Code Editor</strong> from the navigation menu. A new, unique Room ID will be generated automatically for your session.
                </p>
              </div>

              <div className="bg-gray-800/40 p-6 rounded-xl border border-gray-700/50">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="bg-blue-500/20 text-blue-400 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                  Invite Collaborators
                </h3>
                <p className="text-gray-300 ml-11">
                  Copy the Room ID displayed in the top bar of the editor. Share this ID with anyone you want to join your session.
                </p>
              </div>

              <div className="bg-gray-800/40 p-6 rounded-xl border border-gray-700/50">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="bg-blue-500/20 text-blue-400 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                  Start Coding
                </h3>
                <p className="text-gray-300 ml-11">
                  Select your preferred programming language and start typing! Your changes will sync instantly to all connected clients.
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 'features':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white mb-6">Core Features</h1>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800/30 border border-gray-700/50 p-6 rounded-xl">
                <Zap className="text-yellow-400 mb-4" size={32} />
                <h3 className="text-xl font-bold text-white mb-2">Real-time Synchronization</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Powered by WebSockets, every keystroke is broadcasted with incredibly low latency. Multiple users can edit the same file simultaneously without merge conflicts.
                </p>
              </div>

              <div className="bg-gray-800/30 border border-gray-700/50 p-6 rounded-xl">
                <Terminal className="text-purple-400 mb-4" size={32} />
                <h3 className="text-xl font-bold text-white mb-2">Cloud Execution</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Run your code instantly in our secure cloud environments. See standard output and errors broadcasted to everyone in the room in real-time.
                </p>
              </div>

              <div className="bg-gray-800/30 border border-gray-700/50 p-6 rounded-xl">
                <Book className="text-blue-400 mb-4" size={32} />
                <h3 className="text-xl font-bold text-white mb-2">Room History</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Logged-in users automatically save their participation history. Revisit old rooms to review code written during previous collaborative sessions.
                </p>
              </div>

              <div className="bg-gray-800/30 border border-gray-700/50 p-6 rounded-xl">
                <Code className="text-green-400 mb-4" size={32} />
                <h3 className="text-xl font-bold text-white mb-2">Intelligent Editor</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Built on the powerful Monaco Editor (the core of VS Code). Enjoy syntax highlighting, bracket matching, and auto-indentation out of the box.
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 'collaboration':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white mb-6">Collaboration Guide</h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Learn how to make the most out of your shared coding sessions.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6 py-2">
                <h3 className="text-xl font-bold text-white mb-2">User Cursors & Presence</h3>
                <p className="text-gray-400">
                  See exactly who is in the room. As they type, their changes appear instantly. The editor manages concurrent edits gracefully.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-6 py-2">
                <h3 className="text-xl font-bold text-white mb-2">Session Persistence</h3>
                <p className="text-gray-400">
                  Code written in a room remains active as long as the session is alive. If you accidentally disconnect, rejoining with the same Room ID will restore your code.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-6 py-2">
                <h3 className="text-xl font-bold text-white mb-2">Role Management</h3>
                <p className="text-gray-400">
                  Users can act as observers or editors. Guests joining a room will inherit the current state of the codebase automatically upon connection.
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 'languages':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white mb-6">Supported Languages</h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              CodeSync currently supports the following primary programming languages for both syntax highlighting and cloud execution:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 p-6 rounded-xl flex flex-col items-center justify-center border border-gray-700/50 hover:border-yellow-400/50 transition-colors group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🟨</div>
                <h4 className="text-white font-semibold">JavaScript</h4>
                <p className="text-xs text-gray-500 mt-1">Node.js Engine</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-xl flex flex-col items-center justify-center border border-gray-700/50 hover:border-blue-400/50 transition-colors group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🐍</div>
                <h4 className="text-white font-semibold">Python</h4>
                <p className="text-xs text-gray-500 mt-1">Python 3.x</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-xl flex flex-col items-center justify-center border border-gray-700/50 hover:border-red-400/50 transition-colors group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">☕</div>
                <h4 className="text-white font-semibold">Java</h4>
                <p className="text-xs text-gray-500 mt-1">OpenJDK</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-xl flex flex-col items-center justify-center border border-gray-700/50 hover:border-blue-600/50 transition-colors group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">⚡</div>
                <h4 className="text-white font-semibold">C++</h4>
                <p className="text-xs text-gray-500 mt-1">GCC / G++</p>
              </div>
            </div>

            <div className="mt-8 bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
              <p className="text-blue-300 text-sm flex items-center gap-2">
                <Zap size={16} />
                <strong>Note:</strong> We are continuously adding support for more languages (e.g., Rust, Go, TypeScript). Stay tuned!
              </p>
            </div>
          </motion.div>
        );

      case 'faq':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white mb-6">Frequently Asked Questions</h1>
            
            <div className="space-y-4">
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
                <h4 className="text-lg font-bold text-white mb-2">Is CodeSync free to use?</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Yes! CodeSync is completely free for standard use. You can create unlimited rooms and collaborate with as many users as you want.
                </p>
              </div>
              
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
                <h4 className="text-lg font-bold text-white mb-2">Do I need an account to join a room?</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  No, guests can join rooms freely by entering a valid Room ID. However, having an account allows you to save your room history and maintain a persistent profile identity.
                </p>
              </div>

              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
                <h4 className="text-lg font-bold text-white mb-2">How long do rooms stay active?</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Rooms remain active as long as there is at least one participant connected. Inactive rooms are automatically cleaned up after a period of idleness to preserve server resources.
                </p>
              </div>

              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
                <h4 className="text-lg font-bold text-white mb-2">Can I download my code?</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Yes, you can copy the contents of the editor at any time. We also plan to introduce an "Export to File" feature very soon.
                </p>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-16 relative">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.1)_0%,transparent_50%)] pointer-events-none"></div>
      
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl z-50 hover:bg-blue-500 transition-colors"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar Navigation */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed md:sticky top-16 left-0 h-[calc(100vh-64px)] w-72 bg-gray-900/95 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border-r border-gray-800/50 p-6 z-40 overflow-y-auto"
            >
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6 ml-2">Documentation</h2>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSection(section.id);
                        if (window.innerWidth < 768) setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                        isActive 
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      <section.icon size={18} className={isActive ? 'text-blue-400' : 'text-gray-500'} />
                      <span className="font-medium">{section.title}</span>
                      {isActive && <ChevronRight size={16} className="ml-auto opacity-50" />}
                    </button>
                  );
                })}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className={`flex-1 p-6 md:p-12 lg:p-16 transition-all duration-300 ${isSidebarOpen ? 'md:ml-0' : ''}`}>
          <div className="max-w-3xl">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentationPage;
