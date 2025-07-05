import Home from "./pages/Home.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn.jsx";
import Navbar from "./components/Navbar.jsx";
import Register from "./pages/Register.jsx";
import Posts from "./pages/Posts.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts" element={<Posts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
