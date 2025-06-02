const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3005;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Increased limit for screenshots
app.use(express.static('src')); // Serve static files from src directory

// Create feedback directory if it doesn't exist
const feedbackDir = path.join(__dirname, 'feedback');
if (!fs.existsSync(feedbackDir)) {
    fs.mkdirSync(feedbackDir);
}

// Endpoint to handle feedback
app.post('/api/feedback', (req, res) => {
    const { userPlatform, userFeedback, screenshotIncluded, userScreenshot } = req.body;
    
    // Create a timestamp for the filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Save screenshot if included
    let screenshotPath = null;
    if (userScreenshot) {
        const screenshotBuffer = Buffer.from(userScreenshot, 'base64');
        screenshotPath = path.join(feedbackDir, `screenshot-${timestamp}.png`);
        fs.writeFileSync(screenshotPath, screenshotBuffer);
    }
    
    // Create feedback object
    const feedback = {
        timestamp,
        userPlatform,
        userFeedback,
        screenshotIncluded,
        screenshotPath: screenshotPath ? path.basename(screenshotPath) : null
    };
    
    // Save feedback to JSON file
    const feedbackPath = path.join(feedbackDir, `feedback-${timestamp}.json`);
    fs.writeFileSync(feedbackPath, JSON.stringify(feedback, null, 2));
    
    console.log('Feedback received:', feedback);
    res.json({ success: true, message: 'Feedback received' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Feedback will be saved in: ${feedbackDir}`);
}); 