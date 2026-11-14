import React from "react";
import "./AboutUsStory.css";

import baristaExperience from "./Images/Cafe_images/Barista_Experience.webp";
import cafeAtmosphere from "./Images/Cafe_images/Cafe_Atmosphere.webp";
import cafeSeating from "./Images/Cafe_images/Cafe_Seating.webp";
import coffeePastries from "./Images/Cafe_images/Coffee_Pastries.webp";

function AboutUsStory() {
  return (
    <article className="story-card">
      <h2 className="story-title">A neighbourhood café with a lot to offer</h2>

      <div className="story-layout">
        <div className="story-column story-column-left">
          <section className="story-intro" aria-label="About Ellas Café">
            <div className="story-image-copy story-intro-content">
              <img
                className="story-image story-image-barista"
                src={baristaExperience}
                alt="A barista preparing a coffee"
                loading="lazy"
              />

              <p className="story-text">
                At Ellas Café, we believe that the best moments in life are
                often shared over a good cup of coffee and something delicious
                to eat.
              </p>

              <p className="story-text">
                Created with a passion for great coffee, quality food and
                genuine hospitality, Ellas Café was founded to bring something
                special to the local community. We wanted to create more than
                just somewhere to grab a coffee – a welcoming space where people
                could meet friends, enjoy a quiet moment, catch up over
                breakfast or simply make a little time for themselves.
              </p>

              <p className="story-text story-signoff">
                We're here to serve our community, one cup at a time.
              </p>
            </div>
          </section>

          <section
            className="story-section"
            aria-labelledby="story-coffee-heading"
          >
            <h2 id="story-coffee-heading" className="story-heading">
              Our Coffee
            </h2>
            <p className="story-lead">
              Good coffee starts with great ingredients.
            </p>

            <div className="story-image-copy story-coffee-content">
              <img
                className="story-image story-image-pastries"
                src={coffeePastries}
                alt="Coffee and pastries served at Ellas Café"
                loading="lazy"
              />

              <p className="story-text">
                We believe that a really good cup of coffee is about more than
                just the final brew. It starts with carefully selected beans,
                thoughtful sourcing and an appreciation for the people and
                processes behind every cup.
              </p>

              <p className="story-text">
                We aim to bring together quality coffee beans from established
                growing regions, working with trusted coffee suppliers and
                roasting partners who share our commitment to flavour,
                consistency and quality.
              </p>

              <p className="story-text">
                From the origins of the beans to the skill of the barista, every
                detail matters. Whether you prefer a smooth flat white, a
                classic cappuccino, a rich espresso or something a little
                different, our aim is to serve coffee that you will want to come
                back for.
              </p>

              <p className="story-text">
                We also believe that good coffee should be enjoyed responsibly.
                We value suppliers who take sustainability seriously, support
                responsible sourcing practices and recognise the importance of
                looking after the communities and environments involved in
                coffee production.
              </p>
            </div>
          </section>
        </div>

        <div className="story-column story-column-right">
          <section
            className="story-section story-values-section"
            aria-labelledby="story-values-heading"
          >
            <h2 id="story-values-heading" className="story-heading">
              Our Values
            </h2>

            <div className="story-values-feature">
              <section className="story-value story-value-featured">
                <h3 className="story-value-heading">Independent by Nature</h3>
                <p className="story-text">
                  We take pride in being an independent local business, with the
                  freedom to focus on what matters most: our customers, our
                  products and the quality of every experience.
                </p>
              </section>

              <img
                className="story-image story-image-atmosphere"
                src={cafeAtmosphere}
                alt="The welcoming atmosphere inside Ellas Café"
                loading="lazy"
              />
            </div>

            <div className="story-values">
              <section className="story-value">
                <h3 className="story-value-heading">Part of the Community</h3>
                <p className="story-text">
                  We believe cafés bring people together. We want Ellas Café to
                  be a familiar and welcoming part of Winchmore Hill, where
                  neighbours, families and visitors feel at home.
                </p>
              </section>

              <section className="story-value story-value-quality">
                <h3 className="story-value-heading">Quality in Every Detail</h3>
                <p className="story-text">
                  From our coffee to our food, we believe quality makes all the
                  difference. We aim to use carefully selected ingredients and
                  prepare our products with attention and care.
                </p>
              </section>

              <section className="story-value">
                <h3 className="story-value-heading">Responsible Sourcing</h3>
                <p className="story-text">
                  We appreciate the journey behind the products we serve. We aim
                  to work with suppliers who value responsible sourcing,
                  sustainability and the people behind the ingredients.
                </p>
              </section>
            </div>
          </section>

          <section
            className="story-section story-location"
            aria-labelledby="story-location-heading"
          >
            <h2 id="story-location-heading" className="story-heading">
              Located on Green Lanes
            </h2>

            <div className="story-image-copy">
              <img
                className="story-image story-image-location"
                src={cafeSeating}
                alt="Seating area at Ellas Café"
                loading="lazy"
              />

              <p className="story-text">
                Located on Green Lanes in Winchmore Hill, we are proud to be an
                independent neighbourhood café. Whether you're stopping by on
                your morning commute, meeting someone for brunch or enjoying an
                afternoon coffee, we want every visit to feel relaxed, friendly
                and memorable.
              </p>

              <p className="story-text story-signoff">
                We're here to serve our community, one cup at a time.
              </p>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}

export default AboutUsStory;
