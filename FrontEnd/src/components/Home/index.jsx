import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Menu, User, X } from "lucide-react"

function Home() {
  const [challenge, setChallenge] = useState("")
  const [reps, setReps] = useState(0)
  const [points, setPoints] = useState(0)
  const [showBanner, setShowBanner] = useState(true)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const userStatus = localStorage.getItem("isUserLoggedIn")
    setIsUserLoggedIn(userStatus === "true")
  }, [])

  // useEffect(() => {
  //   fetch("http://localhost:8000/send-challenge")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("Data received:", data)
  //       setChallenge(data.name)
  //       setReps(data.reps)
  //       setPoints(data.points)

  //       setTimeout(() => {
  //         setShowBanner(false)
  //       }, 60000)
  //     })
  //     .catch((error) => console.error("Error fetching data:", error))
  // }, [])

  return (
    <div className="flex flex-col scroll-smooth">
      {/* Slide 1 - Existing Home Page */}
      <div
        className="min-h-screen flex flex-col relative overflow-hidden text-white bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: "url('Home.png')" }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Header with Logo and New Buttons */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 sm:p-6 z-10">
          <div className="flex items-center">
            <img src="Logo.png" alt="Hi-Fit Logo" className="h-8 sm:h-12 w-auto mr-2 sm:mr-4" />
            <h1 className="text-2xl sm:text-[40px] font-bold text-[#FFF700]">Hi-Fit</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                /* Handle profile click */
              }}
              className="text-white hover:text-[#FFF700] transition-colors duration-200"
            >
              <User className="h-6 w-6" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[#FFF700] transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6 text-[#FFF700]" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-0 right-0 w-64 h-screen bg-black bg-opacity-90 z-20 p-6">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-white hover:text-[#FFF700] transition-colors duration-200">
                Home
              </Link>
              <Link to="/about" className="text-white hover:text-[#FFF700] transition-colors duration-200">
                About
              </Link>
              <Link to="/services" className="text-white hover:text-[#FFF700] transition-colors duration-200">
                Services
              </Link>
              <Link to="/contact" className="text-white hover:text-[#FFF700] transition-colors duration-200">
                Contact
              </Link>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md"
          >
            <h1 className="flex flex-col justify-center text-4xl sm:text-6xl md:text-[100px] font-bold uppercase italic">
              Be Your <span className="text-[#FFF700]">Best</span>
            </h1>

            {isUserLoggedIn ? (
              <div className="space-y-2 mt-4">
                <Link
                  to="/plank-tracker"
                  className="bg-[#FFF700] text-black px-4 sm:px-6 py-2 rounded-lg shadow-md block text-center font-bold text-sm sm:text-base"
                >
                  Plank Tracker
                </Link>
                <Link
                  to="/pushup-tracker"
                  className="bg-[#FFEF00] text-black px-4 sm:px-6 py-2 rounded-lg shadow-md block text-center font-bold text-sm sm:text-base"
                >
                  Push-up Tracker
                </Link>
                <Link
                  to="/squat-tracker"
                  className="bg-[#FFF700] text-black px-4 sm:px-6 py-2 rounded-lg shadow-md block text-center font-bold text-sm sm:text-base"
                >
                  Squat Tracker
                </Link>
                <Link
                  to="/workout-tracker"
                  className="bg-[#FFFB33] text-black px-4 sm:px-6 py-2 rounded-lg shadow-md block text-center font-bold text-sm sm:text-base"
                >
                  Workout Tracker
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 justify-center mt-4">
                <Link
                  to="/auth"
                  className="bg-[#FFF700] text-black px-4 sm:px-6 py-2 rounded-lg shadow-md font-bold text-sm sm:text-base"
                >
                  Get Started
                </Link>
                <button
                  onClick={() => setIsOpen(true)}
                  className="bg-white text-black px-4 sm:px-6 py-2 rounded-lg shadow-md font-bold text-sm sm:text-base"
                >
                  Demo Video
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Slide 2 - Content from PPT */}
      <div
        className="min-h-screen flex flex-col md:flex-row items-center justify-between text-white p-6 sm:p-10"
        style={{ backgroundColor: "#141414" }}
      >
        {/* Left Side Content */}
        <div className="flex flex-col w-full md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-3xl sm:text-4xl md:text-[50px] font-bold text-[#FFF700] italic mb-4">
            ABOUT OUR FIT FAMILY
          </h2>

          <p className="text-lg sm:text-xl md:text-[25px] max-w-2xl mb-6">
            Stay on top of your fitness goals with our advanced tracking system.
            {isExpanded && (
              <span>
                We offer a variety of features to help you maintain your fitness routine, including workout tracking,
                goal setting, and more. HiFit was founded in 2025 by two friends, Chirag and Sachman Singh. Our team is
                dedicated to constantly improving our service to ensure the best experience for all users. We believe in
                empowering individuals to achieve their fitness goals through data-driven insights and personalized
                challenges.
              </span>
            )}
          </p>

          <a
            className="mt-4 text-white underline cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show Less" : "Learn More"}
          </a>
        </div>

        {/* Right Side Images */}
        <div className="relative w-full md:w-1/2 h-64 md:h-full">
          <img
            src="About1.png"
            alt="Image 1"
            className="absolute top-0 left-0 md:top-[-150px] w-1/2 h-auto object-cover transition-all duration-300 hover:scale-105 hover:z-10"
          />
          <img
            src="About2.png"
            alt="Image 2"
            className="absolute bottom-0 right-0 md:top-[-250px] w-1/2 h-auto object-cover transition-all duration-300 hover:scale-105 hover:z-10"
          />
        </div>
      </div>

      {/* Slide 3 */}
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-10"
        style={{ backgroundColor: "#141414" }}
      >
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-[50px] font-bold text-[#FFF700] italic text-center">
            WHAT WE OFFER
          </h2>
          <p className="text-lg sm:text-xl md:text-[25px] mt-4 text-white text-center">
            We're committed to bringing you the best workout experience.
          </p>
        </div>

        {/* Images with text */}
        <div className="flex flex-wrap justify-between w-full mt-8">
          <div className="relative w-full md:w-1/3 h-64 mb-4 md:mb-0">
            <img src="Offer1.png" alt="Image 1" className="w-full h-full object-cover" />
            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl sm:text-2xl md:text-[25px] text-white font-semibold text-center">
              Perfect positioning
            </p>
          </div>
          <div className="relative w-full md:w-1/3 h-64 mb-4 md:mb-0">
            <img src="Offer2.png" alt="Image 2" className="w-full h-full object-cover" />
            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl sm:text-2xl md:text-[25px] text-white font-semibold text-center">
              Keep your body fit by daily challenges and scores
            </p>
          </div>
          <div className="relative w-full md:w-1/3 h-64">
            <img src="Offer3.png" alt="Image 3" className="w-full h-full object-cover" />
            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl sm:text-2xl md:text-[25px] text-white font-semibold text-center">
              Ask about Personal Training
            </p>
          </div>
        </div>
      </div>

      {/* Slide 4 */}
      <div
        className="min-h-screen flex flex-col items-center justify-center text-white p-6 sm:p-10"
        style={{ backgroundImage: 'url("quote.png")', backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <h2 className="text-3xl sm:text-5xl md:text-[80px] font-bold text-[#FFF700] text-center">
          GET IN TOUCH TODAY
        </h2>
      </div>

      {/* Footer Section */}
      <footer className="bg-[#FFF700] text-black p-4 text-center">
        <p className="text-base sm:text-lg">Email Address</p>
        <p className="text-base sm:text-lg font-semibold">hiFitn3ss@gmail.com</p>
      </footer>

      {/* Banner - Only show if showBanner is true */}
      {showBanner && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-[#FFF700] text-black text-lg lg:text-2xl font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-500 opacity-100 scale-100 animate-fadeIn">
          🏆 Challenge: {challenge} | 🔄 Reps: {reps} | 🎯 Points: {points}
        </div>
      )}
    </div>
  )
}

export default Home;