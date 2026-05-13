# 📝 Notes App

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

## 📖 Project Description

The **Notes App** is a fast, lightweight, and fully responsive client-side web application designed for seamlessly capturing and organizing ideas. Built entirely with Vanilla JavaScript, HTML5, and modern CSS3, it solves the problem of quick, temporary note-taking by leveraging the browser's `localStorage` for data persistence. This means your notes are saved instantly without the need for a database, backend, or user authentication. 

## 💻 Tech Stack

* **Frontend:** HTML5, CSS3 (Custom Properties, Flexbox, Animations)
* **Scripting:** Vanilla JavaScript (ES6+)
* **Storage:** Browser `localStorage` API
* **Assets:** FontAwesome (Icons), Google Fonts (DM Sans, Space Mono)

## ✨ Features

* **CRUD Functionality:** Create, read, update, and delete notes with a clean, intuitive interface.
* **Persistent Storage:** Automatically saves notes and edits to the browser's `localStorage`.
* **Smart Search:** Real-time filtering of notes by title or description content.
* **Dynamic Timestamps:** Automatically calculates and displays human-readable creation/edit times (e.g., "just now", "5 minutes ago", "yesterday").
* **Share Capabilities:** Integrates the native Web Share API with an automatic fallback to Telegram sharing if native sharing is unsupported.
* **Interactive UI/UX:** Features interactive empty states, animated toast notifications for user actions, inline delete confirmations, and a dynamic character counter for note titles (max 60 characters).

## 📂 Folder Structure

```text
├── app.js         # Core application logic, local storage management, and DOM manipulation
├── index.html     # Application markup, form inputs, and UI layout
├── style.css      # Custom styling, responsive design, and CSS animations
└── notes.png      # Favicon (Icon asset)

## 🚀 Getting Started / Installation

Since this project is completely client-side and requires no build tools or package managers, running it locally is incredibly straightforward.

**Prerequisites:**

* Any modern web browser (Chrome, Firefox, Safari, Edge).
* *Optional:* A local server extension like VS Code "Live Server" for auto-reloading.

**Installation Steps:**

1. Clone the repository:
```bash
git clone [https://github.com/habashyabdulrahman/Notes](https://github.com/habashyabdulrahman/Notes)

```


2. Navigate to the project directory:
```bash
cd notes-app

```


3. Open the application:
Simply double-click the `index.html` file to open it in your default browser, or serve it using your preferred local development server.

## 🔐 Environment Variables

This project is entirely client-side and relies on native browser APIs.

| Variable | Type | Description |
| --- | --- | --- |
| N/A | N/A | **No environment variables or `.env` file are required for this project.** |

## 🔌 API Documentation

This application runs independently in the browser and does not communicate with external REST or GraphQL APIs.

**Data Flow:**

* Data is serialized to JSON and stored locally via `localStorage.setItem("notes", JSON.stringify(notes))`.
* Data is retrieved and parsed on load via `JSON.parse(localStorage.getItem("notes"))`.

## 📜 License & Author

**Author:** [Habashy Abdulrahman / habashyabdulrahman]

This project is licensed under the MIT License - see the LICENSE file for details.

```

```