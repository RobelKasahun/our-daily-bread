import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigationbar from "../components/Navigationbar";
import { apiRequest } from "../utils/api";
import { API_BASE_URL } from "../utils/config";

export default function Post() {
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: "",
    content: "",
  });

  const handleChange = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    });
  };

  const handlePost = async (e) => {
    e.preventDefault();
    const response = await apiRequest(`${API_BASE_URL}/posts`, {
      method: "POST",
      body: JSON.stringify(post),
    });

    const data = await response.json();
    if (response.ok) {
      navigate("/contents");
    } else {
      console.error("Post failed:", data.error);
      //   setRegistrationErrorMessage(data.error);
    }
  };

  return (
    <>
      <Navigationbar showSearchBar={false} />
      <div className="container p-3 my-9 flex items-center justify-center mx-auto w-full">
        <form
          onSubmit={handlePost}
          className="space-y-4 p-3 w-full max-w-md sm:max-w-lg md:max-w-2xl"
        >
          <div>
            <input
              type="text"
              name="title"
              id="title"
              value={post.title}
              onChange={handleChange}
              required
              placeholder="Enter a title"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <textarea
              name="content"
              id="content"
              rows="12"
              required
              value={post.content}
              onChange={handleChange}
              placeholder="Write your content here..."
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <button className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md">
            Publish
          </button>
        </form>
      </div>
    </>
  );
}
