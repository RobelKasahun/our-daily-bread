import { useState, useEffect } from "react";
import { apiRequest } from "../utils/api";

export default function UserInfo({ userId }) {
  const [user, setUser] = useState([]);

  // load posts
  useEffect(() => {
    const handleUser = async (e) => {
      const response = await apiRequest(
        `http://localhost:8000/user/${userId}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("User fetched successfully!", data);
        setUser(data);
      } else {
        console.error("Failed to fetch user:", data.error);
      }
    };

    if (user) handleUser();
  }, [userId]);

  return (
    <p className="inline-block">
      {user.first_name} {user.last_name}
    </p>
  );
}
