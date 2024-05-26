import { GetTopSpotTradersRequestBody } from '../types/requestTypes/getTopTraders.js';
import { db } from '../utils/firebase.js';

export const getTopSpotTradesController = async (
  requestBody: GetTopSpotTradersRequestBody,
) => {
  try {
    const { endTimestamp, orderBy, platform, limit } = requestBody;

    let topSpotTradersRef = db
      .collection('users')
      .where('lastSwapTimestampMs', '>=', endTimestamp)
      .orderBy(orderBy || 'totalVolumeSwapped', 'desc')
      .limit(limit || 10);

    if (platform) {
      topSpotTradersRef = db
        .collection('users')
        .where('lastSwapTimestampMs', '>=', endTimestamp)
        .orderBy(
          `swapData.${platform}.${orderBy}` ||
            `swapData.${platform}.totalVolumeSwapped`,
          'desc',
        )
        .limit(limit || 10);
    }

    const topSpotTradersSnapshot = await topSpotTradersRef.get();

    return topSpotTradersSnapshot.docs.map((doc) => ({
      ...doc.data(),
      address: doc.id,
    }));
  } catch (error: any) {
    throw new Error(error.message);
  }
};
