import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ResetPassword() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-sm">
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

          <div className="mt-10">
            <form className="space-y-6" autoComplete="off">
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
          </div>
        </div>
      </div>
    </>
  );
}
