import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { SelectBudgetOptions, SelectTravelsList } from "../constants/options.jsx";
import { generateTripPlan } from "../service/AIModal.jsx";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
  const [place, setPlace] = useState("");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("✅ Updated Form Data:", formData);
  }, [formData]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenInfo) => {
      try {
        const res = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${tokenInfo.access_token}`,
              Accept: "application/json",
            },
          }
        );

        localStorage.setItem("user", JSON.stringify(res.data));
        setOpenDialog(false);
        OnGenerateTrip(); // proceed
      } catch (err) {
        console.error("❌ Google Login failed:", err);
        alert("Failed to fetch user info");
      }
    },
    onError: (err) => {
      console.error("❌ Google login failed:", err);
      alert("Google login failed");
    },
  });

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }

    const { location, days, budget, travelWith } = formData;

    if (!location || !days || !budget || !travelWith) {
      alert("⚠️ Please fill in all required fields.");
      return;
    }

    if (parseInt(days) > 5) {
      alert("⚠️ Trip duration should be between 1–5 days.");
      return;
    }

    try {
      setLoading(true);
      console.log("🧠 Generating trip with AI for:", formData);

      const aiResponse = await generateTripPlan({
        location,
        days,
        people: travelWith,
        budget,
      });

      console.log("✅ AI Trip Plan Response:", aiResponse);
      const docId = await SaveAiTrip(aiResponse);
      if (docId) {
        navigate("/view-trip/" + docId);
      }
    } catch (err) {
      console.error("❌ Error generating trip plan:", err);
      alert("Something went wrong while generating your trip.");
    } finally {
      setLoading(false);
    }
  };

  const SaveAiTrip = async (TripData) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const docId = Date.now().toString();

      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: TripData,
        userEmail: user?.email,
        id: docId,
      });

      console.log("✅ Trip saved successfully!");
      return docId;
    } catch (error) {
      console.error("❌ Error saving trip to Firestore:", error);
      alert("Failed to save trip. Check Firestore rules or auth.");
      return null;
    }
  };

  const isFormComplete =
    formData.location && formData.days && formData.budget && formData.travelWith;

  const CustomDialog = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 relative">
          <button
            onClick={onClose}
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
    );
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
      <h2 className="font-bold text-3xl">Tell us your travel preferences 🏕️🌴</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate a customized itinerary.
      </p>

      {/* Input Sections */}
      <div className="mt-10 flex flex-col gap-10">
        <div>
          <h2 className="text-xl font-medium">What is your destination?</h2>
          <input
            type="text"
            placeholder="Enter a place"
            value={place}
            onChange={(e) => {
              setPlace(e.target.value);
              handleInputChange("location", e.target.value);
            }}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <h2 className="text-xl font-medium">How many days?</h2>
          <input
            type="number"
            min="1"
            placeholder="Enter number of days"
            onChange={(e) => handleInputChange("days", e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Budget Selection */}
      <div className="mt-10">
        <h2 className="text-xl font-medium">What is your budget?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("budget", item.title)}
              className={`p-4 border rounded-lg cursor-pointer transition ${
                formData.budget === item.title.trim()
                  ? "shadow-lg border-black ring-2 ring-blue-500"
                  : ""
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Travel Group */}
      <div className="mt-10">
        <h2 className="text-xl font-medium">Who are you traveling with?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
          {SelectTravelsList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("travelWith", item.title)}
              className={`p-4 border rounded-lg cursor-pointer transition ${
                formData.travelWith === item.title.trim()
                  ? "shadow-lg border-black ring-2 ring-blue-500"
                  : ""
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Trip Button */}
      <div className="my-10 flex justify-end">
        <button
          disabled={loading}
          onClick={OnGenerateTrip}
          className={`px-6 py-3 rounded-md transition ${
            isFormComplete
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
          ) : (
            "Generate Trip"
          )}
        </button>
      </div>

      <CustomDialog isOpen={openDialog} onClose={() => setOpenDialog(false)} />
    </div>
  );
}

export default CreateTrip;
