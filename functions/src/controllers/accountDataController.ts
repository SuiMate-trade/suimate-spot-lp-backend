import { db } from '../utils/firebase.js';
import { getCoinPrice } from '../utils/getCoinPrice.js';
import client from '../utils/sui.js';

export const getAccountHoldingsController = async (address: string) => {
  try {
    const balances = await client.getAllBalances({
      owner: address,
    });

    const balancesWithMetadata = await Promise.all(
      balances
        .sort((a, b) =>
          BigInt(a.totalBalance) > BigInt(b.totalBalance) ? -1 : 1,
        )
        .map(async (balance) => {
          const coinType = balance.coinType;
          const coinMetadata = await client.getCoinMetadata({
            coinType,
          });
          const coinPrice = await getCoinPrice(coinType);

          return {
            ...balance,
            ...coinMetadata,
            coinPrice,
          };
        }),
    );

    return balancesWithMetadata;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getAccountStatsController = async (address: string) => {
  try {
    const userRef = db.collection('users').doc(address);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      return null;
    }

    return userSnapshot.data();
  } catch (error) {
    console.error(error);
    return null;
  }
};
