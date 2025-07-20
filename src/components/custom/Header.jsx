import React, { useEffect, useState } from "react";
import "./Header.css";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

function Header() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    console.log("User:", user);
  }, []);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
              Accept: "application/json",
            },
          }
        );

        localStorage.setItem("user", JSON.stringify(res.data));
        setOpenDialog(false);
        window.location.reload();
      } catch (err) {
        console.error("Google User Info Fetch Failed:", err);
        alert("Failed to fetch user info");
      }
    },
    onError: (err) => {
      console.error("Google Login Error:", err);
      alert("Google login failed");
    },
  });

  return (
    <div className="p-3 shadow-sm flex justify-between items-center px-5 bg-white">
      <img src="/vite.svg" className="h-8" alt="Logo" />

      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <a href='/create-trip'>
            <button className="rounded-full px-4 py-1 border text-sm">+ Create Trip</button>
            </a>
            <a href='/my-trips'>
            <button className="rounded-full px-4 py-1 border text-sm">My Trips</button>
            </a>
            <button
              onClick={() => {
                googleLogout();
                localStorage.clear();
                window.location.reload();
              }}
              className="text-sm px-3 py-1 rounded-full bg-red-500 text-white"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => setOpenDialog(true)}
            className="px-4 py-1 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        )}
      </div>

      {/* Sign In Dialog */}
      {openDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 relative">
            <button
              onClick={() => setOpenDialog(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-semibold"
            >
              ×
            </button>
            <div className="flex items-center mb-4">
              <img src="/vite.svg" alt="Logo" className="h-8 w-8 mr-2" />
              <span className="text-lg font-semibold">Trip Planner</span>
            </div>
            <h2 className="text-lg font-semibold mb-1">Sign In With Google</h2>
            <p className="text-sm text-gray-500 mb-5">
              Sign in to the app with Google authentication securely
            </p>
            <button
              onClick={login}
              className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              <FcGoogle className="text-xl" />
              <span>Sign In With Google</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
