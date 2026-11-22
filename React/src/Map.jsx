import React, { useState } from "react";
import winchmoreHillImg from "./Images/Cafe_exterior/Winchmore_Hill.webp";
import palmersGreenImg from "./Images/Cafe_exterior/Palmers_Green.webp";
import southgateImg from "./Images/Cafe_exterior/Southgate.webp";
import "./Map.css";

const SHARED_MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1191.525361778143!2d-0.09709881271413798!3d51.63039503699291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876193281ba5c79%3A0xc08a8d51f4c06501!2s701-703%20Green%20Lanes%2C%20London%20N21%203RS!5e0!3m2!1sen!2suk!4v1794285759606!5m2!1sen!2suk"; //[cite: 7]

const LOCATIONS = [
  {
    id: "winchmore-hill",
    name: "Winchmore Hill",
    image: winchmoreHillImg,
    imageAlt: "Exterior view of the Winchmore Hill café",
    address: "Ellas Café, 705 Green Lanes, London, N21 3RS",
    phoneDisplay: "020 8374 4310",
    phoneHref: "tel:+442083744310",
    email: "contact@ellascafe.co.uk",
    hours: "Mon - Fri | 8am - 4:30pm",
    mapSrc: SHARED_MAP_SRC,
  },
  {
    id: "palmers-green",
    name: "Palmers Green",
    image: palmersGreenImg,
    imageAlt: "Exterior view of the Palmers Green café",
    address: "Ellas Café, 705 Green Lanes, London, N21 3RS",
    phoneDisplay: "020 8374 4310",
    phoneHref: "tel:+442083744310",
    email: "contact@ellascafe.co.uk",
    hours: "Mon - Fri | 8am - 4:30pm",
    mapSrc: SHARED_MAP_SRC,
  },
  {
    id: "southgate",
    name: "Southgate",
    image: southgateImg,
    imageAlt: "Exterior view of the Southgate café",
    address: "Ellas Café, 705 Green Lanes, London, N21 3RS",
    phoneDisplay: "020 8374 4310",
    phoneHref: "tel:+442083744310",
    email: "contact@ellascafe.co.uk",
    hours: "Mon - Fri | 8am - 4:30pm",
    mapSrc: SHARED_MAP_SRC,
  },
];

function Map() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  const selectedLocation = LOCATIONS[selectedIndex];
  const totalLocations = LOCATIONS.length;

  const handleSelectIndex = (index) => {
    const normalizedIndex =
      ((index % totalLocations) + totalLocations) % totalLocations;
    setSelectedIndex(normalizedIndex);
  };

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      setTouchStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e) => {
    if (
      touchStartX === null ||
      !e.changedTouches ||
      e.changedTouches.length === 0
    ) {
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    const swipeThreshold = 45;

    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX < 0) {
        handleSelectIndex(selectedIndex + 1);
      } else {
        handleSelectIndex(selectedIndex - 1);
      }
    }

    setTouchStartX(null);
  };

  return (
    <section
      id="cafe-map"
      className="cafe-map"
      aria-label="Cafe locations, map, and contact details"
    >
      <h2 className="cafe-map__title">Where to find us</h2>

      <div className="cafe-map__container">
        <div
          className="cafe-map__desktop-selector"
          role="tablist"
          aria-label="Choose a café location"
        >
          {LOCATIONS.map((location, index) => {
            const isActive = index === selectedIndex;

            return (
              <button
                key={location.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`cafe-map__location-card ${
                  isActive ? "cafe-map__location-card--active" : ""
                }`}
                onClick={() => handleSelectIndex(index)}
              >
                <div className="cafe-map__location-media">
                  <img
                    src={location.image}
                    alt={location.imageAlt}
                    className="cafe-map__location-image"
                    loading="lazy"
                  />
                </div>
                <div className="cafe-map__location-body">
                  <span className="cafe-map__location-name">
                    {location.name}
                  </span>
                  {/* Removed location tag span */}
                </div>
              </button>
            );
          })}
        </div>

        <div
          className="cafe-map__mobile-carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label="Café locations carousel"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="cafe-map__carousel-stage">
            <img
              src={selectedLocation.image}
              alt={selectedLocation.imageAlt}
              className="cafe-map__carousel-image"
            />

            <button
              type="button"
              className="cafe-map__carousel-arrow cafe-map__carousel-arrow--prev"
              aria-label="Previous café location"
              onClick={() => handleSelectIndex(selectedIndex - 1)}
            >
              ‹
            </button>

            <button
              type="button"
              className="cafe-map__carousel-arrow cafe-map__carousel-arrow--next"
              aria-label="Next café location"
              onClick={() => handleSelectIndex(selectedIndex + 1)}
            >
              ›
            </button>

            <div className="cafe-map__carousel-caption">
              <span className="cafe-map__carousel-title">
                {selectedLocation.name}
              </span>
              {/* Removed carousel subtitle span */}
            </div>
          </div>

          <div
            className="cafe-map__carousel-dots"
            role="tablist"
            aria-label="Select café location slide"
          >
            {LOCATIONS.map((location, index) => {
              const isActive = index === selectedIndex;
              return (
                <button
                  key={location.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Show ${location.name}`}
                  className={`cafe-map__dot ${
                    isActive ? "cafe-map__dot--active" : ""
                  }`}
                  onClick={() => handleSelectIndex(index)}
                />
              );
            })}
          </div>
        </div>

        <div className="cafe-map__layout">
          <article
            className="cafe-map__contact-card"
            aria-label={`${selectedLocation.name} contact details`}
          >
            <div className="cafe-map__active-heading">
              <h3 className="cafe-map__active-name">{selectedLocation.name}</h3>
              {/* Removed active location tag span */}
            </div>

            <div className="cafe-map__contact-list">
              <div className="cafe-map__contact-row">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="cafe-map__contact-icon"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                </svg>
                <div className="cafe-map__contact-content">
                  <span className="cafe-map__contact-value">
                    {selectedLocation.address}
                  </span>
                </div>
              </div>

              <div className="cafe-map__contact-row">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="cafe-map__contact-icon"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
                  />
                </svg>
                <div className="cafe-map__contact-content">
                  <a
                    href={selectedLocation.phoneHref}
                    className="cafe-map__contact-value"
                  >
                    {selectedLocation.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="cafe-map__contact-row">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="cafe-map__contact-icon"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.756z" />
                </svg>
                <div className="cafe-map__contact-content">
                  <a
                    href={`mailto:${selectedLocation.email}`}
                    className="cafe-map__contact-value"
                  >
                    {selectedLocation.email}
                  </a>
                </div>
              </div>

              <div className="cafe-map__contact-row">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="cafe-map__contact-icon"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 3.5a.75.75 0 0 0-1.5 0v4.25c0 .276.11.528.293.71l3 3a.75.75 0 0 0 1.06-1.06L8.5 7.44V3.5z" />
                </svg>
                <div className="cafe-map__contact-content">
                  <span className="cafe-map__contact-value">
                    {selectedLocation.hours}
                  </span>
                </div>
              </div>
            </div>
          </article>

          <div className="cafe-map__frame">
            <iframe
              key={selectedLocation.id}
              src={selectedLocation.mapSrc}
              title={`Map showing ${selectedLocation.name} café location`}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Map;
