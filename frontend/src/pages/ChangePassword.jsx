import Navbar from "../components/Navbar";

export default function ChangePassword() {
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
            Reset Password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            // onSubmit={handleSignIn}
            autoComplete="off"
          >
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
                // value={form.email}
                // onChange={handleChange}
                required
                className="mt-2 block w-full rounded-md px-3 py-1.5 text-gray-900 shadow-sm outline outline-1 outline-gray-300 focus:outline-indigo-600"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Confirm Password
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                // value={form.password}
                // onChange={handleChange}
                required
                className="mt-2 block w-full rounded-md px-3 py-1.5 text-gray-900 shadow-sm outline outline-1 outline-gray-300 focus:outline-indigo-600"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-white font-semibold hover:bg-indigo-500 cursor-pointer"
            >
              Submit Password Change
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
