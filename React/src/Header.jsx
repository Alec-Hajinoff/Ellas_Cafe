import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { adminExists } from "./ApiService";
import blue from "./Images/Ellas_Cafe_Logo.webp";
import LogoutComponent from "./LogoutComponent";
import NavigationBar from "./NavigationBar";
import "./Header.css";

function Header({ isAuthenticated, isLoading, onLogoutComplete }) {
  const location = useLocation();

  const [hasActiveUsers, setHasActiveUsers] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAdminExists = async () => {
      try {
        const exists = await adminExists();

        if (isMounted) {
          setHasActiveUsers(exists);
        }
      } catch (error) {
        console.error("Header could not check whether an admin exists:", error);
      }
    };

    checkAdminExists();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="header-wrapper">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-8 col-md-3 mb-3 mb-md-0 order-1">
            <Link to="/">
              <img
                id="logo"
                src={blue}
                alt="Ellas Cafe Logo"
                title="Ellas Cafe Logo"
              />
            </Link>
          </div>

          <div className="col-12 col-md-6 mb-3 mb-md-0 order-3 order-md-2">
            <NavigationBar isAuthenticated={isAuthenticated} />
          </div>

          <div className="col-4 col-md-3 order-2 order-md-3">
            <div className="header-account-actions">
              {!isLoading &&
                (isAuthenticated ? (
                  <LogoutComponent onLogoutComplete={onLogoutComplete} />
                ) : (
                  <div className="header-auth-links">
                    <Link
                      to="/UserLogin"
                      className={`header-btn-ghost ${
                        location.pathname === "/UserLogin" ? "active" : ""
                      }`}
                    >
                      Log in
                    </Link>

                    {!hasActiveUsers && (
                      <Link
                        to="/UserRegistration"
                        className={`header-btn-signup ${
                          location.pathname === "/UserRegistration"
                            ? "active"
                            : ""
                        }`}
                      >
                        Sign up
                      </Link>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
