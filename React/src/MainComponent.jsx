import React from "react";
import HeroSection from "./HeroSection";
import FeaturedProducts from "./FeaturedProducts";
import CafeImages from "./CafeImages";
import TestimonialCarousel from "./TestimonialCarousel";
import Map from "./Map";

import "./MainComponent.css";

function MainComponent() {
  return (
    <div className="overflow-hidden">
      <div>
        <HeroSection />
      </div>
      <div className="container">
        <FeaturedProducts />
      </div>
      <div className="container">
        <CafeImages />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-11 col-lg-9 mx-auto">
            <div className="main-container">
              <TestimonialCarousel />
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <Map />
      </div>
    </div>
  );
}

export default MainComponent;
