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
      console.log("Registration successful!", data);
      setPosts(data);
      console.log(posts);
    } else {
      console.error("Registration failed:", data.error);
    }
  };
  return (
    <>
      <Navigationbar />
      <h1>POSTS</h1>
    </>
  );
}
