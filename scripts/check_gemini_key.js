const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    if (envConfig.NEXT_PUBLIC_GEMINI_API_KEY) {
        console.log('NEXT_PUBLIC_GEMINI_API_KEY is present');
    } else {
        console.log('NEXT_PUBLIC_GEMINI_API_KEY is MISSING in .env.local');
    }
} else {
    console.log('.env.local file not found');
}
