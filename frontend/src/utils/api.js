// utils/api.js
import { API_BASE_URL } from "./config";

let accessToken = null;

export const apiRequest = async (url, options = {}) => {
    // let token = localStorage.getItem("access_token");

    const res = await fetch(url, {
        ...options,
        credentials: "include", // send cookies for every request
        headers: {
            ...options.headers,
            Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
            "Content-Type": "application/json",
        },
    });

    if (res.status === 401) {
        // Try refreshing the token
        const refreshed = await refreshAccessToken();
        if (refreshed) {
            // Retry the original request with new token
            // token = localStorage.getItem("access_token");
            return await fetch(url, {
                ...options,
                credentials: "include",
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
        } else {
            // Redirect to login or handle logout
        }
    }

    return res;
};

const refreshAccessToken = async () => {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
    });

    if (res.ok) {
        const data = await res.json();
        // localStorage.setItem("access_token", data.access_token);
        accessToken = data.access_token;
        return true;
    } else {
        console.warn("Refresh failed. User must log in again.");
        return false;
    }
};


