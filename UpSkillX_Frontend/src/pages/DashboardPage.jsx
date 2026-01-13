import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, Home, LogOut, LayoutDashboard, MessageSquare } from "lucide-react"
import LearningSidebar from "../components/layout/LearningSidebar"
import Button from "../components/common/Button"
import { OverviewContent } from "../components/dashboard/overview-content"
import { FeedbackContent } from "../components/dashboard/feedback-content"
import { useLearner } from "../context/LearnerContext"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const { logout } = useLearner()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "feedback", label: "Feedback", icon: MessageSquare }
  ]

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-indigo-50/30">
      <LearningSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-72 flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 border-b border-gray-200/60">
          <div className="flex h-16 items-center justify-between px-6 lg:px-10">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden inline-flex items-center gap-2 hover:bg-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">Dashboard</p>
                <h1 className="text-lg font-bold text-gray-900 -mt-0.5">{activeTab === "overview" ? "Overview" : "Feedback & Results"}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/"> 
                <Button variant="outline" size="sm" className="inline-flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Home</span>
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                className="inline-flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div> 
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 px-6 lg:px-10 -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all relative ${
                    activeTab === tab.id
                      ? "text-indigo-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </button>
              )
            })}
          </div>
        </header>

        <main className="flex-1 px-6 py-8 lg:px-10 lg:py-10">
          {activeTab === "overview" ? <OverviewContent /> : <FeedbackContent />}
        </main>
      </div>
    </div>
  )
}
