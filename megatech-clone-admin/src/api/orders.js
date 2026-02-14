const BASE_URL = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getOrders() {
  const res = await fetch(`${BASE_URL}/orders`, {
    headers: authHeaders(),
  });

  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    window.location.href = "/login";
    return;
  }

  return res.json();
}

export async function getOrderById(id) {
  const res = await fetch(`${BASE_URL}/orders/${id}`, {
    headers: authHeaders(),
  });

  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    window.location.href = "/login";
    return;
  }

  return res.json();
}

export async function updateOrderStatus({ id, status }) {
  const res = await fetch(`${BASE_URL}/admin/orders/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ status }),
  });

  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update order");
  }

  return res.json();
}

export async function exportOrdersCsv(params = {}) {
  const token = localStorage.getItem("admin_token");

  const query = new URLSearchParams(params).toString();

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/admin/orders/export${
      query ? `?${query}` : ""
    }`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Export failed");
  }

  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "orders.csv";
  document.body.appendChild(a);
  a.click();

  a.remove();
  window.URL.revokeObjectURL(url);
}
