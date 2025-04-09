import { NavLink } from "react-router-dom";
import { LayoutDashboard, Settings, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-background dark:bg-dark-card border border-border dark:border-dark-border shadow-lg"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative w-64 bg-background dark:bg-dark-card border-r border-border dark:border-dark-border shadow-lg h-screen transition-all duration-300 ease-in-out z-40 ${
          isOpen ? "left-0" : "-left-64 md:left-0"
        }`}
      >
        <div className="p-4 border-b border-border dark:border-dark-border">
          <h1 className="text-xl font-semibold text-primary dark:text-dark-primary">
            Dashboard
          </h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-purple-light/20 text-purple-dark dark:bg-purple-dark/30 dark:text-purple-light"
                      : "text-foreground hover:bg-purple-light/10 dark:text-dark-foreground dark:hover:bg-purple-dark/20"
                  }`
                }
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-purple-light/20 text-purple-dark dark:bg-purple-dark/30 dark:text-purple-light"
                      : "text-foreground hover:bg-purple-light/10 dark:text-dark-foreground dark:hover:bg-purple-dark/20"
                  }`
                }
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
