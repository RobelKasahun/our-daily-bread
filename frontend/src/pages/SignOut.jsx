// pages/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SignOut() {
  const navigate = useNavigate();

  useEffect(() => {
    //   remove access token
    localStorage.removeItem("access_token");
    // redirect to the home page
    navigate("/", { replace: true });
  }, [navigate]);

  return null;
}
