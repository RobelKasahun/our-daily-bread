import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Navigationbar from "../components/Navigationbar";

export default function Profile() {
  const [followingAuthors, setFollowingAuthors] = useState([]);

  useEffect(() => {
    const fetchFollowedIds = async () => {
      const response = await fetch(
        "http://localhost:8000/followers/following/ids",
        {
          method: "GET",
          credentials: "include", // to send cookies for JWT
        }
      );

      const data = await response.json();

      if (response.ok) {
        setFollowingAuthors(data);
      } else {
        console.error("Failed to fetch following ids");
      }
    };

    fetchFollowedIds();
  }, []);

  return (
    <>
      <Navigationbar showWriteButton={true} />
      <div className="container mx-auto w-[95%] lg:w-[80%] xl:w-[76%]">
        <div className="flex flex-col md:flex-row gap-4 border-l border-r border-gray-200">
          {/* Posts Section */}
          <div className="w-full md:w-3/4 lg:w-4/5">Selam Kidane</div>
        </div>
      </div>
      <Footer />
    </>
  );
}
