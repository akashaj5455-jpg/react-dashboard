"use server"

import { Innertube } from "youtubei.js"
import { YoutubeTranscript } from "youtube-transcript"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function fetchVideoTranscript(videoUrl: string) {
    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
        return { error: "Invalid YouTube URL" }
    }

    // Strategy 1: Try Innertube (youtubei.js) - Mimics a real client, good for restrictions
    try {
        console.log(`[AI] Attempting Strategy 1 (Innertube) for: ${videoId}`)
        const youtube = await Innertube.create();
        const info = await youtube.getInfo(videoId);
        const transcriptData = await info.getTranscript();

        if (
            transcriptData &&
            transcriptData.transcript &&
            transcriptData.transcript.content &&
            transcriptData.transcript.content.body &&
            transcriptData.transcript.content.body.initial_segments
        ) {
            const transcriptText = transcriptData.transcript.content.body.initial_segments
                .map((seg: any) => seg.snippet.text)
                .join(" ");
            return { transcript: transcriptText }
        }
    } catch (error: any) {
        console.warn(`[AI] Strategy 1 failed: ${error.message}`)
    }

    // Strategy 2: Try youtube-transcript - Lightweight scraper, good fallback
    try {
        console.log(`[AI] Attempting Strategy 2 (youtube-transcript) for: ${videoId}`)
        const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId)
        const transcriptText = transcriptItems.map((item) => item.text).join(" ")
        return { transcript: transcriptText }
    } catch (error: any) {
        console.warn(`[AI] Strategy 2 failed: ${error.message}`)
    }

    // If both fail:
    return { error: "Could not fetch transcript. Please use the 'Manual Text' tab to paste it manually." }
}

export async function generateNotes(transcriptText: string) {
    try {
        // Truncate if too long (Gemini 1.5 Flash has a large context window, but good to be safe)
        // A rough char limit, can be adjusted based on model
        const maxLength = 30000
        const truncatedTranscript = transcriptText.substring(0, maxLength)

        // Generate Summary with Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

        const prompt = `
        You are an expert student tutor. 
        Analyze the following text (video transcript) and create structured Study Notes.
        
        Format the output in clean Markdown:
        - Use # for the Main Title.
        - Use ## for Section Headers.
        - Use bullet points for key details.
        - Highlight important terms in **bold**.
        - Include a "Key Takeaways" section at the end.
        
        Transcript:
        ${truncatedTranscript}
        `

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        return { notes: text }

    } catch (error) {
        console.error("AI Generation Error:", error)
        return { error: "Failed to generate notes." }
    }
}

function extractVideoId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
}
