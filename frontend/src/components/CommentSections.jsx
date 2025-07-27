import { useState } from "react";

export default function CommentSections() {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const fakeComments = [
    { id: 1, username: "Alice", content: "This post was really insightful!" },
    { id: 2, username: "Bob", content: "I have a different opinion." },
    { id: 3, username: "Charlie", content: "Looking forward to more posts!" },
  ];

  const toggleComments = () => setShowComments((prev) => !prev);

  const handleCommentSubmit = () => {
    if (commentText.trim() === "") return;
    alert(`Comment submitted: ${commentText}`);
    setCommentText("");
  };

  return (
    <>
      <button
        onClick={toggleComments}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {showComments ? "Hide Comments" : "Show Comments"}
      </button>

      {showComments && (
        <div className="fixed top-0 right-0 w-[400px] h-screen bg-gray-100 shadow-lg overflow-y-auto p-4">
          <h1 className="text-lg font-semibold text-black mb-4">
            Responses ({fakeComments.length})
          </h1>

          <div className="mb-6">
            <textarea
              className="w-full p-2 border rounded resize-none h-24"
              placeholder="Write a response..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleCommentSubmit}
              >
                Respond
              </button>
            </div>
          </div>

          {fakeComments.map((comment) => (
            <div
              key={comment.id}
              className="mb-4 p-3 bg-white rounded-lg shadow"
            >
              <p className="text-sm font-bold text-gray-700">
                {comment.username}
              </p>
              <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
