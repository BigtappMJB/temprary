// LoadingScreen.jsx
import React from "react";
import "./LoadingScreen.css"; // Import your CSS file for styling
import { useLoading } from "./loadingProvider";

/**
 * Global Loading Screen component.
 * Displays a full-screen overlay with a loading spinner and optional text.
 *
 * @component
 * @param {Object} props Component props
 * @param {boolean} props.isLoading Whether to show the loading screen or not
 * @param {string} [props.loadingText] Optional text to display for accessibility
 * @returns {JSX.Element} Loading screen component
 */
const LoadingScreen = () => {
  const { isLoading } = useLoading();
  return (
    <div className={`loading-screen ${isLoading ? "active" : ""}`}>
      <div className="loading-spinner"></div>
    </div>
  );
};

export default LoadingScreen;
