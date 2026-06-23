// Default template code for supported languages
export const DEFAULT_CODE = {
  javascript: "// Write your JavaScript code here\nconsole.log('Hello World!');",
  python: "# Write your Python code here\nprint('Hello World!')",
  java: `// Write your Java code here
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello World!");
  }
}`,
  cpp: `// Write your C++ code here
#include <iostream>

int main() {
  std::cout << "Hello World!" << std::endl;
  return 0;
}`
};

// Generate random Room ID
export const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Input validation rules per language
export const INPUT_VALIDATORS = {
  javascript: (input) => ({ valid: true, message: "" }),
  python: (input) => ({ valid: true, message: "" }),
  java: (input) => {
    if (input.trim() === "") return { valid: true, message: "" };
    if (/^[\d\s]+$/.test(input)) return { valid: true, message: "" };
    if (/^".*"$/.test(input)) return { valid: true, message: "" };
    return {
      valid: false,
      message: "Java input should be numbers or strings in double quotes"
    };
  },
  cpp: (input) => {
    if (input.trim() === "") return { valid: true, message: "" };
    if (/^[\d\s]+$/.test(input)) return { valid: true, message: "" };
    if (/^".*"$/.test(input)) return { valid: true, message: "" };
    return {
      valid: false,
      message: "C++ input should be numbers or strings in double quotes"
    };
  }
};

// Language configuration for Monaco Editor
export const LANGUAGE_CONFIG = {
  javascript: {
    id: "javascript",
    extensions: [".js"],
    aliases: ["JavaScript", "js"]
  },
  python: {
    id: "python",
    extensions: [".py"],
    aliases: ["Python", "py"]
  },
  java: {
    id: "java",
    extensions: [".java"],
    aliases: ["Java"]
  },
  cpp: {
    id: "cpp",
    extensions: [".cpp", ".cc", ".cxx"],
    aliases: ["C++", "cpp"]
  }
};

// Supported programming languages
export const SUPPORTED_LANGUAGES = [
  { value: "javascript", label: "JavaScript", icon: "🟨" },
  { value: "python", label: "Python", icon: "🐍" },
  { value: "java", label: "Java", icon: "☕" },
  { value: "cpp", label: "C++", icon: "⚡" }
];

export const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Code Editor", path: "/editor" },
  { name: "Room History", path: "/roomProfile" },
  { name: "Docs", path: "/docs" }
];

// Footer Quick Links
export const FOOTER_QUICK_LINKS = [
  ...NAV_LINKS,
  { name: "About", path: "/#about" },
  { name: "Contact", path: "/#contact" }
];

// Social Media Links (Placeholders)
export const SOCIAL_LINKS = [
  { name: "GitHub", href: "https://github.com/codesync", icon: "Github" },
  { name: "LinkedIn", href: "https://linkedin.com/company/codesync", icon: "Linkedin" },
  { name: "Twitter", href: "https://twitter.com/codesync", icon: "Twitter" }
];

export const API_URL =
  import.meta.env.VITE_API_URL || "https://code-editor-collaboration-11.onrender.com";

// export const API_URL = import.meta.env.VITE_API_URL || "http://192.168.X.X:4000";
