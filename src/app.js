// Update the checkDomain function in src/app.js
async function checkDomain(domain) {
    const results = {
        FNS: null,
        UD: null,
        ENS: null
    };
    
    try {
        const namespaces = ['FNS', 'UD', 'ENS'];
        
        // Using our tested API integration from the test file
        for (const namespace of namespaces) {
            try {
                const response = await axios({
                    method: 'GET',
                    url: `https://api.freename.io/api/v1/resolver/${namespace}/${domain}`,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                // Using the actual API response format we confirmed in our tests
                results[namespace] = {
                    available: false,
                    data: response.data,
                    timestamp: response.data.timestamp
                };
            } catch (error) {
                if (error.response?.status === 404) {
                    console.log(`Domain ${domain} not found in ${namespace}`);
                    results[namespace] = {
                        available: true,
                        message: 'Domain available'
                    };
                } else {
                    console.error(`${namespace} Resolution failed for ${domain}:`, error.response?.data || error.message);
                    results[namespace] = {
                        error: true,
                        message: 'API error occurred'
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
