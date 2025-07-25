import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiRequest } from "../utils/api";
import Navigationbar from "../components/Navigationbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandsClapping,
  faComment,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import UserInfo from "../components/UserInfo";

export default function PostDetails() {
  const { id } = useParams(); // <-- Get post ID from the URL
  const [post, setPost] = useState(null);
  const [followedIds, setFollowedIds] = useState([]);
  const [currentUser, setCurrentUser] = useState(-1);

  // save posts
  const handleSavingPost = async (post_id) => {
    const response = await fetch(
      `http://localhost:8000/posts/save/${post_id}`,
      {
        method: "POST",
        credentials: "include", // to send cookies for JWT
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("success saving post");
    } else {
      console.error("Failed to save the post");
    }
  };

  // Get current user
  useEffect(() => {
    const handleCurrentUser = async () => {
      const response = await apiRequest("http://localhost:8000/users/current", {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data);
      } else {
        console.error("Failed to fetch current user:", data.error);
      }
    };

    handleCurrentUser();
  }, []);

  useEffect(() => {
    const fetchFollowedIds = async () => {
      const response = await fetch(
        "http://localhost:8000/followers/following/ids",
        {
          method: "GET",
          credentials: "include", // to send cookies for JWT
        }
      );

      const data = await response.json();

      if (response.ok) {
        setFollowedIds(data.following_ids); // now you can compare these
        console.log("success following_ids");
      } else {
        console.error("Failed to fetch following ids");
      }
    };

    fetchFollowedIds();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await apiRequest(`http://localhost:8000/posts/${id}`, {
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

  if (!post) return <div className="p-4">Loading...</div>;

  const handleFollow = async (author_id) => {
    const response = await apiRequest(
      `http://localhost:8000/followers/${author_id}`,
      {
        method: "POST",
        credentials: "include", // includes JWT cookies
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("Successful following...");
    } else {
      console.error("Failed to follow:", post.user_id, data.error);
    }
  };

  const handleUnFollow = async (author_id) => {
    const response = await apiRequest(
      `http://localhost:8000/followers/${author_id}`,
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

  const formatDate = (dateString) => {
    const formattedDate = new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return formattedDate;
  };

  return (
    <>
      <Navigationbar showWriteButton={true} />
      <div className="container mt-10 mx-auto w-[1060px] w-[95%] lg:w-[80%] xl:w-[55%] p-8">
        <div className="post-headers">
          <h1 className="text-5xl w-200 font-bold box-content text-start">
            {post.title}
          </h1>
          <div className="text-sm w-100 my-5">
            <span className="author-name">
              <UserInfo userId={post.user_id} />
            </span>
            {currentUser["current_user"] != post.user_id &&
              (followedIds.includes(post.user_id) ? (
                <button
                  onClick={() => {
                    // unfollow post.user_id
                    handleUnFollow(post.user_id);
                    // Remove post.user_id from followedIds
                    setFollowedIds((prev) =>
                      prev.filter((id) => id !== post.user_id)
                    );
                  }}
                  className="inline-block ml-5 follow-btn bg-gray-200 p-2 w-20 rounded-full cursor-pointer"
                >
                  Following
                </button>
              ) : (
                <button
                  onClick={() => {
                    // follow post.user_id
                    handleFollow(post.user_id);
                    // Update UI state when a new author's id is added
                    setFollowedIds((prev) => [...prev, post.user_id]);
                  }}
                  className={`inline-block ml-5 follow-btn bg-gray-200 p-2 w-20 rounded-full cursor-pointer`}
                >
                  Follow
                </button>
              ))}
            <span className="created_at ml-5">
              {formatDate(post.created_at)}
            </span>
          </div>
        </div>
        <div className="claps-comments-wrapper">
          <div className="post-info border-y border-gray-200">
            <p className="p-2">
              <FontAwesomeIcon
                title="Leave Comment"
                icon={faComment}
                size="lg"
                className="text-gray-500 cursor-pointer"
              />
              <span className="post-comments text-sm text-gray-500 ml-1 mr-2">
                {post.comment_count}
              </span>{" "}
              <FontAwesomeIcon
                title="Like / Clap"
                icon={faHandsClapping}
                size="lg"
                className="text-gray-500 cursor-pointer"
              />
              <span className="post-likes text-sm text-gray-500 ml-1">
                {post.like_count}
              </span>{" "}
              <button
                onClick={() => {
                  handleSavingPost(post.id);
                }}
              >
                <FontAwesomeIcon
                  title="Save"
                  icon={faBookmark}
                  className="ml-2 text-gray-500 cursor-pointer"
                  style={{ color: "F2F2F2" }}
                />
              </button>
            </p>
          </div>
        </div>
        <div className="post-content-wrapper w-[1000px] mt-5">
          <p className="text-justify whitespace-pre-wrap py-5 pr-5">
            {post.content}
          </p>
        </div>
      </div>
    </>
  );
}
