# Fest Results App - User Manual

Welcome to the Fest Results Application! This manual provides a complete guide for both Administrators and Public Users, along with important technical details about how the application handles data.

---

## ⚠️ Important Note: How Data Works

**Please read this carefully regarding your "Real-time" question.**

This application currently uses **Local Storage** (browser memory) to save data. This means:
1.  **Data is NOT shared across devices:** Results published on your laptop will **NOT** automatically appear on someone else's phone.
2.  **Unique to each Browser:** If you open the app on Chrome and then on Safari on the same computer, they will have separate data.
3.  **Real-time Refresh:** The "Auto-refresh" feature currently restarts the local timer to check for *local* updates (e.g., if you have the app open in two tabs on the same browser). It does **not** fetch data from a server.

### How to share results with the public?
Since there is no backend database connected yet, to show results to others, you currently have two options:
1.  **Projector/Screen Mode:** Use one main computer connected to a screen to enter and display results.
2.  **Export/Import (Manual Sync):**
    *   **Admin:** Go to Dashboard -> Click **Export Results** (downloads a `.json` file).
    *   **User/Other Device:** Go to Dashboard -> Click **Import Results** -> Upload that file.
    *(This is obviously not ideal for a public website. To have true real-time syncing for everyone, we would need to connect a database like Firebase or Supabase.)*

---

## 👨‍💻 Admin Guide

### 1. Accessing the Admin Panel
*   **URL:** Navigate to `https://your-site.vercel.app/admin` (e.g., `/admin`).
*   **Note:** There is no button on the homepage for this; you must type the URL manually.

### 2. Login
*   **Password:** `Madin_Shuhada@admin`
*   Enter the password and click "Login to Admin Panel".

### 3. The Dashboard
*   **Stats Cards:** View total results, team scores (Team Badr vs Team Uhud), and program coverage.
*   **Action Buttons:**
    *   **Publish Result:** Opens the form to add a new win.
    *   **Logout:** Securely logs you out (top right).
    *   **Export/Import:** For backing up or transferring data.
    *   **Clear All:** Delete all results (Danger Zone).

### 4. Publishing a Result
1.  Click **"Publish Result"**.
2.  **Select Program:** Choose from the list (Quran Recitation, Speech, etc.).
3.  **Select Participant:** Choose the student (Category/Class is auto-shown).
    *   *Note:* Team is auto-selected based on the participant.
4.  **Enter Points:** (1-1000).
5.  **Select Position:** 1st, 2nd, 3rd, or Participation.
6.  **Select Grade:** A+, A, B+, etc.
7.  Click **"Publish Result"**.

### 5. Managing Results
*   Scroll down to the "Recent Results" list.
*   **Edit:** Click the pencil icon to modify points, grade, or position.
*   **Delete:** Click the trash icon to remove a result.

---

## 👥 Public User Guide

### 1. The Home Page
*   **URL:** `https://your-site.vercel.app/`
*   **Hero Section:** Shows total results count.
*   **Auto-Refresh:** The page refreshes its view every 30 seconds (useful if used as a static display).

### 2. Live Scoreboard
*   Shows the header-to-head score of **Team Badr** vs **Team Uhud**.
*   The leading team card glows and scales up slightly.
*   Includes a progress bar visualization.

### 3. Viewing Results
*   **List View:** Scroll down to see cards for every published result.
*   **Badges:** See Position (1st/2nd/3rd) and Grade (A+/A) clearly.
*   **Search & Filter:**
    *   Click the **Filters** button.
    *   **Search:** Type a name, program, or category (e.g., "UP", "HS", "Rizwan").
    *   **Category:** Filter by On-Stage / Off-Stage.
    *   **Team:** Filter by Team Badr or Team Uhud.
    *   **Sort:** Sort by Points (High/Low) or Grade.

---

## 🚀 Deployment & Updates

### 404 Error on Refresh
If you see a "404 Not Found" error when refreshing the `/admin` page on Vercel:
*   Ensure the `vercel.json` file exists in your project root with the following content:
    ```json
    {
      "rewrites": [
        { "source": "/(.*)", "destination": "/index.html" }
      ]
    }
    ```
*   Push this file to your Git repository to redeploy.

### Updating Data
To change Team names, Participants, or Programs:
1.  Edit the files in `src/data/`.
2.  Commit and Push changes to GitHub.
3.  Vercel will automatically redeploy the update.
