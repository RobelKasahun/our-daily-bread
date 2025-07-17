import { MdOutlineModeComment } from "react-icons/md";
import UserInfo from "./UserInfo";
import { useState } from "react";

export default function Card({ post, style, user_id }) {
  const formatDate = (dateString) => {
    const formattedDate = new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return formattedDate;
  };
  return (
    <div className={style}>
      <div className="post-author flex items-center">
        <span className="inline-block mr-2 bg-indigo-100 p-3 rounded-full">
          {"Av"}
        </span>
        <h2>
          <UserInfo userId={user_id} />
        </h2>
      </div>

      <div className="post-header">
        <h1 className="font-bold text-xl">{post.title}</h1>
      </div>

      <div className="post-content text-gray-500">
        {post.content.substring(0, 90)} ...
      </div>

      <div className="post-info">
        <p>
          <span className="post-date text-sm text-gray-500 mr-4">
            {formatDate(post.created_at)}
          </span>{" "}
          <span className="post-comments text-sm text-gray-500 mr-4">
            {post.comment_count > 1
              ? `${post.comment_count} comments`
              : `${post.comment_count} comment`}
          </span>{" "}
          <span className="post-likes text-sm text-gray-500">
            {post.like_count > 1
              ? `${post.like_count} Likes`
              : `${post.like_count} Like`}
          </span>
        </p>
      </div>
    </div>
  );
}
