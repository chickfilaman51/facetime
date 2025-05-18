"use client";

import { useState, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [activeTab, setActiveTab] = useState("score"); 
  const [uploadedImage, setUploadedImage] = useState<string | null>(null); 
  const [analysis, setAnalysis] = useState<any>(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUploadedImage, setLastUploadedImage] = useState<string | null>(null);
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null); 
  const [scoreHistory, setScoreHistory] = useState<{ date: string; score: number; imageUrl: string }[]>([]);
  const [sliderValue, setSliderValue] = useState(50);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false); 
  const [confirmPassword, setConfirmPassword] = useState(""); 

  const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  if (username === "admin" && password === "password") {
    setIsLoggedIn(true);
    setError(null);
  } else {
    setError("Invalid username or password");
  }
};

const handleCreateAccount = (e: React.FormEvent) => {
  e.preventDefault();
  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  setIsLoggedIn(true);
  setError(null);
};

if (!isLoggedIn) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={isCreatingAccount ? handleCreateAccount : handleLogin}
        className="p-10 bg-white shadow-lg rounded-lg w-[500px]" 
      >
        <h1 className="text-4xl font-bold mb-8 text-center">
          {isCreatingAccount ? "Create Account" : "Login"}
        </h1>
        {error && <p className="text-red-500 mb-6 text-center">{error}</p>}
        <div className="mb-6">
          <label htmlFor="username" className="block text-lg font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-lg"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-lg font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-lg"
          />
        </div>
        {isCreatingAccount && (
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-lg"
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark text-xl font-bold"
        >
          {isCreatingAccount ? "Create Account" : "Login"}
        </button>
        <p className="mt-6 text-center text-lg text-gray-600">
          {isCreatingAccount ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsCreatingAccount(!isCreatingAccount);
              setError(null);
            }}
            className="text-primary font-semibold hover:underline"
          >
            {isCreatingAccount ? "Login" : "Create Account"}
          </button>
        </p>
      </form>
    </div>
  );
}
  const getChartData = () => ({
    labels: scoreHistory.map((entry) => entry.date),
    datasets: [
      {
        label: "Skin Score Over Time",
        data: scoreHistory.map((entry) => entry.score),
        borderColor: "rgba(59, 130, 246, 1)", 
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
      },
    ],
  });
  

  const handleTabChange = (tab: string) => {
    if (tab === "upload") {
      setUploadedImage(null);
      setAnalysis(null);
      setError(null);
    }
    setActiveTab(tab);
  };
  

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setAnalysis(null);
      setError(null);

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

    
      const currentImageUrl = URL.createObjectURL(file);
      setScoreHistory((prev) => [
        ...prev,
        {
          date: selectedDate || new Date().toISOString().slice(0, 10),
          score: data.skin_score,
          imageUrl: currentImageUrl,
        },
      ]);



      setLastUploadedImage(URL.createObjectURL(file));
      setLastAnalysis(data);

    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };
  

  const renderBoundingBoxes = () => {
    if (!analysis || !uploadedImage) return null;

    const img = imageRef.current;
    const boxes = (analysis as any).predictions || [];
    const scaleX = img ? img.width / img.naturalWidth : 1;
    const scaleY = img ? img.height / img.naturalHeight : 1;

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

      <button
      onClick={() => setIsLoggedIn(false)}
      className="absolute top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg hover:bg-red-600 text-lg font-semibold"
    >
      Log Out
    </button>
      <div className="w-1/4 bg-gray-200 p-4 flex flex-col space-y-8"> 
        <h2 className="text-4xl font-bold mb-8 mt-8 text-center">Dashboard</h2> 
        <button
          onClick={() => handleTabChange("score")}
          className={`p-4 rounded-lg text-lg font-semibold ${
            activeTab === "score" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          Home
        </button>
        <button
          onClick={() => handleTabChange("upload")}
          className={`p-4 rounded-lg text-lg font-semibold ${
            activeTab === "upload" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          Upload Picture
        </button>
        <button
          onClick={() => handleTabChange("time")}
          className={`p-4 rounded-lg text-lg font-semibold ${
            activeTab === "time" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          Time Machine
        </button>

      </div>


      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100">
      {activeTab === "score" && (
        <div className="flex flex-col md:flex-row w-full max-w-6xl items-start gap-8">
     
          <div className="w-full md:w-1/2">
            <h1 className="text-5xl font-bold mb-6 text-center md:text-left">Your Score</h1>

            {lastUploadedImage && (
              <div className="relative mt-4 w-full border border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={lastUploadedImage}
                  alt="Most Recent Upload"
                  className="w-full object-cover"
                />
              </div>
            )}

            {lastAnalysis && (
              <div className="mt-6 text-left bg-white p-4 rounded shadow">
                <h2 className="text-3xl font-bold mb-4">Skin Score: {lastAnalysis.skin_score}</h2>

                <h3 className="text-2xl font-semibold mb-2">Acne Counts:</h3>
                <ul className="list-disc list-inside mb-4">
                {Object.entries(lastAnalysis.acne_counts as Record<string, number>).map(([type, count]) => (
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

          
          <div className="w-full md:w-1/2">
            <h2 className="text-5xl font-bold mb-6 text-center md:text-left">Progress Tracker</h2>
            <div className="bg-white p-4 rounded shadow">
              {scoreHistory.length > 0 ? (
                <Line data={getChartData()} />
              ) : (
                <p className="text-gray-500 text-center">No data yet. Upload an image to see your progress.</p>
              )}
            </div>
          </div>
        </div>
      )}



      {activeTab === "upload" && (
        <div className="text-center w-full max-w-xl">
          <h1 className="text-5xl font-bold mb-6">Upload a Picture</h1>


          <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold mb-4">Reminders for Uploading:</h2>
            <ul className="list-disc list-inside text-lg text-gray-700">
              <li>Ensure a plain background for better analysis.</li>
              <li>Take a picture facing directly at the camera.</li>
              <li>Avoid distractions like hair or accessories covering your face.</li>
              <li>Ensure good lighting for clear visibility.</li>
            </ul>
          </div>


          <form
            className="flex flex-col items-center space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
      
            <input
              type="date"
              className="text-gray-500 text-lg py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setSelectedDate(e.target.value)} 
            />

          
            <label className="block text-lg text-gray-500 file:py-3 file:px-6 file:rounded-md file:border-0 file:text-lg file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={!selectedDate}
              />
              <span
                className={`cursor-pointer py-3 px-6 rounded-md ${
                  selectedDate ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Choose File
              </span>
            </label>

   
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
                {Object.entries(lastAnalysis.acne_counts as Record<string, number>).map(([type, count]) => (
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
       {activeTab === "time" && (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-5xl font-bold mb-6 text-center">Time Machine</h1>

       
          <p className="text-lg text-gray-600 mb-4 text-center">Drag the line to compare images</p>

          {scoreHistory.length >= 2 ? (
            <div className="relative w-full h-[400px] mt-6">
         
              <div
                className="absolute inset-0"
                style={{
                  clipPath: `polygon(0 0, ${sliderValue}% 0, ${sliderValue}% 100%, 0 100%)`, // Clip the first image based on slider value
                }}
              >
                <img
                  src={scoreHistory[0].imageUrl} 
                  alt="First Upload"
                  className="w-full h-full object-cover rounded-lg"
                />
           
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded">
                  Before
                </div>
    
                <div className="absolute top-16 left-4 bg-gray-800 text-white px-3 py-1 rounded">
                  Score: {scoreHistory[0].score}
                </div>
         
                <div className="absolute top-24 left-4 bg-gray-800 text-white px-3 py-1 rounded">
                  Date: {new Date(scoreHistory[0].date).toLocaleDateString()}
                </div>
              </div>

       
              <div
                className="absolute inset-0"
                style={{
                  clipPath: `polygon(${sliderValue}% 0, 100% 0, 100% 100%, ${sliderValue}% 100%)`, // Clip the second image based on slider value
                }}
              >
                <img
                  src={scoreHistory[scoreHistory.length - 1].imageUrl} 
                  alt="Latest Upload"
                  className="w-full h-full object-cover rounded-lg"
                />
    
                <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded">
                  After
                </div>
        
                <div className="absolute top-16 right-4 bg-gray-800 text-white px-3 py-1 rounded">
                  Score: {scoreHistory[scoreHistory.length - 1].score}
                </div>
      
                <div className="absolute top-24 right-4 bg-gray-800 text-white px-3 py-1 rounded">
                  Date: {new Date(scoreHistory[scoreHistory.length - 1].date).toLocaleDateString()}
                </div>
              </div>

           
              <div
                className="absolute inset-y-0 flex items-center justify-center"
                style={{
                  left: `${sliderValue}%`,
                  width: "4px",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  cursor: "ew-resize",
                }}
                onMouseDown={(e) => {
                  const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                  const onMouseMove = (moveEvent: MouseEvent) => {
                    if (rect) {
                      const newSliderValue = Math.min(
                        100,
                        Math.max(0, ((moveEvent.clientX - rect.left) / rect.width) * 100)
                      );
                      setSliderValue(newSliderValue);
                    }
                  };

                  const onMouseUp = () => {
                    document.removeEventListener("mousemove", onMouseMove);
                    document.removeEventListener("mouseup", onMouseUp);
                  };

                  document.addEventListener("mousemove", onMouseMove);
                  document.addEventListener("mouseup", onMouseUp);
                }}
              >

                <div
                  className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-full"
                  style={{
                    transform: "translate(0%, -50%)", 
                    position: "absolute",
                    top: "50%", 
                  }}
                >
                  ⇔
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xl text-gray-600 mt-8">
              Upload at least 2 images to compare.
            </p>
          )}


          {scoreHistory.length > 0 && (
            <div className="mt-8 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-center">Download Image by Date</h2>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                <option value="">Select a Date</option>
                {scoreHistory.map((entry, index) => (
                  <option key={index} value={entry.date}>
                    {new Date(entry.date).toLocaleDateString()}
                  </option>
                ))}
              </select>
              {selectedDate && (
                <div className="text-center">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={() => {
                      const selectedEntry = scoreHistory.find(
                        (entry) => entry.date === selectedDate
                      );
                      if (selectedEntry) {
                        const link = document.createElement("a");
                        link.href = selectedEntry.imageUrl;
                        link.download = `image-${new Date(selectedEntry.date).toLocaleDateString()}.jpg`;
                        link.click();
                      }
                    }}
                  >
                    Download Image
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
                        
      </div>
    </div>
  );
}