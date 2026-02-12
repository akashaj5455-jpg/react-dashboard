const { YoutubeTranscript } = require('youtube-transcript');

async function debug() {
    const videoId = 'DYDs_Inzkz4'; // The user's latest video
    console.log(`Checking video: ${videoId}`);

    try {
        // Try to fetch default
        console.log("Attempting fetchTranscript...");
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);
        console.log("Success! Found " + transcript.length + " lines.");
    } catch (e) {
        console.error("Default fetch failed:", e.message);
    }

    try {
        // Try to list available languages (if the library supports it, otherwise this might fail)
        // Note: youtube-transcript doesn't export a separate 'list' function easily, 
        // but let's see if we can catch the error object which might contain available langs.
        console.log("Trying to fetch with lang 'en' explicit...");
        await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' });
    } catch (e) {
        console.log("Explicit 'en' failed.");
    }
}

debug();
