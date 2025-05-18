"use client";

import { useState, useRef } from "react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("score"); // Default tab is "score"
  const [uploadedImage, setUploadedImage] = useState<string | null>(null); // Uploaded image URL
  const [analysis, setAnalysis] = useState<any>(null); // API response JSON
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUploadedImage, setLastUploadedImage] = useState<string | null>(null);
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // Selected date
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleTabChange = (tab: string) => {
    if (tab === "upload") {
      // Clear upload-only state when entering Upload tab
      setUploadedImage(null);
      setAnalysis(null);
      setError(null);
    }
    setActiveTab(tab);
  };
  

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create image preview URL
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setAnalysis(null);
      setError(null);

      // Call API to analyze image
      await analyzeImage(file);
    }
  };

  const analyzeImage = async (file: File) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
  
    try {
      const formData = new FormData();
      formData.append("file", file);
  
      const response = await fetch("https://d4ed6d0a-8f08-488d-9f94-15e828990f0c-00-261inyv6qmvnb.janeway.replit.dev/analyze", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
  
      const data = await response.json();
      setAnalysis(data);
  
      // Save for View Score tab
      setLastUploadedImage(URL.createObjectURL(file));
      setLastAnalysis(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };
  

  // Helper: render bounding boxes overlay on image
  const renderBoundingBoxes = () => {
    if (!analysis || !uploadedImage || !imageRef.current) return null;

    const img = imageRef.current;
    const boxes = (analysis as any).predictions || [];
    // Scale bounding boxes to match the displayed image size
    const scaleX = img.width / img.naturalWidth;
    const scaleY = img.height / img.naturalHeight;

    return boxes.map((box: any, i: number) => {
      const style = {
        position: "absolute" as const,
        border: "2px solid #ff0000",
        left: box.x * scaleX,
        top: box.y * scaleY,
        width: box.width * scaleX,
        height: box.height * scaleY,
        pointerEvents: "none" as const,
        boxSizing: "border-box" as const,
        borderRadius: "4px",
      };

      return <div key={i} style={style}></div>;
    });
  };

  return (
    <div className="flex min-h-screen from-blue-100 via-blue-50 to-blue-100">
      {/* Left Sidebar */}
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-200 p-4 flex flex-col space-y-8"> {/* Increased spacing between buttons */}
        <h2 className="text-4xl font-bold mb-8 mt-8 text-center">Dashboard</h2> {/* Increased font size for the heading */}
        <button
          onClick={() => handleTabChange("score")}
          className={`p-4 rounded-lg text-lg font-semibold ${
            activeTab === "score" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          View Score
        </button>
        <button
          onClick={() => handleTabChange("upload")}
          className={`p-4 rounded-lg text-lg font-semibold ${
            activeTab === "upload" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          Upload Picture
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100">
      {activeTab === "score" && (
        <div className="text-center w-full max-w-xl">
          <h1 className="text-5xl font-bold mb-6">Your Score</h1>

          {lastUploadedImage && (
            <div className="relative mt-8 mx-auto w-80 h-80 border border-gray-300 rounded-lg overflow-hidden">
              <img
                src={lastUploadedImage}
                alt="Most Recent Upload"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {lastAnalysis && (
            <div className="mt-6 text-left bg-white p-4 rounded shadow max-w-xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Skin Score: {lastAnalysis.skin_score}</h2>

              <h3 className="text-2xl font-semibold mb-2">Acne Counts:</h3>
              <ul className="list-disc list-inside mb-4">
                {Object.entries(lastAnalysis.acne_counts).map(([type, count]) => (
                  <li key={type}>
                    {type}: {count}
                  </li>
                ))}
              </ul>

              <h3 className="text-2xl font-semibold mb-2">Recommendations & Feedback:</h3>
              <ul className="list-disc list-inside">
                {lastAnalysis.feedback.map((fb: any, idx: number) => (
                  <li key={idx} className="mb-2">
                    {fb.message
                      ? fb.message
                      : `${fb.acne_type} (${fb.count}): ${fb.note || fb.encouragement}`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!lastAnalysis && (
            <p className="text-lg text-gray-500 mt-4">
              No analysis available. Please upload an image in the "Upload Picture" tab.
            </p>
          )}
        </div>
      )}


      {activeTab === "upload" && (
        <div className="text-center w-full max-w-xl">
          <h1 className="text-5xl font-bold mb-6">Upload a Picture</h1>

          {/* Reminders Section */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold mb-4">Reminders for Uploading:</h2>
            <ul className="list-disc list-inside text-lg text-gray-700">
              <li>Ensure a plain background for better analysis.</li>
              <li>Take a picture facing directly at the camera.</li>
              <li>Avoid distractions like hair or accessories covering your face.</li>
              <li>Ensure good lighting for clear visibility.</li>
            </ul>
          </div>

          {/* File Input Section */}
          <form
            className="flex flex-col items-center space-y-4"
            onSubmit={(e) => e.preventDefault()} // Prevent form submission
          >
            {/* Date Picker */}
            <input
              type="date"
              className="text-gray-500 text-lg py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setSelectedDate(e.target.value)} // Update selected date
            />

            {/* File Input */}
            <label className="block text-lg text-gray-500 file:py-3 file:px-6 file:rounded-md file:border-0 file:text-lg file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={!selectedDate} // Disable file input if no date is selected
              />
              <span
                className={`cursor-pointer py-3 px-6 rounded-md ${
                  selectedDate ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Choose File
              </span>
            </label>

            {/* Error Message */}
            {!selectedDate && (
              <p className="text-red-500 text-sm mt-2">
                Please select a date before uploading a picture.
              </p>
            )}
          </form>

          {loading && <p className="mt-4 text-lg">Analyzing image...</p>}
          {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}

          {uploadedImage && (
              <div className="relative mt-8 mx-auto w-80 h-80 border border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                  ref={imageRef}
                />
                {renderBoundingBoxes()}
              </div>
            )}

            {analysis && (
              <div className="mt-6 text-left bg-white p-4 rounded shadow max-w-xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">Skin Score: {analysis.skin_score}</h2>

                <h3 className="text-2xl font-semibold mb-2">Acne Counts:</h3>
                <ul className="list-disc list-inside mb-4">
                  {Object.entries(analysis.acne_counts).map(([type, count]) => (
                    <li key={type}>
                      {type}: {count}
                    </li>
                  ))}
                </ul>

                <h3 className="text-2xl font-semibold mb-2">Recommendations & Feedback:</h3>
                <ul className="list-disc list-inside">
                  {analysis.feedback.map((fb: any, idx: number) => (
                    <li key={idx} className="mb-2">
                      {fb.message
                        ? fb.message
                        : `${fb.acne_type} (${fb.count}): ${fb.note || fb.encouragement}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}