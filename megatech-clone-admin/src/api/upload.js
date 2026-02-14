// frontend/src/api/upload.js

const BASE_URL = import.meta.env.VITE_API_URL;

export async function uploadImage(files) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const res = await fetch(`${BASE_URL}/api/upload/image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");

  return res.json();
}
