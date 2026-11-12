import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavigationBar.css";

function NavigationBar({ isAuthenticated }) {
  const location = useLocation();

  const targetDashboardPath = isAuthenticated
    ? "/AdminDashboard"
    : "/UserLogin";

  const isDashboardActive = location.pathname === "/AdminDashboard";

  return (
    <nav className="navigation-bar">
      <Link
        to="/"
        className={`nav-bar-link ${location.pathname === "/" ? "active" : ""}`}
      >
        Home
      </Link>

      <Link
        to="/Menu"
        className={`nav-bar-link ${
          location.pathname.toLowerCase() === "/menu" ? "active" : ""
        }`}
      >
        Menu
      </Link>

      <Link
        to="/AboutUs"
        className={`nav-bar-link ${
          location.pathname.toLowerCase() === "/aboutus" ? "active" : ""
        }`}
      >
        About Us
      </Link>

      {isAuthenticated && (
        <Link
          to={targetDashboardPath}
          className={`nav-bar-link ${isDashboardActive ? "active" : ""}`}
        >
          Dashboard
        </Link>
      )}
    </nav>
  );
}

export default NavigationBar;
