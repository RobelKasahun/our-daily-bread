import Navigationbar from "../components/Navigationbar";
import { useState } from "react";

export default function Posts() {
  const [posts, setPosts] = useState([]);

  const handlePosts = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
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
  return (
    <>
      <Navigationbar showWriteButton={true} />
      <h1>POSTS</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </>
  );
}
