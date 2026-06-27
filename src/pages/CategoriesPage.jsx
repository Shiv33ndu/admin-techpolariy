import { useState, useEffect } from "react";
import { categoryApi } from "../api/categories.api";
import { sectionApi } from "../api/sections.api";
import useAuthStore from "../store/authStore";
import useToastStore from "../store/toastStore";
import ConfirmModal from "../components/ui/ConfirmModal";
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Tag,
  X,
} from "lucide-react";

const inputClass =
  "w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-50 focus:border-[#FF0000] transition";

export default function CategoriesPage() {
  const token = useAuthStore((s) => s.token);
  const { addToast } = useToastStore();

  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", section_slug: "", order: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await categoryApi.listAll(token);
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSections = async () => {
    try {
      const data = await sectionApi.listActive(token);
      setSections(Array.isArray(data) ? data : []);
    } catch {
      setSections([]);
    }
  };

  useEffect(() => {
    load();
    loadSections();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", slug: "", section_slug: "", order: 0 });
    setError("");
    setShowForm(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      section_slug: cat.section_slug || "",
      order: cat.order ?? 0,
    });
    setError("");
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: name === "order" ? parseInt(value) || 0 : value,
      };
      if (name === "name" && !editing) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      setError("Name and slug are required.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      if (editing) {
        await categoryApi.update(token, editing.slug, {
          name: form.name,
          section_slug: form.section_slug || null,
          order: form.order,
        });
        addToast("Sub-category updated", "success");
      } else {
        await categoryApi.create(token, {
          name: form.name,
          slug: form.slug,
          section_slug: form.section_slug || null,
          order: form.order,
          is_active: true,
        });
        addToast("Sub-category created", "success");
      }
      setShowForm(false);
      await load();
    } catch (err) {
      const msg = err.message || "Failed to save sub-category.";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await categoryApi.delete(token, deleteTarget.slug);
      addToast(`Sub-category "${deleteTarget.name}" deleted`, "success");
      setDeleteTarget(null);
      await load();
    } catch (err) {
      addToast(err.message || "Failed to delete.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggle = async (cat) => {
    try {
      await categoryApi.toggleActive(token, cat.slug, !cat.is_active);
      addToast(
        `"${cat.name}" ${!cat.is_active ? "activated" : "deactivated"}`,
        "success"
      );
      await load();
    } catch (err) {
      addToast(err.message || "Failed to toggle.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sub-Categories</h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading
              ? "Loading…"
              : `${categories.length} sub-categor${categories.length !== 1 ? "ies" : "y"}`}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#FF0000] hover:bg-[#D80000] text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-red-500/20 transition-all"
        >
          <Plus size={15} />
          New Sub-Category
        </button>
      </div>

      {/* Sub-Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editing ? "Edit Sub-Category" : "New Sub-Category"}
                </h2>
                <p className="text-gray-400 text-xs mt-0.5">
                  {editing
                    ? "Update name and display order"
                    : "Create a new content sub-category"}
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Artificial Intelligence"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  Slug
                </label>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="e.g. ai"
                  className={`${inputClass} font-mono ${
                    editing ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  required
                  disabled={!!editing}
                />
                {editing && (
                  <p className="text-xs text-gray-400 mt-1">
                    Slug cannot be changed after creation.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  Parent Header
                </label>
                <select
                  name="section_slug"
                  value={form.section_slug}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">No header</option>
                  {sections.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  Display Order
                </label>
                <input
                  name="order"
                  type="number"
                  value={form.order}
                  onChange={handleChange}
                  className={inputClass}
                  min="0"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#FF0000] hover:bg-[#D80000] text-white py-3 rounded-xl font-semibold text-sm transition disabled:opacity-60"
                >
                  {saving
                    ? "Saving…"
                    : editing
                    ? "Save Changes"
                    : "Create Sub-Category"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-sm shadow-sm border border-gray-100">
          Loading sub-categories…
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
          <Tag size={44} className="mx-auto text-gray-200 mb-4" />
          <p className="text-lg font-semibold text-gray-500">
            No sub-categories yet
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Create your first sub-category to start organizing articles.
          </p>
          <button
            onClick={openCreate}
            className="mt-5 inline-flex items-center gap-2 bg-[#FF0000] text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
          >
            <Plus size={14} /> Create Sub-Category
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  Slug
                </th>
                <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Header
                </th>
                <th className="px-4 py-3.5 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Order
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
              {categories.map((cat) => (
                <tr
                  key={cat.slug}
                  className="hover:bg-gray-50/60 transition"
                >
                  <td className="px-6 py-4 font-semibold text-sm text-gray-900">
                    {cat.name}
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <code className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg">
                      {cat.slug}
                    </code>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    {cat.section_slug ? (
                      <span className="text-xs text-gray-600">
                        {sections.find((s) => s.slug === cat.section_slug)?.name ||
                          cat.section_slug}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-gray-500 hidden md:table-cell">
                    {cat.order ?? 0}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        cat.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {cat.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => handleToggle(cat)}
                        className={`p-2 rounded-lg transition ${
                          cat.is_active
                            ? "hover:bg-green-50 text-gray-400 hover:text-green-600"
                            : "hover:bg-gray-100 text-gray-300 hover:text-gray-500"
                        }`}
                        title={cat.is_active ? "Deactivate" : "Activate"}
                      >
                        {cat.is_active ? (
                          <ToggleRight size={16} />
                        ) : (
                          <ToggleLeft size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => openEdit(cat)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(cat)}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Sub-Category"
        message={`Delete "${deleteTarget?.name}"? Articles in this sub-category will not be deleted, but they will no longer appear in navigation.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
        danger
      />
    </div>
  );
}
