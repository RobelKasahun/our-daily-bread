import Navigationbar from "../components/Navigationbar";
import { useState, useEffect } from "react";
import Card from "../components/Card";
import { apiRequest } from "../utils/api";

export default function Posts() {
  const [posts, setPosts] = useState([]);

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

  return (
    <>
      <Navigationbar showWriteButton={true} />
      <div className="container p-3 border border-gray-200 mx-auto w-[60%] my-4">
        {posts.map((post) => (
          <Card key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}
