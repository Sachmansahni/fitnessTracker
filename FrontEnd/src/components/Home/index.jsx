import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const userStatus = localStorage.getItem("isUserLoggedIn");
    setIsUserLoggedIn(userStatus === "true");
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-myTeal relative overflow-hidden">
      {/* Curved Background */}
      <div className="absolute top-0 right-0 w-3/4 h-full bg-white" style={{ clipPath: "ellipse(80% 70% at 100% 50%)" }}></div>

      {/* Content Section */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-10 min-h-screen">
        {/* Left Content */}
        <div className="text-left max-w-md text-gray-800">
          <div className="mt-4 space-y-2">
            <h1 className="text-7xl font-bold mb-4">Welcome to Fitness Tracker</h1>
            {isUserLoggedIn ? (
              <div className="space-y-4">
                <Link to="/plank-tracker" className="bg-blue-900 text-white px-6 py-2 rounded-lg shadow-md block text-center">Plank Tracker</Link>
                <Link to="/pushup-tracker" className="bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md block text-center">Push-up Tracker</Link>
                <Link to="/squat-tracker" className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md block text-center">Squat Tracker</Link>
                <Link to="/workout-tracker" className="bg-blue-300 text-white px-6 py-2 rounded-lg shadow-md block text-center">Workout Tracker</Link>
              </div>
            ) : (
              <>
                <p className="text-xl max-w-2xl mb-6">Track your workouts, monitor your progress, and stay fit with our advanced fitness tracking system.</p>
                <div className="mt-6 space-x-4">
                  <Link to="/auth" className="bg-blue-900 text-white px-6 py-2 rounded-lg shadow-md">Get Started</Link>
                  <button onClick={() => setIsOpen(true)} className="bg-myPeach text-white px-6 py-2 rounded-lg shadow-md">Demo Video</button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Image */}
        <div className="mt-0 md:mt-0 flex justify-center">
          <img
            src="Screenshot 2025-02-15 210035.png"
            alt="Hi Fit Logo"
            className="h-[60px] md:h-[125px] lg:h-[250px] xl:h-[500px] w-auto object-contain"
          />
        </div>
      </div>

      {/* Video Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl w-full relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 bg-myPeach text-white rounded-full px-3 py-1 text-lg"
            >
              ✕
            </button>
            <div className="relative w-full">
              <video className="w-full h-64 md:h-96" controls>
                <source src="Screen Recording 2024-08-31 111242.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;