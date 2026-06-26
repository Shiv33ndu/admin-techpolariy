import { apiFetch } from "./axiosInstance";

export const sectionApi = {
  listActive: (token) => apiFetch("/api/v1/sections/main", token),

  listAll: (token) => apiFetch("/api/v1/sections/admin/all", token),

  create: (token, body) =>
    apiFetch("/api/v1/sections/", token, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (token, slug, body) =>
    apiFetch(`/api/v1/sections/${slug}`, token, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (token, slug) =>
    apiFetch(`/api/v1/sections/${slug}`, token, {
      method: "DELETE",
    }),

  toggleActive: (token, slug, isActive) =>
    apiFetch(`/api/v1/sections/${slug}`, token, {
      method: "PATCH",
      body: JSON.stringify({ is_active: isActive }),
    }),
};
