import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLearner } from "../../context/LearnerContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Button from "../common/Button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, Award, BookOpen, MessageSquare, ArrowRight, Play } from "lucide-react";
export function OverviewContent() {
  const { learnerProfile } = useLearner();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    avgScore: 0,
    totalInterviews: 0,
    completedInterviews: 0,
  });
  const [expandedFeedback, setExpandedFeedback] = useState({});
  const toggleFeedback = (interviewId) => {
    setExpandedFeedback((prev) => ({
      ...prev,
      [interviewId]: !prev[interviewId],
    }));
  };
  useEffect(() => {
    if (learnerProfile) {
      const quizzes = learnerProfile.quizAttempts || [];
      const interviews = learnerProfile.interviewsPracticed || [];
      const totalQuizzes = quizzes.length;
      const avgScore =
        totalQuizzes > 0
          ? quizzes.reduce((sum, q) => sum + (q.percentage || 0), 0) /
            totalQuizzes
          : 0;
      const totalInterviews = interviews.length;
      const completedInterviews = interviews.filter(
        (i) => i.status === "completed"
      ).length;
      setStats({
        totalQuizzes,
        avgScore: Math.round(avgScore * 10) / 10,
        totalInterviews,
        completedInterviews,
      });
    }
  }, [learnerProfile]);
  const quizChartData = (learnerProfile?.quizAttempts || [])
    .slice(-6)
    .map((quiz, index) => ({
      name: `Quiz ${index + 1}`,
      score: quiz.percentage || 0,
      total: 100,
    }));
  const skillsChartData = (learnerProfile?.skills || [])
    .slice(0, 5)
    .map((skill) => ({
      skill,
      progress: 75, // Default progress since we don't track individual skill progress yet
    }));
  return (
    <div className="space-y-8">
      {}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome back, {learnerProfile?.name || "Learner"}! 👋
        </h2>
        <p className="text-gray-600 mt-2 text-base">
          {learnerProfile?.role || "Track your learning progress and achievements"}
        </p>
      </div>
      {}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-50 opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Quiz Attempts</p>
              <div className="p-2.5 rounded-xl bg-indigo-100">
                <Award className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalQuizzes}
            </div>
            <p className="text-xs text-gray-500">
              {stats.totalQuizzes > 0 ? "Keep it up!" : "Start your first quiz"}
            </p>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-50 opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <div className="p-2.5 rounded-xl bg-emerald-100">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.avgScore > 0 ? `${stats.avgScore}%` : "N/A"}
            </div>
            <p className="text-xs text-gray-500">
              {stats.totalQuizzes > 0 ? "Great progress!" : "Take a quiz"}
            </p>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-violet-50 opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Skills Tracked</p>
              <div className="p-2.5 rounded-xl bg-violet-100">
                <BookOpen className="h-5 w-5 text-violet-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {learnerProfile?.skills?.length || 0}
            </div>
            <p className="text-xs text-gray-500">
              {learnerProfile?.experience || "Set your level"}
            </p>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-50 opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-600">Interviews</p>
              <div className="p-2.5 rounded-xl bg-amber-100">
                <MessageSquare className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalInterviews}
            </div>
            <p className="text-xs text-gray-500">
              <span className="text-emerald-600 font-semibold">
                {stats.completedInterviews}
              </span>{" "}
              completed
            </p>
          </div>
        </div>
      </div>
      {}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-indigo-500 to-indigo-600 p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm">
                <Play className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Practice Quizzes</h3>
                <p className="text-indigo-100 text-sm">Test your knowledge</p>
              </div>
            </div> 
            <p className="text-indigo-50 text-sm mb-6 leading-relaxed">
              Challenge yourself with AI-generated quizzes across multiple topics and difficulty levels.
            </p>
            <Button 
              onClick={() => navigate("/quizzes")}
              className="w-full text-black hover:bg-indigo-50 font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Start Quiz
            </Button> 
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-600 p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Mock Interviews</h3>
                <p className="text-emerald-100 text-sm">Practice with AI</p>
              </div>
            </div>
            <p className="text-emerald-50 text-sm mb-5 leading-relaxed">
              Get real-time feedback on your interview skills with AI-powered mock interviews.
            </p>
            <Button 
              onClick={() => navigate("/interviews")}
              className="w-full text-black hover:bg-emerald-50 font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Start Interview
            </Button>
          </div>
        </div>
      </div>
      {}
      {(stats.totalQuizzes > 0 ||
        (learnerProfile?.skills?.length || 0) > 0) && (
        <div className="grid gap-6 lg:grid-cols-2">
          {}
          {stats.totalQuizzes > 0 && (
            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="text-slate-900">Recent Quiz Performance</CardTitle>
                <CardDescription className="text-slate-600">
                  Your last {quizChartData.length} quiz attempts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={quizChartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                    />
                    <XAxis 
                      dataKey="name" 
                      className="text-xs"
                      stroke="#64748b"
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      className="text-xs"
                      stroke="#64748b"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#2563eb"
                      strokeWidth={3}
                      name="Score %"
                      dot={{ fill: "#2563eb", r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
          {}
          {(learnerProfile?.skills?.length || 0) > 0 && (
            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="text-slate-900">Your Tech Stack</CardTitle>
                <CardDescription className="text-slate-600">Skills you're tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={skillsChartData} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      className="text-xs"
                      stroke="#64748b"
                    />
                    <YAxis
                      dataKey="skill"
                      type="category"
                      width={100}
                      className="text-xs"
                      stroke="#64748b"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                      }}
                    />
                    <Bar
                      dataKey="progress"
                      fill="#8b5cf6"
                      radius={[0, 8, 8, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      {}
      {stats.completedInterviews > 0 && (
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="text-slate-900">Recent Interview Feedback</CardTitle>
            <CardDescription className="text-slate-600">
              Summary of your latest interview sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(learnerProfile?.interviewsPracticed || [])
                .filter((interview) => interview.status === "completed")
                .slice(0, 3)
                .map((interview, index) => (
                  <div
                    key={interview.id || index}
                    className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-slate-900">
                          {interview.role} - {interview.interviewType}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {new Date(
                            interview.startedAt || interview.completedAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      {interview.overallScore && (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                          {interview.overallScore}%
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      {interview.feedback ? (
                        <>
                          <p
                            className={`text-sm text-slate-700 ${
                              expandedFeedback[interview.id]
                                ? ""
                                : "line-clamp-2"
                            }`}
                          >
                            {interview.feedback}
                          </p>
                          {interview.feedback.length > 100 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFeedback(interview.id)}
                              className="text-xs text-blue-600 hover:text-blue-700"
                            >
                              {expandedFeedback[interview.id]
                                ? "Show Less"
                                : "Show Full Feedback"}
                            </Button>
                          )}
                        </>
                      ) : (
                        <div className="text-sm text-slate-500 italic">
                          No feedback available for this interview
                        </div>
                      )}
                    </div>
                    {interview.strengths && interview.strengths.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {interview.strengths.slice(0, 3).map((strength, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-green-100 px-2 py-1 text-xs text-green-700 font-medium"
                          >
                            {strength}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
            {stats.completedInterviews > 3 && (
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="w-full mt-4 border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                View All Feedback
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      {}
      {stats.totalQuizzes === 0 && stats.totalInterviews === 0 && (
        <Card className="border-slate-200 bg-white">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-blue-100 p-4 mb-4">
              <BookOpen className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Ready to start your learning journey?
            </h3>
            <p className="text-slate-600 text-center max-w-md mb-6">
              Take a quiz or practice an interview to get personalized feedback
              and track your progress.
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={() => navigate("/quizzes")}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Start Quiz
              </Button>
              <Button 
                onClick={() => navigate("/interviews")}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Practice Interview
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
export default OverviewContent;
