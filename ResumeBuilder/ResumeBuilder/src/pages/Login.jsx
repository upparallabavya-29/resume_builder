import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../utils/contants";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userData = urlParams.get("user");

    if (token && userData) {
      try {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("refreshToken", token); // Using same token for now or handle refresh token if available
        localStorage.setItem("user", userData);
        window.dispatchEvent(new Event("storage"));
        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
          onClose: () => navigate("/", { replace: true }),
        });
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/users/login`, formData);

      // Store tokens and user info
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Update global state
      window.dispatchEvent(new Event("storage"));

      toast.success(res.data.message || "Login successful!", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
        onClose: () => navigate("/", { replace: true }),
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed! Please try again.",
        {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg p-3 pl-10 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-foreground placeholder:text-gray-400";

  return (
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground transition-colors duration-300 px-4 relative overflow-hidden mesh-gradient">

      <ToastContainer />

      <form
        onSubmit={handleLogin}
        className={`glass-card p-10 w-full max-w-md backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 transition-all duration-500 animate-fade-in-up ${loading ? "opacity-75 scale-[0.98]" : "opacity-100 scale-100"
          }`}
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform duration-300 inline-block">
            <Link to="/home">ResumeAI</Link>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Welcome back! Please login to continue.</p>
        </div>

        <div className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className={inputClasses}
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className={inputClasses}
            />
          </div>

          <div className="flex justify-end mt-1">
            <Link to="/forgot-password" className="text-sm font-semibold text-green-600 hover:text-green-500 hover:underline">
              Forgot Password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 p-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-green-500/30 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30 ${loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
            }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300 dark:border-slate-700"></div>
          <span className="px-4 text-gray-500 dark:text-gray-400 text-sm font-medium">OR</span>
          <div className="flex-grow border-t border-gray-300 dark:border-slate-700"></div>
        </div>

        <button
          type="button"
          onClick={() => window.location.href = `${BASE_URL}/users/auth/google`}
          className="w-full flex items-center justify-center gap-3 p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-bold text-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="mt-8 text-center animate-fade-in-up delay-200">
          <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
          <Link
            to="/signup"
            className="text-green-600 hover:text-green-500 font-bold hover:underline transition-all duration-200"
          >
            Sign Up Now
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
