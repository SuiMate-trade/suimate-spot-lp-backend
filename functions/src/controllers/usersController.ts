import { UserType } from '../types/dataTypes/user.js';
import { db } from '../utils/firebase.js';
import { customAlphabet } from 'nanoid';
import axios from 'axios';

export const saveUserController = async (userAddress: `0x${string}`) => {
  const userRef = db.collection('suimate-users').doc(userAddress);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    throw new Error('User already exists');
  }

  const nanoid = customAlphabet(userAddress, 10);

  await userRef.set({
    address: userAddress,
    favorites: [],
    alerts: [],
    userId: nanoid(),
  });
};

export const addToFavoritesController = async (
  userAddress: `0x${string}`,
  traderAddress: `0x${string}`,
) => {
  const userRef = db.collection('suimate-users').doc(userAddress);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    throw new Error('User does not exist');
  }
  const userData = userDoc.data() as UserType;

  if (userData.favorites.includes(traderAddress)) {
    throw new Error('Trader is already in favorites');
  }

  if (userData.favorites.length >= 10) {
    throw new Error('Favorites list is full');
  }

  userData.favorites.push(traderAddress);
  await userRef.update(userData);
};

export const removeFromFavoritesController = async (
  userAddress: `0x${string}`,
  traderAddress: `0x${string}`,
) => {
  const userRef = db.collection('suimate-users').doc(userAddress);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new Error('User does not exist');
  }

  const userData = userDoc.data() as UserType;
  if (!userData.favorites.includes(traderAddress)) {
    throw new Error('Trader is not in favorites');
  }

  await userRef.update({
    favorites: userData.favorites.filter((fav) => fav !== traderAddress),
  });
};

export const getUserFavoritesController = async (
  userAddress: `0x${string}`,
) => {
  const userRef = db.collection('suimate-users').doc(userAddress);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new Error('User does not exist');
  }

  const userData = userDoc.data() as UserType;
  return userData.favorites;
};

export const getUserDataController = async (userAddress: `0x${string}`) => {
  const userRef = db.collection('suimate-users').doc(userAddress);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new Error('User does not exist');
  }

  const userData = userDoc.data() as UserType;

  if (!userData.chatId) {
    const userDataResponse = await axios.get(
      `https://userfunctions-ylp2jhbl2q-uc.a.run.app/userData?userAddress=${userAddress}`,
    );

    if (userDataResponse.data.chatId) {
      const { chatId, firstName, userName } = userDataResponse.data;
      await userRef.update({
        chatId,
        firstName,
        userName,
      });

      userData.chatId = chatId;
      userData.firstName = firstName;
      userData.userName = userName;
    }
  }

  return userData;
};
