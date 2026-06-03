import useStats from "../hooks/useStats";
import Header from "../components/layout/Header";
import {
  FileText,
  CheckCircle,
  Clock3,
  TrendingUp,
  BarChart3,
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

  return (
    <div className="space-y-8">
      <Header title="Dashboard" />

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold">
          Welcome to TechPolarity
        </h2>

        <p className="mt-2 text-blue-100">
          Manage articles, monitor
          publishing activity and track
          content performance.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">
                Total Articles
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {total}
              </h2>
            </div>

            <FileText
              size={40}
              className="text-blue-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">
                Published
              </p>

              <h2 className="text-4xl font-bold mt-2 text-green-600">
                {published}
              </h2>
            </div>

            <CheckCircle
              size={40}
              className="text-green-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">
                Draft Articles
              </p>

              <h2 className="text-4xl font-bold mt-2 text-yellow-600">
                {draft}
              </h2>
            </div>

            <Clock3
              size={40}
              className="text-yellow-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">
                Trending
              </p>

              <h2 className="text-4xl font-bold mt-2 text-purple-600">
                {trending}
              </h2>
            </div>

            <TrendingUp
              size={40}
              className="text-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="text-blue-600" />

            <h3 className="text-xl font-semibold">
              Publishing Health
            </h3>
          </div>

          <div className="mb-3 flex justify-between">
            <span>
              Published Content
            </span>

            <span className="font-semibold">
              {publishPercentage}%
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-700"
              style={{
                width: `${publishPercentage}%`,
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-xl font-semibold mb-4">
            Content Summary
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>
                Published Articles
              </span>

              <span className="font-bold text-green-600">
                {published}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Drafts</span>

              <span className="font-bold text-yellow-600">
                {draft}
              </span>
            </div>

            <div className="flex justify-between">
              <span>
                Trending Articles
              </span>

              <span className="font-bold text-purple-600">
                {trending}
              </span>
            </div>

            <div className="flex justify-between">
              <span>
                Total Articles
              </span>

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