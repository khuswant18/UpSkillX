# UpSkillX 🚀

An AI-powered learning and interview preparation platform that helps users enhance their skills through interactive quizzes and mock interviews with real-time feedback.

## ✨ Features

- **AI-Powered Mock Interviews**: Practice interviews with Gemini AI and VAPI integration for realistic voice interactions
- **Interactive Quizzes**: Test your knowledge across multiple topics and difficulty levels
- **Personalized Dashboard**: Track your progress, quiz scores, and interview performance
- **Real-time Feedback**: Get instant feedback on your interview responses and quiz attempts
- **Learning Profile**: Manage your skills, experience level, and learning goals
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Recharts** - Charting library for data visualization
- **React Router** - Client-side routing
- **@vapi-ai/web** - Voice AI integration

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web framework
- **Prisma 7** - Modern ORM for PostgreSQL
- **PostgreSQL** - Relational database
- **Google Generative AI (Gemini)** - AI-powered content generation
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing

## 📦 Project Structure

```
UpSkillX/
├── UpSkillX_Backend/          # Backend API server
│   ├── config/                # Configuration files
│   ├── controllers/           # Request handlers
│   ├── db/                    # Database configuration
│   ├── middlewares/           # Express middlewares
│   ├── prisma/                # Database schema and migrations
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── utils/                 # Utility functions
│   ├── app.js                 # Express app setup
│   └── server.js              # Server entry point
│
└── UpSkillX_Frontend/         # Frontend React app
    ├── public/                # Static assets
    ├── src/
    │   ├── components/        # React components
    │   │   ├── common/        # Reusable UI components
    │   │   ├── dashboard/     # Dashboard components
    │   │   ├── layout/        # Layout components
    │   │   ├── quiz/          # Quiz components
    │   │   └── ui/            # shadcn/ui components
    │   ├── context/           # React context providers
    │   ├── data/              # Mock data
    │   ├── lib/               # Utility functions
    │   ├── pages/             # Page components
    │   ├── App.jsx            # Root component
    │   └── main.jsx           # Entry point
    └── index.html
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google Gemini API key

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd UpSkillX_Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/upskillx"
   JWT_SECRET="your-secret-key"
   GEMINI_API_KEY="your-gemini-api-key"
   PORT=5000
   ```

4. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

5. **Generate Prisma client**
   ```bash
   npm run prisma:generate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd UpSkillX_Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## 📝 Available Scripts

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run build` - Generate Prisma client
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:push` - Push schema changes to database

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `UpSkillX_Backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add environment variables (DATABASE_URL, JWT_SECRET, GEMINI_API_KEY)

### Frontend (Vercel/Render)
1. Create a new Static Site
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `UpSkillX_Frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Add environment variables (VITE_API_URL)

## 🔐 Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `GEMINI_API_KEY` | Google Gemini API key |
| `PORT` | Server port (default: 5000) |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Khuswant Raj Purohit**
- GitHub: [@khuswant18](https://github.com/khuswant18)

## 🙏 Acknowledgments

- Google Generative AI (Gemini) for AI capabilities
- VAPI for voice AI integration
- Prisma for excellent ORM
- The React and Node.js communities
