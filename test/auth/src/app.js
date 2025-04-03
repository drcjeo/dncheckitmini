const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Constants
const FREENAME_API = 'https://api.freename.io';

// Domain checking function using our tested API endpoints
async function checkDomain(domain) {
    const results = {
        FNS: null,
        UD: null,
        ENS: null
    };
    
    try {
        const namespaces = ['FNS', 'UD', 'ENS'];
        
        for (const namespace of namespaces) {
            try {
                const response = await axios({
                    method: 'GET',
                    url: `${FREENAME_API}/api/v1/resolver/${namespace}/${domain}`,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                results[namespace] = {
                    available: false,
                    data: response.data
                };
            } catch (error) {
                if (error.response?.status === 404) {
                    results[namespace] = {
                        available: true,
                        message: 'Domain available'
                    };
                }
            }
        }
        
        return results;
    } catch (error) {
        console.error('Domain check failed:', error);
        throw error;
    }
}

// API endpoint
app.post('/api/check-domain', async (req, res) => {
    try {
        const { domain } = req.body;
        const results = await checkDomain(domain);
        res.json(results);
    } catch (error) {
        res.status(500).json({
            error: 'Domain check failed',
            message: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`DNcheckit app running on port ${PORT}`);
});
