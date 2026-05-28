import useStats from "../hooks/useStats";
import Header from "../components/layout/Header";

export default function DashboardPage({
  token,
}) {
  const stats = useStats(token);

  return (
    <div>
      <Header title="Dashboard" />

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow">
          <p>Total</p>
          <h2 className="text-3xl font-bold">
            {stats?.total || 0}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p>Published</p>
          <h2 className="text-3xl font-bold">
            {stats?.published || 0}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p>Draft</p>
          <h2 className="text-3xl font-bold">
            {stats?.draft || 0}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p>Trending</p>
          <h2 className="text-3xl font-bold">
            {stats?.trending || 0}
          </h2>
        </div>
      </div>
    </div>
  );
}