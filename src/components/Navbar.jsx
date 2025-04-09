import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Switch } from "@/components/ui/switch";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useEffect, useRef, useMemo } from "react";
import { toast } from "sonner";

export default function Navbar({ toggleSidebar }) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Mock user data - you can replace this with data from props or localStorage
  const [currentUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    initials: "JD",
  });

  // Sample search data - replace with your actual data source
  const sampleData = useMemo(() => [
    { id: 1, name: "Project Alpha", type: "project", path: "/projects/alpha" },
    { id: 2, name: "Documentation", type: "document", path: "/docs" },
    { id: 3, name: "User Dashboard", type: "page", path: "/dashboard" },
  ], []);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim()) {
      const timer = setTimeout(() => {
        const results = sampleData.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(results);
        setShowResults(true);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery, sampleData]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      if (searchResults.length > 0) {
        navigate(searchResults[0].path);
        setSearchQuery("");
        setShowResults(false);
      } else {
        toast.info("No results found");
      }
    }
  };

  const handleResultClick = (item) => {
    navigate(item.path);
    setSearchQuery("");
    setShowResults(false);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => {
        document.querySelector(".mobile-search-input")?.focus();
      }, 100);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("authToken");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout error:", error);
    } finally {
      setShowLogoutDialog(false);
    }
  };

  return (
    <>
      <header className="bg-background dark:bg-dark-background border-b border-border dark:border-dark-border shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          {/* Left side controls */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full hover:bg-purple-light/20 dark:hover:bg-purple-dark/30"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5 text-purple-dark dark:text-purple-light" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full hover:bg-purple-light/20 dark:hover:bg-purple-dark/30"
              onClick={toggleSearch}
            >
              <Search className="h-5 w-5 text-purple-dark dark:text-purple-light" />
            </Button>

            <div className="hidden md:block relative w-64" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/70 dark:text-dark-primary/80" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchSubmit}
                onFocus={() => searchQuery.trim() && setShowResults(true)}
                className="pl-10 bg-background dark:bg-dark-card border-border dark:border-dark-border focus:ring-2 focus:ring-primary/50 dark:focus:ring-dark-primary/50"
              />

              {/* Desktop Search Results */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 max-h-60 overflow-auto border border-gray-200 dark:border-gray-700">
                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                      onClick={() => handleResultClick(item)}
                    >
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {item.type}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Dark Mode Toggle (Desktop) */}
            <div className="hidden sm:flex items-center space-x-2">
              <Sun className="h-5 w-5 text-teal-600 dark:text-teal-300" />
              <Switch
                id="dark-mode"
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-teal-600 data-[state=unchecked]:bg-teal-300"
              />
              <Moon className="h-5 w-5 text-teal-600 dark:text-teal-300" />
            </div>

            {/* Dark Mode Toggle (Mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden rounded-full hover:bg-purple-light/20 dark:hover:bg-purple-dark/30"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Moon className="h-5 w-5 text-teal-300" />
              ) : (
                <Sun className="h-5 w-5 text-teal-600" />
              )}
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-full gap-2 pl-2 pr-3"
                >
                  <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                      {currentUser.initials}
                    </span>
                  </div>
                  <span className="hidden sm:inline">{currentUser.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-background dark:bg-dark-card border-border dark:border-dark-border"
              >
                <DropdownMenuLabel className="px-2 py-1.5">
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {currentUser.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <NavLink to="/settings" className="w-full">
                    Account Settings
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:bg-destructive/10 dark:text-dark-destructive dark:focus:bg-dark-destructive/10"
                  onClick={() => setShowLogoutDialog(true)}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="md:hidden p-2" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/70 dark:text-dark-primary/80" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchSubmit}
                onFocus={() => searchQuery.trim() && setShowResults(true)}
                className="pl-10 bg-background dark:bg-dark-card border-border dark:border-dark-border focus:ring-2 focus:ring-primary/50 dark:focus:ring-dark-primary/50 mobile-search-input"
              />
            </div>

            {/* Mobile Search Results */}
            {showResults && searchResults.length > 0 && (
              <div className="mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200 dark:border-gray-700">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                    onClick={() => handleResultClick(item)}
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {item.type}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to logout?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You'll need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-destructive hover:bg-destructive/90 dark:bg-dark-destructive dark:hover:bg-dark-destructive/90"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
