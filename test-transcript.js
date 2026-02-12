const { YoutubeTranscript } = require('youtube-transcript');

async function test() {
    try {
        console.log("Fetching transcript for video: jNQXAC9IVRw (Me at the zoo)");
        const transcript = await YoutubeTranscript.fetchTranscript('jNQXAC9IVRw');
        console.log("Success! Found " + transcript.length + " items.");
        console.log("First item:", transcript[0]);
    } catch (e) {
        console.error("Error fetching transcript:");
        console.error(e);
    }
}

test();
