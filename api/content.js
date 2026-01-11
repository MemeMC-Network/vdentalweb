const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only accept GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Try to read content.json from the repository root
        // In Vercel, the project files are in the current working directory
        let contentPath;
        
        // Try multiple possible paths
        const possiblePaths = [
            path.join(process.cwd(), 'content.json'),
            path.join(__dirname, '..', 'content.json'),
            path.join('/var/task', 'content.json')
        ];

        for (const tryPath of possiblePaths) {
            if (fs.existsSync(tryPath)) {
                contentPath = tryPath;
                break;
            }
        }

        if (!contentPath) {
            console.error('content.json not found in any of the expected locations');
            return res.status(404).json({ error: 'Content file not found' });
        }

        // Read the content file
        const contentData = fs.readFileSync(contentPath, 'utf8');
        const content = JSON.parse(contentData);

        // Return content as JSON
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(content);

    } catch (error) {
        console.error('Error reading content:', error);
        return res.status(500).json({ error: 'Failed to read content' });
    }
};
