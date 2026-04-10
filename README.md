# Campus Complain - College & Hostel Complaint Management System

A full-stack, real-time complaint management system designed for colleges and hostels. It allows students to map, submit, and track their complaints while providing administrators with a robust dashboard to manage, update, and resolve issues efficiently.

## 🚀 Features

### For Students
- **Authentication:** Secure registration and login functionalities.
- **Complaint Submission:** Easily submit complaints by providing necessary details, including category and description.
- **Track Status:** View all personally submitted complaints along with their current resolution status (e.g., Pending, In Progress, Resolved).
- **Real-Time Updates:** Instantly see updates to complaint statuses without refreshing the page, powered by WebSockets.

### For Administrators
- **Admin Dashboard:** Centralized view of all student complaints across the campus or hostel.
- **Status Management:** Update complaint statuses as they are reviewed and resolved to keep students informed in real time.
- **Real-Time Notifications:** Receive incoming complaints instantly as they are submitted by students.

## 🛠️ Tech Stack

**Frontend:**
- React 19 (Bootstrapped with Vite)
- React Router DOM (Navigation)
- Axios (API requests)
- Socket.io-client (Real-time web socket events)
- Lucide React (UI Icons)
- Context API (Global state management & Auth)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Object Data Modeling)
- Socket.io (Real-time bidirectional communication)
- JSON Web Tokens (JWT) for secure authentication
- bcrypt (Password hashing encryption)

## 📁 Project Structure

```text
Complain-Campus/
├── backend/          # Node.js + Express backend
│   ├── config/       # Database and environment configurations
│   ├── middleware/   # Custom middlewares (e.g., Auth verification)
│   ├── models/       # Mongoose Schemas (User, Complaint, Category)
│   ├── routes/       # API Routes (/api/auth, /api/complaints, /api/categories)
│   ├── .env          # Environment variables (Mongo URI, JWT Secret)
│   └── server.js     # Entry point for the backend server
└── frontend/         # React + Vite frontend
    ├── public/       # Static web assets
    ├── src/
    │   ├── assets/       # Media and image assets
    │   ├── components/   # React components (Login, Dashboard, AdminDashboard, Navbar)
    │   ├── context/      # React Context (AuthContext for user state)
    │   ├── App.jsx       # Main application component & Routing logic
    │   └── main.jsx      # React DOM rendering entry point
    └── index.html    # Base HTML template
```

## ⚙️ Installation & Usage

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Running locally or a MongoDB Atlas cluster)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure you have your `.env` file configured in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser (typically at `http://localhost:5173`).

## 🤝 Contributing
Contributions, issues, and feature requests are always welcome! Feel free to fork the repository and submit a pull request.

## 📝 License
This project is open-source and licensed under the ISC License.
