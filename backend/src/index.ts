import express, { Request, Response } from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database
const urlDatabase: Record<string, string> = {};

// POST /shorten - create a shortened URL
app.post('/shorten', (req: Request, res: Response): void => {
    let { originalUrl } = req.body;

    if (!originalUrl || typeof originalUrl !== 'string') {
        res.status(400).json({ error: 'Invalid URL' });
        return;
    }

    originalUrl = originalUrl.trim();
    if (!/^https?:\/\//i.test(originalUrl)) {
        originalUrl = 'https://' + originalUrl;
    }

    const shortCode = nanoid(6);
    urlDatabase[shortCode] = originalUrl;

    console.log('Storing:', shortCode, '=>', originalUrl);

    res.json({ shortCode });
});


// GET /:shortCode - redirect to original URL
app.get('/:shortCode', (req: Request, res: Response): void => {
    const { shortCode } = req.params;
    const originalUrl = urlDatabase[shortCode];

    console.log('Incoming shortCode:', shortCode);
    console.log('Current DB:', urlDatabase);

    if (originalUrl) {
        res.redirect(originalUrl);
    } else {
        res.status(404).send('URL not found');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
