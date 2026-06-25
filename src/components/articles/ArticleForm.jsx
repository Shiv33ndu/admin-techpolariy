import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { articleApi } from "../../api/articles.api";
import { categoryApi } from "../../api/categories.api";
import { Eye, EyeOff } from "lucide-react";

const initialForm = {
  title: "",
  slug: "",
  description: "",
  content: "",
  domain_slug: "",
  status: "published",
  tags: "",
  is_trending: false,
  image_url: "",
  image_credit: "",
};

export default function ArticleForm({ open, setOpen, token, refetch, article }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    categoryApi
      .listActive(token)
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    if (article) {
      setForm({
        title: article.title || "",
        slug: article.slug || "",
        description: article.description || "",
        content: article.content || "",
        domain_slug: article.domain_slug || "",
        status: article.status || "published",
        tags: Array.isArray(article.tags) ? article.tags.join(", ") : "",
        is_trending: article.is_trending || false,
        image_url: article.image?.url || "",
        image_credit: article.image?.credit || "",
      });
    } else {
      setForm(initialForm);
    }
    setError("");
    setPreview(false);
  }, [article, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "title" && !article) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    setError("");

    if (!form.title.trim() || !form.slug.trim() || !form.domain_slug) {
      setError("Title, slug, and domain are required.");
      return;
    }
    if (!form.image_url.trim()) {
      setError("Image URL is required.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        content: form.content.trim(),
        domain_slug: form.domain_slug,
        status: form.status,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        is_trending: form.is_trending,
        image: {
          url: form.image_url.trim(),
          ...(form.image_credit.trim() && { credit: form.image_credit.trim() }),
        },
      };

      if (article) {
        await articleApi.update(token, article.slug, payload);
        alert("Article updated successfully");
      } else {
        await articleApi.create(token, payload);
        alert("Article created successfully");
      }

      await refetch();
      setOpen(false);
      setForm(initialForm);
    } catch (err) {
      setError(err.message || "Failed to save article");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 bg-gray-50 px-5 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition";

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className="bg-white rounded-3xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">

        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-[#111111]">
              {article ? "Edit Article" : "Create Article"}
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              {article ? "Update article details below" : "Fill in the details to publish a new article"}
            </p>
          </div>
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition px-3 py-2 rounded-xl border border-gray-200"
          >
            {preview ? <EyeOff size={16} /> : <Eye size={16} />}
            {preview ? "Edit" : "Preview"}
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {preview ? (
          <div className="space-y-4 bg-gray-50 rounded-2xl p-6">
            <h1 className="text-2xl font-bold">{form.title || "(No title)"}</h1>
            <p className="text-gray-500 text-sm font-mono">/article/{form.slug || "slug"}</p>
            {form.image_url && (
              <img
                src={form.image_url}
                alt="preview"
                className="w-full aspect-video object-cover rounded-xl"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            )}
            <p className="text-gray-700">{form.description || "(No description)"}</p>
            <div className="whitespace-pre-wrap text-gray-600 text-sm border-t pt-4">
              {form.content || "(No content)"}
            </div>
            <div className="flex gap-2 flex-wrap pt-2">
              {form.tags.split(",").filter(Boolean).map((t) => (
                <span key={t} className="px-3 py-1 bg-gray-200 rounded-full text-xs">{t.trim()}</span>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Title *</label>
                <input name="title" value={form.title} onChange={handleChange}
                  placeholder="Article title" className={inputClass} />
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Slug *</label>
                <input name="slug" value={form.slug} onChange={handleChange}
                  disabled={!!article} placeholder="article-slug"
                  className={`${inputClass} font-mono ${article ? "bg-gray-100 text-gray-400" : ""}`} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Domain *</label>
                <select name="domain_slug" value={form.domain_slug} onChange={handleChange} className={inputClass}>
                  <option value="" disabled>Select a domain</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">Tags</label>
              <input name="tags" value={form.tags} onChange={handleChange}
                placeholder="ai, react, typescript  (comma-separated)" className={inputClass} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Image URL *</label>
                <input name="image_url" value={form.image_url} onChange={handleChange}
                  placeholder="https://images.unsplash.com/..." className={inputClass} />
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Image Credit</label>
                <input name="image_credit" value={form.image_credit} onChange={handleChange}
                  placeholder="Photo by ..." className={inputClass} />
              </div>
            </div>

            {form.image_url && (
              <img
                src={form.image_url}
                alt="preview"
                className="w-full h-40 object-cover rounded-2xl border"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            )}

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Short article summary shown on cards" rows={3}
                className={inputClass} />
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Content
                <span className="ml-2 text-gray-400 font-normal text-xs">
                  ({form.content.length} chars)
                </span>
              </label>
              <textarea name="content" value={form.content} onChange={handleChange}
                placeholder="Write the full article content here. Use blank lines to separate paragraphs."
                rows={10} className={`${inputClass} font-mono text-sm leading-relaxed`} />
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" name="is_trending" checked={form.is_trending}
                onChange={handleChange} className="w-5 h-5 rounded accent-[#FF0000]" />
              <span className="font-medium text-gray-700">Mark as Trending</span>
            </label>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#FF0000] hover:bg-[#D80000] text-white py-4 rounded-2xl font-semibold text-lg shadow-lg transition disabled:opacity-60"
            >
              {loading
                ? article ? "Updating..." : "Creating..."
                : article ? "Update Article" : "Publish Article"}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
