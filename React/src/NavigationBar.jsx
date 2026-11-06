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
    <div className="navigation-bar-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav className="navigation-bar">
              <Link
                to="/"
                className={`nav-bar-link ${
                  location.pathname === "/" ? "active" : ""
                }`}
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

              <Link
                to={targetDashboardPath}
                className={`nav-bar-link ${isDashboardActive ? "active" : ""}`}
              >
                My Account
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavigationBar;
