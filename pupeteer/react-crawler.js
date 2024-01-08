const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const validUrl = require('valid-url');

const app = express();

app.use(cors());

app.get('/images', async (req, res) => {
	const url = req.query.url;

	// Check if the URL is valid
	if (!validUrl.isUri(url)) {
		return res.status(400).json({ error: 'Invalid URL' });
	}

	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setUserAgent(
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
	);
	await page.goto(url, { waitUntil: 'networkidle0' });

	// Wait for a specific image to load
	await page.waitForSelector('img');

	const imgData = await page.evaluate(() =>
		Array.from(document.querySelectorAll('img'))
			.filter(img => img.naturalWidth > 400 && img.naturalHeight > 400)
			.map(img => ({
				src: img.src,
			}))
	);

	await browser.close();

	res.json(imgData);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
