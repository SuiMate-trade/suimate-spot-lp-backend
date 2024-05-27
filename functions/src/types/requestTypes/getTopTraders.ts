export type GetTopSpotTradersRequestBody = {
  orderBy: 'totalVolumeSwapped' | 'totalSwapsMade' | 'lastSwapTimestampMs';
  limit?: number;
  platform?: 'cetus' | 'turbos' | 'kriya';
};

export type GetTopLPTradersRequestBody = {
  orderBy: 'lpVolume' | 'feesCollectedAmount' | 'lastTxnTime';
  limit?: number;
  platform?: 'cetus' | 'turbos';
};
