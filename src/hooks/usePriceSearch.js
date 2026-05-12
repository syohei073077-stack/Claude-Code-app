import { useState } from 'react';

export function usePriceSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  const search = async (keyword) => {
    if (!keyword.trim()) {
      setError('商品名を入力してください');
      return;
    }

    setLoading(true);
    setError(null);
    setQuery(keyword);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(keyword)}`
      );

      if (!response.ok) {
        throw new Error('検索に失敗しました');
      }

      const data = await response.json();
      setResults(data.results || []);

      if (data.errors && data.errors.length > 0) {
        console.warn('Some sources failed:', data.errors);
      }
    } catch (err) {
      setError(err.message || '検索中にエラーが発生しました');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
    query,
    search
  };
}
