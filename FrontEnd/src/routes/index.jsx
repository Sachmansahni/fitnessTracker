import Home from "../components/Home";
import AuthPopup from "../components/AuthPopup";
import WorkoutTracker from "../components/WorkOutTracker";
import PlankTracker from "../components/PlankTracker";
import ForgotPassword from "../components/ForgotPassword";
import PushupTracker from "../components/PushUpTracker";
import SquatTracker from "../components/SquatsTracker";
import LeaderBoard from "../components/LeaderBoard";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/leaderboard", element: <LeaderBoard /> },
  { path: "/planktracker", element: <PlankTracker /> },
  { path: "/pushuptracker", element: <PushupTracker /> },
  { path: "/squattracker", element: <SquatTracker /> },
  { path: "/workouttracker", element: <WorkoutTracker /> },
  { path: "/auth", element: <AuthPopup /> },
  { path: "/forgotpassword", element: <ForgotPassword /> },
];

export default routes;