import Navigationbar from "../components/Navigationbar";
import { useState, useEffect } from "react";
import Card from "../components/Card";
import { apiRequest } from "../utils/api";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]);

  const slicedPosts = posts.slice(0, posts.length).reverse();

  // load posts
  useEffect(() => {
    const handlePosts = async (e) => {
      const response = await apiRequest("http://localhost:8000/posts", {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Posts fetched successfully!", data);
        setPosts(data);
        console.log(posts);
      } else {
        console.error("Failed to fetch posts:", data.error);
      }
    };

    handlePosts();
  }, []);

  const getStyling = (index) => {
    const responsiveStyle =
      "w-full max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl xl:max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8";
    if (index == slicedPosts.length - 1) {
      return `card px-8 pt-8 pb-2 my-3 pb-8 w-160 ${responsiveStyle}`;
    }
    return `card px-8 pt-8 pb-2 my-3 pb-8 ${responsiveStyle}`;
  };

  return (
    <>
      <Navigationbar showWriteButton={true} />
      <div className="container bg-indigo-200 mx-auto w-[95%] lg:w-[80%] xl:w-[76%] my-4">
        <div className="flex flex-col md:flex-row gap-4 border-l border-r border-gray-200">
          {/* Posts Section */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            <div className="post">
              {slicedPosts.map((post, index) => (
                <Link to={"#"}>
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

          {/* Sidebar */}
          <div className="w-full md:w-1/4 lg:w-1/5">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
}
