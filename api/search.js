export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const decodedUrl = decodeURIComponent(url);
        
        // Prepare fetch options
        const options = {
            method: req.method,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Referer': 'https://www.roblox.com/',
                'Origin': 'https://www.roblox.com',
                'Content-Type': req.headers['content-type'] || 'application/json'
            }
        };

        // Forward body for POST/PATCH/PUT
        if (['POST', 'PATCH', 'PUT'].includes(req.method) && req.body) {
            options.body = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
        }

        const response = await fetch(decodedUrl, options);
        const contentType = response.headers.get('content-type');

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            res.setHeader('Content-Type', 'application/json');
            return res.status(response.status).json(data);
        } else {
            const arrayBuffer = await response.arrayBuffer();
            res.setHeader('Content-Type', contentType || 'application/octet-stream');
            res.setHeader('Cache-Control', 'public, max-age=3600');
            return res.status(response.status).send(Buffer.from(arrayBuffer));
        }
    } catch (error) {
        console.error('Proxy Error:', error);
        return res.status(500).json({ error: 'Failed to fetch from Roblox', details: error.message });
    }
}
