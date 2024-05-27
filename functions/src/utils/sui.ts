import { SuiHTTPTransport, SuiClient } from '@mysten/sui.js/client';
import { SUI_RPC_ENDPOINT } from '../constants/index.js';
import cache from './cache.js';

const client = new SuiClient({
  transport: new SuiHTTPTransport({
    url: SUI_RPC_ENDPOINT,
  }),
});

export const getCoinMetadata = async (coinType: string) => {
  try {
    if (cache.get(coinType)) {
      return cache.get(coinType);
    }

    const coinMetadata = await client.getCoinMetadata({
      coinType,
    });

    cache.set(coinType, coinMetadata);

    return coinMetadata;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default client;
