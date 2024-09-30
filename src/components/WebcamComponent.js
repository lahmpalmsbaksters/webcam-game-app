import React, { useRef, useCallback } from "react";
import Webcam from "react-webcam";

const WebcamComponent = ({ onCapture }) => {
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc); // Send to parent component or backend
  }, [webcamRef]);

  return (
    <div className="relative w-full h-screen">
      {/* Blurred Webcam Feed as Background */}
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="absolute top-0 left-0 w-full h-full object-cover filter blur-lg opacity-90" // Added blur and opacity
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60" />
    </div>
  );
};

export default WebcamComponent;
