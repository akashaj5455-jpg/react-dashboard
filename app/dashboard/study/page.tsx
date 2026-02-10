"use client"

import { useState } from "react"
import { generateStudyNotes } from "@/actions/ai"
import ReactMarkdown from "react-markdown"

export default function StudyPage() {
    const [url, setUrl] = useState("")
    const [notes, setNotes] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleGenerate() {
        if (!url) return
        setLoading(true)
        setError("")
        setNotes("")

        try {
            const result = await generateStudyNotes(url)
            if (result.error) {
                setError(result.error)
            } else if (result.notes) {
                setNotes(result.notes)
            }
        } catch (e) {
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white/80 backdrop-blur rounded-xl shadow-sm border border-gray-100 p-8">
                <h1 className="text-3xl font-bold mb-2 text-gray-800">AI Study Notes</h1>
                <p className="text-gray-600 mb-8">Paste a YouTube video URL to instantly generate structured study notes.</p>

                <div className="flex gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="flex-1 rounded-lg border-gray-300 bg-white py-3 px-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !url}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                    >
                        {loading ? "Analyzing..." : "Generate Notes"}
                    </button>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 mb-6">
                        {error}
                    </div>
                )}
            </div>

            {notes && (
                <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg border border-gray-100 p-10 prose prose-indigo max-w-none">
                    <ReactMarkdown>{notes}</ReactMarkdown>
                </div>
            )}
        </div>
    )
}
