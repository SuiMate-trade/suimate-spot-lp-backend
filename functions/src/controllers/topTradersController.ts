import { GetTopSpotTradersRequestBody } from '../types/requestTypes/getTopTraders.js';
import { db } from '../utils/firebase.js';
import client from '../utils/sui.js';

export const getTopSpotTradesController = async (
  requestBody: GetTopSpotTradersRequestBody,
) => {
  try {
    const { orderBy, platform, limit } = requestBody;

    let topSpotTradersRef = db
      .collection('users')
      .orderBy(orderBy || 'totalVolumeSwapped', 'desc')
      .limit(limit || 10);

    if (platform) {
      topSpotTradersRef = db
        .collection('users')
        .orderBy(
          `swapData.${platform}.${orderBy}` ||
            `swapData.${platform}.totalVolumeSwapped`,
          'desc',
        )
        .limit(limit || 10);
    }

    const topSpotTradersSnapshot = await topSpotTradersRef.get();

    const data = [];

    await Promise.all(
      topSpotTradersSnapshot.docs.map(async (doc) => {
        const address = doc.id;
        const balances = await client.getAllBalances({
          owner: address,
        });

        const balancesWithMetadata = await Promise.all(
          balances
            .sort((a, b) =>
              BigInt(a.totalBalance) > BigInt(b.totalBalance) ? -1 : 1,
            )
            .slice(0, 5)
            .map(async (balance) => {
              const coinType = balance.coinType;
              const coinMetadata = await client.getCoinMetadata({
                coinType,
              });

              return {
                ...balance,
                ...coinMetadata,
              };
            }),
        );

        data.push({
          ...doc.data(),
          address,
          balances: balancesWithMetadata,
        });
      }),
    );

    return topSpotTradersSnapshot.docs.map((doc) => ({
      ...doc.data(),
      address: doc.id,
    }));
  } catch (error: any) {
    throw new Error(error.message);
  }
};
