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
            <span className="follow">
              <form action="#" className="inline-block ml-5">
                <button className="follow-btn bg-gray-200 p-2 w-20 rounded-full cursor-pointer">
                  Follow
                </button>
              </form>
            </span>
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
              <FontAwesomeIcon
                title="Save"
                icon={faBookmark}
                className="ml-2 text-gray-500 cursor-pointer"
                style={{ color: "F2F2F2" }}
              />
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
