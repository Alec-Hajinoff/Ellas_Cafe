import React from "react";
import "./Map.css";

function Map() {
  return (
    <section id="cafe-map" className="cafe-map" aria-label="Cafe location map">
      <div className="cafe-map__frame">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1191.525361778143!2d-0.09709881271413798!3d51.63039503699291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876193281ba5c79%3A0xc08a8d51f4c06501!2s701-703%20Green%20Lanes%2C%20London%20N21%203RS!5e0!3m2!1sen!2suk!4v1794285759606!5m2!1sen!2suk"
          title="Map showing the cafe location"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </section>
  );
}

export default Map;
