import express from 'express';
import NodeCache from 'node-cache';
import { calculateTotal } from '../utils/shippingCalculator.js';

const router = express.Router();
const cache = new NodeCache({ stdTTL: 1800 });

const RAKUTEN_API_KEY = process.env.RAKUTEN_API_KEY;
const RAKUTEN_ENDPOINT = 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601';

async function fetchRakutenProducts(keyword) {
  if (!RAKUTEN_API_KEY) {
    throw new Error('RAKUTEN_API_KEY not set');
  }

  const cacheKey = `rakuten:${keyword}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const params = new URLSearchParams({
    applicationId: RAKUTEN_API_KEY,
    keyword,
    hits: 10,
    sort: 'sales'
  });

  const response = await fetch(`${RAKUTEN_ENDPOINT}?${params}`);
  if (!response.ok) {
    throw new Error(`Rakuten API error: ${response.status}`);
  }

  const data = await response.json();
  const products = (data.Items || []).map(item => {
    const itemData = item.Item;
    const priceInfo = calculateTotal(itemData.itemPrice, 'rakuten');
    return {
      site: 'rakuten',
      title: itemData.itemName,
      price: itemData.itemPrice,
      image: itemData.mediumImageUrl,
      url: itemData.itemUrl,
      shopName: itemData.shopName,
      ...priceInfo
    };
  });

  cache.set(cacheKey, products);
  return products;
}

router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const keyword = q.trim().substring(0, 200);
    const products = await fetchRakutenProducts(keyword);
    res.json({ site: 'rakuten', products, count: products.length });
  } catch (error) {
    console.error('Rakuten API error:', error);
    res.status(500).json({ error: 'Failed to fetch Rakuten products' });
  }
});

export default router;
