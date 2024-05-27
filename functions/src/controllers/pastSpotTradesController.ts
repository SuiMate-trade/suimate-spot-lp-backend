import { SpotTradesDataType } from '../types/dataTypes/spotTradesDataType.js';
import { rtdb } from '../utils/firebase.js';
import { getCoinMetadata } from '../utils/sui.js';

export const getPastSpotTradesController = async (address: string) => {
  try {
    const spotTradesSnapshot = await rtdb.ref(`swaps/${address}`).once('value');

    if (!spotTradesSnapshot.exists()) {
      return [];
    }

    return await Promise.all(
      Object.values(spotTradesSnapshot.val()).map(async (data) => {
        const { tokenAType, tokenBType } = data as SpotTradesDataType;
        const tokenAMetadata = await getCoinMetadata(tokenAType);
        const tokenBMetadata = await getCoinMetadata(tokenBType);

        return {
          ...(data as SpotTradesDataType),
          tokenAMetadata,
          tokenBMetadata,
        };
      }),
    );
  } catch (error) {
    console.error(error);
    return [];
  }
};
