import Home from "../components/Home";
import AuthPopup from "../components/AuthPopup";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/auth", element: <AuthPopup /> },
];

export default routes;