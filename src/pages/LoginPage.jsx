import { useState } from "react";
import useAuthStore from "../store/authStore";
import { loginAdmin } from "../api/auth.api";

export default function LoginPage() {
  const login = useAuthStore(
    (state) => state.login
  );

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin =
    async (e) => {
      e.preventDefault();

      setError("");

      try {
        setLoading(true);

        const data =
          await loginAdmin(
            email,
            password
          );

        login(data.access_token);
      } catch (err) {
        setError(
          err.message ||
            "Invalid credentials"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background Accent */}
      <div className="absolute top-[-100px] left-[-100px] w-[280px] h-[280px] bg-red-400/20 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-100px] right-[-100px] w-[280px] h-[280px] bg-orange-300/20 rounded-full blur-3xl"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">

        <div className="bg-white border border-gray-200 rounded-3xl shadow-2xl px-8 py-10">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-2xl bg-[#fff5f2] border border-red-100 flex items-center justify-center shadow-md p-3">
              <img
                src="/logo-techpolarity.png"
                alt="TechPolarity"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#111111] tracking-tight">
              TechPolarity
            </h1>

            <p className="text-gray-500 mt-3 text-sm">
              Secure Admin Dashboard Access
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-500 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* Email */}
            <div>
              <label className="block text-sm text-[#222222] mb-2 font-semibold">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                required
                className="
                  w-full
                  bg-[#fafafa]
                  border
                  border-gray-300
                  text-[#111111]
                  placeholder:text-gray-400
                  px-5
                  py-4
                  rounded-2xl
                  outline-none
                  transition-all
                  duration-300
                  focus:border-red-400
                  focus:ring-4
                  focus:ring-red-100
                "
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-[#222222] mb-2 font-semibold">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                required
                className="
                  w-full
                  bg-[#fafafa]
                  border
                  border-gray-300
                  text-[#111111]
                  placeholder:text-gray-400
                  px-5
                  py-4
                  rounded-2xl
                  outline-none
                  transition-all
                  duration-300
                  focus:border-red-400
                  focus:ring-4
                  focus:ring-red-100
                "
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                py-4
                rounded-2xl
                text-white
                font-semibold
                text-lg
                bg-[#ff6347]
                hover:bg-[#ef553a]
                transition-all
                duration-300
                shadow-lg
                hover:shadow-red-200
                disabled:opacity-70
                disabled:cursor-not-allowed
              "
            >
              {loading
                ? "Authenticating..."
                : "Login to Dashboard"}
            </button>

          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-xs">
              © 2026 TechPolarity Admin Panel
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}