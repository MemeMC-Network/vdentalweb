const jwt = require('jsonwebtoken');

// Verify JWT token
function verifyToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('No token provided');
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error('JWT secret not configured');
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

// Update file in GitHub repository
async function updateFileInGitHub(content) {
    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.REPO_OWNER;
    const repo = process.env.REPO_NAME;

    if (!token || !owner || !repo) {
        throw new Error('GitHub configuration missing');
    }

    const filePath = 'content.json';
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    // Get current file SHA
    const getResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'vdentalweb'
        }
    });

    if (!getResponse.ok) {
        throw new Error('Failed to get current file information');
    }

    const fileData = await getResponse.json();
    const sha = fileData.sha;

    // Update file
    const contentString = JSON.stringify(content, null, 2);
    const encodedContent = Buffer.from(contentString).toString('base64');

    const updateResponse = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'vdentalweb'
        },
        body: JSON.stringify({
            message: 'site: update content.json via admin editor',
            content: encodedContent,
            sha: sha
        })
    });

    if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.message || 'Failed to update file');
    }

    return await updateResponse.json();
}

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only accept POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Verify authentication
        verifyToken(req);

        // Get content from request body
        const updatedContent = req.body;

        if (!updatedContent) {
            return res.status(400).json({ error: 'No content provided' });
        }

        // Validate JSON (basic check)
        if (typeof updatedContent !== 'object') {
            return res.status(400).json({ error: 'Invalid content format' });
        }

        // Update file in GitHub
        const result = await updateFileInGitHub(updatedContent);

        return res.status(200).json({
            success: true,
            message: 'Content updated successfully',
            commit: result.commit
        });

    } catch (error) {
        console.error('Save error:', error);
        
        if (error.message.includes('token')) {
            return res.status(401).json({ error: error.message });
        }
        
        return res.status(500).json({ error: error.message || 'Failed to save content' });
    }
};
