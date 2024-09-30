import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { Button, CircularProgress, TextField } from "@mui/material";

const WebcamCaptureComponent = ({ onCaptureComplete }) => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [name, setName] = useState(""); // State for the text field
  const [loading, setLoading] = useState(false); // Loading state for the CircularProgress
  const [processing, setProcessing] = useState(false); // State to show "Processing your face..."
  const [flash, setFlash] = useState(false); // State for the flash effect

  // Function to capture an image from the webcam feed
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc); // Store the captured image in the state
    return imageSrc; // Return the image source
  }, [webcamRef]);

  // Convert base64 image to Blob
  const base64ToBlob = (base64Data, contentType = "image/jpeg") => {
    const byteCharacters = atob(base64Data.split(",")[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  };

  // Start the countdown when the button is clicked
  const handleCaptureClick = () => {
    setCountdown(3); // Start 3-second countdown
    setLoading(true);
  };

  // Countdown logic using useEffect
  useEffect(() => {
    if (countdown === null) return; // Exit if countdown is not running

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (countdown === 0) {
      const imageSrc = capture(); // Capture image when countdown reaches 0
      setCountdown(null); // Reset countdown
      setProcessing(true); // Show "Processing your face..."

      // Trigger flash effect
      setFlash(true);
      setTimeout(() => {
        setFlash(false); // End flash after a brief moment (200ms)
      }, 200);

      // After capturing the image, send it to the backend
      sendToBackend(imageSrc, name);
    }
  }, [countdown, capture]);

  // Function to send the captured image to the backend
  const sendToBackend = async (capturedImage, name) => {
    if (capturedImage) {
      setLoading(true); // Start showing CircularProgress

      try {
        // Convert base64 image to Blob (raw file)
        const imageBlob = base64ToBlob(capturedImage, "image/jpeg");

        // Create FormData to send the image file and name
        const formData = new FormData();
        formData.append("name", name); // Append the name
        formData.append("file", imageBlob, "captured-image.jpg"); // Append the captured image as a file

        // Send the FormData to the backend using fetch
        const response = await fetch(
          "https://8c0f-2405-9800-b671-458f-b9f0-f790-e6b3-73d.ngrok-free.app/upload-image/",
          {
            method: "POST",
            body: formData, // Send the FormData
          }
        );
        console.log("Response from backend:", response);

        const data = await response.json();
        console.log("Response from backend:", data);

        onCaptureComplete(data); // Send the data back to the parent component
      } catch (error) {
        console.error("Error sending the image to the backend:", error);
      } finally {
        setLoading(false); // Stop showing CircularProgress after response
        setProcessing(false); // Remove "Processing your face..." text
        setName(""); // Clear name field after submission
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Webcam feed container */}
      <div className="relative">
        {/* Webcam feed */}
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded-xl shadow-lg mb-4"
          style={{
            width: "1280px",
            height: "760px", // Fill the entire container (or screen)
            objectFit: "cover", // Ensure it covers the entire area
          }}
        />

        {/* Countdown overlay */}
        {countdown !== null && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-9xl font-bold">
            {countdown}
          </div>
        )}

        {/* Show "Processing your face..." text when processing */}
        {processing && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-bold">
            Processing your face...
          </div>
        )}

        {/* Flash effect */}
        {flash && (
          <div className="absolute inset-0 bg-white opacity-75 z-50 animate-fadeOut"></div>
        )}

        {/* Capture button positioned inside the camera feed */}
        <Button
          onClick={handleCaptureClick}
          variant="contained"
          color="primary"
          disabled={loading} // Disable button while loading
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            position: "absolute",
            bottom: "10%", // Positioned 10% from the bottom of the webcam feed
            left: "50%", // Center the button horizontally
            transform: "translateX(-50%)", // Adjust for perfect centering
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ffffff",
          }}
        >
          {/* Show CircularProgress when loading, otherwise show text */}
          {loading ? (
            <CircularProgress
              size={56}
              thickness={5}
              style={{
                position: "absolute",
                color: "#000000", // You can change the color
              }}
            />
          ) : (
            "Capture"
          )}
        </Button>
      </div>

      {/* Name input field */}
      <TextField
        variant="filled"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name..."
        fullWidth
        InputProps={{
          style: {
            backgroundColor: "#111827", // Tailwind's bg-gray-600 equivalent
            color: "white", // Set text color to white
            borderRadius: "0.75rem", // Tailwind's rounded-xl equivalent
          },
        }}
        InputLabelProps={{
          style: {
            color: "rgba(255, 255, 255, 0.7)", // Lighter color for the placeholder text
          },
        }}
        sx={{
          marginTop: "", // Tailwind's mt-4 equivalent
          "& .MuiFilledInput-underline:before": {
            borderBottom: "none", // Remove underline on normal state
          },
          "& .MuiFilledInput-underline:after": {
            borderBottom: "none", // Remove underline on active state
          },
        }}
      />
    </div>
  );
};

export default WebcamCaptureComponent;
