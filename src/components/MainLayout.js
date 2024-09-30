import React, { useState, useEffect } from "react";
import axios from "axios";
import WebcamComponent from "./WebcamComponent";
import { motion } from "framer-motion";
import WebcamCaptureComponent from "./WebcamCaptureComponent";

const MainLayout = () => {
  const [scoreboardData, setScoreboardData] = useState(null);
  const [result, setResult] = useState(null);

  // Function to fetch scoreboard data
  const fetchScoreboardData = async () => {
    try {
      const response = await axios.get(
        "https://8c0f-2405-9800-b671-458f-b9f0-f790-e6b3-73d.ngrok-free.app/scoreboard/",
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "false",
          },
        }
      );
      console.log(response);
      setScoreboardData(response.data);
    } catch (error) {
      console.error("Error fetching scoreboard data:", error);
    }
  };

  // Fetch data from the API when the component mounts
  useEffect(() => {
    fetchScoreboardData();
  }, []);

  const handleCaptureComplete = (data) => {
    // Handle the response data from the backend
    setResult(data);
    console.log("Data from backend:", data);

    // Fetch updated scoreboard data
    fetchScoreboardData();
  };

  const handleCapture = async (imageSrc) => {
    // Mock function to simulate API response
    console.log("Captured image:", imageSrc);
    setResult("Sample Result");
  };

  const entryVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  };

  // Function to determine the bar color based on smile_percentage
  const getBarColor = (percentage) => {
    if (percentage > 80) {
      return "bg-green-500"; // Green for percentages > 80
    } else if (percentage >= 50) {
      return "bg-yellow-500"; // Yellow for percentages between 50 and 80
    } else {
      return "bg-red-500"; // Red for percentages < 50
    }
  };

  return (
    <motion.div
      className="relative w-full h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Webcam feed in the background */}
      <WebcamComponent onCapture={handleCapture} />

      {/* UI elements in a 3-column grid */}
      <div className="absolute inset-0 p-2 grid grid-cols-12 gap-4">
        {/* Left column (20%) */}
        <div className="col-span-2 bg-gray-900 rounded-2xl p-4 flex flex-col">
          <h6 className="text-white text-3xl font-bold mb-4"> Leaderboard </h6>
          <div className="space-y-8 overflow-y-auto max-h-full flex-grow">
            {scoreboardData &&
              scoreboardData.top_3.map((player, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800 text-white p-4 rounded-2xl flex flex-col items-center"
                  initial="hidden"
                  animate="visible"
                  variants={entryVariants}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  {/* Player Image */}
                  <img
                    src={player.image_url}
                    alt={player.name}
                    className="w-32 h-32 object-cover rounded-xl mb-4" // Circular image for a cleaner look
                  />

                  {/* Player Name and Score */}
                  <div className="text-center">
                    <p className="text-lg font-semibold">
                      {index + 1}. {player.name}
                    </p>
                    <p className="text-md">
                      Score: {player.score}{" "}
                      <span className="text-yellow-400">😃</span>
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>

        {/* Center column (60%) */}
        <div className="col-span-8 bg-transparent border-0 border-green-300 rounded-xl p-0">
          <div className="flex justify-center items-center rounded-xl">
            <WebcamCaptureComponent onCaptureComplete={handleCaptureComplete} />
          </div>
        </div>

        {/* Right column (20%) */}
        <div className="col-span-2 bg-transparent border-0 border-red-300 rounded-xl flex flex-col justify-between">
          <div className="space-y-4 overflow-y-auto flex-1">
            {result && (
              <motion.div
                className="bg-gray-900 text-white p-6 rounded-2xl flex flex-col items-center justify-center h-full"
                initial="hidden"
                animate="visible"
                variants={entryVariants}
                transition={{ duration: 0.5 }}
              >
                {/* Display captured image */}
                <img
                  src={result.image_url}
                  alt={result.name}
                  className="w-80 h-80 object-cover rounded-lg mb-2"
                />

                {/* Display name */}
                <div className="text-center">
                  <p className="text-lg font-semibold truncate whitespace-nowrap">
                    {result.name}
                  </p>

                  {/* Display score */}
                  <p className="text-xl font-bold">
                    Score: {result.score}{" "}
                    <span className="text-yellow-400">😃</span>
                  </p>

                  {/* Display smile percentage */}
                  <p className="text-md">
                    Smile Percentage: {result.smile_percentage.toFixed(2)}%
                  </p>
                </div>

                {/* Animated Vertical Bar with color change */}
                <div className="py-2 relative flex justify-center items-center w-full h-full">
                  <div className="relative w-10 h-full bg-gray-200 rounded-lg overflow-hidden flex items-end">
                    <motion.div
                      className={`${getBarColor(
                        result.smile_percentage
                      )} rounded-lg`}
                      initial={{ height: 0 }}
                      animate={{ height: `${result.smile_percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      style={{ width: "100%" }} // Full width bar
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MainLayout;
