import { useState, useEffect } from "react";
import Navigationbar from "../components/Navigationbar";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import { apiRequest } from "../utils/api";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../utils/config";

export default function SavedPosts() {
  const [savedPosts, setSavedPosts] = useState([]);

  // Get all the saved posts
  useEffect(() => {
    const handleSavedPosts = async () => {
      const response = await apiRequest(`${API_BASE_URL}/posts/saved`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setSavedPosts(data);
      } else {
        console.error("Failed to fetch saved posts:", data.error);
      }
    };

    handleSavedPosts();
  }, []);

  const getStyling = (index) => {
    const responsiveStyle =
      "w-full max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl xl:max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8";
    if (index == savedPosts.length - 1) {
      return `card px-8 pt-8 pb-2 my-3 pb-8 w-160 ${responsiveStyle}`;
    }
    return `card border-b border-gray-200 px-8 pt-8 pb-2 my-3 pb-8 ${responsiveStyle}`;
  };

  return (
    <>
      <Navigationbar showWriteButton={true} />
      <div className="container mx-auto w-[95%] lg:w-[80%] xl:w-[76%] xl:max-w-[1000px]">
        <h1 className="text-3xl mt-8 text-center">Saved Posts</h1>
        <div className="flex flex-col md:flex-row gap-4 border-l border-r border-gray-200">
          {/* Posts Section */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            <div className="post">
              {savedPosts.map((post, index) => (
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
        </div>
      </div>
    </>
  );
}
