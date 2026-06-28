import { useState, useEffect } from "react";
import { Eye, EyeOff, X, ImageIcon, Upload, Loader2 } from "lucide-react";
import { articleApi } from "../../api/articles.api";
import { categoryApi } from "../../api/categories.api";
import { sectionApi } from "../../api/sections.api";
import useAuthStore from "../../store/authStore";
import useToastStore from "../../store/toastStore";
import { uploadImageToCloudinary } from "../../lib/cloudinary";
import RichTextEditor from "./RichTextEditor";

const initialForm = {
  title: "",
  slug: "",
  description: "",
  content: "",
  domain_slug: "",
  section_slug: "",
  status: "published",
  tags: "",
  is_trending: false,
  image_url: "",
  image_credit: "",
};

const inputClass =
  "w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-50 focus:border-[#FF0000] transition";

export default function ArticleForm({ open, setOpen, refetch, article }) {
  const token = useAuthStore((s) => s.token);
  const { addToast } = useToastStore();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    categoryApi
      .listActive(token)
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
    sectionApi
      .listActive(token)
      .then((data) => setSections(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [token, open]);

  useEffect(() => {
    if (article) {
      setForm({
        title: article.title || "",
        slug: article.slug || "",
        description: article.description || "",
        content: article.content || "",
        domain_slug: article.domain_slug || "",
        section_slug: "",
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

  // Once categories are loaded, prefill the section dropdown with whatever
  // the selected category is currently linked to.
  useEffect(() => {
    if (!form.domain_slug || categories.length === 0) return;
    const cat = categories.find((c) => c.slug === form.domain_slug);
    if (cat && cat.section_slug) {
      setForm((prev) =>
        prev.section_slug ? prev : { ...prev, section_slug: cat.section_slug }
      );
    }
  }, [categories, form.domain_slug]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      if (name === "title" && !article) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      }
      if (name === "domain_slug") {
        const cat = categories.find((c) => c.slug === value);
        updated.section_slug = cat?.section_slug || "";
      }
      return updated;
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadImageToCloudinary(file);
      setForm((prev) => ({ ...prev, image_url: url }));
    } catch (err) {
      addToast(err.message || "Image upload failed", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async () => {
    setError("");

    if (!form.title.trim() || !form.slug.trim() || !form.domain_slug) {
      setError("Title, slug, and category are required.");
      return;
    }
    if (!form.image_url.trim()) {
      setError("Image URL is required.");
      return;
    }

    try {
      setLoading(true);

      const selectedCategory = categories.find(
        (c) => c.slug === form.domain_slug
      );
      if (selectedCategory && (selectedCategory.section_slug || "") !== form.section_slug) {
        await categoryApi.update(token, form.domain_slug, {
          section_slug: form.section_slug || null,
        });
      }

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
          ...(form.image_credit.trim() && {
            credit: form.image_credit.trim(),
          }),
        },
      };

      if (article) {
        await articleApi.update(token, article.slug, payload);
        addToast("Article updated successfully", "success");
      } else {
        await articleApi.create(token, payload);
        addToast("Article published successfully", "success");
      }

      await refetch();
      setOpen(false);
      setForm(initialForm);
    } catch (err) {
      const msg = err.message || "Failed to save article";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {article ? "Edit Article" : "New Article"}
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">
              {article
                ? "Update article details"
                : "Fill in the details to publish"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-2 rounded-xl border border-gray-200 hover:border-gray-300 transition"
            >
              {preview ? <EyeOff size={14} /> : <Eye size={14} />}
              {preview ? "Edit" : "Preview"}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {error && (
            <div className="mb-5 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {preview ? (
            <div className="space-y-4 bg-gray-50 rounded-2xl p-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {form.title || "(No title)"}
              </h1>
              <p className="text-xs font-mono text-gray-400">
                /article/{form.slug || "slug"}
              </p>
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt="preview"
                  className="w-full aspect-video object-cover rounded-xl"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              <p className="text-gray-600">
                {form.description || "(No description)"}
              </p>
              <div className="border-t border-gray-200 pt-4">
                {form.content ? (
                  <div
                    className="prose prose-sm max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: form.content }}
                  />
                ) : (
                  <p className="text-gray-500 text-sm">(No content)</p>
                )}
              </div>
              <div className="flex gap-2 flex-wrap pt-2">
                {form.tags
                  .split(",")
                  .filter(Boolean)
                  .map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 bg-gray-200 rounded-full text-xs"
                    >
                      {t.trim()}
                    </span>
                  ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Title + Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Title *
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Article title"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Slug *
                  </label>
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    disabled={!!article}
                    placeholder="article-slug"
                    className={`${inputClass} font-mono ${
                      article ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Sub-Category + Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Sub-Category *
                  </label>
                  <select
                    name="domain_slug"
                    value={form.domain_slug}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select a sub-category
                    </option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Parent Header
                  </label>
                  <select
                    name="section_slug"
                    value={form.section_slug}
                    onChange={handleChange}
                    disabled={!form.domain_slug}
                    className={`${inputClass} ${
                      !form.domain_slug ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <option value="">No header</option>
                    {sections.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    Links the selected sub-category to this header.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Tags
                </label>
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="ai, react, typescript  (comma-separated)"
                  className={inputClass}
                />
              </div>

              {/* Image URL + Credit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Image URL *
                  </label>
                  <div className="flex gap-2">
                    <input
                      name="image_url"
                      value={form.image_url}
                      onChange={handleChange}
                      placeholder="https://images.unsplash.com/... or upload"
                      className={inputClass}
                    />
                    <label
                      className={`flex items-center justify-center w-11 shrink-0 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer hover:border-[#FF0000] transition ${
                        uploading ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    >
                      {uploading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Upload size={16} />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Image Credit
                  </label>
                  <input
                    name="image_credit"
                    value={form.image_credit}
                    onChange={handleChange}
                    placeholder="Photo by ..."
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Image preview */}
              {form.image_url ? (
                <img
                  src={form.image_url}
                  alt="preview"
                  className="w-full h-36 object-cover rounded-xl border border-gray-100"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-36 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300">
                  <ImageIcon size={24} />
                  <p className="text-xs mt-2">Image preview</p>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Short summary shown on article cards…"
                  rows={3}
                  className={inputClass}
                />
              </div>

              {/* Content */}
              <div>
                <label className="block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Content
                </label>
                <RichTextEditor
                  value={form.content}
                  onChange={(html) =>
                    setForm((prev) => ({ ...prev, content: html }))
                  }
                />
              </div>

              {/* Trending toggle */}
              <label className="flex items-center gap-3 cursor-pointer select-none group">
                <div
                  onClick={() =>
                    setForm((p) => ({ ...p, is_trending: !p.is_trending }))
                  }
                  className={`w-11 h-6 rounded-full transition-colors duration-200 flex items-center px-0.5 ${
                    form.is_trending ? "bg-[#FF0000]" : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                      form.is_trending ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Mark as Trending
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 flex-shrink-0">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || preview}
            className="w-full bg-[#FF0000] hover:bg-[#D80000] text-white py-3.5 rounded-xl font-semibold transition shadow-lg shadow-red-500/20 disabled:opacity-60"
          >
            {loading
              ? article
                ? "Updating…"
                : "Publishing…"
              : article
              ? "Update Article"
              : "Publish Article"}
          </button>
        </div>
      </div>
    </div>
  );
}
