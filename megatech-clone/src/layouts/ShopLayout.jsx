import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function ShopLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 py-6">
          {/* Desktop sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <Sidebar />
          </aside>

          {/* Mobile overlay sidebar */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <button
                aria-label="Close sidebar overlay"
                className="absolute inset-0 bg-black/40"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="absolute left-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-xl overflow-y-auto">
                <div className="relative">
                  <div className="flex items-center justify-between border-b px-4 py-3 bg-white sticky top-0">
                    <div className="font-semibold">Categories</div>
                    <button
                      className="rounded-md px-3 py-1 text-sm hover:bg-gray-100"
                      onClick={() => setSidebarOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                  <div className="p-2">
                    <Sidebar />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main content */}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
