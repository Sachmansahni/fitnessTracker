import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const userStatus = localStorage.getItem("isUserLoggedIn");
    setIsUserLoggedIn(userStatus === "true");
  }, []);

  return (
    <div className="flex flex-col scroll-smooth">
      {/* Slide 1 - Existing Home Page */}
      <div className="h-screen flex flex-col relative overflow-hidden text-white bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: "url('Home.png')" }}>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Header with Logo */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 z-10">
          <div className="flex items-center">
            <img src="Logo.png" alt="Hi-Fit Logo" className="h-12 w-auto mr-4" />
            <h1 className="text-3xl font-bold text-yellow-500">Hi-Fit</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center p-10 min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md"
          >
            <h1 className="text-6xl font-bold mb-6 uppercase">Track Your Fitness</h1>
            <p className="text-lg max-w-2xl mb-6">Stay on top of your fitness goals with our advanced tracking system.</p>

            {isUserLoggedIn ? (
              <div className="space-y-4">
                <Link to="/plank-tracker" className="bg-yellow-500 text-black px-6 py-2 rounded-lg shadow-md block text-center font-bold">Plank Tracker</Link>
                <Link to="/pushup-tracker" className="bg-yellow-400 text-black px-6 py-2 rounded-lg shadow-md block text-center font-bold">Push-up Tracker</Link>
                <Link to="/squat-tracker" className="bg-yellow-300 text-black px-6 py-2 rounded-lg shadow-md block text-center font-bold">Squat Tracker</Link>
                <Link to="/workout-tracker" className="bg-yellow-200 text-black px-6 py-2 rounded-lg shadow-md block text-center font-bold">Workout Tracker</Link>
              </div>
            ) : (
              <div className="flex space-x-4 justify-center">
                <Link to="/auth" className="bg-yellow-500 text-black px-6 py-2 rounded-lg shadow-md font-bold">Get Started</Link>
                <button onClick={() => setIsOpen(true)} className="bg-white text-black px-6 py-2 rounded-lg shadow-md font-bold">Demo Video</button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl w-full relative">
            <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 bg-yellow-500 text-black rounded-full px-3 py-1 text-lg">✕</button>
            <div className="relative w-full">
              <video className="w-full h-64 md:h-96" controls>
                <source src="Screen Recording 2024-08-31 111242.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* Slide 2 - Content from PPT */}
      <div className="h-screen flex items-center justify-between bg-gray-900 text-white p-10">
        {/* Left Side Content */}
        <div className="flex flex-col w-1/2">
          <h2 className="text-4xl font-bold">ABOUT OUR FIT FAMILY</h2>
          <p className="text-lg mt-4">Astraeus was founded in 2001 by a husband and wife team, Bobby and Dora Graff. Since then, we have expanded to over 115 locations nationwide!</p>
          <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded">Learn More</button>
        </div>

        {/* Right Side Images */}
        <div className="flex w-1/2 space-x-4">
          <img src="image1.jpg" alt="Image 1" className="w-1/2 h-auto object-cover" />
          <img src="image2.jpg" alt="Image 2" className="w-1/2 h-auto object-cover" />
        </div>
      </div>


      {/* Slide 3 */}
      <div className="h-screen flex flex-col items-center justify-center bg-gray-800 text-white p-10">
        <h2 className="text-4xl font-bold">Slide 3 Title</h2>
        <p className="text-lg mt-4 max-w-2xl text-center">This is where the content from the third slide of the PPT will go.</p>
      </div>

      {/* Slide 4 */}
      <div className="h-screen flex flex-col items-center justify-center bg-gray-700 text-white p-10">
        <h2 className="text-4xl font-bold">Slide 4 Title</h2>
        <p className="text-lg mt-4 max-w-2xl text-center">More content from the PPT.</p>
      </div>

      {/* Additional slides can be added similarly */}
    </div>
  );
}

export default Home;