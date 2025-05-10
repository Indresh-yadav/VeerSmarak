import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../src/useAuth";
import { Menu } from "lucide-react"; 

const Navbar = () => {
  const { isLoggedIn, role } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center relative shadow-md">

      {!isLoggedIn ? (
        <>
        <Link to="/" className="font-bold text-2xl">VeerSmarak</Link>
        <div className="flex space-x-6">
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/register" className="hover:underline">Register</Link>
        </div>
        </>
      ) : (
        <>
        <Link to="/dashboard" className="font-bold text-2xl">VeerSmarak</Link>
        <div className="relative" ref={menuRef}>
          <button onClick={toggleMenu} className="focus:outline-none">
            <Menu className="w-8 h-8" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-gray-700 rounded-lg shadow-lg flex flex-col p-4 space-y-2 animate-fadeIn w-max z-5">
            {role === "admin" && (
                <Link
                  to="/admin"
                  className="hover:underline"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              <Link
                to="/savedPosts"
                className="hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                Saved Posts
              </Link>
              <Link
                to="/likedPosts"
                className="hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                Liked Posts
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="hover:underline text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
