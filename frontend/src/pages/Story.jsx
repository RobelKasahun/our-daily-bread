import Footer from "../components/Footer";
import Navigationbar from "../components/Navigationbar";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { apiRequest } from "../utils/api";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import { API_BASE_URL } from "../utils/config";

export default function Story() {
  const [posts, setPosts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Get current user
  useEffect(() => {
    const handleCurrentUser = async () => {
      const response = await apiRequest(`${API_BASE_URL}/users/current`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentUserId(data.current_user);
      } else {
        console.error("Failed to fetch current user:", data.error);
      }
    };

    handleCurrentUser();
  }, []);

  // load posts
  useEffect(() => {
    //   currentUserId must be set to the current user ID
    if (currentUserId === null) return;

    const handlePosts = async () => {
      const response = await apiRequest(
        `${API_BASE_URL}/posts/all/${currentUserId}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPosts(data);
      } else {
        console.error("Failed to fetch posts:", data.error);
      }
    };

    handlePosts();
  }, [currentUserId]);

  const getStyling = (index) => {
    const responsiveStyle =
      "w-full max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl xl:max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8";
    if (index == posts.length - 1) {
      return `card px-8 pt-8 pb-2 my-3 pb-8 w-160 ${responsiveStyle}`;
    }
    return `card border-b border-gray-200 px-8 pt-8 pb-2 my-3 pb-8 ${responsiveStyle}`;
  };

  return (
    <>
      <Navigationbar showWriteButton={true} />
      <div className="container mx-auto w-[95%] lg:w-[80%] xl:w-[76%]">
        <div className="stories bg-gray-200 p-5">
          <h1 className="text-4xl">Your Writings</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-4 border-l border-r border-gray-200">
          {/* Posts Section */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            <div className="post">
              {posts.map((post, index) => (
                <Link to={`/contents/${post.id}`} key={post.id}>
                  <Card
                    key={post.id}
                    user_id={post.user_id}
                    post={post}
                    style={getStyling(index)}
                  />
                </Link>
              ))}
            </div>
          </div>
          <div className="w-full md:w-1/4 lg:w-1/5">
            <Sidebar />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
