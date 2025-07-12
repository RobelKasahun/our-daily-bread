// utils/api.js
export const apiRequest = async (url, options = {}) => {
    let token = localStorage.getItem("access_token");

    const res = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        credentials: "include", // for refresh token cookie
    });

    if (res.status === 401) {
        // Try refreshing the token
        const refreshed = await refreshAccessToken();
        if (refreshed) {
            // Retry the original request with new token
            token = localStorage.getItem("access_token");
            return await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
        } else {
            // Redirect to login or handle logout
        }
    }

    return res;
};

const refreshAccessToken = async () => {
    const res = await fetch("http://127.0.0.1:8000/auth/refresh", {
        method: "POST",
        credentials: "include",
    });


    console.log(`refreshAccessToken: ${res.ok}`);

    if (res.ok) {
        const data = await res.json();
        localStorage.setItem("access_token", data.access_token);
        return true;
    } else {
        console.warn("Refresh failed. User must log in again.");
        return false;
    }
};
