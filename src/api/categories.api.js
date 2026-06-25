import { apiFetch } from "./axiosInstance";

export const categoryApi = {
  listActive: (token) =>
    apiFetch("/api/v1/navigation/main", token),

  listAll: (token) =>
    apiFetch("/api/v1/navigation/admin/all", token),

  create: (token, body) =>
    apiFetch("/api/v1/navigation/", token, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (token, slug, body) =>
    apiFetch(`/api/v1/navigation/${slug}`, token, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (token, slug) =>
    apiFetch(`/api/v1/navigation/${slug}`, token, {
      method: "DELETE",
    }),

  toggleActive: (token, slug, isActive) =>
    apiFetch(`/api/v1/navigation/${slug}`, token, {
      method: "PATCH",
      body: JSON.stringify({ is_active: isActive }),
    }),
};
