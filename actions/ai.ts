"use server"

import { Innertube } from "youtubei.js"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function fetchVideoTranscript(videoUrl: string) {
    try {
        const videoId = extractVideoId(videoUrl)
        if (!videoId) {
            return { error: "Invalid YouTube URL" }
        }

        // Use Innertube (youtubei.js)
        const youtube = await Innertube.create();
        const info = await youtube.getInfo(videoId);

        try {
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
            } else {
                throw new Error("Transcript data missing");
            }
        } catch (innerError: any) {
            const msg = innerError.message || "";
            if (msg.includes("FAILED_PRECONDITION") || msg.includes("disabled")) {
                return { error: "This video has disabled captions. Please use the Manual Input tab." }
            }
            throw innerError;
        }

    } catch (error) {
        console.error("Transcript Error:", error)
        return { error: error instanceof Error ? error.message : "Failed to fetch transcript" }
    }
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
