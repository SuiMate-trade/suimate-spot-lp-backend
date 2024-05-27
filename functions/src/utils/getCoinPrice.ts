import axios from 'axios';

export const getCoinPrice = async (coinType: string) => {
  try {
    const coinPriceResponse = await axios.get(
      `https://api.coingecko.com/api/v3/simple/token_price/sui?contract_addresses=${coinType}&vs_currencies=usd`,
    );

    return coinPriceResponse.data[coinType].usd;
  } catch (error) {
    console.error(error);
    return 0;
  }
};
