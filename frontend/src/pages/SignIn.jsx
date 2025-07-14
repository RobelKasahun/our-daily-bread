import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function SignIn() {
  const [signinErrorMessage, setSigninErrorMessage] = useState("");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      // current user authenticated successfully
      navigate("/contents", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await response.json();

      // Navigate to the Posts page on successfully sign in
      console.log(response.status);
      if (response.ok) {
        localStorage.setItem("access_token", data.access_token);
        navigate("/contents", { replace: true }); // Don't allow back to login
      } else {
        setSigninErrorMessage(data.error || "Login failed");
      }
    } catch (error) {
      setSigninErrorMessage("Network error");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 items-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            src="/images/holyshare-logo.png"
            alt="HolyShare"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            onSubmit={handleSignIn}
            autoComplete="off"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-2 block w-full rounded-md px-3 py-1.5 text-gray-900 shadow-sm outline outline-1 outline-gray-300 focus:outline-indigo-600"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-2 block w-full rounded-md px-3 py-1.5 text-gray-900 shadow-sm outline outline-1 outline-gray-300 focus:outline-indigo-600"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-white font-semibold hover:bg-indigo-500"
            >
              Sign in
            </button>
          </form>

          {signinErrorMessage && (
            <p className="mt-4 text-center text-sm text-red-500">
              {signinErrorMessage}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            Not a member?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-500 font-semibold"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
