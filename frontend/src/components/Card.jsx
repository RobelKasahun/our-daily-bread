export default function Card({ post }) {
  return (
    <div className="card border-b border-gray-200 px-5 pt-5 pb-1 my-3 w-200">
      <div className="post-author flex items-center">
        <span className="inline-block mr-2 bg-indigo-100 p-3 rounded-full">
          SK
        </span>
        <h2>Selam Kidane</h2>
      </div>
      <div className="post-header">
        <h1 className="font-bold text-xl">{post.title}</h1>
      </div>
      <div className="post-content">
        Anyone who’s ever used a keyboard trying to get stuff done on a computer
        should know the seven foundational data structures of...
      </div>

      <div className="post-info">
        <p>
          <span className="post-date text-sm text-gray-500">June 10, 2025</span>{" "}
          <span className="post-likes text-sm text-gray-500">103 Likes</span>{" "}
          <span className="post-comments text-sm text-gray-500">
            103 Comments
          </span>
        </p>
      </div>
    </div>
  );
}
