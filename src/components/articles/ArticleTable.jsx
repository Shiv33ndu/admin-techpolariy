export default function ArticleTable({
  articles,
}) {
  return (
    <table className="w-full bg-white rounded-xl overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-4 text-left">
            Title
          </th>
          <th className="p-4 text-left">
            Status
          </th>
        </tr>
      </thead>

      <tbody>
        {articles.map((article) => (
          <tr
            key={article.slug}
            className="border-t"
          >
            <td className="p-4">
              {article.title}
            </td>

            <td className="p-4">
              {article.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}