// Credit: ChatGPT
import { useEffect, useRef, useState } from "react";
import { apiRequest } from "../utils/api";
import { API_BASE_URL } from "../utils/config";

export default function EditResponseModal({
  isOpen,
  onClose,
  onSave,
  value,
  setValue,
  postId,
  currentUserId,
  commentId,
}) {
  const modalRef = useRef();

  // load comment using commentId
  useEffect(() => {
    if (commentId === -1) return;

    const handleCurrentComment = async () => {
      const response = await apiRequest(
        `${API_BASE_URL}/comments/api/${commentId}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setValue(data.content);
      } else {
        console.error("Failed to fetch current comment:", data.error);
      }
    };

    handleCurrentComment();
  }, [commentId]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    }

    function handleEsc(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold">Edit Response</h2>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full h-32 border rounded-md p-2 border-gray-200 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            Edit Response
          </button>
        </div>
      </div>
    </div>
  );
}
