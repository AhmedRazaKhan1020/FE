"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function Index() {
  const [profileImageUrl, setprofileImageUrl] = useState(null);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();


  const handleSignup = async (e) => {
    e.preventDefault();

    if (!fullname || !email || !password) {
      setError("All fields are required");
      toast.error("All fields are required");
      return;
    }

    setError(null);

    try {
      const response = await fetch("https://be-production-4ef6.up.railway.app/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullname, email, password, profileImageUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Register successful:", data);
        toast.success("Register successful!");
        router.push("/Login");
      } else {
        setError(data.message || "Register failed");
        toast.error(data.message || "Register failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pl-2">
      <div className="w-full max-w-md  p-8 flex flex-col justify-center mt-10 md:mt-0">
        <h3 className="text-xl font-medium text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today and take control of your finances with ease!
        </p>

        <form onSubmit={handleSignup}>
          {/* Input*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
              <input
                type="text"
                placeholder="Enter Your Full Name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            {/* Password */}
            <div className="col-span-1 md:col-span-2">
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
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-xs pb-2.5 mt-2">{error}</p>}

          {/* Submit*/}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition mt-2 cursor-pointer"
          >
            Sign up
          </button>

          {/* Login*/}
          <p className="text-[13px] text-slate-800 mt-3 text-center">
            Already have an account?{" "}
            <Link href="/" className="font-medium text-purple-600 underline">
              Login
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
