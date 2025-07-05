export default function Posts() {
  const handlePosts = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Registration successful!", data);
    } else {
      console.error("Registration failed:", data.error);
    }
  };
  return (
    <>
      <h1>POSTS</h1>
    </>
  );
}
