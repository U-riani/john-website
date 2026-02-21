// frontend/src/layouts/ShopLayout.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function ShopLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Lock scroll when sidebar open
  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  // Close on ESC
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    if (sidebarOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 py-5 lg:py-14">
          {/* Desktop sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <Sidebar />
          </aside>

          {/* Mobile Sidebar */}
          <div
            className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
              sidebarOpen
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            {/* Overlay */}
            <div
              className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
                sidebarOpen ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sliding Panel */}
            <div
              className={`absolute left-0 top-0 h-full w-80 max-w-[85%] transform bg-white shadow-2xl transition-transform duration-300 ease-out ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Categories
                  </div>

                  {/* SEXY X BUTTON */}
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 transition hover:bg-gray-300"
                    aria-label="Close sidebar"
                  >
                    <span className="absolute h-4 w-4">
                      <span className="absolute top-1/2 left-0 h-[2px] w-4 -translate-y-1/2 rotate-45 bg-gray-700 transition group-hover:bg-black" />
                      <span className="absolute top-1/2 left-0 h-[2px] w-4 -translate-y-1/2 -rotate-45 bg-gray-700 transition group-hover:bg-black" />
                    </span>
                  </button>
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="h-[calc(100%-64px)] overflow-y-auto p-3">
                <Sidebar />
              </div>
            </div>
          </div>

          {/* Main content */}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
