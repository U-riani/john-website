import { NavLink } from "react-router-dom";

const navItem =
  "block rounded-md px-3 py-2 text-sm hover:bg-gray-800";
const active = "bg-gray-800 text-white";

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Overlay (mobile only) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 
          bg-gray-900 text-gray-200
          transform transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 px-4 py-4 font-bold">
          <span>MegaTech Admin</span>

          {/* Close button (mobile only) */}
          <button
            onClick={onClose}
            className="text-sm text-gray-400 lg:hidden"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          <NavLink
            to="/"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `${navItem} ${isActive ? active : ""}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/orders"
            onClick={onClose}
            className={({ isActive }) =>
              `${navItem} ${isActive ? active : ""}`
            }
          >
            Orders
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
