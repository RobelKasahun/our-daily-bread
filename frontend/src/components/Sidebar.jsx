import { Link } from "react-router-dom";

export default function Sidebar() {
  const topics = [
    "Post Creation",
    "Image Upload",
    "User Authentication",
    "Like and Comment System",
    "Share via Link",
    "User Profile Pages",
    "Follow/Unfollow Users",
    "Save/Bookmark Posts",
    "Trending Posts Feed",
    "Hashtag - Based Search",
  ];

  const writers = [];
  return (
    <div className="sidebar float-right h-full">
      <div className="relative w-full h-full max-w-[20rem] flex-col border-l border-gray-200 p-4 text-gray-700">
        <div className="saved-stories">
          <div className="mx-3">
            <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Recently Saved
            </h5>
          </div>

          <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
            {topics.map((topic) => (
              <div
                role="button"
                className="flex items-center w-full p-1 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
              >
                <Link to={"#"}>{topic}</Link>
              </div>
            ))}
          </nav>
        </div>

        <div className="followers my-5">
          <div className="mx-3">
            <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Who to Follow
            </h5>
          </div>

          <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
            {topics.map((topic) => (
              <div
                role="button"
                className="flex items-center w-full p-1 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
              >
                <Link to={"#"}>{topic}</Link>
              </div>
            ))}
          </nav>
        </div>

        <div className="topic-for-you">
          <div className="mx-3">
            <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Topics for You
            </h5>
          </div>

          <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
            {topics.map((topic) => (
              <div
                role="button"
                className="flex items-center w-full p-1 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
              >
                <Link to={"#"}>{topic}</Link>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
