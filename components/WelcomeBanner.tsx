// WelcomeBanner/index.tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/WelcomeBanner.module.scss";
import Image from "next/image";

const Slideshow: React.FC<{images: string[]}> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(timer); // Clean up on unmount
  }, [images]);

  return (
    <div className={styles.slideshow}>
      <Image 
        className={styles.slideshowImage}
        src={images[currentImageIndex]}
        alt="Slideshow"
        width={2500}
        height={1500}
      />
    </div>
  );
};

const WelcomeBanner: React.FC = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const features = [
    {
      title: "Activity Suggestions",
      description: "Discover and select from our curated list of exciting activities.",
      image: "/images/welcome-banner/features/suggestions.png"
    },
    {
      title: "Drag and Drop Reordering",
      description: "Easily organize your itinerary by dragging and dropping activities.",
      image: "/images/welcome-banner/features/drag-and-drop.png"
    },
    {
      title: "Custom Activities",
      description: "Create your own custom activities and add them to your itinerary.",
      image: "/images/welcome-banner/features/notes.png"
    },
    {
      title: "Get Directions Button",
      description: "Effortlessly obtain directions for your entire itinerary with a single click.",
      image: "/images/welcome-banner/features/directions.png"
    },
    {
      title: "Share with Friends and Family",
      description: "Share your itineraries with friends and family to help plan your trips together.",
      image: "/images/welcome-banner/features/send.png"
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <Slideshow images={[
          "/images/welcome-banner/slideshow/1.jpg",
          "/images/welcome-banner/slideshow/2.jpg",
          "/images/welcome-banner/slideshow/3.jpg",
        ]} />
        <div className={styles.overlayContainer}>
          <Image
            src="/images/header_logo.png"
            alt="Excursia Logo"
            className={styles.logoOverlay}
            width={655}
            height={179}
          />
          <button 
            className={styles.getStartedButton}
            onClick={() => router.push("/sign-up")}
          >
            Get Started
          </button>
        </div>
      </div>
      <div className={styles.infoBox}>
        <h2 className={styles.title}>Welcome to Excursia</h2>
        <h3 className={styles.subtitle}>Discover amazing experiences</h3>
        <p className={styles.description}>
          Excursia helps you find and plan amazing trips and experiences, tailored to your preferences. Join us today and start exploring!
        </p>
        <div className={styles.featuresList}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureItem}>
              {index % 2 === 0 && <img
                  className={styles.featureImage}
                  src={feature.image}
                  alt={feature.title}
              />}
              <div className={styles.featureWords}>
                <h4 className={styles.featureTitle}>{feature.title}</h4>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
              {index % 2 === 1 && <img
                  className={styles.featureImage}
                  src={feature.image}
                  alt={feature.title}
              />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
