import { useState, useEffect } from "react";
import { apiRequest } from "../utils/api";

export default function UserInfo({ userId }) {
  const [user, setUser] = useState([]);

  // load posts
  useEffect(() => {
    const handleUser = async (e) => {
      const response = await apiRequest(
        `http://localhost:8000/users/${userId}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data);
      } else {
        console.error("Failed to fetch user:", data.error);
      }
    };

    if (user) handleUser();
  }, [userId]);

  return (
    <div className="inline-block text-sm">
      {user.first_name} {user.last_name}
    </div>
  );
}
