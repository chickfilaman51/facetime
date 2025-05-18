"use client";

import { useState, useRef, useEffect } from "react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("score"); // Default tab is "score"
  const [uploadedImage, setUploadedImage] = useState<string | null>(null); // Uploaded image URL
  const [fileData, setFileData] = useState<File | null>(null); // The actual File object to send
  const [analysis, setAnalysis] = useState<any>(null); // API response JSON
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setAnalysis(null);
    setError(null);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create image preview URL
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setFileData(file);
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

      // Change the URL below to your backend's actual address if not localhost
      const response = await fetch("https://d4ed6d0a-8f08-488d-9f94-15e828990f0c-00-261inyv6qmvnb.janeway.replit.dev/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      setAnalysis(data);
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
    const boxes = analysis.predictions || [];
  
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
      <div className="w-1/4 bg-gray-200 p-4 flex flex-col space-y-4 ">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <button
          onClick={() => handleTabChange("score")}
          className={`p-2 rounded-lg ${
            activeTab === "score" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          View Score
        </button>
        <button
          onClick={() => handleTabChange("upload")}
          className={`p-2 rounded-lg ${
            activeTab === "upload" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          Upload Picture
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100">
        {activeTab === "score" && (
          <div className="text-center">
            {uploadedImage && (
              <div className="flex flex-col items-center justify-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Most Recent Image:</h2>
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-80 h-80 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}
            <h1 className="text-5xl font-bold mb-6">Your Score</h1>
            <p className="text-2xl mb-6">Score: 85/100</p>
            <h2 className="text-3xl font-bold mb-4">Tips for Improvement:</h2>
            <ul className="list-disc list-inside text-xl">
              <li>Drink more water to keep your skin hydrated.</li>
              <li>Use sunscreen daily to protect your skin.</li>
              <li>Maintain a consistent skincare routine.</li>
            </ul>
          </div>
        )}

        {activeTab === "upload" && (
          <div className="text-center w-full max-w-xl">
            <h1 className="text-5xl font-bold mb-6">Upload a Picture</h1>
            <form>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-lg text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-md file:border-0 file:text-lg file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              />
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
