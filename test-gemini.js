const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Manually load .env
const envPath = path.resolve(__dirname, '.env');
try {
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                let value = parts.slice(1).join('=').trim();
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.substring(1, value.length - 1);
                }
                if (key && value) process.env[key] = value;
            }
        });
    }
} catch (e) {
    console.error('Error loading .env:', e);
}

async function main() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log(`Using API Key: ${apiKey ? apiKey.substring(0, 5) + '...' : 'Missing'}`);

    // Try specifically gemini-2.0-flash
    const targetModel = "gemini-2.0-flash";
    console.log(`\nTesting specific model: ${targetModel}...`);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: targetModel });

    try {
        const result = await model.generateContent("Explain React in 5 words.");
        const response = await result.response;
        console.log(`✅ Success with ${targetModel}! Output: ${response.text()}`);
    } catch (e) {
        console.log(`❌ Failed with ${targetModel}: ${e.message}`);
    }
}

main();
