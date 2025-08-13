# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

**🗺️ AI Trip Planner**
An AI-powered trip planning application that generates personalized travel itineraries with hotel recommendations and allows users to save trips for future reference. Built with Node.js for backend connections, Firebase for trip storage, Google OAuth for authentication, and Google Gemini API for AI-powered trip generation.

**🚀 Features**
AI-Generated Itineraries – Tailored day-by-day plans based on destination, budget, and group size.

Hotel Recommendations – AI suggests hotels matching your budget and location.

User Authentication – Secure login with Google OAuth 2.0.

Save & Retrieve Trips – Logged-in users can store trips in Firebase Firestore for future use.

Realtime Data Storage – Trip details are securely stored and accessible anytime.

Fast Backend – Node.js + Express.js for smooth API connections.

**🛠️ Tech Stack**
Backend: Node.js, Express.js

AI Integration: Google Gemini API

Authentication: Google OAuth 2.0

Database: Firebase Firestore

**⚙️ Setup & Installation**
****1️⃣ Clone the repository****
bash
Copy
Edit
git clone https://github.com/yourusername/ai-trip-planner.git
cd ai-trip-planner
2️⃣ Install dependencies
bash
Copy
Edit
npm install
3️⃣ Set up Firebase
Go to Firebase Console

Create a new project

Enable Firestore Database

Get your Firebase config and paste it into firebaseConfig.js

4️⃣ Set up Google OAuth
Go to Google Cloud Console

Create a new project

Enable OAuth 2.0 and get Client ID & Secret

Add them to .env file:

ini
Copy
Edit
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
5️⃣ Set up Gemini AI API
Get API key from Google AI Studio

Store it in .env as:

ini
Copy
Edit
GEMINI_API_KEY=your_api_key_here
6️⃣ Run the backend
bash
Copy
Edit
npm start
📌 API Endpoints
POST /generate-trip
Generates a trip itinerary with hotel recommendations.

Request Body:

json
Copy
Edit
{
  "place": "Paris",
  "members": 4,
  "budget": 2000
}
Response:

json
Copy
Edit
{
  "itinerary": [
    "Day 1: Eiffel Tower visit and Seine River cruise",
    "Day 2: Louvre Museum and Montmartre exploration"
  ],
  "hotels": [
    "Hotel A - 3-star, near Eiffel Tower, $120/night",
    "Hotel B - 4-star, city center, $150/night"
  ]
}
POST /save-trip
Saves a generated trip for a logged-in user.

Request Body:

json
Copy
Edit
{
  "userId": "google_uid_here",
  "tripData": {
    "place": "Paris",
    "itinerary": [...],
    "hotels": [...]
  }
}
Response:

json
Copy
Edit
{
  "message": "Trip saved successfully!"
}
🎯 Future Improvements
Add nearby restaurant recommendations

Include real-time weather updates

Enable sharing trips with friends

Multi-language support

