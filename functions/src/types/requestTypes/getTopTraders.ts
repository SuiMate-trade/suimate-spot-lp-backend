export type GetTopSpotTradersRequestBody = {
  endTimestamp: number;
  orderBy: 'swapVolume' | 'swapsMade' | 'lastTxnTime';
  limit?: number;
  platform?: 'cetus' | 'turbos' | 'kriya';
};

export type GetTopLPTradersRequestBody = {
  endTimestamp: number;
  orderBy: 'lpVolume' | 'feesCollectedAmount' | 'lastTxnTime';
  limit?: number;
  platform?: 'cetus' | 'turbos';
};
