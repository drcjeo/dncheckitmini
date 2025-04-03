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

describe('DNcheckit Domain Check', function() {
    this.timeout(30000);

    async function checkDomain(domain) {
        try {
            console.log(`\nChecking domain: ${domain}`);
            
            const response = await axios({
                method: 'GET',
                url: `https://apis.freename.io/api/v1/resolver/resolve/${domain}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            // Simplified response
            console.log('\nDomain Status:', 'Registered');
            console.log('Network:', response.data.data.network);
            console.log('TLD:', response.data.data.tld);
            console.log('SLD:', response.data.data.sld);
            
            return response.data;

        } catch (error) {
            if (error.response?.status === 404) {
                console.log('\nDomain Status: Available');
                return { available: true };
            }
            console.error('\nError:', error.response?.data?.message || error.message);
            return { error: true, message: error.response?.data?.message || error.message };
        }
    }

    it('should check domain availability', async function() {
        try {
            const domain = await question('\nEnter domain to check: ');
            await checkDomain(domain);
        } finally {
            rl.close();
        }
    });

    after(function() {
        rl.close();
    });
});
