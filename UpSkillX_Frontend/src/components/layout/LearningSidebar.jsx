import { Link, useLocation, useNavigate } from "react-router-dom"
import { LayoutDashboard, BookOpen, MessageSquare, LogOut, Home, Sparkles } from "lucide-react"
import { useLearner } from "../../context/LearnerContext"
import Button from "../common/Button"
const links = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Quizzes", to: "/quizzes", icon: BookOpen },
  { label: "Interviews", to: "/interviews", icon: MessageSquare },
] 
export default function LearningSidebar({ open = false, onClose }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { learnerProfile, logout } = useLearner()
  const displayName = learnerProfile?.name || "User"
  const displayField = learnerProfile?.role || learnerProfile?.field || "Learner"
  const avatarUrl = learnerProfile?.avatar
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
  const handleLogout = () => {
    logout()
    navigate("/")
    if (onClose) { 
      onClose()
    }
  }
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-3 border-b border-gray-100 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-indigo-600 shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">UpSkillX</p>
              <p className="text-xs text-gray-500">Learning Platform</p>
            </div>
          </div>
          <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
            {links.map((item) => {
              const isActive = location.pathname === item.to
              const Icon = item.icon
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-linear-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={onClose}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
            <div className="pt-4 mt-4 border-t border-gray-100">
              <Link
                to="/"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                onClick={onClose}
              >
                <Home className="h-5 w-5" />
                Home
              </Link>
            </div>
          </nav>
          <div className="border-t border-gray-100 p-5 bg-gray-50/50">
            <div className="flex items-center gap-3 mb-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-11 w-11 rounded-full border-2 border-indigo-100 object-cover ring-2 ring-white"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-indigo-600 text-white font-semibold text-sm shadow-lg">
                  {initials || "U"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                <p className="text-xs text-gray-600 truncate">{displayField}</p>
              </div>
            </div>
            <Button 
              className="w-full bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 rounded-xl font-medium" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
