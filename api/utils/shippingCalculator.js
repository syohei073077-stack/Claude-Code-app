const OKINAWA_SHIPPING = {
  rakuten: {
    free_threshold: 3000,
    default: 800,
    note: '3000円以上で送料無料（一部出品者による）'
  },
  yahoo: {
    free_threshold: 0,
    default: 550,
    note: '配送料は出品者による'
  },
  iherb: {
    free_threshold: 6000,
    default: 1200,
    note: '6000円以上で送料無料'
  },
  qoo10: {
    free_threshold: 5000,
    default: 600,
    note: 'QPAY利用で無料（条件あり）'
  },
  matsukiyo: {
    free_threshold: 3980,
    default: 660,
    note: '3980円以上で送料無料'
  },
  welcia: {
    free_threshold: 3980,
    default: 660,
    note: '3980円以上で送料無料'
  },
  kenko: {
    free_threshold: 5000,
    default: 800,
    note: '5000円以上で送料無料'
  },
  cosme: {
    free_threshold: 3000,
    default: 680,
    note: '3000円以上で送料無料'
  },
  rakutenBeauty: {
    free_threshold: 3000,
    default: 800,
    note: '3000円以上で送料無料'
  }
};

export function calculateShippingCost(siteKey, price) {
  const shipping = OKINAWA_SHIPPING[siteKey];
  if (!shipping) {
    return { shipping: 0, note: 'Unknown site' };
  }

  const shippingCost = price >= shipping.free_threshold ? 0 : shipping.default;
  return {
    shipping: shippingCost,
    note: shipping.note
  };
}

export function calculateTotal(price, siteKey) {
  const { shipping } = calculateShippingCost(siteKey, price);
  const tax = Math.floor(price * 0.1);
  return {
    price,
    shipping,
    tax,
    total: price + shipping + tax
  };
}
