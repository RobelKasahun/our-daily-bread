import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { API_BASE_URL } from "../utils/config";
import { apiRequest } from "../utils/api";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await apiRequest(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      const data = response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Something went wrong. Try again.");
    }
  };
  return (
    <>
      <Navbar />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 items-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            src="/images/dailybread-logo.png"
            alt="DailyBread"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold text-gray-900">
            Forgot Password
          </h2>
          <p className="text-center">
            Type your email address, so we can send you reset instructions.
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            // onSubmit={handleSignIn}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 block w-full rounded-md px-3 py-1.5 text-gray-900 shadow-sm outline outline-1 outline-gray-300 focus:outline-indigo-600"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-white font-semibold hover:bg-indigo-500 cursor-pointer"
            >
              Reset My Password
            </button>
          </form>
          {message && (
            <p className="mt-4 text-center text-sm text-red-500">{message}</p>
          )}
        </div>
      </div>
    </>
  );
}
