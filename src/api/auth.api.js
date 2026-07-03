const BASE =
  import.meta.env.VITE_API_BASE ||
  "https://api.techpolarity.com";

export async function loginAdmin(
  email,
  password
) {
  const res = await fetch(
    `${BASE}/api/v1/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  if (!res.ok) {
    throw new Error(
      "Invalid email or password"
    );
  }

  return res.json();
}