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
            <h1 className="text-[40px] font-bold text-[#FFF700]">Hi-Fit</h1> {/* Company Name */}
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md"
          >
            <h1 className="flex flex-col justify-center text-[100px] font-bold uppercase italic">
              Be Your <span className="text-[#FFF700]">Best</span>
            </h1>

            {isUserLoggedIn ? (
              <div className="space-y-2">
                <Link to="/plank-tracker" className="bg-[#FFF700] text-black px-6 py-2 rounded-lg shadow-md block text-center font-bold">Plank Tracker</Link> {/* Lemon Yellow */}
                <Link to="/pushup-tracker" className="bg-[#FFEF00] text-black px-6 py-2 rounded-lg shadow-md block text-center font-bold">Push-up Tracker</Link>
                <Link to="/squat-tracker" className="bg-[#FFF700] text-black px-6 py-2 rounded-lg shadow-md block text-center font-bold">Squat Tracker</Link> {/* Lemon Yellow */}
                <Link to="/workout-tracker" className="bg-[#FFFB33] text-black px-6 py-2 rounded-lg shadow-md block text-center font-bold">Workout Tracker</Link>
              </div>
            ) : (
              <div className="flex space-x-4 justify-center">
                <Link to="/auth" className="bg-[#FFF700] text-black px-6 py-2 rounded-lg shadow-md font-bold">Get Started</Link> {/* Lemon Yellow */}
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
            <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 bg-[#FFF700] text-black rounded-full px-3 py-1 text-lg">✕</button> {/* Lemon Yellow */}
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
      <div className="h-screen flex items-center justify-between text-white p-10" style={{ backgroundColor: '#141414' }}>
        {/* Left Side Content */}
        <div className="flex flex-col w-1/2">
          <h2 className="text-[50px] font-bold text-[#FFF700] italic">ABOUT OUR FIT FAMILY</h2>
          <p className="text-[25px] max-w-2xl mb-6">Stay on top of your fitness goals with our advanced tracking system. We offer a variety of features to help you maintain your fitness routine, including workout tracking, goal setting, and more.</p>
          <p className="text-[25px] mt-4 text-white">Astraeus was founded in 2001 by a husband and wife team, Bobby and Dora Graff. Since then, we have expanded to over 115 locations nationwide!</p>
          <a href="" className="mt-6 text-white underline">Learn More</a>
        </div>

        {/* Right Side Images */}
        <div className="relative w-1/2 h-full">
          <img
            src="About1.png"
            alt="Image 1"
            className="absolute top-10 left-10 w-1/2 h-auto object-cover transition-all duration-300 hover:scale-105 hover:z-10"
          />
          <img
            src="About2.png"
            alt="Image 2"
            className="absolute bottom-10 right-10 w-1/2 h-auto object-cover transition-all duration-300 hover:scale-105 hover:z-10"
          />
        </div>
      </div>

      {/* Slide 3 */}
      <div className="h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#141414' }}>
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-[50px] font-bold text-[#FFF700] italic">WHAT WE OFFER</h2> {/* Subheading - Lemon Yellow */}
          <p className="text-[25px] mt-4 text-white text-center">We're committed to bringing you the best workout experience.</p>
        </div>

        {/* Images with text */}
        <div className="flex justify-between w-full mt-10">
          <div className="relative w-1/3 h-64">
            <img src="Offer1.png" alt="Image 1" className="w-full h-full object-cover" />
            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[25px] text-white font-semibold text-center">
              Perfect positioning
            </p>
          </div>
          <div className="relative w-1/3 h-64">
            <img src="Offer2.png" alt="Image 2" className="w-full h-full object-cover" />
            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[25px] text-white font-semibold text-center">
              Keep your body fit by daily challenges and scores
            </p>
          </div>
          <div className="relative w-1/3 h-64">
            <img src="Offer3.png" alt="Image 3" className="w-full h-full object-cover" />
            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[25px] text-white font-semibold text-center">
              Ask about Personal Training
            </p>
          </div>
        </div>
      </div>

      {/* Slide 4 */}
      <div
        className="h-screen flex flex-col items-center justify-center text-white p-10"
        style={{ backgroundImage: 'url("quote.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <h2 className="text-[80px] font-bold text-[#FFF700]">GET IN TOUCH TODAY</h2> {/* Subheading - Lemon Yellow */}
      </div>

      {/* Footer Section */}
      <footer className="bg-[#FFF700] text-black p-4 text-center"> {/* Lemon Yellow */}
        <p className="text-lg">Email Address</p>
        <p className="text-lg font-semibold">hiFit001@gmail.com</p>
      </footer>

    </div>
  );
};

export default Home;