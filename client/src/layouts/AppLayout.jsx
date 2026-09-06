import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden w-64 border-r border-slate-800 bg-slate-900 md:flex md:flex-col">

          {/* Logo */}
          <div className="border-b border-slate-800 px-6 py-5">
            <Link
              to="/dashboard"
              className="text-2xl font-bold"
            >
              Dev<span className="text-blue-500">Track</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">

            <Link
              to="/dashboard"
              className={`block rounded-lg px-4 py-3 transition ${
                isActive("/dashboard")
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              Dashboard
            </Link>

            <Link
              to="/projects"
              className={`block rounded-lg px-4 py-3 transition ${
                isActive("/projects")
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              Projects
            </Link>

          </nav>

          {/* User */}
          <div className="border-t border-slate-800 p-4">
            <div className="mb-3">
              <p className="font-medium">
                {user?.name}
              </p>

              <p className="truncate text-sm text-slate-500">
                {user?.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* Mobile header */}
          <header className="border-b border-slate-800 bg-slate-900 px-4 py-4 md:hidden">
            <div className="flex items-center justify-between">
              <Link
                to="/dashboard"
                className="text-xl font-bold"
              >
                Dev<span className="text-blue-500">Track</span>
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm text-slate-400"
              >
                Logout
              </button>
            </div>
          </header>

          {/* Page */}
          <main className="flex-1">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
};

export default AppLayout;