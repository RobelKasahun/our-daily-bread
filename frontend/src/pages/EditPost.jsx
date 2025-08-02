import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigationbar from "../components/Navigationbar";
import { apiRequest } from "../utils/api";

export default function Post() {
  const navigate = useNavigate();
  const { postId } = useParams();

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

  useEffect(() => {
    // wait until the post id contains actual post ID
    if (post === undefined) return;
    const handleLoadingPost = async () => {
      const response = await apiRequest(
        `http://localhost:8000/posts/${postId}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Get a post
        setPost(data);
        console.log(`Post has been loaded successfully.`);
      } else {
        console.error(
          `Failed to get the post with postID: ${postId}: ${data.error}`
        );
      }
    };

    handleLoadingPost();
  }, []);

  console.log(`postID: ${postId}`);

  // edit a post
  const editPost = async () => {
    const response = await apiRequest(`http://localhost:8000/posts/${postId}`, {
      method: "PUT",
      body: JSON.stringify({
        title: post.title,
        content: post.content,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // post has been edited successfully
      // navigate to the contents / posts page
      console.log(`post has been edited successfully`);
      navigate("/contents", { replace: true });
    } else {
      // failed to edit post
      console.error(`failed to edit post: ${data.error}`);
    }
  };

  return (
    <>
      <Navigationbar showSearchBar={false} />
      <div className="container p-3 my-9 flex items-center justify-center mx-auto w-fit">
        <form
          className="space-y-4 items-center justify-center p-3 w-300"
          onSubmit={(e) => {
            e.preventDefault(); // stops the page from refreshing.
            editPost();
          }}
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
            type="submit"
            className="bg-gray-900 text-white text-gray-300 hover:bg-gray-700 cursor-pointer
                  hover:text-white rounded-md px-3 py-2 text-sm font-medium bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          >
            Publish Edit
          </button>
        </form>
      </div>
    </>
  );
}
