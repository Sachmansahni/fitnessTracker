import Home from "../components/Home";
import AuthPopup from "../components/AuthPopup";
import WorkoutTracker from "../components/WorkOutTracker";
import PlankTracker from "../components/PlankTracker";
import ForgotPassword from "../components/ForgotPassword";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/plank-tracker", element: <PlankTracker /> },
  { path: "/workout-tracker", element: <WorkoutTracker /> },
  { path: "/auth", element: <AuthPopup /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
];

export default routes;