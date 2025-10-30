"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

 function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required");
      toast.error("All fields are required");
      return;
    }

    setError(null);

    try {
      const response = await fetch("https://be-production-4ef6.up.railway.app/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        localStorage.setItem("token", data.token);
        toast.success("Login successful!");
        router.push("/Dashboard");
      } else {
        setError(data.message || "Login failed");
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pl-2">
      <div className="w-full max-w-md  p-8 flex flex-col justify-center">
        <h3 className="text-2xl font-medium text-black mb-2">Welcome Back</h3>
        <p className="text-sm text-gray-700 mb-6">
          Please log in to continue managing your expenses.
        </p>

        <form onSubmit={handleLogin}>
          {/* Email*/}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>

          {/* Password*/}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
            <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-300 hover:text-[#7f22fe] cursor-pointer"
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
          </div>
          </div>

          {/* Error*/}
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#7f22fe] text-white py-2 rounded-md text-sm font-medium hover:bg-[#7f22fe]/90 transition cursor-pointer"
          >
            Login
          </button>

          {/* Signup*/}
          <p className="text-[13px] text-slate-800 mt-3 text-center">
            Don’t have an account?{" "}
            <Link href="/Register" className="font-medium text-[#7f22fe] underline">
              Signup
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block">
        <img src="/Auth.jpg" alt="img" className="w-350 h-122" />
      </div>
    </div>
  );
}

export default Index;