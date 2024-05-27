import { UserType } from '../types/dataTypes/user.js';
import { db } from '../utils/firebase.js';

export const addTraderToAlertsListController = async (
  userAddress: `0x${string}`,
  traderAddress: `0x${string}`,
) => {
  const userRef = db.collection('suimate-users').doc(userAddress);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    throw new Error('User does not exist');
  }
  const userData = userDoc.data() as UserType;

  if (userData.alerts.includes(traderAddress)) {
    throw new Error('Trader is already in alerts');
  }

  if (userData.alerts.length >= 5) {
    throw new Error('Alerts list is full');
  }

  userData.alerts.push(traderAddress);
  await userRef.update(userData);

  const alertsRef = db.collection('alerts').doc(traderAddress);
  const alertsDoc = await alertsRef.get();

  if (!alertsDoc.exists) {
    await alertsRef.set({
      alerts: [userAddress],
    });
  } else {
    const alertsData = alertsDoc.data() as { alerts: string[] };
    if (alertsData.alerts.includes(userAddress)) {
      throw new Error('User is already in alerts');
    }
    alertsData.alerts.push(userAddress);
    await alertsRef.update(alertsData);
  }
};

export const removeTraderFromAlertsListController = async (
  userAddress: `0x${string}`,
  traderAddress: `0x${string}`,
) => {
  const userRef = db.collection('suimate-users').doc(userAddress);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new Error('User does not exist');
  }

  const userData = userDoc.data() as UserType;
  if (!userData.alerts.includes(traderAddress)) {
    throw new Error('Trader is not in alerts');
  }

  userData.alerts = userData.alerts.filter(
    (address) => address !== traderAddress,
  );
  await userRef.update(userData);

  const alertsRef = db.collection('alerts').doc(traderAddress);
  const alertsDoc = await alertsRef.get();

  if (!alertsDoc.exists) {
    throw new Error('Alerts list does not exist');
  }

  const alertsData = alertsDoc.data() as { alerts: string[] };
  if (!alertsData.alerts.includes(userAddress)) {
    throw new Error('User is not in alerts');
  }

  await alertsRef.update({
    alerts: alertsData.alerts.filter((address) => address !== userAddress),
  });
};

export const getTraderAlertsListForUserController = async (
  userAddress: `0x${string}`,
) => {
  const userRef = db.collection('suimate-users').doc(userAddress);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new Error('User does not exist');
  }

  const userData = userDoc.data() as UserType;
  return userData.alerts;
};

export const getUserAlertsListForTraderController = async (
  traderAddress: `0x${string}`,
) => {
  const alertsRef = db.collection('alerts').doc(traderAddress);
  const alertsDoc = await alertsRef.get();

  if (!alertsDoc.exists) {
    throw new Error('Alerts list does not exist');
  }

  const alertsData = alertsDoc.data() as { alerts: string[] };
  return alertsData.alerts;
};
