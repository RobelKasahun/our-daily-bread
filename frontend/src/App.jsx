import Home from "./pages/Home.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn.jsx";
import Navbar from "./components/Navbar.jsx";
import Register from "./pages/Register.jsx";
import Posts from "./pages/Posts.jsx";
import { Navigate } from "react-router-dom";
import SignOut from "./pages/SignOut.jsx";
import PublicRoute from "./routes/PublicRoutes.jsx";
import Post from "./pages/Post.jsx";
import PostDetails from "./pages/PostDetails.jsx";
import SavedPosts from "./pages/SavedPosts.jsx";
import Writers from "./pages/Writers.jsx";
import Profile from "./pages/Profile.jsx";
import Story from "./pages/Story.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route path="/signout" element={<SignOut />} />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="/contents" element={<Posts />} />
        <Route path="/new-post" element={<Post />} />
        <Route path="/contents/:id" element={<PostDetails />} />
        <Route path="/saved-posts" element={<SavedPosts />} />
        <Route path="/writers" element={<Writers />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/your-stories" element={<Story />} />
        <Route path="/users/:userId" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
