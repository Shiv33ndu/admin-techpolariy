import { useState } from "react";

import Modal from "../ui/Modal";

import { articleApi } from "../../api/articles.api";

export default function ArticleForm({
  open,
  setOpen,
  token,
  refetch,
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

  const [form, setForm] =
    useState(initialForm);

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm({
      ...form,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  const handleSubmit =
    async () => {

      try {

        setLoading(true);

        const payload = {
          title: form.title,

          slug: form.slug,

          description:
            form.description,

          content: form.content,

          domain_slug:
            form.domain_slug,

          status: form.status,

          tags: form.tags
            .split(",")
            .map((tag) =>
              tag.trim()
            )
            .filter(Boolean),

          is_trending:
            form.is_trending,

          image: {},
        };

        console.log(
          "Payload:",
          payload
        );

        await articleApi.create(
          token,
          payload
        );

        alert(
          "Article Created Successfully"
        );

        refetch();

        setOpen(false);

        setForm(initialForm);

      } catch (err) {

        console.log(err);

        alert(
          err.message ||
            "Failed to create article"
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

      <div className="bg-white rounded-3xl p-2">

        <div className="mb-6">

          <h2 className="text-3xl font-bold text-[#111111]">
            Create Article
          </h2>

          <p className="text-gray-500 mt-2">
            Publish a new article
            to TechPolarity
          </p>

        </div>

        <div className="space-y-5">

          <div>

            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Title
            </label>

            <input
              name="title"
              placeholder="Enter article title"
              value={form.title}
              onChange={
                handleChange
              }
              className="
                w-full
                border
                border-gray-300
                bg-[#fafafa]
                px-5
                py-4
                rounded-2xl
                outline-none
                focus:ring-4
                focus:ring-red-100
                focus:border-red-400
                transition-all
              "
            />
          </div>

          <div>

            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Slug
            </label>

            <input
              name="slug"
              placeholder="article-slug"
              value={form.slug}
              onChange={
                handleChange
              }
              className="
                w-full
                border
                border-gray-300
                bg-[#fafafa]
                px-5
                py-4
                rounded-2xl
                outline-none
                focus:ring-4
                focus:ring-red-100
                focus:border-red-400
                transition-all
              "
            />
          </div>

          <div>

            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Domain
            </label>

            <input
              name="domain_slug"
              placeholder="technology"
              value={
                form.domain_slug
              }
              onChange={
                handleChange
              }
              className="
                w-full
                border
                border-gray-300
                bg-[#fafafa]
                px-5
                py-4
                rounded-2xl
                outline-none
                focus:ring-4
                focus:ring-red-100
                focus:border-red-400
                transition-all
              "
            />
          </div>

          <div>

            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Tags
            </label>

            <input
              name="tags"
              placeholder="react, ai, javascript"
              value={form.tags}
              onChange={
                handleChange
              }
              className="
                w-full
                border
                border-gray-300
                bg-[#fafafa]
                px-5
                py-4
                rounded-2xl
                outline-none
                focus:ring-4
                focus:ring-red-100
                focus:border-red-400
                transition-all
              "
            />
          </div>

          <div>

            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              placeholder="Short article description"
              value={
                form.description
              }
              onChange={
                handleChange
              }
              className="
                w-full
                border
                border-gray-300
                bg-[#fafafa]
                px-5
                py-4
                rounded-2xl
                outline-none
                focus:ring-4
                focus:ring-red-100
                focus:border-red-400
                transition-all
                h-32
                resize-none
              "
            />
          </div>

          <div>

            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Content
            </label>

            <textarea
              name="content"
              placeholder="Write full article content..."
              value={form.content}
              onChange={
                handleChange
              }
              className="
                w-full
                border
                border-gray-300
                bg-[#fafafa]
                px-5
                py-4
                rounded-2xl
                outline-none
                focus:ring-4
                focus:ring-red-100
                focus:border-red-400
                transition-all
                h-48
                resize-none
              "
            />
          </div>

          <div>

            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={
                handleChange
              }
              className="
                w-full
                border
                border-gray-300
                bg-[#fafafa]
                px-5
                py-4
                rounded-2xl
                outline-none
                focus:ring-4
                focus:ring-red-100
                focus:border-red-400
                transition-all
              "
            >
              <option value="published">
                Published
              </option>

              <option value="draft">
                Draft
              </option>

            </select>

          </div>

          <div className="flex items-center gap-3">

            <input
              type="checkbox"
              name="is_trending"
              checked={
                form.is_trending
              }
              onChange={
                handleChange
              }
              className="w-5 h-5 accent-red-500"
            />

            <label className="text-sm font-medium text-gray-700">
              Mark as Trending
            </label>

          </div>

          <button
            onClick={
              handleSubmit
            }
            disabled={loading}
            className="
              w-full
              bg-[#ff6347]
              hover:bg-[#ef553a]
              text-white
              py-4
              rounded-2xl
              font-semibold
              text-lg
              transition-all
              duration-300
              shadow-lg
              hover:shadow-red-200
              disabled:opacity-70
            "
          >
            {loading
              ? "Creating..."
              : "Create Article"}
          </button>

        </div>
      </div>

    </Modal>
  );
}