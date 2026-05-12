export function PriceComparisonResult({ results, loading, error, query }) {
  const siteLabels = {
    rakuten: '楽天',
    yahoo: 'Yahoo!ショッピング',
    iherb: 'iHerb',
    qoo10: 'Qoo10',
    matsukiyo: 'マツキヨ',
    welcia: 'ウエルシア',
    kenko: 'ケンコー',
    cosme: '@cosme',
    rakutenBeauty: '楽天Beauty'
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 h-24 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return query ? (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded-lg">
          「{query}」の検索結果が見つかりません
        </div>
      </div>
    ) : null;
  }

  const lowestPrice = results[0];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">「{query}」の検索結果</h2>
        <p className="text-gray-600">{results.length}件の商品が見つかりました</p>
      </div>

      <div className="space-y-4">
        {results.map((product, idx) => (
          <div
            key={idx}
            className={`border-2 rounded-lg p-4 transition ${
              idx === 0
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <div className="flex gap-4">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-24 h-24 object-cover rounded"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-blue-600 font-semibold mb-1">
                      {siteLabels[product.site] || product.site}
                      {idx === 0 && (
                        <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          最安値
                        </span>
                      )}
                    </p>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                      {product.title}
                    </h3>

                    {product.shopName && (
                      <p className="text-sm text-gray-600 mb-2">
                        店舗: {product.shopName}
                      </p>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-bold text-gray-900">
                      ¥{product.total.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <p>商品: ¥{product.price.toLocaleString()}</p>
                      <p>送料: ¥{product.shipping.toLocaleString()}</p>
                      <p>税金: ¥{product.tax.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  サイトで確認
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
