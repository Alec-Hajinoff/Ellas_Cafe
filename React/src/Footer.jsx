import React from "react";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();
  const user = ["c", "o", "n", "t", "a", "c", "t"].join("");
  const domain = ["ellascafe", "co.uk"].join(".");
  const email = `${user}@${domain}`;

  return (
    <footer className="footer-wrapper">
      <div className="container text-center">
        <div className="row">
          <div className="col-12">
            <p className="footer-content mb-2">
              &copy; Copyright 2026 - {currentYear}. Ellas Café, 705 Green
              Lanes, London N21 3RS. Phone: 020 8374 4310. Email:{" "}
              <a href={`mailto:${email}`}>{email}</a>
            </p>

            <div className="footer-builder-wrapper">
              <span className="footer-builder-text">
                Web application by:{" "}
                <a
                  href="https://hertfordstandard.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-builder-link"
                >
                  Hertford Standard
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
