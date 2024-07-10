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
app.use(cors({
    origin: `${frontend_domain}`
}));

app.get('/login', (req, res) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo`;
    res.redirect(githubAuthUrl);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;

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
        res.redirect(`${frontend_domain}/editTasks.html?access_token=${accessToken}`);
    } catch (error) {
        res.send('Error during authentication: ' + error.message);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
