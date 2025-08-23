import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiRequest } from "../utils/api";
import Navigationbar from "../components/Navigationbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserInfo from "../components/UserInfo";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { Link } from "react-router-dom";
import EditResponseModal from "../components/EditResponseModal";
import { API_BASE_URL } from "../utils/config";
import HashLoader from "react-spinners/HashLoader";
import {
  faHeart,
  faComment,
  faBookmark,
  faTrash,
  faEdit,
  faArrowLeft,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

export default function PostDetails() {
  const { id } = useParams(); // <-- Get post ID from the URL
  const [post, setPost] = useState(null);
  const [followedIds, setFollowedIds] = useState([]);
  const [currentUser, setCurrentUser] = useState(-1);
  const [savedPostsIds, setSavedPostsIds] = useState([]);
  const [likesPostsIds, setLikesPostsIds] = useState([]);
  const [showResponses, setShowResponses] = useState(false);
  const [responseData, setResponseData] = useState("");
  const [postResponses, setPostResponses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postResponse, setPostResponse] = useState("");
  const [commentId, setCommentId] = useState(-1);

  const navigate = useNavigate();

  const toggleResponses = () => setShowResponses((prev) => !prev);

  // Get all comments that belongs to the post_id
  useEffect(() => {
    const handlePostResponses = async () => {
      const response = await apiRequest(`${API_BASE_URL}/comments/${id}`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        if (Array.isArray(data)) {
          // data is of type Array
          setPostResponses(data);
        } else {
          //
          setPostResponses([]);
        }
      } else {
        console.error(
          `Failed to load all the responses that belongs to post_id with post id: ${id}`,
          data.error
        );
      }
    };

    handlePostResponses();
  }, []);

  // leave comment on a post
  const handlePostResponse = async (post_id) => {
    const response = await apiRequest(`${API_BASE_URL}/comments/${post_id}`, {
      method: "POST",
      body: JSON.stringify({
        content: responseData,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Add new response to list
      setPostResponses((prevResponses) => [...prevResponses, data]);
      setResponseData("");
    } else {
      console.error(
        `Failed to leave a response on post with post id: ${post_id}`,
        data.error
      );
    }
  };

  // Get all the saved posts
  useEffect(() => {
    const handleSavedPosts = async () => {
      const response = await apiRequest(`${API_BASE_URL}/posts/saved`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        // extract all ids of the saved posts
        setSavedPostsIds(data.map((post) => post.id));
      } else {
        console.error("Failed to fetch saved posts ids:", data.error);
      }
    };

    handleSavedPosts();
  }, []);

  // save posts
  const handleSavingPost = async (post_id) => {
    const response = await fetch(`${API_BASE_URL}/posts/save/${post_id}`, {
      method: "POST",
      credentials: "include", // to send cookies for JWT
    });

    const data = await response.json();

    if (response.ok) {
      // success saving post"
    } else {
      console.log("Failed to save the post");
    }
  };

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
  }, [API_BASE_URL]);

  useEffect(() => {
    if (currentUser <= 0) return;
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
        setFollowedIds(data.following_ids);
      } else {
        console.error("Failed to fetch following ids");
      }
    };

    fetchFollowedIds();
  }, [currentUser, API_BASE_URL]);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await apiRequest(`${API_BASE_URL}/posts/${id}`, {
        method: "GET",
      });

      const data = await res.json();

      if (res.ok) {
        setPost(data);
      } else {
        console.error("Error loading post:", data.error);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchPostLikingIds = async (post_id) => {
      const res = await apiRequest(
        `${API_BASE_URL}/likes/${post_id}/liking_ids`,
        {
          method: "GET",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setLikesPostsIds(data);
      } else {
        console.error("Error loading liking user ids:", data.error);
      }
    };

    fetchPostLikingIds(id);
  }, [id]);

  const handleLikePost = async (post_id) => {
    const res = await apiRequest(`${API_BASE_URL}/likes/${post_id}`, {
      method: "POST",
    });

    const data = await res.json();

    if (res.ok) {
      // post has been liked
    } else {
      console.error("Error loading post:", data.error);
    }
  };

  if (!post)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
        <HashLoader size={55} />
      </div>
    );

  const handleFollow = async (author_id) => {
    const response = await apiRequest(
      `${API_BASE_URL}/followers/${author_id}`,
      {
        method: "POST",
      }
    );

    const data = await response.json();

    if (response.ok) {
      // Successful following
    } else {
      console.error("Failed to follow:", post.user_id, data.error);
    }
  };

  const handleUnFollow = async (author_id) => {
    const response = await apiRequest(
      `${API_BASE_URL}/followers/${author_id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (response.ok) {
      // Successful unfollowing
    } else {
      console.error("Failed to unfollow:", author_id, data.error);
    }
  };

  const deletePost = async (post_id) => {
    const response = await apiRequest(`${API_BASE_URL}/posts/${post_id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (response.ok) {
      // when successfully deleted, navigate to the contents page
      navigate("/contents", { replace: true });
    } else {
      console.error("Failed to delete post:", author_id, data.error);
    }
  };

  const deleteResponse = async (commentId, postId) => {
    // commentId/postId
    const response = await apiRequest(
      `${API_BASE_URL}/comments/posts/${postId}/comments/${commentId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (response.ok) {
      setPostResponses((prev) =>
        prev.filter((comment) => comment.id !== commentId)
      );
    } else {
      console.error(
        "Failed to delete the comment:",
        commentId,
        postId,
        data.error
      );
    }
  };

  const editResponse = async (postId, commentId) => {
    const response = await apiRequest(
      `${API_BASE_URL}/comments/posts/${postId}/comments/${commentId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          content: postResponse,
        }),
      }
    );

    const data = await response.json();

    console.log(data);

    if (response.ok) {
      // Update the response in the local state immediately
      setPostResponses((prevResponses) =>
        prevResponses.map((response) =>
          response.id === commentId
            ? { ...response, content: postResponse }
            : response
        )
      );
      return true;
    } else {
      console.error("Failed to update response");
      return false;
    }
  };

  const handleSave = async () => {
    // Save logic (API call)
    const successResponse = await editResponse(id, commentId);
    if (successResponse) setIsModalOpen(false);
  };

  // date and time formatter
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const notify = (message) => {
    const toastId = "save-success";

    if (!toast.isActive(toastId)) {
      toast.success(message, {
        toastId,
      });
    }
  };

  const notifyAlready = (message) => {
    const toastId = "already-saved";

    if (!toast.isActive(toastId)) {
      toast.info(message, {
        toastId,
      });
    }
  };

  return (
    <>
      <Navigationbar showWriteButton={true} showSearchBar={false} />
      <div className="container mt-10 mx-auto w-full px-4 sm:w-[95%] lg:w-4/5 xl:w-3/5">
        <Link to={`/contents`}>
          <FontAwesomeIcon
            title="Back"
            icon={faArrowLeft}
            className="ml-2 text-gray-500 cursor-pointer mb-6 relative text-2xl sm:text-3xl md:text-4xl right-2 sm:right-4 md:right-6"
            style={{ color: "#06100d" }}
          />
        </Link>

        <div className="post-headers">
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-3 break-words text-start">
            {post.title}
          </h1>
          <div className="text-sm flex flex-wrap items-center gap-3 my-5">
            <span className="author-name">
              <UserInfo userId={post.user_id} />
            </span>
            {currentUser !== post.user_id &&
              (followedIds.includes(post.user_id) ? (
                <button
                  onClick={() => {
                    handleUnFollow(post.user_id);
                    setFollowedIds((prev) =>
                      prev.filter((id) => id !== post.user_id)
                    );
                    notify("Successful unfollowing...");
                  }}
                  className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  Following
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleFollow(post.user_id);
                    setFollowedIds((prev) => [...prev, post.user_id]);
                    notify("Successful following...");
                  }}
                  className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  Follow
                </button>
              ))}
            <span className="created_at">{formatDate(post.created_at)}</span>
          </div>
        </div>

        <div className="claps-comments-wrapper">
          <div className="post-info border-y border-gray-200">
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center space-x-3">
                <button onClick={toggleResponses}>
                  <FontAwesomeIcon
                    title="Leave Comment"
                    icon={faComment}
                    size="lg"
                    className="text-gray-500 cursor-pointer"
                  />
                </button>
                <span className="text-sm text-gray-500">
                  {postResponses.length > 0 ? postResponses.length : 0}
                </span>
                <button
                  onClick={() => {
                    handleLikePost(post.id);
                    if (likesPostsIds.includes(currentUser)) {
                      setLikesPostsIds((prev) =>
                        prev.filter((id) => id !== currentUser)
                      );
                      setPost((prev) => ({
                        ...prev,
                        like_count:
                          prev.like_count > 0 ? prev.like_count - 1 : 0,
                      }));
                      notifyAlready("Post unliked");
                    } else {
                      setLikesPostsIds((prev) => [...prev, currentUser]);
                      setPost((prev) => ({
                        ...prev,
                        like_count: prev.like_count + 1,
                      }));
                      notify(`Success! post liked`);
                    }
                  }}
                >
                  <FontAwesomeIcon
                    title="Clap"
                    icon={faHeart}
                    size="lg"
                    className="text-gray-500 cursor-pointer"
                  />
                </button>
                <span className="text-sm text-gray-500">{post.like_count}</span>
              </div>

              <div className="flex items-center space-x-2">
                {currentUser !== post.user_id && (
                  <button
                    onClick={() => {
                      !savedPostsIds.includes(post.id)
                        ? notify("Post saved!")
                        : notifyAlready("Post already saved");
                      handleSavingPost(post.id);
                    }}
                  >
                    <FontAwesomeIcon
                      title="Save"
                      icon={faBookmark}
                      className="text-gray-500 cursor-pointer"
                    />
                  </button>
                )}
                {currentUser === post.user_id && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        navigate(`/edit-post/${post.id}`);
                      }}
                    >
                      <FontAwesomeIcon
                        title="Edit"
                        icon={faEdit}
                        className="text-gray-500 cursor-pointer"
                      />
                    </button>
                    <button
                      onClick={() => {
                        deletePost(post.id);
                      }}
                    >
                      <FontAwesomeIcon
                        title="Delete"
                        icon={faTrash}
                        className="text-gray-500 cursor-pointer"
                      />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <ToastContainer
            position="top-center"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
        </div>

        <div className="post-content-wrapper w-full mt-5">
          <p className="text-justify whitespace-pre-wrap py-5 pr-2 sm:pr-5">
            {post.content}
          </p>
        </div>
      </div>

      {/* Responses Section */}
      {showResponses && (
        <div className="fixed top-0 right-0 w-full sm:w-[400px] h-screen bg-white shadow-lg overflow-y-auto p-4 z-50">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
            <h1 className="text-base sm:text-lg font-semibold">
              Responses{" "}
              {"(" +
                (postResponses.length > 0 ? postResponses.length : 0) +
                ")"}
            </h1>

            <button onClick={toggleResponses}>
              <FontAwesomeIcon
                title="Close"
                icon={faXmark}
                size="lg"
                className="text-gray-500 cursor-pointer hover:text-gray-700"
              />
            </button>
          </div>

          <textarea
            required
            name="comment"
            className="w-full p-2 border border-gray-200 rounded resize-none h-32 sm:h-44 text-sm"
            value={responseData}
            onChange={(e) => setResponseData(e.target.value)}
            placeholder="What are your thoughts?"
          ></textarea>

          <div className="flex justify-end">
            <button
              className="mt-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer text-sm"
              onClick={() => {
                handlePostResponse(post.id);
                setResponseData((prev) => [...prev, post.user_id]);
              }}
            >
              Respond
            </button>
          </div>

          <div className="mt-9 space-y-3">
            {postResponses.length > 0 &&
              postResponses.map((response) => (
                <div key={response.id} className="p-3 bg-white shadow rounded">
                  <div className="text-sm text-gray-700 flex justify-between flex-wrap gap-2">
                    <div className="flex flex-wrap gap-2">
                      <span className="font-bold">
                        <UserInfo userId={response.user_id} />
                      </span>
                      <span>{formatDate(response.created_at)}</span>
                    </div>

                    {response.user_id === currentUser && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            deleteResponse(response.id, response.post_id);
                          }}
                        >
                          <FontAwesomeIcon
                            title="Delete"
                            icon={faTrash}
                            className="text-gray-500 cursor-pointer"
                            style={{ color: "#06100d" }}
                          />
                        </button>
                        <button
                          onClick={() => {
                            setIsModalOpen(true);
                            setCommentId(response.id);
                          }}
                        >
                          <FontAwesomeIcon
                            title="Edit"
                            icon={faPenToSquare}
                            className="text-gray-500 cursor-pointer"
                            style={{ color: "#06100d" }}
                          />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-800 break-words">
                    {response.content}
                  </p>
                </div>
              ))}

            <EditResponseModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSave}
              value={postResponse}
              setValue={setPostResponse}
              postId={id}
              currentUserId={currentUser}
              commentId={commentId}
            />
          </div>
        </div>
      )}
    </>
  );
}
