import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";

export default function Sidebar() {
  const [authors, setAuthors] = useState([]);
  const [posts, setPosts] = useState([]);

  // load users
  useEffect(() => {
    const handleUsers = async (e) => {
      const response = await apiRequest("http://localhost:8000/users", {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setAuthors(data);
      } else {
        console.error("Failed to fetch users:", data.error);
      }
    };

    handleUsers();
  }, []);

  // load posts
  useEffect(() => {
    const handlePosts = async (e) => {
      const response = await apiRequest("http://localhost:8000/posts", {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setPosts(data);
      } else {
        console.error("Failed to fetch posts:", data.error);
      }
    };

    handlePosts();
  }, []);

  return (
    <div className="sidebar float-right h-full">
      <div className="relative w-full h-full max-w-[20rem] flex-col border-l border-gray-200 p-4 text-gray-700">
        <div className="saved-stories">
          <div className="mx-3">
            <h2 className="block font-sans text-lg antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Recently Saved
            </h2>
          </div>

          <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
            {posts.map((post) => (
              <div
                key={post.id}
                role="button"
                className="flex items-center text-sm w-full p-1 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
              >
                <Link to={"#"}>{post.title}</Link>
              </div>
            ))}
          </nav>
        </div>

        <div className="followers my-5">
          <div className="mx-3">
            <h2 className="block font-sans text-lg antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Who to Follow
            </h2>
          </div>

          <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
            {authors.map((author) => (
              <div
                key={author.id}
                role="button"
                className="flex items-center justify-between w-full p-1 text-sm rounded-lg hover:bg-blue-100"
              >
                <Link to={"#"} key={author.id}>
                  {author.first_name} {author.last_name}
                </Link>
                <button
                  onClick={() => handleFollow(author.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 cursor-pointer"
                >
                  Follow
                </button>
              </div>
            ))}
          </nav>
        </div>

        <div className="topic-for-you">
          <div className="mx-3">
            <h2 className="block font-sans text-lg antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Topics for You
            </h2>
          </div>

          <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
            {posts.map((post) => (
              <div
                key={post.id}
                role="button"
                className="flex items-center text-sm w-full p-1 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
              >
                <Link to={"#"}>{post.title}</Link>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
