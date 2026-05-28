import { useState } from "react";

import Modal from "../ui/Modal";

import { articleApi } from "../../api/articles.api";

export default function ArticleForm({
  open,
  setOpen,
  token,
  refetch,
}) {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    domain_slug: "",
    status: "published",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      await articleApi.create(
        token,
        form
      );

      alert("Article Created");

      refetch();

      setOpen(false);

      setForm({
        title: "",
        slug: "",
        description: "",
        content: "",
        domain_slug: "",
        status: "published",
      });
    } catch (err) {
      console.log(err);

      alert("Failed");
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
    >
      <h2 className="text-2xl font-bold mb-6">
        Create Article
      </h2>

      <div className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <input
          name="slug"
          placeholder="Slug"
          value={form.slug}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <input
          name="domain_slug"
          placeholder="Domain"
          value={form.domain_slug}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg h-28"
        />

        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg h-44"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        >
          <option value="published">
            Published
          </option>

          <option value="draft">
            Draft
          </option>
        </select>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-xl"
        >
          Create Article
        </button>
      </div>
    </Modal>
  );
}