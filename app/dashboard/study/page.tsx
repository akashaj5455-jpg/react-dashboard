"use client"

import { useState } from "react"
import { fetchVideoTranscript, generateNotes } from "@/actions/ai"
import ReactMarkdown from "react-markdown"

export default function StudyPage() {
    const [url, setUrl] = useState("")
    const [transcript, setTranscript] = useState("")
    const [notes, setNotes] = useState("")
    const [status, setStatus] = useState<"idle" | "fetching" | "generating" | "success" | "error">("idle")
    const [error, setError] = useState("")
    const [activeTab, setActiveTab] = useState<"youtube" | "manual">("youtube")

    async function handleStep1_Fetch() {
        if (!url) return
        setStatus("fetching")
        setError("")
        setNotes("")
        setTranscript("")

        try {
            const result = await fetchVideoTranscript(url)
            if (result.error) {
                setError(result.error)
                setStatus("error")
            } else if (result.transcript) {
                setTranscript(result.transcript)
                setStatus("idle") // Ready for step 2
            }
        } catch (e) {
            setError("Failed to fetch transcript.")
            setStatus("error")
        }
    }

    async function handleStep2_Generate() {
        if (!transcript) return
        setStatus("generating")
        setError("")

        try {
            const result = await generateNotes(transcript)
            if (result.error) {
                setError(result.error)
                setStatus("error")
            } else if (result.notes) {
                setNotes(result.notes)
                setStatus("success")
            }
        } catch (e) {
            setError("Failed to generate notes.")
            setStatus("error")
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="bg-white/80 backdrop-blur rounded-xl shadow-sm border border-gray-100 p-8">
                <h1 className="text-3xl font-bold mb-2 text-gray-800">AI Study Notes</h1>
                <p className="text-gray-600 mb-8">Generate structured study notes from YouTube videos or text.</p>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("youtube")}
                        className={`pb-2 px-4 font-medium transition-colors ${activeTab === "youtube" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        YouTube URL
                    </button>
                    <button
                        onClick={() => setActiveTab("manual")}
                        className={`pb-2 px-4 font-medium transition-colors ${activeTab === "manual" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        Manual Text
                    </button>
                </div>

                <div className="space-y-6">
                    {activeTab === "youtube" && (
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="flex-1 rounded-lg border-gray-300 bg-white py-3 px-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <button
                                onClick={handleStep1_Fetch}
                                disabled={status === "fetching" || !url}
                                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                            >
                                {status === "fetching" ? "Fetching..." : "Fetch Transcript"}
                            </button>
                        </div>
                    )}

                    {(activeTab === "manual" || transcript) && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {activeTab === "youtube" ? "Fetched Transcript (Editable)" : "Paste Transcript / Text Here"}
                            </label>
                            <textarea
                                value={transcript}
                                onChange={(e) => setTranscript(e.target.value)}
                                rows={8}
                                className="w-full rounded-lg border-gray-300 bg-white p-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm leading-relaxed"
                                placeholder="Paste the video transcript or any text here..."
                            />
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleStep2_Generate}
                                    disabled={status === "generating" || !transcript}
                                    className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center gap-2"
                                >
                                    {status === "generating" ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Generating Notes...
                                        </>
                                    ) : (
                                        "Generate Study Notes"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 flex items-center justify-between">
                        <span>{error}</span>
                        {activeTab === "youtube" && (
                            <button
                                onClick={() => setActiveTab("manual")}
                                className="text-sm underline hover:text-red-800"
                            >
                                Switch to Manual Input
                            </button>
                        )}
                    </div>
                )}
            </div>

            {notes && (
                <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg border border-gray-100 p-10 prose prose-indigo max-w-none animate-in fade-in zoom-in-95 duration-500">
                    <ReactMarkdown>{notes}</ReactMarkdown>
                </div>
            )}
        </div>
    )
}
