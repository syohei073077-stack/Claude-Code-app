import express from 'express';

const router = express.Router();

async function searchAllSites(keyword) {
  const results = [];
  const errors = [];

  try {
    const rakutenResponse = await fetch(
      `http://localhost:${process.env.PORT || 3001}/api/rakuten?q=${encodeURIComponent(keyword)}`,
      { timeout: 5000 }
    );
    if (rakutenResponse.ok) {
      const rakutenData = await rakutenResponse.json();
      results.push(...rakutenData.products);
    }
  } catch (error) {
    errors.push({ site: 'rakuten', error: error.message });
  }

  return { results, errors };
}

router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const keyword = q.trim().substring(0, 200);

    const { results, errors } = await searchAllSites(keyword);

    const sortedResults = results.sort((a, b) => a.total - b.total);
    const lowestPrice = sortedResults[0] || null;

    res.json({
      query: keyword,
      results: sortedResults,
      lowestPrice,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
