import { Pencil, Trash2 } from "lucide-react";

export default function ArticleTable({
  articles,
  onEdit,
  onDelete,
}) {
  return (
    <table className="w-full bg-white rounded-xl overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-4 text-left">Title</th>
          <th className="p-4 text-left">Status</th>
          <th className="p-4 text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {articles.map((article) => (
          <tr
            key={article.id}
            className="border-t"
          >
            <td className="p-4">{article.title}</td>

            <td className="p-4">
              {article.status}
            </td>

            <td className="p-4">
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => onEdit(article)}
                  className="text-blue-600"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() =>
                    onDelete(article.slug)
                  }
                  className="text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}