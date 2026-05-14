export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const decodedUrl = decodeURIComponent(url);
        
        const response = await fetch(decodedUrl, {
            method: req.method,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            }
        });

        const contentType = response.headers.get('content-type');
        res.setHeader('Content-Type', contentType || 'application/octet-stream');
        res.setHeader('Access-Control-Allow-Origin', '*');

        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return res.status(response.status).json(data);
        } else {
            // It's an image or other binary data
            const arrayBuffer = await response.arrayBuffer();
            return res.status(response.status).send(Buffer.from(arrayBuffer));
        }
    } catch (error) {
        console.error('Proxy Error:', error);
        return res.status(500).json({ error: 'Failed to fetch from Roblox', details: error.message });
    }
}
