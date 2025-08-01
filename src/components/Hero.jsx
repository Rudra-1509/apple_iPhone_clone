import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { heroVideo, smallHeroVideo } from "../utils";
import { useState } from "react";
import { useEffect } from "react";

const Hero = () => {
  useGSAP(() => {
    gsap.to("#hero", {
      y: 10,
      opacity: 1,
      delay: 1.5,
      duration: 1,
    });
    gsap.to('#cta',{
        opacity:1,
        y:-35,
        delay:1.8,
        ease:"back.inOut",
        duration:2
    })
  }, []);
    const [videoSrc, setVideoSrc] =useState(window.innerWidth<760 ?
        smallHeroVideo : heroVideo
    );

    const handleSetVideoSrc =()=>{
        if(window.innerWidth < 760){
            setVideoSrc(smallHeroVideo)
        }else{
            setVideoSrc(heroVideo)
        }
    }
    
    useEffect(()=>{
        window.addEventListener('resize',handleSetVideoSrc);

        return ()=>{
            window.removeEventListener('resize',handleSetVideoSrc)
        }
    },[]);
  return (
    <section className="w-full nav-height bg-black relative">
      <div className="h-5/6 w-full flex-center flex-col">
        <p id="hero" className="hero-title">iPhone 15 Pro</p>
        <div className="md:w-10/12 w-9/12">
            <video className="pointer-events-none" 
            autoPlay muted playsInline={true} key={videoSrc}>
                <source src={videoSrc} type="video/mp4"/>
            </video>
        </div>
      </div>

    <div id="cta" className="h-1/6 flex flex-col items-center opacity-0 translate-y-20">
        <a href="#highlights" className="btn  bg-indigo-950">Buy</a>
        <p className="font-normal text-xl">From $199/month or $999</p>
    </div>

    </section>
  );
};

export default Hero;
