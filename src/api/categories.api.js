import { apiFetch } from "./axiosInstance";

export const categoryApi = {
  listActive: (token) => apiFetch("/api/v1/navigation/main", token),
};
