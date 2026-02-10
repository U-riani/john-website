import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Topbar({ onMenuClick }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-4">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="rounded p-2 hover:bg-gray-100 lg:hidden"
        >
          ☰
        </button>

        <p className="font-semibold">Admin Dashboard</p>
      </div>

      {/* Right */}
      <div className="flex flex-col items-end text-sm text-gray-600">
        <p>admin@megatech.local</p>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="mt-1 rounded bg-slate-300 px-3 py-1 text-sm hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
