export default function Card({ post, style }) {
  return (
    <div className={style}>
      <div className="post-author flex items-center">
        <span className="inline-block mr-2 bg-indigo-100 p-3 rounded-full">
          SK
        </span>
        <h2>Selam Kidane</h2>
      </div>

      <div className="post-header">
        <h1 className="font-bold text-xl">{post.title}</h1>
      </div>

      <div className="post-content">{post.content.substring(0, 90)} ...</div>

      <div className="post-info">
        <p>
          <span className="post-date text-sm text-gray-500">
            {post.created_at}
          </span>{" "}
          <span className="post-likes text-sm text-gray-500">
            {post.like_count} Likes
          </span>{" "}
          <span className="post-comments text-sm text-gray-500">
            {post.comment_count} Comments
          </span>
        </p>
      </div>
    </div>
  );
}
