import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { articleApi } from "../../api/articles.api";

export default function ArticleForm({
  open,
  setOpen,
  token,
  refetch,
  article,
}) {
  const initialForm = {
    title: "",
    slug: "",
    description: "",
    content: "",
    domain_slug: "",
    status: "published",
    tags: "",
    is_trending: false,
    image: {},
  };

  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (article) {
      setForm({
        title: article.title || "",
        slug: article.slug || "",
        description: article.description || "",
        content: article.content || "",
        domain_slug: article.domain_slug || "",
        status: article.status || "published",
        tags: Array.isArray(article.tags)
          ? article.tags.join(", ")
          : "",
        is_trending: article.is_trending || false,
        image: article.image || {},
      });
    } else {
      setForm(initialForm);
    }
  }, [article, open]);

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        title: form.title,
        slug: form.slug,
        description: form.description,
        content: form.content,
        domain_slug: form.domain_slug,
        status: form.status,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        is_trending: form.is_trending,
        image: {},
      };

      if (article) {
        await articleApi.update(
          token,
          article.slug,
          payload
        );

        alert(
          "Article Updated Successfully"
        );
      } else {
        await articleApi.create(
          token,
          payload
        );

        alert(
          "Article Created Successfully"
        );
      }

      await refetch();

      setOpen(false);

      setForm(initialForm);

    } catch (err) {
      console.error(err);

      alert(
        err.message ||
          "Failed to save article"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() =>
        setOpen(false)
      }
    >
      <div className="bg-white rounded-3xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#111111]">
            {article
              ? "Edit Article"
              : "Create Article"}
          </h2>

          <p className="text-gray-500 mt-2">
            {article
              ? "Update article details"
              : "Publish a new article to TechPolarity"}
          </p>
        </div>

        <div className="space-y-5">

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Title
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter article title"
              className="w-full border border-gray-300 bg-[#fafafa] px-5 py-4 rounded-2xl"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Slug
            </label>

            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="article-slug"
              className="w-full border border-gray-300 bg-[#fafafa] px-5 py-4 rounded-2xl"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Domain
            </label>

            <input
              name="domain_slug"
              value={form.domain_slug}
              onChange={handleChange}
              placeholder="technology"
              className="w-full border border-gray-300 bg-[#fafafa] px-5 py-4 rounded-2xl"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Tags
            </label>

            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="react, ai, javascript"
              className="w-full border border-gray-300 bg-[#fafafa] px-5 py-4 rounded-2xl"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Short article description"
              className="w-full border border-gray-300 bg-[#fafafa] px-5 py-4 rounded-2xl h-32"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Content
            </label>

            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Write full article content..."
              className="w-full border border-gray-300 bg-[#fafafa] px-5 py-4 rounded-2xl h-48"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-[#fafafa] px-5 py-4 rounded-2xl"
            >
              <option value="published">
                Published
              </option>

              <option value="draft">
                Draft
              </option>

              <option value="deleted">
                Deleted
              </option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_trending"
              checked={form.is_trending}
              onChange={handleChange}
              className="w-5 h-5"
            />

            <label>
              Mark as Trending
            </label>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold"
          >
            {loading
              ? article
                ? "Updating..."
                : "Creating..."
              : article
              ? "Update Article"
              : "Create Article"}
          </button>
        </div>
      </div>
    </Modal>
  );
}