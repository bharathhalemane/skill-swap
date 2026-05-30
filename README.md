# 🔄 Skill Swap

> A full-stack web platform that connects people who want to **teach what they know** and **learn what they don't** — through peer-to-peer skill exchange. No money, just knowledge.

🌐 **Live Demo:** [skill-swap-tau-ruby.vercel.app](https://skill-swap-tau-ruby.vercel.app)

---

## 📖 About

Skill Swap is a community-driven platform where users can list skills they offer and skills they want to learn, then connect with others for a mutual exchange. Browse skill listings, send swap requests, join study groups, and schedule sessions — all in one place.

---

## ✨ Features

- 🔐 **User Authentication** — Secure sign up / login with email, Google OAuth, and GitHub OAuth
- 🔑 **Password Reset** — Email-based password reset flow via Nodemailer
- 👤 **Profile Management** — Set your username, bio, location, and profile photo (hosted on Cloudinary)
- 📚 **Skill Listings** — Post skills with title, category, level (Beginner / Intermediate / Advanced), duration, and a cover image
- 🔍 **Browse & Discover** — Search and filter skills posted by other users
- 🤝 **Swap Requests** — Send, receive, and manage skill exchange requests
- ✅ **Completed Swaps** — Track your finished skill exchanges
- 👥 **Study Groups** — Create or join online/offline study groups with capacity limits and join-request approval
- 🗓️ **Class Scheduling & Availability** — Set your availability and schedule sessions with matched users
- 💬 **Real-time Presence** — Socket.IO tracks online users in real time
- 📱 **Responsive Design** — Fully usable on desktop and mobile

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework and build tool |
| React Router v7 | Client-side routing |
| Redux Toolkit | Global state management |
| Tailwind CSS v4 | Utility-first styling |
| Socket.IO Client | Real-time online presence |
| Axios | HTTP requests |
| Lucide React / React Icons | Icon libraries |
| React Toastify | Toast notifications |
| React Slick | Carousel / slider |

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express 5 | Runtime and REST API framework |
| MongoDB + Mongoose | Database and ODM |
| JWT | Authentication tokens |
| Passport.js | Google & GitHub OAuth strategies |
| Bcryptjs | Password hashing |
| Cloudinary + Multer | Image upload and storage |
| Nodemailer | Email (password reset) |
| Socket.IO | Real-time online-user tracking |

### Deployment

| Service | Usage |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Cloud database |
| Cloudinary | Image CDN |

---

## 📁 Project Structure

```
skill-swap/
├── client/                    # React + Vite frontend
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── Auth/
│       │   ├── Footer/
│       │   ├── Header/
│       │   ├── Profile/
│       │   ├── Skill/
│       │   └── Utils/
│       ├── Pages/
│       │   ├── Home/
│       │   ├── Auth/
│       │   ├── Dashboard/
│       │   ├── BrowseSkills/
│       │   ├── CompletedSkills/
│       │   ├── GroupPage/
│       │   └── StudyGroups/
│       ├── redux/             # Redux slices & store
│       ├── ProtectedRoute/
│       ├── Socket.jsx         # Socket.IO client setup
│       └── App.jsx
│
└── server/                    # Node.js / Express backend
    ├── config/                # DB connection, Cloudinary, Passport
    ├── controllers/           # Route logic
    ├── middleware/            # Auth middleware
    ├── models/
    │   ├── User.js
    │   ├── Skill.js
    │   ├── Request.js
    │   ├── Group.js
    │   ├── Availability.js
    │   └── ClassSchedule.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── skillsRoutes.js
    │   ├── requestRoutes.js
    │   ├── groupRoutes.js
    │   ├── availabilityRoutes.js
    │   ├── classScheduleRoutes.js
    │   ├── user.js
    │   └── upload.js
    ├── utils/
    ├── socket.js              # Socket.IO server setup
    └── server.js
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- A [Cloudinary](https://cloudinary.com/) account (free tier works)
- A [Google Cloud](https://console.cloud.google.com/) project with OAuth credentials (optional)
- A [GitHub OAuth App](https://github.com/settings/developers) (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/bharathhalemane/skill-swap.git
cd skill-swap
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory (see `example.env` for reference):

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/skillswap
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

# Email (for password reset)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=SkillSwap <your_email@gmail.com>

# Cloudinary (for profile & skill images)
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name

# URLs
BACKEND_LINK=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev     # development (nodemon)
npm start       # production
```

The server will run at `http://localhost:5000`.

### 3. Setup the Frontend

Open a new terminal:

```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory (see `example.env` for reference):

```env
VITE_AUTH_API_URL=http://localhost:5000/api/auth
VITE_SKILL_API=http://localhost:5000/api/skills
VITE_PROFILE_API=http://localhost:5000/api/profile
VITE_BACKEND_API=http://localhost:5000/api
VITE_BACKEND=http://localhost:5000
VITE_FRONTEND_URL=http://localhost:5173
```

Start the frontend:

```bash
npm run dev
```

The app will open at `http://localhost:5173`.

---

## 🌐 Deployment

### Frontend — Vercel

1. Push your code to GitHub.
2. Import the repository on [vercel.com](https://vercel.com).
3. Set the **root directory** to `client`.
4. Add your `VITE_*` environment variables in the Vercel dashboard.
5. Deploy!

### Backend — Render

1. Create a new **Web Service** on [render.com](https://render.com).
2. Set the **root directory** to `server`.
3. Set the **start command** to `npm start`.
4. Add all your server environment variables.
5. Deploy and copy the public URL into the frontend's `VITE_BACKEND` env variable.

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m "Add your feature"`
4. **Push** to the branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Bharath Halemane**
- GitHub: [@bharathhalemane](https://github.com/bharathhalemane)

---

<div align="center">
  <p>⭐ If you found this project helpful, please give it a star!</p>
</div>
