import { useState, useEffect, useCallback, useRef } from "react";
import useAuthStore from "../store/authStore";
import useToastStore from "../store/toastStore";
import { articleApi } from "../api/articles.api";
import { categoryApi } from "../api/categories.api";
import ArticleForm from "../components/articles/ArticleForm";
import ConfirmModal from "../components/ui/ConfirmModal";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  SlidersHorizontal,
  ImageOff,
} from "lucide-react";

const LIMIT = 10;

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "deleted", label: "Deleted" },
];

export default function ArticlesPage() {
  const token = useAuthStore((s) => s.token);
  const { addToast } = useToastStore();

  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [domainFilter, setDomainFilter] = useState("");

  const [categories, setCategories] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    categoryApi
      .listActive(token)
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [token]);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: LIMIT };
      if (activeSearch) params.search = activeSearch;
      if (statusFilter) params.status = statusFilter;
      if (domainFilter) params.domain_slug = domainFilter;

      const data = await articleApi.list(token, params);
      setArticles(Array.isArray(data) ? data : data?.items || []);
      setTotal(data?.total || 0);
    } catch {
      addToast("Failed to load articles", "error");
    } finally {
      setLoading(false);
    }
  }, [token, page, activeSearch, statusFilter, domainFilter]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const applySearch = (e) => {
    e.preventDefault();
    setPage(1);
    setActiveSearch(searchInput);
  };

  const resetFilters = () => {
    setSearchInput("");
    setActiveSearch("");
    setStatusFilter("");
    setDomainFilter("");
    setPage(1);
  };

  const handleCreate = () => {
    setSelectedArticle(null);
    setFormOpen(true);
  };

  const handleEdit = (article) => {
    setSelectedArticle(article);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await articleApi.delete(token, deleteTarget.slug);
      addToast(`"${deleteTarget.title}" deleted`, "success");
      setDeleteTarget(null);
      fetchArticles();
    } catch {
      addToast("Failed to delete article", "error");
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const hasFilters = activeSearch || statusFilter || domainFilter;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? "Loading…" : `${total} article${total !== 1 ? "s" : ""} total`}
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-[#FF0000] hover:bg-[#D80000] text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-red-500/20 transition-all"
        >
          <Plus size={15} />
          New Article
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <form onSubmit={applySearch} className="flex-1 min-w-[200px] relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            ref={searchRef}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search articles…"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FF0000] focus:ring-2 focus:ring-red-50 transition"
          />
        </form>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FF0000] focus:ring-2 focus:ring-red-50 transition cursor-pointer text-gray-700"
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          value={domainFilter}
          onChange={(e) => {
            setDomainFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FF0000] focus:ring-2 focus:ring-red-50 transition cursor-pointer text-gray-700"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 transition"
          >
            <RotateCcw size={13} />
            Reset
          </button>
        )}

        <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-400">
          <SlidersHorizontal size={13} />
          {hasFilters ? "Filtered" : "All articles"}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Article
              </th>
              <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                Category
              </th>
              <th className="px-4 py-3.5 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                Trending
              </th>
              <th className="px-4 py-3.5 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3.5 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50/80">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 animate-pulse flex-shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-3.5 bg-gray-100 rounded animate-pulse w-2/3" />
                        <div className="h-2.5 bg-gray-100 rounded animate-pulse w-1/3" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-20" />
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-10 mx-auto" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-5 bg-gray-100 rounded-full animate-pulse w-20 mx-auto" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-5 bg-gray-100 rounded animate-pulse w-14 mx-auto" />
                  </td>
                </tr>
              ))
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <ImageOff size={40} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-gray-500 font-medium text-sm">
                    No articles found
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {hasFilters
                      ? "Try different filters"
                      : "Create your first article to get started"}
                  </p>
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr
                  key={article.slug}
                  className="hover:bg-gray-50/60 transition"
                >
                  {/* Article */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {article.image?.url ? (
                        <img
                          src={article.image.url}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center">
                          <ImageOff size={16} className="text-gray-300" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate max-w-[260px]">
                          {article.title}
                        </p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5 truncate max-w-[260px]">
                          /{article.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-sm text-gray-600 capitalize">
                      {article.domain_slug}
                    </span>
                  </td>

                  {/* Trending */}
                  <td className="px-4 py-4 text-center hidden lg:table-cell">
                    {article.is_trending ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-600 text-[11px] font-semibold rounded-lg">
                        <TrendingUp size={10} /> Hot
                      </span>
                    ) : (
                      <span className="text-gray-200">—</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        article.status === "published"
                          ? "bg-green-100 text-green-700"
                          : article.status === "draft"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {article.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => handleEdit(article)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition"
                        title="Edit article"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(article)}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                        title="Delete article"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {!loading && total > LIMIT && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages} &bull; {total} total
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const pg = i + 1;
                return (
                  <button
                    key={pg}
                    onClick={() => setPage(pg)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                      pg === page
                        ? "bg-[#FF0000] text-white"
                        : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {pg}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Article Form Drawer */}
      <ArticleForm
        open={formOpen}
        setOpen={setFormOpen}
        refetch={fetchArticles}
        article={selectedArticle}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Article"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
        danger
      />
    </div>
  );
}
