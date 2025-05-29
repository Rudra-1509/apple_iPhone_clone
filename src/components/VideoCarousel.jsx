import { useEffect, useRef, useState } from "react";
import { highlightsSlides } from "../constants";
import gsap from "gsap";
import { pauseImg, playImg, replayImg } from "../utils";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const VideoCarousel = () => {
  const videoRef = useRef([]);//For the videos itself
  const videoSpanRef = useRef([]); //each video will have a span of itself... it will be for the playbar below
  const videoDivRef = useRef([]);//this is a div for each of the span mentioned above ... 

  const [loadedData, setLoadedData] = useState([]);
  const [video, setVideo] = useState({
    isEnd: false,
    isLastVideo: false,
    startPlay: false,
    isPlaying: false,
    videoId: 0,
  });

  const { isEnd, isLastVideo, startPlay, isPlaying, videoId } = video;

  const handleLoadedMetaData = (i, e) => {
    setLoadedData((pre) => [...pre, e]);
  };

  useGSAP(() => {
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "Power2.inOut",
    });

    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((pre) => ({ ...pre, startPlay: true, isPlaying: true }));
      },
    });

  }, [videoId, isEnd]);

  {/*For video playing*/}
  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [videoId, startPlay, isPlaying, loadedData]);

  {/*For the Carousel playbar below*/}
  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      //animation
      let anim = gsap.to(span[videoId],  {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);
          if (currentProgress !== progress) {
            currentProgress = progress;
          }

          gsap.to(videoDivRef.current[videoId], {
            width:
              window.innerWidth < 760
                ? "10vw" //mobile
                : window.innerWidth < 1200
                ? "10vw" //tablet
                : "4vw", //laptop
          });
          gsap.to(span[videoId], {
            width: `${currentProgress}%`,
            backgroundColor: "white", //when animation plays
          });
        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",//when animation dont play back to normal
            });
          }
        },
      });

      if (videoId === 0) {
        anim.restart();
      }
      const animUpdate = () => {
        anim.progress(
          videoRef.current[videoId].currentTime /
            highlightsSlides[videoId].videoDuration
        );
      };
      if (isPlaying) {
        //Ticker keeps the animated progress bar in sync with the video's current playback time — only while the video is playing.
        gsap.ticker.add(animUpdate);
      } else {
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, startPlay, isPlaying]);

  const handleProcess = (type, i) => {
    switch (type) {
      case "video-end":
        setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 }));
        break;
      case "video-last":
        setVideo((pre) => ({ ...pre, isLastVideo: true }));
        break;
      case "video-reset":
        setVideo((pre) => ({ ...pre, isLastVideo: false, videoId: 0 }));
        break;
      case "play":
      case "pause":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      default:
        return video;
    }
  };

  return (
    <>
      <div className="flex items-center">
        {highlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div
                className="w-full h-full flex-center
               rounded-3xl overflow-hidden bg-black"
              >
                <video
                  id="video"
                  playsInline={true}
                  muted
                  preload="auto"
                  ref={(el) => (videoRef.current[i] = el)}
                  onPlay={() =>
                    setVideo((pre) => ({
                      ...pre,
                      isPlaying: true,
                    }))
                  }
                  onEnded={() =>
                    i !== 3
                      ? handleProcess("video-end", i)
                      : handleProcess("video-last")
                  }
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                  className={`${
                    list.id === 2 && "translate-x-44"
                  } pointer-events-none`}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text) => (
                  <p key={text} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7  bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              ref={(el) => (videoDivRef.current[i] = el)}
              className="mx-2 h-3 w-3 bg-gray-200 rounded-full cursor-pointer relative"
            >
              {/* w-3 means 12 px */}
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (videoSpanRef.current[i] = el)}
              />
            </span>
          ))}
        </div>

        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
              isLastVideo //passing the states eg. the video is 'play'ing now
                ? () => handleProcess("video-reset")
                : isPlaying
                ? () => handleProcess("play")
                : () => handleProcess("pause")
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
