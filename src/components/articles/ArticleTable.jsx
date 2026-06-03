import { Pencil, Trash2 } from "lucide-react";

export default function ArticleTable({
  articles,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">
              Title
            </th>

            <th className="p-4 text-left">
              Status
            </th>

            <th className="p-4 text-center">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {articles.length === 0 ? (
            <tr>
              <td
                colSpan="3"
                className="p-6 text-center text-gray-500"
              >
                No articles found
              </td>
            </tr>
          ) : (
            articles.map((article) => (
              <tr
                key={
                  article.id ||
                  article.slug
                }
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4 font-medium">
                  {article.title}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      article.status ===
                      "published"
                        ? "bg-green-100 text-green-700"
                        : article.status ===
                          "draft"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {article.status}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() =>
                        onEdit(article)
                      }
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Edit Article"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() =>
                        onDelete(
                          article.slug
                        )
                      }
                      className="text-red-600 hover:text-red-800 transition"
                      title="Delete Article"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}