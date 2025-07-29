import Footer from "../components/Footer";
import Navigationbar from "../components/Navigationbar";
import Card from "../components/Card";

import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { ToastContainer, toast, Bounce } from "react-toastify";
import _ from "lodash"; // for shuffling a list
import CircleLoader from "react-spinners/CircleLoader";
import UserInfo from "../components/UserInfo";

export default function Profile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [current_user, setCurrentUser] = useState(-1);
  const [followedIds, setFollowedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const slicedPosts = posts.slice(0, 7);

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

  // Get a user
  useEffect(() => {
    const handleUser = async () => {
      if (!current_user || current_user === undefined || current_user === -1)
        return;

      console.log(`current_user: ${current_user}`);

      const response = await apiRequest(
        `http://localhost:8000/users/${current_user}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data);
      } else {
        console.error("Failed to fetch current user:", data.error);
      }
    };

    handleUser();
  }, []);

  // load all your posts
  useEffect(() => {
    const handlePosts = async (e) => {
      setLoading(true);

      const response = await apiRequest(`http://localhost:8000/posts/all`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setPosts(data);
      } else {
        console.error("Failed to fetch posts:", data.error);
      }

      setLoading(false);
    };

    handlePosts();
  }, []);

  const notify = () => toast("Wow so easy !");

  // Get all followed ids
  useEffect(() => {
    const fetchFollowingIds = async () => {
      const response = await fetch(
        `http://localhost:8000/followers/following/ids`,
        {
          method: "GET",
          credentials: "include", // to send cookies for JWT
        }
      );

      const data = await response.json();

      if (response.ok) {
        setFollowedIds(data.following_ids); // now you can compare these
      } else {
        console.error("Failed to fetch following ids");
      }
    };

    fetchFollowingIds();
  }, []);

  const getStyling = (index) => {
    const responsiveStyle =
      "w-full max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl xl:max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8";
    if (index == slicedPosts.length - 1) {
      return `card px-8 pt-8 pb-2 my-3 pb-8 w-160 ${responsiveStyle}`;
    }
    return `card border-b border-gray-200 px-8 pt-8 pb-2 my-3 pb-8 ${responsiveStyle}`;
  };

  return (
    <>
      <Navigationbar showSearchBar={false} showWriteButton={true} />
      <div className="container mx-auto w-[95%] lg:w-[80%] xl:w-[76%] border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 border-l border-r border-gray-200">
          {/* Posts Section */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            <div className="username border-b border-gray-200"></div>
            {loading && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
                <CircleLoader loading size={100} speedMultiplier={2} />
              </div>
            )}
            <div className="post">
              {slicedPosts.length > 0 &&
                slicedPosts.map((post, index) => (
                  <Link to={`/contents/${post.id}`} key={post.id}>
                    <Card
                      key={post.id}
                      user_id={post.user_id}
                      post={post}
                      style={getStyling(index)}
                    />
                  </Link>
                ))}
            </div>
          </div>

          <div className="sidebar float-right h-full">
            <div className="relative w-full h-full max-w-[20rem] flex-col border-l border-gray-200 p-4 text-gray-700">
              <div className="profile-avatar mx-3 mb-3 bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold text-gray-700">
                {user}
              </div>

              <div className="username mx-3">
                {<UserInfo userId={userId} />}
              </div>

              <div className="followers my-5">
                <div className="mx-3">
                  <h2 className="block font-sans text-lg antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                    Following ({followedIds.length})
                  </h2>
                </div>

                <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
                  {followedIds.length > 0 &&
                    followedIds.map(
                      (author) =>
                        author.id !== current_user && (
                          <div key={author}>
                            <div
                              key={author}
                              role="button"
                              className="flex items-center justify-between w-full p-1 text-sm rounded-lg hover:bg-blue-100"
                            >
                              <Link to={`/profile/${author}`} key={author}>
                                <UserInfo userId={author} />
                              </Link>
                            </div>
                          </div>
                        )
                    )}
                  {/* <Link to={"/writers"} className="text-sm p-1">
                    See all ({followedIds.length})
                  </Link> */}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
