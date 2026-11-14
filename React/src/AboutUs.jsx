import React from "react";
import AboutUsStory from "./AboutUsStory";
import CafeImages from "./CafeImages";

import "./AboutUs.css";

function AboutUs() {
  return (
    <div className="about-us-page">
      <section className="about-us-hero-wrapper">
        <div className="container">
          <div className="row justify-content-center">
            <div>
              <h2 className="about-us-hero-headline">
                A neighbourhood café with a lot to offer
              </h2>
            </div>
          </div>
        </div>
      </section>

      <div className="container about-us-container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-11 col-lg-10 mx-auto">
            <AboutUsStory />
            <CafeImages />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
