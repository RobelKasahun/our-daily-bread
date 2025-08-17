import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { ToastContainer, toast, Bounce } from "react-toastify";
import _ from "lodash"; // for shuffling a list
import { API_BASE_URL } from "../utils/config";

export default function Sidebar() {
  const [authors, setAuthors] = useState([]);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(-1);
  const [followedIds, setFollowedIds] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

  const slicedPosts = posts.slice(0, 7);
  const slicedAuthors = authors.slice(0, 7);
  const slicedSavedPosts = savedPosts.slice(0, 7);
  const topicsForYou = _.shuffle(slicedPosts);

  // load users
  useEffect(() => {
    const handleUsers = async (e) => {
      const response = await apiRequest(`${API_BASE_URL}/users`, {
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
      const response = await apiRequest(`${API_BASE_URL}/posts`, {
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

  // Get current user
  useEffect(() => {
    const handleCurrentUser = async () => {
      const response = await apiRequest(`${API_BASE_URL}/users/current`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data.current_user);
      } else {
        console.error("Failed to fetch current user:", data.error);
      }
    };

    handleCurrentUser();
  }, []);

  // handle follow
  const handleFollow = async (author_id) => {
    const response = await apiRequest(
      `${API_BASE_URL}/followers/${author_id}`,
      {
        method: "POST",
        credentials: "include", // includes JWT cookies
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("Successful following...");
    } else {
      console.error("Failed to follow:", author_id, data.error);
    }
  };

  // handle unfollow
  const handleUnFollow = async (author_id) => {
    console.log("author_id:", author_id);
    const response = await apiRequest(
      `${API_BASE_URL}/followers/${author_id}`,
      {
        method: "DELETE",
        credentials: "include", // includes JWT cookies
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("Successful unfollowing...");
    } else {
      console.error("Failed to unfollow:", author_id, data.error);
    }
  };

  const notify = () => toast("Wow so easy !");

  // Get all followed ids
  useEffect(() => {
    if (!currentUser || currentUser === undefined || currentUser === -1) return;
    const fetchFollowedIds = async () => {
      const response = await fetch(
        `${API_BASE_URL}/followers/following/ids/${currentUser}`,
        {
          method: "GET",
          credentials: "include", // to send cookies for JWT
        }
      );

      const data = await response.json();

      if (response.ok) {
        setFollowedIds(data.following_ids); // now you can compare these
        // console.log("success following_ids");
      } else {
        console.error("Failed to fetch following ids");
      }
    };

    fetchFollowedIds();
  }, [currentUser]);

  return (
    <div className="sidebar hidden lg:block float-right h-full">
      <div className="relative w-full h-full max-w-[20rem] flex-col border-l border-gray-200 p-4 text-gray-700">
        <div className="saved-stories">
          <div className="mx-3">
            <h2 className="block font-sans text-lg antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Recently Saved
            </h2>
          </div>

          <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
            {slicedSavedPosts.map((post) => (
              <div
                key={post.id}
                role="button"
                className="flex items-center text-sm w-full p-1 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
              >
                <Link to={`/contents/${post.id}`}>
                  <h1 className="font-bold text-black">{post.title}</h1>
                </Link>
              </div>
            ))}
            <Link to={"/saved-posts"} className="text-sm p-1">
              See all ({savedPosts.length})
            </Link>
          </nav>
        </div>

        <div className="followers my-5">
          <div className="mx-3">
            <h2 className="block font-sans text-lg antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Who to Follow
            </h2>
          </div>

          <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
            {slicedAuthors.map(
              (author) =>
                author.id !== currentUser && (
                  <div key={author.id}>
                    <div
                      key={author.id}
                      role="button"
                      className="flex items-center justify-between w-full p-1 text-sm rounded-lg hover:bg-blue-100"
                    >
                      <Link to={`/profile/${author.id}`} key={author.id}>
                        {author.first_name} {author.last_name}
                      </Link>

                      {followedIds.includes(author.id) ? (
                        <button
                          onClick={() => {
                            // follow author.id
                            handleUnFollow(author.id);
                            // Remove author.id from followedIds
                            setFollowedIds((prev) =>
                              prev.filter((id) => id !== author.id)
                            );
                          }}
                          className={`px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-700 cursor-pointer`}
                        >
                          Following
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            // follow author.id
                            handleFollow(author.id);
                            // Update UI state when a new author's id is added
                            setFollowedIds((prev) => [...prev, author.id]);
                          }}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 cursor-pointer"
                        >
                          Follow
                        </button>
                      )}
                    </div>
                  </div>
                )
            )}
            <Link to={"/writers"} className="text-sm p-1">
              {/* execlude the logged in current user */}
              See all ({authors.length - 1})
            </Link>
          </nav>
        </div>

        <div className="topic-for-you">
          <div className="mx-3">
            <h2 className="block font-sans text-lg antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Topics for You
            </h2>
          </div>

          <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
            {topicsForYou.map((post) => (
              <div
                key={post.id}
                role="button"
                className="flex items-center text-sm w-full p-1 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
              >
                <Link to={`#`}>
                  <h1 className="font-bold text-black">{post.title}</h1>
                </Link>
              </div>
            ))}
            <Link to={"#"} className="text-sm p-1">
              See all ({posts.length})
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
