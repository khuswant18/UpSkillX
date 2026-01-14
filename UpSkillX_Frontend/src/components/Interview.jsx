import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Vapi from "@vapi-ai/web";
import { useLearner } from "../context/LearnerContext";
import { ArrowLeft, Mic, MicOff, Phone, PhoneOff, User, Clock, ChevronDown, Check, RotateCcw, AlertCircle, Loader2 } from "lucide-react";
function Interview() {
  const navigate = useNavigate();
  const { learnerProfile, refreshProfile, loading: profileLoading } = useLearner();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("Configure your interview settings below");
  const [statusType, setStatusType] = useState("info"); // info, loading, success, error
  const [vapiInstance, setVapiInstance] = useState(null);
  const [interviewInfo, setInterviewInfo] = useState(null);
  const [interviewId, setInterviewId] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionTimeout, setConnectionTimeout] = useState(null);
  const transcriptEndRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const interviewIdRef = useRef(null);
  const transcriptRef = useRef([]);
  const callDurationRef = useRef(0);
  const [formData, setFormData] = useState({
    userId: learnerProfile?.id || `user_${Date.now()}`,
    role: learnerProfile?.role || "",
    interviewType: "mixed",
    technologies: learnerProfile?.skills || [],
  });
  useEffect(() => {
    if (learnerProfile) {
      setFormData((prev) => ({
        ...prev,
        userId: learnerProfile.id,
        role: learnerProfile.role || prev.role,
        technologies: learnerProfile.skills || prev.technologies,
      }));
    }
  }, [learnerProfile]);
  const hasAttemptedRefresh = useRef(false);
  useEffect(() => {
    if (!profileLoading && (!learnerProfile || !learnerProfile.id) && !hasAttemptedRefresh.current) {
      console.log("Profile missing, attempting to refresh once...");
      hasAttemptedRefresh.current = true;
      refreshProfile();
    }
  }, [profileLoading, learnerProfile, refreshProfile]);
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [transcript]);
  useEffect(() => {
    interviewIdRef.current = interviewId;
  }, [interviewId]);
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);
  useEffect(() => {
    callDurationRef.current = callDuration;
  }, [callDuration]);
  const vapiRef = useRef(null);
  useEffect(() => {
    const currentTimer = timerIntervalRef.current;
    return () => {
      if (vapiRef.current) {
        try {
          console.log("🧹 Cleaning up Vapi instance on unmount");
          vapiRef.current.stop();
        } catch (e) { }
      }
      if (currentTimer) clearInterval(currentTimer);
      if (connectionTimeout) clearTimeout(connectionTimeout);
    };
  }, []); // Run only on mount/unmount
  useEffect(() => {
    return () => {
      if (connectionTimeout) {
        console.log("🧹 Clearing connection timeout");
        clearTimeout(connectionTimeout);
      }
    };
  }, [connectionTimeout]);
  const roles = [
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Data Scientist",
    "Machine Learning Engineer",
    "DevOps Engineer",
    "Mobile Developer",
  ];
  const techOptions = {
    "Full Stack Developer": ["React", "Node.js", "MongoDB", "PostgreSQL", "Express", "TypeScript"],
    "Frontend Developer": ["React", "Vue.js", "Angular", "TypeScript", "Next.js", "CSS/SCSS"],
    "Backend Developer": ["Node.js", "Python", "Java", "Go", "PostgreSQL", "MongoDB", "Redis"],
    "Data Scientist": ["Python", "R", "TensorFlow", "PyTorch", "Pandas", "SQL"],
    "Machine Learning Engineer": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Keras"],
    "DevOps Engineer": ["Docker", "Kubernetes", "Jenkins", "AWS", "Terraform", "CI/CD"],
    "Mobile Developer": ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
  };
  const interviewTypes = [
    { id: "technical", label: "Technical", description: "Coding & system design" },
    { id: "behavioral", label: "Behavioral", description: "Soft skills & leadership" },
    { id: "mixed", label: "Mixed", description: "Both types combined" },
  ];
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "role") {
      setFormData((prev) => ({ ...prev, technologies: [] }));
    }
  };
  const toggleTechnology = (tech) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter((t) => t !== tech)
        : [...prev.technologies, tech],
    }));
  };
  const updateStatus = (message, type = "info") => {
    setStatus(message);
    setStatusType(type);
  };
  const startInterview = async () => {
    if (!formData.role) {
      updateStatus("Please select a role first", "error");
      return;
    }
    if (formData.technologies.length === 0) {
      updateStatus("Please select at least one technology", "error");
      return;
    }
    const userId = learnerProfile?.id;
    if (!userId) {
      updateStatus("User profile not loaded. Please refresh the page.", "error");
      return;
    }
    const interviewPayload = {
      userId,
      role: formData.role,
      interviewType: formData.interviewType,
      technologies: formData.technologies,
    };
    console.log("\n========== STARTING INTERVIEW ==========");
    console.log("📤 Interview payload:", interviewPayload);
    console.log("🔑 Auth token exists:", !!localStorage.getItem("authToken"));
    setIsLoading(true);
    updateStatus("Generating your personalized interview...", "loading");
    if (vapiRef.current) {
      try {
        console.log("🧹 Stopping previous Vapi instance before starting new one");
        await vapiRef.current.stop();
      } catch (e) { }
      vapiRef.current = null;
    }
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        updateStatus("Please log in again to continue", "error");
        setIsLoading(false);
        return;
      }
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      console.log("🌐 API URL:", API_URL);
      console.log("📤 Fetching:", `${API_URL}/interview/start-interview`);
      const res = await fetch(`${API_URL}/interview/start-interview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(interviewPayload),
      });
      console.log("📥 Response status:", res.status);
      console.log("📥 Response ok:", res.ok);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("❌ API Error Response:", errData);
        throw new Error(errData.error || `Server error (${res.status})`);
      }
      const data = await res.json();
      console.log("✅ API Response data:", {
        success: data.success,
        hasPublicKey: !!data.publicKey,
        publicKeyPreview: data.publicKey?.substring(0, 10) + "...",
        interviewId: data.interviewId,
        hasSystemPrompt: !!data.systemPrompt
      });
      if (!data.success) {
        console.error("❌ Interview start failed:", data.error);
        throw new Error(data.error || "Failed to start interview");
      }
      if (!data.publicKey) {
        console.error("❌ CRITICAL: No Vapi public key received from server!");
        throw new Error("Vapi configuration missing. Check server environment.");
      }
      setInterviewInfo(data.interviewConfig);
      setInterviewId(data.interviewId);
      setStep(2);
      updateStatus("Connecting to AI interviewer...", "loading");
      const timeout = setTimeout(() => {
        if (!isConnected) {
          updateStatus("Connection timed out. Please try again.", "error");
          setIsLoading(false);
          if (vapiRef.current) {
            try {
              console.log("🧹 Stopping Vapi due to connection timeout");
              vapiRef.current.stop();
            } catch (e) { }
            vapiRef.current = null;
          }
        }
      }, 30000);
      setConnectionTimeout(timeout);
      console.log("🎬 Initializing Vapi with public key:", data.publicKey.substring(0, 10) + "...");
      const vapi = new Vapi(data.publicKey);
      setVapiInstance(vapi);
      vapiRef.current = vapi;
      vapi.on("call-start", () => {
        console.log("✅ VAPI: Call started successfully!");
        clearTimeout(timeout);
        setConnectionTimeout(null);
        setIsConnected(true);
        setIsLoading(false);
        updateStatus("Interview in progress - speak clearly!", "success");
        const startTime = Date.now();
        timerIntervalRef.current = setInterval(() => {
          setCallDuration(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
      });
      vapi.on("call-end", async () => {
        const currentInterviewId = interviewIdRef.current;
        const currentTranscript = transcriptRef.current;
        const currentDuration = callDurationRef.current;
        console.log("📞 VAPI: Call ended");
        console.log("📞 Interview ID (from ref):", currentInterviewId);
        console.log("📞 Transcript length (from ref):", currentTranscript.length);
        console.log("📞 Duration (from ref):", currentDuration);
        setIsConnected(false);
        setIsSpeaking(false);
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
        if (currentInterviewId && currentTranscript.length > 0) {
          try {
            updateStatus("Saving interview and generating feedback...", "loading");
            console.log("📤 Saving interview:", {
              interviewId: currentInterviewId,
              transcriptLength: currentTranscript.length,
              duration: currentDuration
            });
            const response = await fetch(`${API_URL}/interview/complete`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                interviewId: currentInterviewId,
                transcript: currentTranscript,
                duration: currentDuration,
              }),
            });
            const result = await response.json();
            console.log("📥 Complete interview response:", result);
            if (result.success) {
              await refreshProfile();
              updateStatus("Interview complete! Check your Dashboard for feedback.", "success");
            } else {
              console.error("❌ Failed to save interview:", result.error);
              updateStatus("Interview complete. Feedback could not be saved.", "error");
            }
          } catch (error) {
            console.error("❌ Error saving interview:", error);
            updateStatus("Interview complete. Could not save feedback.", "error");
          }
        } else {
          console.log("ℹ️ Interview ended without transcript - nothing to save");
          updateStatus("Interview ended.", "info");
        }
      });
      vapi.on("speech-start", () => {
        console.log("🗣️ VAPI: AI Speech started");
        setIsSpeaking(true);
      });
      vapi.on("speech-end", () => {
        console.log("🤐 VAPI: AI Speech ended");
        setIsSpeaking(false);
      });
      vapi.on("message", (msg) => {
        console.log("💬 VAPI Message received:", msg.type, msg);
        if (msg.type === "transcript" && msg.transcriptType === "final") {
          console.log("📝 Transcript:", msg.role, "-", msg.transcript);
          const speaker = msg.role === "assistant" ? "AI" : "You";
          setTranscript((prev) => [
            ...prev,
            { speaker, text: msg.transcript, time: new Date().toLocaleTimeString() },
          ]);
        }
      });
      vapi.on("error", (error) => {
        console.error("❌ VAPI Error Event:", error);
        console.error("❌ VAPI Error details:", JSON.stringify(error, null, 2));
        updateStatus(`Connection failed: ${error.message || error.errorMessage || "Unknown error"}`, "error");
        setIsConnected(false);
        setIsLoading(false);
        clearTimeout(timeout);
      });
      vapi.on("volume-level", (volume) => {
      });
      const callConfig = {
        name: `${formData.role} Interview`,
        transcriber: { provider: "deepgram", model: "nova-2", language: "en-US" },
        model: {
          provider: "openai",
          model: "gpt-4o-mini",
          temperature: 0.7,
          messages: [{ role: "system", content: data.systemPrompt }],
        },
        voice: {
          provider: "openai",
          voiceId: "shimmer"
        },
        firstMessage: `Hello! I'm your interviewer for the ${formData.role} position. Let's start with a simple question - tell me about yourself and your experience.`,
      };
      console.log("🎬 Starting Vapi call with config:", {
        name: callConfig.name,
        transcriber: callConfig.transcriber,
        model: { ...callConfig.model, messages: "[REDACTED]" },
        voice: callConfig.voice
      });
      await vapi.start(callConfig);
      console.log("✅ Vapi start() called successfully");
    } catch (err) {
      console.error("❌ Interview error:", err);
      console.error("❌ Full error object:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
      console.log("========== END INTERVIEW (ERROR) ==========\n");
      updateStatus(`Error: ${err.message}`, "error");
      setIsLoading(false);
    }
  };
  const stopInterview = async () => {
    if (vapiRef.current) {
      try {
        console.log("🧹 Manually stopping interview");
        await vapiRef.current.stop();
      } catch (e) { }
      vapiRef.current = null;
    }
    setVapiInstance(null);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsConnected(false);
    setIsSpeaking(false);
    updateStatus("Interview ended", "info");
  };
  const resetForm = () => {
    stopInterview();
    setStep(1);
    setFormData({
      userId: learnerProfile?.id || `user_${Date.now()}`,
      role: learnerProfile?.role || "",
      interviewType: "mixed",
      technologies: learnerProfile?.skills || [],
    });
    setTranscript([]);
    setInterviewInfo(null);
    setInterviewId(null);
    setCallDuration(0);
    updateStatus("Configure your interview settings below", "info");
  };
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  const getStatusIcon = () => {
    switch (statusType) {
      case "loading": return <Loader2 className="h-4 w-4 animate-spin" />;
      case "success": return <Check className="h-4 w-4 text-green-500" />;
      case "error": return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };
  return (
    <div className="min-h-screen bg-slate-50">
      {}
      {profileLoading && (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
            <p className="mt-4 text-slate-600">Loading your profile...</p>
          </div>
        </div>
      )}
      {}
      {!profileLoading && !learnerProfile?.id && (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center max-w-md p-6">
            <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
            <h2 className="mt-4 text-lg font-semibold text-slate-900">Profile Not Available</h2>
            <p className="mt-2 text-slate-600">
              Please log in to access the interview feature.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
              >
                Go to Login
              </Link>
              <button
                onClick={() => {
                  hasAttemptedRefresh.current = false;
                  refreshProfile();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
      {}
      {!profileLoading && learnerProfile?.id && (
        <>
          {}
          <div className="border-b bg-white">
            <div className="mx-auto max-w-4xl px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link to="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
                    <ArrowLeft className="h-5 w-5" />
                    <span className="font-medium">Back</span>
                  </Link>
                  <div className="h-6 w-px bg-slate-200" />
                  <h1 className="text-xl font-bold text-slate-900">Mock Interview</h1>
                </div>
                {step === 2 && (
                  <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span className="font-mono text-lg font-semibold">{formatTime(callDuration)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mx-auto max-w-4xl px-4 py-8">
            {}
            <div className={`mb-6 flex items-center gap-3 rounded-lg px-4 py-3 ${statusType === "error" ? "bg-red-50 text-red-700" :
              statusType === "success" ? "bg-green-50 text-green-700" :
                statusType === "loading" ? "bg-blue-50 text-blue-700" :
                  "bg-slate-100 text-slate-700"
              }`}>
              {getStatusIcon()}
              <p className="text-sm font-medium">{status}</p>
            </div>
            {}
            {step === 1 && (
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-slate-900">Interview Configuration</h2>
                  <p className="text-sm text-slate-500">Set up your mock interview session</p>
                </div>
                <div className="space-y-6 p-6">
                  {}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Select Role <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.role}
                        onChange={(e) => handleInputChange("role", e.target.value)}
                        className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-3 pr-10 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="">-- Select a role --</option>
                        {roles.map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  {}
                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-700">
                      Interview Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {interviewTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => handleInputChange("interviewType", type.id)}
                          className={`rounded-lg border-2 p-4 text-left transition-all ${formData.interviewType === type.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 hover:border-slate-300"
                            }`}
                        >
                          <div className="font-medium text-slate-900">{type.label}</div>
                          <div className="mt-1 text-xs text-slate-500">{type.description}</div>
                          {formData.interviewType === type.id && (
                            <Check className="mt-2 h-4 w-4 text-blue-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  {}
                  {formData.role && (
                    <div>
                      <label className="mb-3 block text-sm font-medium text-slate-700">
                        Select Technologies <span className="text-red-500">*</span>
                        <span className="ml-2 text-xs text-slate-400">(at least 1)</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {techOptions[formData.role]?.map((tech) => (
                          <button
                            key={tech}
                            onClick={() => toggleTechnology(tech)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${formData.technologies.includes(tech)
                              ? "bg-blue-500 text-white"
                              : "border border-slate-300 bg-white text-slate-700 hover:border-blue-500"
                              }`}
                          >
                            {tech}
                            {formData.technologies.includes(tech) && <Check className="h-3.5 w-3.5" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {}
                  <button
                    onClick={startInterview}
                    disabled={!formData.role || formData.technologies.length === 0 || isLoading}
                    className="w-full rounded-lg bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Starting Interview...
                      </span>
                    ) : (
                      "Start Interview"
                    )}
                  </button>
                </div>
              </div>
            )}
            {}
            {step === 2 && (
              <div className="space-y-6">
                {}
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{formData.role}</h3>
                      <p className="text-sm text-slate-500">
                        {formData.interviewType.charAt(0).toUpperCase() + formData.interviewType.slice(1)} Interview • {formData.technologies.join(", ")}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${isConnected ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                      <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "animate-pulse bg-yellow-500"}`} />
                      {isConnected ? "Connected" : "Connecting..."}
                    </div>
                  </div>
                </div>
                {}
                <div className="grid gap-6 md:grid-cols-2">
                  {}
                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <div className="flex flex-col items-center py-8">
                      <div className={`flex h-24 w-24 items-center justify-center rounded-full border-4 ${isSpeaking ? "border-green-500 bg-green-50" : "border-slate-200 bg-slate-50"
                        }`}>
                        <Mic className={`h-10 w-10 ${isSpeaking ? "text-green-500" : "text-slate-400"}`} />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-slate-900">AI Interviewer</h3>
                      <p className="text-sm text-slate-500">
                        {isSpeaking ? "Speaking..." : isConnected ? "Listening..." : "Connecting..."}
                      </p>
                    </div>
                  </div>
                  {}
                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <div className="flex flex-col items-center py-8">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-blue-200 bg-blue-50">
                        <User className="h-10 w-10 text-blue-500" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-slate-900">You</h3>
                      <p className="text-sm text-slate-500">
                        {isConnected ? "Speak clearly into your microphone" : "Waiting to connect..."}
                      </p>
                    </div>
                  </div>
                </div>
                {}
                <div className="flex gap-3">
                  <button
                    onClick={stopInterview}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-600"
                  >
                    <PhoneOff className="h-5 w-5" />
                    End Interview
                  </button>
                  <button
                    onClick={resetForm}
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <RotateCcw className="h-5 w-5" />
                    New
                  </button>
                </div>
                {}
                {transcript.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">Conversation</h3>
                    <div className="max-h-64 space-y-3 overflow-y-auto">
                      {transcript.map((msg, index) => (
                        <div key={index} className={`flex ${msg.speaker === "You" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] rounded-lg px-4 py-2 ${msg.speaker === "You"
                            ? "bg-blue-500 text-white"
                            : "bg-slate-100 text-slate-900"
                            }`}>
                            <div className="mb-1 text-xs opacity-70">{msg.speaker} • {msg.time}</div>
                            <p className="text-sm">{msg.text}</p>
                          </div>
                        </div>
                      ))}
                      <div ref={transcriptEndRef} />
                    </div>
                  </div>
                )}
                {}
                {!isConnected && transcript.length > 0 && (
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full rounded-lg border-2 border-blue-500 bg-blue-50 px-6 py-4 font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    View Feedback on Dashboard →
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
export default Interview;
