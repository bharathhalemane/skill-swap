# 🔄 Skill Swap

> A full-stack web platform that connects people who want to **teach what they know** and **learn what they don't** — through peer-to-peer skill exchange.

🌐 **Live Demo:** [skill-swap-tau-ruby.vercel.app](https://skill-swap-tau-ruby.vercel.app)

---

## 📖 About

Skill Swap is a community-driven platform where users can list skills they offer and skills they want to learn, then connect with others for a mutual exchange — no money involved, just knowledge.

---

## ✨ Features

- 🔐 **User Authentication** — Secure sign up and login
- 👤 **Profile Management** — List your offered skills and skills you want to learn
- 🔍 **Browse & Discover** — Find other users based on skills
- 🤝 **Swap Requests** — Send and receive skill exchange requests
- 📱 **Responsive Design** — Works seamlessly on desktop and mobile

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js | UI framework |
| CSS | Styling & layout |
| JavaScript (ES6+) | Application logic |
| Cloudinary | Image hosting |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | REST API framework |
| MongoDB | Database |

### Deployment
| Service | Usage |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |

---

## 📁 Project Structure

```
skill-swap/
├── client/     # React frontend application
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── ProtectedRoute/
│       ├── Socket.jsx
│       └── App.jsx
│
└── server/      # Node.js/Express backend API
    ├── config/
    ├── middleware/
    ├── routes/
    ├── models/
    ├── controllers/
    ├── utils/
    ├── socket.js
    └── server.js
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

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

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
change all fields with your credentials
```

Start the backend server:

```bash
npm start
```

```env
change all fields with your credentials
```

The backend will run on `http://localhost:5000`

### 3. Setup the Frontend

Open a new terminal:

```bash
cd client
npm install
```

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm start
```

The app will open at `http://localhost:3000`

---

## 🌐 Deployment

The frontend is deployed on **Vercel**. To deploy your own instance:

1. Push your code to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Set the root directory to `skill-swap-frontend`
4. Add your environment variables
5. Deploy!

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