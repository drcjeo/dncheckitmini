const chai = require('chai');
const expect = chai.expect;
const axios = require('axios');
const readline = require('readline');
require('dotenv').config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

describe('Freename Domain Check', function() {
    this.timeout(30000);

    async function checkDomain(domain) {
        try {
            console.log(`\nChecking domain: ${domain}`);
            
            // Using the correct API endpoint from Freename documentation
            const response = await axios({
                method: 'GET',
                url: `https://api.freename.io/v1/domain/${domain}/availability`,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('API Response:', JSON.stringify(response.data, null, 2));
            return response.data;

        } catch (error) {
            console.error('API Error:', error.response?.data || error.message);
            return { error: true, message: error.response?.data || error.message };
        }
    }

    it('should check domain availability', async function() {
        try {
            const domain = await question('\nEnter domain to check (any TLD/SLD): ');
            await checkDomain(domain);
        } finally {
            rl.close();
        }
    });

    after(function() {
        rl.close();
    });
});
