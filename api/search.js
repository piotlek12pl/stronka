export default async function handler(req, res) {
    const { keyword } = req.query;
    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }

    try {
        const response = await fetch(`https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(keyword)}&limit=10`);
        const data = await response.json();
        
        // Add CORS headers just in case
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch from Roblox' });
    }
}
