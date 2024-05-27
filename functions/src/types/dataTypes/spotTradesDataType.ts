export type SpotTradesDataType = {
  amountIn: string;
  amountOut: string;
  atob: boolean;
  event: string;
  eventSeq: string;
  fees?: string;
  platform: string;
  pool: string;
  sender: string;
  timestampMs: number;
  tokenAType: string;
  tokenBType: string;
  txnDigest: string;
};
