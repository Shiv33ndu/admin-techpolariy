import { apiFetch } from "./axiosInstance";

export const articleApi = {
  stats: (token) =>
    apiFetch("/api/v1/articles/admin/stats", token),

  list: (token, params) =>
    apiFetch(
      "/api/v1/articles/admin/list?" +
        new URLSearchParams(params),
      token
    ),

    

  create: (token, body) =>
    apiFetch("/api/v1/articles/", token, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (token, slug, body) =>
    apiFetch(`/api/v1/articles/${slug}`, token, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (token, slug) =>
    apiFetch(`/api/v1/articles/${slug}`, token, {
      method: "DELETE",
    }),
};