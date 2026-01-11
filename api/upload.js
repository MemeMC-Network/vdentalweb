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

// Parse multipart form data (simple implementation for single file)
// NOTE: For production with large files, consider using 'busboy' or 'formidable' library
// This implementation may be vulnerable to memory exhaustion with very large files
async function parseMultipart(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        
        req.on('data', (chunk) => {
            chunks.push(chunk);
        });

        req.on('end', () => {
            try {
                const buffer = Buffer.concat(chunks);
                const boundary = req.headers['content-type'].split('boundary=')[1];
                
                if (!boundary) {
                    throw new Error('No boundary found');
                }

                const parts = buffer.toString('binary').split(`--${boundary}`);
                
                for (const part of parts) {
                    if (part.includes('filename=')) {
                        const filenameMatch = part.match(/filename="(.+?)"/);
                        const filename = filenameMatch ? filenameMatch[1] : 'upload.jpg';
                        
                        // Extract file content (after double CRLF)
                        const contentStart = part.indexOf('\r\n\r\n') + 4;
                        const contentEnd = part.lastIndexOf('\r\n');
                        
                        if (contentStart > 3 && contentEnd > contentStart) {
                            const fileContent = part.substring(contentStart, contentEnd);
                            const fileBuffer = Buffer.from(fileContent, 'binary');
                            
                            resolve({ filename, buffer: fileBuffer });
                            return;
                        }
                    }
                }
                
                reject(new Error('No file found in request'));
            } catch (error) {
                reject(error);
            }
        });

        req.on('error', reject);
    });
}

// Upload file to GitHub repository
async function uploadFileToGitHub(filename, fileBuffer) {
    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.REPO_OWNER;
    const repo = process.env.REPO_NAME;

    if (!token || !owner || !repo) {
        throw new Error('GitHub configuration missing');
    }

    // Create a safe filename
    const timestamp = Date.now();
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `assets/images/uploads/${timestamp}_${safeFilename}`;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    // Encode file content to base64
    const encodedContent = fileBuffer.toString('base64');

    // Upload file
    const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'vdentalweb'
        },
        body: JSON.stringify({
            message: `site: upload image ${safeFilename} via admin editor`,
            content: encodedContent
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload file');
    }

    const result = await response.json();
    
    return {
        path: filePath,
        url: result.content.download_url,
        commit: result.commit
    };
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

        // Check content type
        if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
            return res.status(400).json({ error: 'Content-Type must be multipart/form-data' });
        }

        // Parse multipart form data
        const { filename, buffer } = await parseMultipart(req);

        // Validate file type (basic check)
        // NOTE: For production, validate actual file content/magic bytes, not just extension
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
        
        if (!allowedExtensions.includes(ext)) {
            return res.status(400).json({ error: 'Invalid file type. Only images are allowed.' });
        }

        // Upload to GitHub
        const result = await uploadFileToGitHub(filename, buffer);

        return res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            path: result.path,
            url: result.url,
            commit: result.commit
        });

    } catch (error) {
        console.error('Upload error:', error);
        
        if (error.message.includes('token')) {
            return res.status(401).json({ error: error.message });
        }
        
        return res.status(500).json({ error: error.message || 'Failed to upload image' });
    }
};
