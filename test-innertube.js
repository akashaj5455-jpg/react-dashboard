const { Innertube } = require('youtubei.js');

(async () => {
    try {
        const youtube = await Innertube.create();
        const videoId = 'DYDs_Inzkz4'; // The problematic video

        console.log(`Fetching info for ${videoId}...`);
        const info = await youtube.getInfo(videoId);

        console.log("Video Info found. Check captions...");
        const captions = info.captions;

        if (!captions) {
            console.log("No captions found in info.");
        } else {
            console.log("Captions found! Attempting to get transcript...");
            try {
                const transcriptData = await info.getTranscript();

                if (transcriptData && transcriptData.transcript && transcriptData.transcript.content) {
                    console.log("Success! Transcript lines: " + transcriptData.transcript.content.body.initial_segments.length);
                    console.log("First line: " + transcriptData.transcript.content.body.initial_segments[0].snippet.text);
                } else {
                    console.log("Transcript data structure unexpected.");
                }
            } catch (innerError) {
                console.log("Direct getTranscript failed. This video likely restricts 3rd party caption access.");
                console.log("Error: " + innerError.message);
            }
        }

    } catch (error) {
        console.error("Innertube Error:", error);
    }
})();
