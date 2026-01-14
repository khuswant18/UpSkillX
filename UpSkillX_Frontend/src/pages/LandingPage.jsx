import { useEffect, useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useLearner } from "../context/LearnerContext"
import Button from "../components/common/Button"
import { ArrowRight, BookOpen, MessageSquare, CheckCircle2, Sparkles } from "lucide-react"
export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated, learnerProfile, authUser, logout } = useLearner()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  const handleLogout = () => {
    logout()
    setShowDropdown(false)
    navigate("/")
  }
  const userAvatar = authUser?.picture || learnerProfile?.avatar
  const userName = learnerProfile?.name || authUser?.name || "User"
  const userInitials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  return (
    <div className="min-h-screen bg-slate-50">
      {}
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">UpSkillX</span>
          </Link>
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Get Started
                </button>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 rounded-full bg-slate-100 px-3 py-1.5 hover:bg-slate-200"
                >
                  <span className="text-sm text-slate-700 hidden sm:block">{userName}</span>
                  {userAvatar ? (
                    <img src={userAvatar} alt={userName} className="h-8 w-8 rounded-full border-2 border-blue-500 object-cover" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                      {userInitials}
                    </div>
                  )}
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border bg-white shadow-lg">
                    <div className="border-b px-4 py-3">
                      <p className="text-sm font-medium text-slate-900">{userName}</p>
                      <p className="truncate text-xs text-slate-500">{learnerProfile?.email || authUser?.email}</p>
                    </div>
                    <button
                      onClick={() => { setShowDropdown(false); navigate("/dashboard") }}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
      {}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Ace your next interview with{" "}
            <span className="text-blue-600">AI practice</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Practice mock interviews with AI, take quizzes, and get personalized feedback to land your dream job.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => navigate(isAuthenticated ? '/interviews' : '/signup')}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700"
            >
              {isAuthenticated ? 'Start Interview' : 'Get Started Free'}
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate(isAuthenticated ? '/quizzes' : '/signup')}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-8 py-4 text-lg font-semibold text-slate-700 hover:bg-slate-50"
            >
              Try a Quiz
            </button>
          </div>
          {}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: "7+", label: "Job Roles" },
              { value: "40+", label: "Technologies" },
              { value: "AI", label: "Powered" },
              { value: "24/7", label: "Available" },
            ].map((stat, index) => (
              <div key={index} className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            {}
            <div className="rounded-xl border bg-slate-50 p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Interactive Quizzes</h3>
              <p className="mt-2 text-slate-600">
                Test your knowledge with AI-generated quizzes. Get instant feedback and track progress.
              </p>
              <ul className="mt-4 space-y-2">
                {["AI-generated questions", "Multiple difficulty levels", "Instant scoring"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate(isAuthenticated ? '/quizzes' : '/signup')}
                className="mt-6 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              >
                {isAuthenticated ? 'Start Quiz' : 'Get Started'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            {}
            <div className="rounded-xl border bg-slate-50 p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Mock Interviews</h3>
              <p className="mt-2 text-slate-600">
                Practice with AI interviewers and get real-time feedback on your performance.
              </p>
              <ul className="mt-4 space-y-2">
                {["Technical & behavioral", "Voice interaction", "Personalized feedback"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate(isAuthenticated ? '/interviews' : '/signup')}
                className="mt-6 flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
              >
                {isAuthenticated ? 'Start Interview' : 'Get Started'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
      {}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-xl bg-blue-600 p-8 text-center text-white">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to ace your next interview?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-blue-100">
            Start practicing today and improve your interview skills.
          </p>
          <button
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
            className="mt-6 rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 hover:bg-blue-50"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Start for Free'}
          </button>
        </div>
      </section>
      {}
      <footer className="border-t bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900">UpSkillX</span>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            © {new Date().getFullYear()} UpSkillX. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
