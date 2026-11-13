import React from "react";
import { Link } from "react-router-dom";
import "./CafeImages.css";

import baristaExperience from "./Images/Cafe_images/Barista_Experience.webp";
import cafeAtmosphere from "./Images/Cafe_images/Cafe_Atmosphere.webp";
import cafeSeating from "./Images/Cafe_images/Cafe_Seating.webp";
import coffeePastries from "./Images/Cafe_images/Coffee_Pastries.webp";

const cafeImages = [
  { src: baristaExperience, alt: "A barista preparing a coffee" },
  { src: cafeAtmosphere, alt: "The welcoming atmosphere inside Ellas Café" },
  { src: cafeSeating, alt: "Seating area inside Ellas Café" },
  { src: coffeePastries, alt: "Coffee and pastries served at Ellas Café" },
];

function CafeImages() {
  return (
    <section
      className="cafe-images-section"
      aria-labelledby="cafe-images-heading"
    >
      <h2 id="cafe-images-heading" className="cafe-images-tagline">
        A place to relax, work &amp; enjoy great coffee
      </h2>

      <div className="cafe-images-row row g-3">
        {cafeImages.map((image) => (
          <div
            className="cafe-images-item col-12 col-sm-6 col-lg-3"
            key={image.src}
          >
            <img
              className="cafe-gallery-image"
              src={image.src}
              alt={image.alt}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <Link className="cafe-images-about-button" to="/AboutUs">
          Out Story
        </Link>
      </div>
    </section>
  );
}

export default CafeImages;
