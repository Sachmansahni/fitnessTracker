import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthPopup() {
  const navigate = useNavigate();
  const [type, setType] = useState("signup");
  const [formData, setFormData] = useState({ email: "", password: "", username: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const baseUrl = "http://localhost:8000";
    const url = type === "signup" ? `${baseUrl}/register` : `${baseUrl}/token`;
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }
  
      const result = await response.json();
      
      if (type !== "signup") {
        localStorage.setItem("token", result.access_token);
        localStorage.setItem("isUserLoggedIn", JSON.stringify(true));
        navigate("/");
      }
  
      alert(result.message);
    } catch (error) {
      console.error("Error submitting form:", error.message);
      alert(error.message);
    }
  };  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-3 py-1"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">{type === "signup" ? "Sign Up" : "Login"}</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            className="w-full p-2 border rounded" 
            required 
            value={formData.email} 
            onChange={handleChange} 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            className="w-full p-2 border rounded" 
            required 
            value={formData.password} 
            onChange={handleChange} 
          />
          {type === "signup" && (
            <input 
              type="text" 
              name="username" 
              placeholder="Username" 
              className="w-full p-2 border rounded" 
              required 
              value={formData.username} 
              onChange={handleChange} 
            />
          )}
          <button type="submit" className="w-full bg-teal-500 text-white p-2 rounded hover:bg-teal-600">
            {type === "signup" ? "Sign Up" : "Login"}
          </button>
        </form>
        <p className="text-center mt-4">
          {type === "signup" ? "Already have an account? " : "Don't have an account? "}
          <button className="text-teal-500 underline" onClick={() => setType(type === "signup" ? "login" : "signup")}>
            {type === "signup" ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthPopup;