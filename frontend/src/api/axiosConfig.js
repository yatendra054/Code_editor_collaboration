import axios from "axios";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://codesync-osdn.onrender.com", // Backend URL
  withCredentials: true, // Important for cookies (Session ID)
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add interceptors to handle 401 Unauthorized or other errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      console.error("Unauthorized! Please login.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
