import { useState } from "react";
import {
  ShieldCheck,
  Newspaper,
  TrendingUp,
  Eye,
  EyeOff,
} from "lucide-react";

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

  const [showPassword, setShowPassword] =
    useState(false);

  const handleLogin = async (e) => {
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
    <div className="min-h-screen flex bg-[#FAFAFA]">

      {/* LEFT SECTION */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#FF0000] via-[#D80000] to-[#8B0000]">

        <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">

          <img
            src="/logo-techpolarity.png"
            alt="TechPolarity"
            className="w-32 mb-8"
          />

          <h1 className="text-6xl font-black leading-tight">
            TechPolarity
          </h1>

          <p className="mt-6 text-xl text-red-100 max-w-lg">
            Modern technology journalism,
            insights, innovation, AI,
            startups and future trends.
          </p>

          <div className="mt-12 space-y-6">

            <div className="flex items-center gap-4">
              <Newspaper size={28} />
              <span className="text-lg">
                Manage Articles
              </span>
            </div>

            <div className="flex items-center gap-4">
              <TrendingUp size={28} />
              <span className="text-lg">
                Track Trending Content
              </span>
            </div>

            <div className="flex items-center gap-4">
              <ShieldCheck size={28} />
              <span className="text-lg">
                Secure Admin Access
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">

        <div className="w-full max-w-md">

          <div className="bg-white rounded-[32px] p-10 shadow-2xl border border-gray-100">

            <div className="lg:hidden flex justify-center mb-6">
              <img
                src="/logo-techpolarity.png"
                alt="TechPolarity"
                className="h-20"
              />
            </div>

            <div className="text-center mb-8">

              <h2 className="text-4xl font-bold text-[#111111]">
                Welcome Back
              </h2>

              <p className="text-gray-500 mt-3">
                Login to access your
                TechPolarity dashboard
              </p>

            </div>

            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl">
                {error}
              </div>
            )}

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              <div>
                <label className="block mb-2 text-sm font-semibold text-[#111111]">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="admin@techpolarity.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  required
                  className="
                    w-full
                    bg-gray-50
                    border
                    border-gray-200
                    px-5
                    py-4
                    rounded-2xl
                    outline-none
                    focus:ring-4
                    focus:ring-red-100
                    focus:border-red-500
                  "
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-[#111111]">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    required
                    className="
                      w-full
                      bg-gray-50
                      border
                      border-gray-200
                      px-5
                      py-4
                      pr-12
                      rounded-2xl
                      outline-none
                      focus:ring-4
                      focus:ring-red-100
                      focus:border-red-500
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    tabIndex={-1}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                      hover:text-gray-600
                      transition-colors
                    "
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  py-4
                  rounded-2xl
                  bg-[#FF0000]
                  hover:bg-[#D80000]
                  text-white
                  font-semibold
                  text-lg
                  shadow-xl
                  hover:scale-[1.02]
                  transition-all
                  duration-300
                  disabled:opacity-90
                  disabled:hover:scale-100
                  disabled:cursor-not-allowed
                  flex
                  items-center
                  justify-center
                "
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" />
                    </span>
                    Authenticating
                  </span>
                ) : (
                  "Login to Dashboard"
                )}
              </button>

            </form>

            <div className="mt-8 text-center text-xs text-gray-400">
              © 2026 TechPolarity CMS
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}