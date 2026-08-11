"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Briefcase,
  Building,
  Clipboard,
  Eye,
  EyeOff,
  User,
  Lock,
} from "lucide-react";
import { signUp, login, clearState, loadUser } from "@/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { MdEmail } from "react-icons/md";

export default function AuthForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { error, loading, isUserRegistered, isUserLogged, user } = useSelector(
    (state) => state.user
  );
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bussinessName: "",
    bussinessDescription: "",
    bussinessCategory: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const toggleAuthMode = () => setIsSignUp(!isSignUp);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (user) {
      router.push("/user");
    }
  }, [user, router]);

  useEffect(() => {
    if (isUserRegistered) {
      toast.success("User registered successfully");
      dispatch(clearState());
      dispatch(loadUser());
      setFormData({
        name: "",
        email: "",
        password: "",
        bussinessName: "",
        bussinessDescription: "",
        bussinessCategory: "",
      });
    }
    if (isUserLogged) {
      toast.success("User logged in successfully");
      dispatch(clearState());
      dispatch(loadUser());
      setLoginData({
        email: "",
        password: "",
      });
    }
    if (error) {
      console.log(error);
      toast.error(error);
      dispatch(clearState());
    }
  }, [isUserRegistered, isUserLogged, error, dispatch]);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login(loginData));
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    dispatch(signUp(formData));
  };

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;
    router.push("/user");
  }, [user, router]);

  return (
    <div className="text-[#1a1a1a] min-h-screen flex items-center justify-center bg-[#FDF9F0] py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-5 left-5">
        <button
          className="flex items-center gap-2 p-2 bg-white border-2 border-[#1a1a1a] shadow-neo-sm hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
          onClick={() => (window.location.href = "/")}
        >
          <ArrowLeft className="h-6 w-6 text-[#1a1a1a]" />
          <span className="font-extrabold text-sm uppercase">Home</span>
        </button>
      </div>

      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="font-syne text-lg sm:text-xl font-bold text-[#FF4D00] uppercase tracking-wider mb-2">
            {isSignUp ? "WELCOME TO" : "SIGN IN TO"}
          </h2>
          <img
            src="/aptus-logo.png"
            alt="Aptus Logo"
            className="h-16 sm:h-20 w-auto mx-auto cursor-pointer object-contain mb-3"
            onClick={() => router.push("/")}
          />
          <p className="text-sm font-semibold text-gray-700">
            {isSignUp
              ? "Create an account to get started with Aptus Chatbot Integration"
              : "Sign in to manage your Aptus AI assistant"}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 border-3 border-[#1a1a1a] shadow-neo-lg"
        >
          <form className="space-y-5">
            <div className="space-y-4">
              {isSignUp && (
                <div>
                  <label htmlFor="name" className="block text-xs font-black uppercase text-[#1a1a1a] mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="w-full pl-10 pr-3 py-2 border-2 border-[#1a1a1a] bg-white text-[#1a1a1a] font-medium placeholder-gray-400 focus:outline-none focus:bg-[#FDF9F0] focus:shadow-neo-sm"
                      placeholder="Your Full Name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email-address" className="block text-xs font-black uppercase text-[#1a1a1a] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    required
                    className="w-full pl-10 pr-3 py-2 border-2 border-[#1a1a1a] bg-white text-[#1a1a1a] font-medium placeholder-gray-400 focus:outline-none focus:bg-[#FDF9F0] focus:shadow-neo-sm"
                    placeholder="Email address"
                    value={isSignUp ? formData.email : loginData.email}
                    onChange={isSignUp ? handleChange : handleLoginChange}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdEmail className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-black uppercase text-[#1a1a1a] mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full pl-10 pr-10 py-2 border-2 border-[#1a1a1a] bg-white text-[#1a1a1a] font-medium placeholder-gray-400 focus:outline-none focus:bg-[#FDF9F0] focus:shadow-neo-sm"
                    placeholder="Password"
                    value={isSignUp ? formData.password : loginData.password}
                    onChange={isSignUp ? handleChange : handleLoginChange}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                    {showPassword ? (
                      <EyeOff
                        onClick={togglePasswordVisibility}
                        className="h-5 w-5 text-gray-500"
                      />
                    ) : (
                      <Eye
                        onClick={togglePasswordVisibility}
                        className="h-5 w-5 text-gray-500"
                      />
                    )}
                  </div>
                </div>
              </div>

              {isSignUp && (
                <>
                  <div>
                    <label htmlFor="businessName" className="block text-xs font-black uppercase text-[#1a1a1a] mb-1">
                      Business Name
                    </label>
                    <div className="relative">
                      <input
                        id="businessName"
                        name="bussinessName"
                        type="text"
                        required
                        className="w-full pl-10 pr-3 py-2 border-2 border-[#1a1a1a] bg-white text-[#1a1a1a] font-medium placeholder-gray-400 focus:outline-none focus:bg-[#FDF9F0] focus:shadow-neo-sm"
                        placeholder="Business Name"
                        value={formData.bussinessName}
                        onChange={handleChange}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="businessCategory" className="block text-xs font-black uppercase text-[#1a1a1a] mb-1">
                      Business Category
                    </label>
                    <div className="relative">
                      <input
                        id="businessCategory"
                        name="bussinessCategory"
                        type="text"
                        required
                        className="w-full pl-10 pr-3 py-2 border-2 border-[#1a1a1a] bg-white text-[#1a1a1a] font-medium placeholder-gray-400 focus:outline-none focus:bg-[#FDF9F0] focus:shadow-neo-sm"
                        placeholder="Business Category"
                        value={formData.bussinessCategory}
                        onChange={handleChange}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="businessDescription" className="block text-xs font-black uppercase text-[#1a1a1a] mb-1">
                      Business Description
                    </label>
                    <div className="relative">
                      <textarea
                        id="businessDescription"
                        name="bussinessDescription"
                        required
                        rows={3}
                        className="w-full pl-10 pr-3 py-2 border-2 border-[#1a1a1a] bg-white text-[#1a1a1a] font-medium placeholder-gray-400 focus:outline-none focus:bg-[#FDF9F0] focus:shadow-neo-sm resize-none overflow-y-auto max-h-32"
                        placeholder="Business Description"
                        value={formData.bussinessDescription}
                        onChange={handleChange}
                      />
                      <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                        <Clipboard className="h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  onClick={isSignUp ? handleSignUp : handleLogin}
                  className={`w-full btn-neo-primary py-3 px-4 font-extrabold text-base ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading
                    ? "LOADING..."
                    : isSignUp
                    ? "CREATE ACCOUNT"
                    : "SIGN IN"}
                </button>
              </div>
            </div>
          </form>

          <div className="flex items-center justify-center mt-6 pt-4 border-t-2 border-gray-200">
            <p className="text-sm font-bold text-[#1a1a1a]">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                onClick={toggleAuthMode}
                className="font-black text-[#FF4D00] hover:underline ml-2 uppercase"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
