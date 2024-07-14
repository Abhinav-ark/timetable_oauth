// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const cors = require('cors');


const app = express();
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const frontend_domain = process.env.FRONTEND_DOMAIN;

// Enable CORS for your frontend domain
app.use(cors());

app.get('/login', (req, res) => {
    try {
        // Ensure the page parameter is present
        const page = req.query.page;
        if (!page) {
            return res.status(400).send('Missing required parameter: page');
        }

        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(`${redirectUri}?page=${page}`)}&scope=repo`;
        res.redirect(githubAuthUrl);
    } catch (error) {
        console.error('Error in /login endpoint:', error);
        res.status(500).send('An unexpected error occurred. Please try again later.');
    }
});


app.get('/callback', async (req, res) => {
    const code = req.query.code;
    const page = req.query.page;

    try {
        const response = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            redirect_uri: redirectUri
        }, {
            headers: {
                'Accept': 'application/json'
            }
        });

        const accessToken = response.data.access_token;
        res.redirect(`${frontend_domain}/editTasks.html?access_token=${accessToken}&page=${page}`);
    } catch (error) {
        res.send('Error during authentication: ' + error.message);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
