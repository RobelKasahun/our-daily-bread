import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigationbar from "../components/Navigationbar";

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
    const response = await fetch("http://localhost:8000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(post),
    });

    const data = await response.json();
    console.log(response.status);
    console.log(localStorage.getItem("access_token"));
    if (response.ok) {
      navigate("/contents");
    } else {
      console.error("Registration failed:", data.error);
      //   setRegistrationErrorMessage(data.error);
    }
  };

  return (
    <>
      <Navigationbar showSearchBar={false} />
      <div className="container p-3 my-9 flex items-center justify-center mx-auto w-fit">
        <form
          onSubmit={handlePost}
          className="space-y-4 items-center justify-center p-3 w-300"
        >
          <div>
            <input
              type="text"
              name="title"
              id="title"
              value={post.title}
              onChange={handleChange} // <-- update state on change
              required
              placeholder="Enter a title"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-0"
            />
          </div>

          <div>
            <textarea
              name="content"
              id="content"
              rows="26"
              required
              value={post.content}
              onChange={handleChange} // <-- update state on change
              placeholder="Write your content here..."
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-0 resize-none"
            />
          </div>
          <button
            className="bg-gray-900 text-white text-gray-300 hover:bg-gray-700
                  hover:text-white rounded-md px-3 py-2 text-sm font-medium bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          >
            Publish
          </button>
        </form>
      </div>
    </>
  );
}
