// WelcomeBanner/index.tsx
import React from "react";
import styles from "./WelcomeBanner.module.css";

const WelcomeBanner: React.FC = () => {
  const features = [
    {
      title: "Activity Suggestions",
      description: "Discover and select from our curated list of exciting activities.",
    },
    {
      title: "Drag and Drop Reordering",
      description: "Easily organize your itinerary by dragging and dropping activities.",
    },
    {
      title: "Custom Activities",
      description: "Create your own custom activities and add them to your itinerary.",
    },
    {
      title: "Get Directions Button",
      description: "Effortlessly obtain directions for your entire itinerary with a single click.",
    },
    {
      title: "Share with Friends and Family",
      description: "Share your itineraries with friends and family to help plan your trips together.",
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Welcome to Excursia</h2>
      <h3 className={styles.subtitle}>Discover amazing experiences</h3>
      <p className={styles.description}>
        Excursia helps you find and plan amazing trips and experiences, tailored to your preferences. Join us today and start exploring!
      </p>
      <div className={styles.image}>
        {/* Replace this div with an actual image or an Image component */}
        <p>Placeholder image</p>
      </div>

      <div className={styles.featuresList}>
        {features.map((feature, index) => (
          <div key={index} className={styles.featureItem}>
            <div className={styles.featureImage}>
              {/* Replace this div with an actual image or an Image component */}
              <p>Placeholder image</p>
            </div>
            <div>
              <h4 className={styles.featureTitle}>{feature.title}</h4>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeBanner;
