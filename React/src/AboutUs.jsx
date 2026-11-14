import React from "react";
import AboutUsStory from "./AboutUsStory";
import "./AboutUs.css";

function AboutUs() {
  return (
    <div className="about-us-page">
      <div className="container about-us-container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-11 col-lg-10 mx-auto">
            <AboutUsStory />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
