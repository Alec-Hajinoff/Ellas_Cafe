import "./HeroSection.css";

function HeroSection() {
  return (
    <section className="hero-section-wrapper d-flex align-items-center">
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-4">
            <div className="hero-content">
              <h1 className="hero-heading">
                Artisan Coffee & Fresh Food in Winchmore Hill.
              </h1>

              <a className="hero-find-us-button" href="#cafe-map">
                Find us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
