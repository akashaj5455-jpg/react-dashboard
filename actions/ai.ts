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

        // List of models to try in order of preference
        // We prioritize newer/better models, but fallback to lite/older ones on error
        const modelsToTry = [
            "gemini-2.0-flash",
            "gemini-2.0-flash-lite",
            "gemini-flash-latest",
            "gemini-pro-latest"
        ];

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

        let lastError = null;

        for (const modelName of modelsToTry) {
            try {
                console.log(`[AI] Trying model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                // Try generation with a short retry for transient 429s (optional but good)
                // But mainly we rely on switching models if one is exhausted
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                return { notes: text }; // Success! Return immediately

            } catch (error: any) {
                console.warn(`[AI] Failed with ${modelName}: ${error.message}`);
                lastError = error;

                // If it's a safety block or invalid prompt, don't retry other models
                if (error.message.includes("SAFETY") || error.message.includes("BLOCKED")) {
                    return { error: "Content blocked due to safety settings." };
                }

                // Continue to next model on 429 (Rate Limit) or 404 (Not Found)
            }
        }

        // If we get here, all models failed
        console.error("All AI models failed.");
        throw lastError || new Error("All available AI models failed.");

    } catch (error: any) {
        console.error("AI Generation Error:", error)
        return { error: error.message || "Failed to generate notes." }
    }
}

function extractVideoId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
}
