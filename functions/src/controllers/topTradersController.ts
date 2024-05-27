import BigNumber from 'bignumber.js';
import { TraderType } from '../types/dataTypes/trader.js';
import { GetTopSpotTradersRequestBody } from '../types/requestTypes/getTopTraders.js';
import { db } from '../utils/firebase.js';
import { getCoinPrice } from '../utils/getCoinPrice.js';
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

    const data: TraderType[] = [];

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

              if (!coinMetadata) {
                return {
                  ...balance,
                };
              }

              const coinPrice = await getCoinPrice(coinType);
              const balanceInUsd = BigNumber(balance.totalBalance)
                .dividedBy(10 ** coinMetadata.decimals)
                .multipliedBy(coinPrice)
                .toFixed(2);

              return {
                ...balance,
                ...coinMetadata,
                balanceInUsd,
              };
            }),
        );

        data.push({
          ...(doc.data() as any),
          address,
          balances: balancesWithMetadata,
        });
      }),
    );

    return data.sort((a, b) => {
      if (!platform) {
        return BigNumber(a[orderBy]).gt(b[orderBy]) ? -1 : 1;
      } else {
        // @ts-ignore
        return BigNumber(a.swapData[platform][orderBy]).gt(
          // @ts-ignore
          b.swapData[platform][orderBy],
        )
          ? -1
          : 1;
      }
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};
