import axios from 'axios';
import cache from './cache.js';

export const getCoinPrice = async (coinType: string) => {
  try {
    let coingeckoId = '';

    if (cache.get(`coingeckoId-${coinType}`)) {
      coingeckoId = cache.get(`coingeckoId-${coinType}`) as string;
    } else {
      const coinMetadataResponse = await axios.get(
        `https://api.coingecko.com/api/v3/coins/sui/contract/${coinType}`,
      );

      coingeckoId = coinMetadataResponse.data.id;
      cache.set(`coingeckoId-${coinType}`, coingeckoId);
    }

    const coinPriceResponse = await axios.get(
      `https://api.martianwallet.xyz/v1/prices/market-value-data/${coingeckoId}`,
    );

    return coinPriceResponse.data.market_data.current_price.usd;
  } catch (error) {
    console.error(error);
    return 0;
  }
};
