import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import { apiRequest } from "../utils/api";
import { API_BASE_URL } from "../utils/config";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";

export default function Navigationbar({
  setQuery,
  showSearchBar = true,
  showWriteButton = false,
  showPublishButton = false,
}) {
  const [currentUser, setCurrentUser] = useState(-1);
  const [input, setInput] = useState("");

  // Get current user
  useEffect(() => {
    const handleCurrentUser = async () => {
      const response = await apiRequest(`${API_BASE_URL}/users/current`, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data.current_user);
      } else {
        console.error("Failed to fetch current user:", data.error);
      }
    };

    handleCurrentUser();
  }, []);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    setQuery(value);
  };
  return (
    <Disclosure
      as="nav"
      className="relative bg-white-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Link to="/" className="-m-1.5 p-1.5">
                <span className="sr-only">DailyBread</span>
                <img
                  alt=""
                  src={"../images/dailybread-logo.png"}
                  className="h-8 w-auto"
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {/* Search Bar */}
                {showSearchBar && (
                  <form className="mx-8">
                    <input
                      type="search"
                      placeholder="Search"
                      value={input}
                      onChange={handleSearchInputChange}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none"
                    />
                  </form>
                )}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {showWriteButton && (
              <Link
                to="/new-post"
                className="bg-gray-900 text-white text-gray-300 hover:bg-gray-700
                  hover:text-white rounded-md px-3 py-2 text-sm font-medium"
              >
                Write
              </Link>
            )}

            {/* Profile dropdown */}
            {/* https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80 */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt="Profile Image"
                    src="../images/dailybread-logo.png"
                    className="size-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute overflow-y-auto right-0 z-10 mt-2 w-68 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <Link
                    to={`/profile/${currentUser}`}
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Profile
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    to="/saved-posts"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Saved
                  </Link>
                </MenuItem>

                <MenuItem>
                  <Link
                    to="/your-stories"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Stories
                  </Link>
                </MenuItem>

                <MenuItem>
                  <Link
                    to="/writers"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Writers
                  </Link>
                </MenuItem>

                <MenuItem>
                  <Link
                    to="/signout"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Sign out
                  </Link>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {/* Search Bar */}
          {showSearchBar && (
            <form className="mx-8">
              <input
                type="search"
                placeholder="Search"
                value={input}
                onChange={handleSearchInputChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none"
              />
            </form>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
