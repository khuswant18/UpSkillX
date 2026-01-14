import { useState } from "react"
import { useLearner } from "../../context/LearnerContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import Button from "../common/Button"
import { MessageSquare, ThumbsUp, Clock, CheckCircle2, AlertCircle, TrendingUp, Award } from "lucide-react"
export function FeedbackContent() {
  const { learnerProfile } = useLearner()
  const [expandedFeedback, setExpandedFeedback] = useState({})
  const toggleFeedback = (id) => {
    setExpandedFeedback(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }
  const interviews = learnerProfile?.interviewsPracticed || []
  const completedInterviews = interviews.filter(i => i.status === "completed")
  const pendingInterviews = interviews.filter(i => i.status === "pending" || i.status === "in-progress")
  const avgScore = completedInterviews.length > 0
    ? Math.round(completedInterviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) / completedInterviews.length)
    : 0
  return (
    <div className="space-y-6">
      {}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Feedback & Results</h2>
        <p className="text-slate-600 mt-1">Review your interview feedback and performance insights</p>
      </div>
      {}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-slate-200 bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Interviews</p>
                <p className="text-2xl font-bold text-slate-900">{interviews.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-slate-900">{completedInterviews.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-slate-900">{pendingInterviews.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Avg. Score</p>
                <p className="text-2xl font-bold text-slate-900">{avgScore > 0 ? `${avgScore}%` : "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {}
      {completedInterviews.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Interview Results</h3>
          {completedInterviews.map((interview, index) => {
            const score = interview.overallScore || 0
            const ratingColor = score >= 90 ? "text-green-600 bg-green-100" : 
                               score >= 75 ? "text-blue-600 bg-blue-100" : 
                               score >= 60 ? "text-amber-600 bg-amber-100" : "text-red-600 bg-red-100"
            const rating = score >= 90 ? "Excellent" : 
                          score >= 75 ? "Very Good" : 
                          score >= 60 ? "Good" : "Needs Improvement"
            return (
              <Card key={interview.id || index} className="border-slate-200 bg-white">
                <CardHeader>
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl text-slate-900">
                        {interview.role} - {interview.interviewType}
                      </CardTitle>
                      <CardDescription>
                        <span className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="h-4 w-4" />
                          {new Date(interview.completedAt || interview.startedAt).toLocaleDateString()} 
                          {interview.duration && ` • Duration: ${Math.round(interview.duration / 60)}m`}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      {score > 0 && (
                        <div className="text-right">
                          <p className="text-sm text-slate-600">Score</p>
                          <p className="text-2xl font-bold text-slate-900">{score}%</p>
                        </div>
                      )}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${ratingColor}`}>
                        {rating}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {}
                  {interview.feedback && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                        Overall Feedback
                      </h4>
                      <p className={`text-sm text-slate-700 leading-relaxed ${expandedFeedback[interview.id] ? '' : 'line-clamp-3'}`}>
                        {interview.feedback}
                      </p>
                      {interview.feedback.length > 150 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFeedback(interview.id)}
                          className="mt-2 text-blue-600 hover:text-blue-700"
                        >
                          {expandedFeedback[interview.id] ? "Show Less" : "Show More"}
                        </Button>
                      )}
                    </div>
                  )}
                  {}
                  <div className="grid gap-4 md:grid-cols-2">
                    {interview.strengths && interview.strengths.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4 text-green-600" />
                          Strengths
                        </h4>
                        <ul className="space-y-1">
                          {interview.strengths.map((strength, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                              <span className="text-green-600 mt-0.5">✓</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {interview.improvements && interview.improvements.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-amber-600" />
                          Areas for Improvement
                        </h4>
                        <ul className="space-y-1">
                          {interview.improvements.map((improvement, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                              <span className="text-amber-600 mt-0.5">→</span>
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-slate-200 bg-white">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-slate-100 p-4 mb-4">
              <AlertCircle className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No interview feedback yet
            </h3>
            <p className="text-slate-600 text-center max-w-md mb-6">
              Complete an interview practice session to receive personalized feedback and track your progress.
            </p>
            <Button 
              onClick={() => window.location.href = '/interviews'}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Start Interview Practice
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
