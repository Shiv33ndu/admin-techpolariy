import { create } from "zustand";

const useAuthStore = create(
  (set) => ({
    token:
      localStorage.getItem(
        "tp_token"
      ) || "",

    login: (token) => {
      localStorage.setItem(
        "tp_token",
        token
      );

      set({ token });
    },

    logout: () => {
      localStorage.removeItem(
        "tp_token"
      );

      set({ token: "" });
    },
  })
);

export default useAuthStore;