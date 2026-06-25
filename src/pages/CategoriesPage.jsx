import { useState, useEffect } from "react";
import { categoryApi } from "../api/categories.api";
import Header from "../components/layout/Header";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Tag } from "lucide-react";

export default function CategoriesPage({ token }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", order: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const data = await categoryApi.listActive(token);
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", slug: "", order: 0 });
    setError("");
    setShowForm(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, order: cat.order ?? 0 });
    setError("");
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: name === "order" ? parseInt(value) || 0 : value };
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
          order: form.order,
        });
      } else {
        await categoryApi.create(token, {
          name: form.name,
          slug: form.slug,
          order: form.order,
          is_active: true,
        });
      }
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm(`Delete category "${slug}"? This will not delete its articles.`)) return;
    try {
      await categoryApi.delete(token, slug);
      await load();
    } catch (err) {
      alert(err.message || "Failed to delete.");
    }
  };

  const handleToggle = async (cat) => {
    try {
      await categoryApi.toggleActive(token, cat.slug, !cat.is_active);
      await load();
    } catch (err) {
      alert(err.message || "Failed to toggle.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <Header title="Categories" />
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
        >
          <Plus size={18} /> New Category
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">
              {editing ? "Edit Category" : "New Category"}
            </h2>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Artificial Intelligence"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Slug</label>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="e.g. ai"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 font-mono"
                  required
                  disabled={!!editing}
                />
                {editing && (
                  <p className="text-xs text-gray-400 mt-1">Slug cannot be changed after creation.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Display Order</label>
                <input
                  name="order"
                  type="number"
                  value={form.order}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  min="0"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#FF0000] hover:bg-[#D80000] text-white py-3 rounded-xl font-semibold transition"
                >
                  {saving ? "Saving..." : editing ? "Save Changes" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl p-8 text-center text-gray-500">
          Loading categories...
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center">
          <Tag size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-xl font-semibold text-gray-500">No categories yet.</p>
          <p className="text-gray-400 mt-1">Create your first category to organize articles.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Slug</th>
                <th className="p-4 text-center text-sm font-semibold text-gray-600">Order</th>
                <th className="p-4 text-center text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-center text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.slug} className="border-t border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-900">{cat.name}</td>
                  <td className="p-4 font-mono text-sm text-gray-500">{cat.slug}</td>
                  <td className="p-4 text-center text-gray-600">{cat.order ?? 0}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        cat.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {cat.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleToggle(cat)}
                        className={`transition ${cat.is_active ? "text-green-600 hover:text-green-800" : "text-gray-400 hover:text-gray-600"}`}
                        title={cat.is_active ? "Deactivate" : "Activate"}
                      >
                        {cat.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                      <button
                        onClick={() => openEdit(cat)}
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.slug)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
