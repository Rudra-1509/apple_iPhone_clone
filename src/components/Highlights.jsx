import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { rightImg, watchImg } from "../utils";
import ViddeoCarousel from "./VideoCarousel.jsx"

const Highlights = () => {
  useGSAP(() => {
    gsap.to("#title", {
      opacity: 1,
      y: -30,
      duration: 0.5,
    });
    gsap.to(".link", {
      opacity: 1,
      y: 0,
      duration: 1.5,
      stagger:0.25
    });
  }, []);
  return (
    <section
      id="highlights"
      className="w-screen common-padding overflow-hidden bg-zinc"
    >
      <div className="screen-max-width">
        <div className="mb-12 w-full md:flex items-end justify-between">
          <h1 id="title" className="section-heading">
            Get The Highlights.
          </h1>
          <div className="flex flex-wrap items-end gap-5">
            <p className="link">
              Watch The Film <img src={watchImg} alt="watch" className="ml-2" />
            </p>
            <p className="link">
              Watch The Event <img src={rightImg} alt="right" className="ml-2" />
            </p>
          </div>
        </div>

        <ViddeoCarousel />
      </div>
    </section>
  );
};

export default Highlights;
