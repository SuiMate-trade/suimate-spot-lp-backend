export type UserType = {
  address: `0x${string}`;
  favorites: `0x${string}`[];
  alerts: `0x${string}`[];
  chatId?: number;
  firstName?: string;
  userName?: string;
  userId?: string;
};
