# 📘 Sztuka '26 - User Manual

Welcome to the **Sztuka '26 Arts Fest** results system! This guide will help you understand how to use the application, whether you are a visitor checking scores or an organizer managing the event.

---

## 👥 For Visitors & Participants (Public View) https://festresults.vercel.app/

This is what everyone sees when they open the app. No login is required.

### 1. 🏠 Home Page Dashboard
*   **Live Scoreboard:** At the top, you will see the **"Team Standings"**. This shows which team is currently leading the competition.
    *   The 🏆 icon shows the 1st place team.
    *   Scores update automatically every 30 seconds.
*   **Latest Statistics:** You can see exactly how many results have been published so far.
*   **Refresh Button:** If you want to check for new results immediately, click the **"Refresh"** button (rotating arrow icon).

### 2. 📋 Viewing Results
Below the scoreboard is the list of published results.
*   **Gallery View (E-Poster):** By default, results appear as beautiful digital posters. This is great for sharing screenshots!
*   **List View:** If you prefer a simple list, click the **List Icon** (lines) at the top right of the results section.
*   **Compare:** Toggle between the Grid (Poster) and List icons to see which view you prefer.

### 3. 🔍 Finding Specific Results
Click the **"Filters"** button to open search options:
*   **Search:** Type a name, program, or team to find it instantly.
*   **Category:** Filter by category (e.g., HS, Junior, Senior).
*   **Team:** See results for a specific team only.
*   **Sort By:** Arrange results by "Highest Points", "Newest", etc.

---

## 🔐 For Admins & Organizers (Admin Panel) https://festresults.vercel.app/admin

This section is for the organizers who need to enter data and publish results.
**Access:** Go to the `/admin` link (e.g., `https://festresults.vercel.app/admin`) and log in with the secret password.

### 1. 📢 Publishing Results (The Main Task)
Go to the **"Results"** tab.
1.  Click the big green **"Publish New Result"** button.
2.  **Select Program:** Choose the event (e.g., "Quran Recitation").
3.  **Select Participant:** Choose who won. The system will automatically know which Team they belong to.
4.  **Enter Points:** Type the score they got.
5.  **Select Grade:** Choose their grade (A, B, etc.).
6.  **Select Position:** Are they 1st, 2nd, 3rd, or just participating?
7.  Click **"Publish Result"**.
    *   *Result:* The scoreboard updates instantly for everyone!

### 2. ✏️ Managing Programs (Events)
Go to the **"Programs"** tab to set up your events.
*   **Add New:** Click "Add Program", give it a name (e.g., "Pencil Drawing"), category, and max points.
*   **Edit:** Made a spelling mistake? Click the **Pencil Icon** next to a program to fix it.
*   **Delete:** Click the **Trash Icon** to remove a program (be careful!).

### 3. 👥 Managing Participants (Students)
Go to the **"Participants"** tab.
*   **Add New:** Click "Add Participant", enter their Name, choose their Team, and Category.
*   **Search:** Use the search bar to find a specific student quickly if you need to edit their details.

### 4. 🚩 Managing Teams
Go to the **"Teams"** tab.
*   Here you can rename teams or change their colors.
*   The scores are calculated automatically based on the Results you publish, so you **don't** need to enter total team scores manually.

### 5. ⚙️ Settings & Tools
Go to the **"Settings"** tab for special tools:
*   **Backup Data:** Click "Export Full Backup" to save a copy of all your hard work to your computer. (Do this at the end of each day!).
*   **Seed Database:** ( Technical) This reset button loads the initial starting data. **Only use this if you are setting up the app for the very first time**, as it can overwrite changes.

---

### 💡 Tips for Success
*   **Double Check:** Before publishing a result, check that the "Max Points" for that program matches your score sheet.
*   **Auto-Save:** The system saves data automatically. If you lose internet, the data stays on your device until you reconnect.
*   **Screenshots:** The "Gallery View" is perfect for taking screenshots to share on WhatsApp or Social Media status updates!
