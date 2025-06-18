const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8000;

// HTTP request logger
const morgan = require('morgan');
app.use(morgan('dev'));

// Middleware to parse JSON bodies
app.use(express.json());

// Set up MIME types
// app.use((req, res, next) => {
//     res.setHeader('Content-Type', 'application/javascript');
//     next();
// });

// --- /apis/function-call endpoint ---
const axios = require('axios');

app.post('/apis/function-call', async (req, res) => {
    // Try to get API key from header or body
    const apiKey = req.headers['x-api-key'] || req.body.apiKey;
    if (!apiKey) {
        return res.status(401).json({ error: 'API key missing' });
    }

    // Extract model, messages, functions from request body
    const { model, messages, functions, function_call } = req.body;
    if (!model || !messages) {
        return res.status(400).json({ error: 'Missing model or messages in request body.' });
    }

    try {
        // Only make one call to OpenAI API
        const openaiRes = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model,
                messages,
                ...(functions ? { functions } : {}),
                ...(function_call ? { function_call } : {})
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        // Always respond with the OpenAI API response data only
        return res.json(openaiRes.data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message });
    }
});


app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res, next) => {
    // If the request has a file extension, skip to static middleware
    if (path.extname(req.path)) {
        return next();
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
