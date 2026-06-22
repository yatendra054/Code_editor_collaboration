import { useEffect, useState, useRef, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { toast } from "react-toastify";
import io from "socket.io-client";
import {
  DEFAULT_CODE,
  generateRoomId,
  INPUT_VALIDATORS,
  API_URL,
} from "./utils/constants";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ForgotPassword from "./components/auth/ForgotPassword";
import SetUserProfile from "./components/auth/SetUserProfile";
import UserProfile from "./components/auth/UserProfile";
import Toast from "./components/ui/Toast";
import RoomProfile from "./components/rooms/RoomProfile";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoadingSpinner from "./components/common/LoadingSpinner";
import JoinApprovalToast from "./components/ui/JoinApprovalToast";

import HomeShimmer from "./components/shimmers/HomeShimmer";

import { RoomProvider } from "./context/RoomContext";

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home"));
const EditorPage = lazy(() => import("./pages/EditorPage"));
const Login = lazy(() => import("./components/auth/Login"));
const Signup = lazy(() => import("./components/auth/Signup"));
const DocumentationPage = lazy(() => import("./pages/DocumentationPage"));

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <RoomProvider>
          <div className="min-h-screen flex flex-col bg-gray-900 text-white">
            <Navbar />
            <div className="flex-grow">
              <Toast />
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Suspense fallback={<HomeShimmer />}><Home /></Suspense>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/setUserProfile" element={<SetUserProfile />} />
                  <Route path="/userProfile" element={<UserProfile />} />
                  <Route
                    path="/roomProfile"
                    element={
                      <ProtectedRoute>
                        <RoomProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/editor"
                    element={<EditorPage />}
                  />
                  <Route path="/docs" element={<DocumentationPage />} />
                  <Route path="/about" element={<Navigate to="/#about" />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Suspense>
            </div>
            <Footer />
          </div>
        </RoomProvider>
      </Router>
    </AuthProvider>
  );
};

export default App;
