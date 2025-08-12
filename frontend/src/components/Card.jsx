import UserInfo from "./UserInfo";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { apiRequest } from "../utils/api";
import { API_BASE_URL } from "../utils/config";

export default function Card({ post, style, user_id }) {
  const [postResponses, setPostResponses] = useState([]);

  // Get all comments that belongs to the post_id
  useEffect(() => {
    const handlePostResponses = async () => {
      const response = await apiRequest(
        `${API_BASE_URL}/comments/${post.id}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPostResponses(data);
      } else {
        console.error(
          `Failed to load all the responses that belongs to post_id with post id: ${id}`,
          data.error
        );
      }
    };

    handlePostResponses();
  }, []);

  const formatDate = (dateString) => {
    const formattedDate = new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return formattedDate;
  };
  return (
    <div className="card-wrapper w-full max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl xl:max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className={style}>
        <div className="post-author flex items-center">
          {/* <span className="inline-block mr-2 bg-indigo-100 p-3 rounded-full">
          {"Av"}
        </span> */}
          <h2>
            <UserInfo userId={user_id} />
          </h2>
        </div>

        <div className="post-header">
          <h1 className="font-bold text-3xl mt-3">{post.title}</h1>
        </div>

        <div className="post-content text-gray-500 mt-2">
          {post.content.substring(0, 90)} ...
        </div>

        <div className="post-info">
          <p className="mt-3">
            <span className="post-date text-sm text-gray-500 mr-4">
              {formatDate(post.created_at)}
            </span>{" "}
            <FontAwesomeIcon
              icon={faComment}
              size="lg"
              className="text-gray-500"
            />
            <span className="post-comments text-sm text-gray-500 ml-1 mr-4">
              {post.comment_count}
            </span>{" "}
            <FontAwesomeIcon
              icon={faHeart}
              size="lg"
              className="text-gray-500"
            />
            <span className="post-likes text-sm text-gray-500 ml-1">
              {post.like_count}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
