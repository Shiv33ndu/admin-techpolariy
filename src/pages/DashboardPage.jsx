import useStats from "../hooks/useStats";
import Header from "../components/layout/Header";
import {
  FileText,
  CheckCircle,
  Clock3,
  TrendingUp,
  BarChart3,
  Activity,
  Target,
} from "lucide-react";

export default function DashboardPage({
  token,
}) {
  const stats = useStats(token);

  const total = stats?.total || 0;
  const published =
    stats?.published || 0;
  const draft = stats?.draft || 0;
  const trending =
    stats?.trending || 0;

  const publishPercentage =
    total > 0
      ? Math.round(
          (published / total) * 100
        )
      : 0;

  const draftPercentage =
    total > 0
      ? Math.round(
          (draft / total) * 100
        )
      : 0;

  const trendingPercentage =
    total > 0
      ? Math.round(
          (trending / total) * 100
        )
      : 0;

  return (
    <div className="space-y-8">

      <Header title="Dashboard" />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#FF0000] via-[#E60000] to-[#B80000] rounded-3xl p-8 text-white shadow-2xl">

        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />

        <div className="absolute bottom-0 right-20 w-24 h-24 bg-white/10 rounded-full" />

        <div className="relative z-10">
          <h2 className="text-4xl font-bold">
            Welcome to TechPolarity
          </h2>

          <p className="mt-3 text-red-100 text-lg">
            Manage articles, monitor publishing activity,
            and track content performance from a single dashboard.
          </p>

          <div className="mt-6 flex gap-6">
            <div>
              <p className="text-red-100 text-sm">
                Total Content
              </p>

              <h3 className="text-3xl font-bold">
                {total}
              </h3>
            </div>

            <div>
              <p className="text-red-100 text-sm">
                Published
              </p>

              <h3 className="text-3xl font-bold">
                {published}
              </h3>
            </div>
          </div>
        </div>

      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">
                Total Articles
              </p>

              <h2 className="text-4xl font-bold mt-2 text-black">
                {total}
              </h2>
            </div>

            <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center">
              <FileText
                size={28}
                className="text-[#FF0000]"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">
                Published
              </p>

              <h2 className="text-4xl font-bold mt-2 text-green-600">
                {published}
              </h2>
            </div>

            <div className="h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center">
              <CheckCircle
                size={28}
                className="text-green-600"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">
                Drafts
              </p>

              <h2 className="text-4xl font-bold mt-2 text-yellow-600">
                {draft}
              </h2>
            </div>

            <div className="h-14 w-14 rounded-2xl bg-yellow-100 flex items-center justify-center">
              <Clock3
                size={28}
                className="text-yellow-600"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">
                Trending
              </p>

              <h2 className="text-4xl font-bold mt-2 text-purple-600">
                {trending}
              </h2>
            </div>

            <div className="h-14 w-14 rounded-2xl bg-purple-100 flex items-center justify-center">
              <TrendingUp
                size={28}
                className="text-purple-600"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Publishing Health */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-5">
            <BarChart3 className="text-[#FF0000]" />

            <h3 className="text-xl font-semibold">
              Publishing Health
            </h3>
          </div>

          <div className="flex justify-between mb-2">
            <span>Published Rate</span>

            <span className="font-bold">
              {publishPercentage}%
            </span>
          </div>

          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF0000] rounded-full transition-all duration-1000"
              style={{
                width: `${publishPercentage}%`,
              }}
            />
          </div>
        </div>

        {/* Health Score */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-[#FF0000]" />

            <h3 className="text-xl font-semibold">
              Content Score
            </h3>
          </div>

          <div className="flex justify-center mt-6">
            <div className="w-36 h-36 rounded-full border-[10px] border-[#FF0000] flex items-center justify-center">
              <span className="text-4xl font-bold text-[#FF0000]">
                {publishPercentage}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-5">
            <Activity className="text-[#FF0000]" />

            <h3 className="text-xl font-semibold">
              Quick Insights
            </h3>
          </div>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span>Publishing Rate</span>

              <span className="font-bold text-green-600">
                {publishPercentage}%
              </span>
            </div>

            <div className="flex justify-between">
              <span>Draft Ratio</span>

              <span className="font-bold text-yellow-600">
                {draftPercentage}%
              </span>
            </div>

            <div className="flex justify-between">
              <span>Trending Ratio</span>

              <span className="font-bold text-[#FF0000]">
                {trendingPercentage}%
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Articles</span>

              <span className="font-bold">
                {total}
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}