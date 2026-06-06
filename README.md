# TravelHub - Modern Blog Website

TravelHub is a premium, full-stack blog platform built with the MERN stack (MongoDB, Express, React, Node.js) and Vite. It features a sleek, responsive design tailored for travel and trekking stories, complete with a powerful Admin Dashboard.

## 🚀 Key Features

*   **AI-Powered Blog Generation**: Integrated with the **Google Gemini API**, the admin panel includes an AI assistant that can instantly generate blog post titles, outlines, and full content drafts in various tones (Professional, Casual, Educational). This significantly speeds up the writing process!
*   **ImageKit API Integration**: Seamless cloud image hosting using **ImageKit.io**. All cover images and inline blog images are automatically uploaded to ImageKit for fast delivery and global CDN caching, with a local storage fallback mechanism.
*   **Custom Rich Text Editor**: A fully custom-built rich text editor allows admins to format text (bold, italic, headings), insert lists, upload inline images, and add hyperlinks with ease.
*   **Admin Dashboard**: A secure, authenticated dashboard for managing posts. Admins can create new drafts, preview them, publish them, and delete old posts.
*   **Premium & Responsive UI**: Designed with a mobile-first approach, the website features glassmorphism, dynamic micro-animations, and a beautiful layout that looks perfect on mobile, tablet, and desktop devices.
*   **Category Filtering & Search**: Users can easily find what they're looking for using keyword search, category filters (like Ladakh, Kashmir, Sikkim), and intelligent sorting.

## 💻 Tech Stack

*   **Frontend**: React 19, Vite, Tailwind CSS v4, React Router DOM, Axios
*   **Backend**: Node.js, Express, MongoDB & Mongoose
*   **Authentication**: JSON Web Tokens (JWT)
*   **APIs**: Google Gemini (AI content generation), ImageKit.io (Image uploading)

## 🛠️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/travelhub-blog.git
    cd travelhub-blog
    ```

2.  **Setup the Backend:**
    ```bash
    cd BACKEND
    npm install
    ```
    Create a `.env` file in the `BACKEND` directory with the following variables:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    GEMINI_API_KEY=your_google_gemini_api_key

    # JWT & Admin Auth
    JWT_SECRET=your_jwt_secret_key
    ADMIN_EMAIL=admin@bloghub.com
    ADMIN_PASSWORD=your_secure_password

    # ImageKit Config
    IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
    IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
    IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
    ```

3.  **Setup the Frontend:**
    ```bash
    cd ../FRONTEND
    npm install
    ```

4.  **Run the Application:**
    You can run both the frontend and backend simultaneously.
    *   **Backend**: `cd BACKEND && npm run dev` (Runs on http://localhost:5000)
    *   **Frontend**: `cd FRONTEND && npm run dev` (Runs on http://localhost:5173 or your local network IP)

## 🔒 Admin Access

To access the Admin Dashboard, navigate to `/login` and enter the credentials you defined in the backend `.env` file (`ADMIN_EMAIL` and `ADMIN_PASSWORD`).

---
*Built with ❤️ for adventurers and storytellers.*
