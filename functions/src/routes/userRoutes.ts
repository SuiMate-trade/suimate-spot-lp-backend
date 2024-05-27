import express, { Request, Response } from 'express';
import cors from 'cors';
import {
  addToFavoritesController,
  getUserDataController,
  getUserFavoritesController,
  removeFromFavoritesController,
  saveUserController,
} from '../controllers/usersController.js';

class UserFunctions {
  static async createUser(req: Request, res: Response) {
    try {
      const { userAddress } = req.body;
      await saveUserController(userAddress);
      res.status(200).send('User created successfully');
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  static async addToFavorites(req: Request, res: Response) {
    try {
      const { userAddress, traderAddress } = req.body;
      await addToFavoritesController(userAddress, traderAddress);
      res.status(200).send('Trader added to favorites successfully');
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  static async removeFromFavorites(req: Request, res: Response) {
    try {
      const { userAddress, traderAddress } = req.body;
      await removeFromFavoritesController(userAddress, traderAddress);
      res.status(200).send('Trader removed from favorites successfully');
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  static async getUserFavorites(req: Request, res: Response) {
    try {
      const { userAddress } = req.query;
      const data = await getUserFavoritesController(
        userAddress as `0x${string}`,
      );
      res.status(200).send(data);
    } catch (error: any) {
      res
        .status(500)
        .send('An error occurred while fetching the user favorites');
    }
  }

  static async getUserData(req: Request, res: Response) {
    try {
      const { userAddress } = req.query;
      const userData = await getUserDataController(
        userAddress as `0x${string}`,
      );
      return res.status(200).send(userData);
    } catch (err: any) {
      return res.status(500).send(err.message);
    }
  }
}

const userFunctionApp = express();
userFunctionApp.use(cors());

userFunctionApp.post('/createUser', UserFunctions.createUser);
userFunctionApp.post('/addToFavorites', UserFunctions.addToFavorites);
userFunctionApp.post('/removeFromFavorites', UserFunctions.removeFromFavorites);
userFunctionApp.get('/getUserFavorites', UserFunctions.getUserFavorites);
userFunctionApp.get('/userData', UserFunctions.getUserData);

export default userFunctionApp;
