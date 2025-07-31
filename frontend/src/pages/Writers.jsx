import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";
import Navigationbar from "../components/Navigationbar";

export default function Writers() {
  const [authors, setAuthors] = useState([]);
  const [currentUser, setCurrentUser] = useState(-1);
  const [followedIds, setFollowedIds] = useState([]);

  // Get all followed ids
  useEffect(() => {
    if (!currentUser || currentUser === undefined || currentUser === -1) return;
    const fetchFollowedIds = async () => {
      const response = await fetch(
        `http://localhost:8000/followers/following/ids/${currentUser}`,
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
  }, [currentUser]);

  // Get current user
  useEffect(() => {
    const handleCurrentUser = async () => {
      const response = await apiRequest("http://localhost:8000/users/current", {
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
  // load users
  useEffect(() => {
    const handleUsers = async (e) => {
      const response = await apiRequest("http://localhost:8000/users", {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setAuthors(data);
        console.log(`slicedAuthors.length: ${authors.length}`);
      } else {
        console.error("Failed to fetch users:", data.error);
      }
    };

    handleUsers();
  }, []);

  // handle follow
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
      console.error("Failed to follow:", author_id, data.error);
    }
  };

  // handle unfollow
  const handleUnFollow = async (author_id) => {
    console.log("author_id:", author_id);
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

  return (
    <>
      <Navigationbar showWriteButton={true} showSearchBar={false} />
      <div className="container m-auto xl:max-w-[1000px]">
        <div className="followers my-18">
          <div className="mx-3">
            <h2 className="block font-sans text-lg text-center antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Follow writers
            </h2>
            {/* {author.id !== current_user["current_user"] && true} */}
          </div>

          <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
            {authors.map(
              (author) =>
                author.id !== currentUser && (
                  <div key={author.id}>
                    <div
                      key={author.id}
                      role="button"
                      className="flex items-center justify-between w-full p-1 text-sm rounded-lg hover:bg-blue-100 border-b border-gray-200"
                    >
                      <Link to={`/followers/${author.id}`} key={author.id}>
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
          </nav>
        </div>
      </div>
    </>
  );
}
