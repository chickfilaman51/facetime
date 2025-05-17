"use client";

import { useState } from "react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("score"); // Default tab is "score"

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-200 p-4 flex flex-col space-y-4">
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
        <button
          onClick={() => handleTabChange("timeTravel")}
          className={`p-2 rounded-lg ${
            activeTab === "timeTravel" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          View Time Travel
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === "score" && (
          <div>
            <h1 className="text-4xl font-bold mb-4">Your Score</h1>
            <p className="text-lg mb-4">Score: 85/100</p>
            <h2 className="text-2xl font-bold mb-2">Tips for Improvement:</h2>
            <ul className="list-disc list-inside">
              <li>Drink more water to keep your skin hydrated.</li>
              <li>Use sunscreen daily to protect your skin.</li>
              <li>Maintain a consistent skincare routine.</li>
            </ul>
          </div>
        )}

        {activeTab === "upload" && (
          <div>
            <h1 className="text-4xl font-bold mb-4">Upload a Picture</h1>
            <form>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              />
              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Upload
              </button>
            </form>
          </div>
        )}

        {activeTab === "timeTravel" && (
          <div>
            <h1 className="text-4xl font-bold mb-4">Time Travel</h1>
            <p className="text-lg">View your skin's progress over time.</p>
            {/* Placeholder for time travel content */}
            <div className="mt-4 p-4 bg-gray-200 rounded-lg">
              <p className="text-gray-600">Time travel feature coming soon!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}