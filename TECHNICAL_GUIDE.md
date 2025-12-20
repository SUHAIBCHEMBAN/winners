# Technical Guide: Fest Results App

This document provides a deep dive into how the application functions, its architecture, and specifically how the Firebase integration enables real-time features.

---

## 🏗 System Architecture

The application is a **Single Page Application (SPA)** built with:
*   **Frontend Framework:** React.js (via Vite)
*   **State Management:** Zustand (Global store for app state)
*   **Routing:** React Router DOM (Client-side navigation)
*   **Styling:** Native CSS with CSS Variables for theming
*   **Database:** Hybrid System (Auto-switches between **Firebase Firestore** and **Local Storage**)
*   **Hosting:** Vercel

---

## 🧠 The Hybrid Data Engine (`useStore.js`)

The specific logic that powers this app lives in `src/store/useStore.js`. It is designed to be "Environment Aware".

### How it decides storage:
When the app loads, it checks for your **Environment Variables** (keys starting with `VITE_FIREBASE_...`).

1.  **If Keys are Present:**
    *   The app initializes the Firebase SDK (`src/lib/firebase.js`).
    *   It activates **Cloud Mode**.
    *   `addResult()` sends data to Google's servers.
    *   The app "subscribes" to changes on the server.

2.  **If Keys are Missing:**
    *   The app stays in **Local Mode**.
    *   Data is saved only to the browser's `localStorage`.
    *   This ensures the app never crashes, even without internet or keys.

---

## 🔥 Firebase Integration Explained

You asked for details about Firebase. Here is what is happening under the hood:

### 1. What is Firebase?
Firebase is a "Backend-as-a-Service" (BaaS) platform by Google. It provides servers, databases, and authentication so developers don't have to build them from scratch. We are using **Cloud Firestore**, which is a NoSQL database.

### 2. How Data is Stored (NoSQL)
Unlike Excel or SQL (Tables and Rows), Firestore is **Document-based**.
*   **Collection:** Think of this as a folder. We have one collection named `'results'`.
*   **Document:** Inside that folder, every result you publish is a "Document". It looks exactly like a JSON object:
    ```json
    {
      "programName": "Speech",
      "participantName": "Ali",
      "points": 10,
      "teamId": "team1",
      "timestamp": "2025-12-19T10:00:00Z"
    }
    ```

### 3. The "Real-Time" Magic (`onSnapshot`)
This is the coolest part. In `useStore.js`, we use a function called `onSnapshot`.
*   **Normal Database:** Client asks "Give me data" -> Server sends data -> Connection closes. (You have to refresh to see new stuff).
*   **Firebase Listeners:** Client says "I am interested in the 'results' collection" -> Server keeps a channel open (Websocket/Long-polling).
*   **When Admin Publishes:**
    1.  Admin app sends new data to Google Cloud.
    2.  Google Cloud instantly checks "Who is listening?".
    3.  It pushes the new data to **all connected devices** (Parents, Scoreboard) within milliseconds.
    4.  The React app receives this update, updates the `results` array in Zustand, and the UI re-renders instantly.

### 4. Security
*   **Environment Variables (`.env`):** We store API keys here so they aren't hardcoded in the script. This allows you to share the code on GitHub without giving away your database access.
*   **Security Rules:** In the Firestore Console, we defined "Rules".
    *   `allow read, write: if request.time < timestamp.date(2026, 1, 18);`
    *   This means "Allow anyone (public) to view and edit data until 2026".
    *   **Why?** Since this is a public fest app without user accounts for parents, this is the simplest way to allow the Admin (you) to write and parents to read without forcing everyone to log in.

---

## 🚀 Deployment Pipeline (Vercel + Git)

1.  **Development:** You write code on your Mac.
2.  **Git:** You commit changes and push to GitHub.
3.  **Vercel (The Host):**
    *   Vercel watches your GitHub repository.
    *   When it sees a new push, it downloads your code.
    *   It runs `npm run build` to create the optimized files.
    *   **Critical Step:** Vercel injects the Environment Variables (API Keys) you set in the Vercel Dashboard into the build.
    *   It then copies the files to its content delivery network (CDN).
    *   **Result:** Your updated site is live globally in seconds.

---

## 🛠 Troubleshooting

*   **Refresh 404 Error:** Fixed by `vercel.json` which tells the server "If you don't find the file (e.g., /admin), just serve index.html and let React handle it".
*   **Data Not Syncing:**
    *   Check your internet connection.
    *   Check Browser Console for "FirebaseError".
    *   Ensure your `.env` keys match exactly with Vercel settings.
