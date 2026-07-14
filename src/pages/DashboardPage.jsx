import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { articleApi } from "../api/articles.api";
import {
  FileText,
  CheckCircle,
  Clock3,
  TrendingUp,
  Plus,
  ArrowRight,
  BarChart3,
} from "lucide-react";

export default function DashboardPage() {
  const token = useAuthStore((s) => s.token);
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    articleApi
      .stats(token)
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoadingStats(false));

    articleApi
      .list(token, { page: 1, limit: 6 })
      .then((data) => setRecent(Array.isArray(data) ? data : data?.items || []))
      .catch(() => {})
      .finally(() => setLoadingRecent(false));
  }, [token]);

  const total = stats?.total || 0;
  const published = stats?.published || 0;
  const draft = stats?.draft || 0;
  const trending = stats?.trending || 0;
  const publishPct = total > 0 ? Math.round((published / total) * 100) : 0;
  const draftPct = total > 0 ? Math.round((draft / total) * 100) : 0;
  const trendPct = total > 0 ? Math.round((trending / total) * 100) : 0;

  const statCards = [
    {
      label: "Total Articles",
      value: total,
      icon: FileText,
      bg: "bg-[#111111]",
      iconBg: "bg-white/10",
      iconColor: "text-white",
      textColor: "text-white",
      subColor: "text-white/60",
    },
    {
      label: "Published",
      value: published,
      icon: CheckCircle,
      bg: "bg-green-500",
      iconBg: "bg-white/20",
      iconColor: "text-white",
      textColor: "text-white",
      subColor: "text-white/70",
    },
    {
      label: "Drafts",
      value: draft,
      icon: Clock3,
      bg: "bg-amber-500",
      iconBg: "bg-white/20",
      iconColor: "text-white",
      textColor: "text-white",
      subColor: "text-white/70",
    },
    {
      label: "Trending",
      value: trending,
      icon: TrendingUp,
      bg: "bg-[#FF0000]",
      iconBg: "bg-white/20",
      iconColor: "text-white",
      textColor: "text-white",
      subColor: "text-white/70",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back — here's an overview of your content
          </p>
        </div>
        <Link
          to="/articles"
          className="flex items-center gap-2 bg-[#FF0000] hover:bg-[#D80000] text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-red-500/20 transition-all"
        >
          <Plus size={15} />
          New Article
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(
          ({ label, value, icon: Icon, bg, iconBg, iconColor, textColor, subColor }) => (
            <div key={label} className={`${bg} rounded-2xl p-5`}>
              <div
                className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center mb-4`}
              >
                <Icon size={18} className={iconColor} />
              </div>
              <p className={`text-3xl font-bold ${textColor}`}>
                {loadingStats ? "—" : value}
              </p>
              <p className={`text-sm mt-1 ${subColor}`}>{label}</p>
            </div>
          )
        )}
      </div>

      {/* Recent Articles + Health side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Articles */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-[15px]">
              Recent Articles
            </h2>
            <Link
              to="/articles"
              className="flex items-center gap-1 text-xs font-medium text-[#FF0000] hover:gap-1.5 transition-all"
            >
              View all <ArrowRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-gray-50">
            {loadingRecent ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-4">
                  <div className="w-11 h-11 rounded-xl bg-gray-100 animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                    <div className="h-2.5 bg-gray-100 rounded animate-pulse w-1/3" />
                  </div>
                  <div className="w-16 h-5 bg-gray-100 rounded-full animate-pulse" />
                </div>
              ))
            ) : recent.length === 0 ? (
              <div className="py-12 text-center">
                <FileText size={36} className="mx-auto text-gray-200 mb-3" />
                <p className="text-gray-400 text-sm">No articles yet</p>
                <Link
                  to="/articles"
                  className="inline-block mt-3 text-xs text-[#FF0000] font-medium"
                >
                  Create your first article →
                </Link>
              </div>
            ) : (
              recent.map((article) => (
                <div
                  key={article.slug}
                  className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50/60 transition"
                >
                  {article.image?.url ? (
                    <img
                      src={article.image.url}
                      alt=""
                      className="w-11 h-11 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-gray-100 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {article.title}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex-shrink-0 ${
                      article.status === "published"
                        ? "bg-green-100 text-green-700"
                        : article.status === "draft"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {article.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Publishing Health */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={18} className="text-[#FF0000]" />
            <h2 className="font-semibold text-gray-900 text-[15px]">
              Publishing Health
            </h2>
          </div>

          <div className="space-y-5">
            {[
              {
                label: "Published Rate",
                value: publishPct,
                color: "bg-green-500",
                textColor: "text-green-600",
              },
              {
                label: "Draft Ratio",
                value: draftPct,
                color: "bg-amber-500",
                textColor: "text-amber-600",
              },
              {
                label: "Trending Ratio",
                value: trendPct,
                color: "bg-[#FF0000]",
                textColor: "text-[#FF0000]",
              },
            ].map(({ label, value, color, textColor }) => (
              <div key={label}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className={`text-sm font-bold ${textColor}`}>
                    {loadingStats ? "—" : `${value}%`}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} rounded-full transition-all duration-700`}
                    style={{ width: loadingStats ? "0%" : `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-5 border-t border-gray-100 text-center">
            <p className="text-4xl font-bold text-gray-900">{publishPct}</p>
            <p className="text-xs text-gray-400 mt-1">Content Score</p>
          </div>
        </div>
      </div>
    </div>
  );
}
