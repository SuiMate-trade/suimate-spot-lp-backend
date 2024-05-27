import express, { Request, Response } from 'express';
import cors from 'cors';
import {
  addTraderToAlertsListController,
  getTraderAlertsListForUserController,
  getUserAlertsListForTraderController,
  removeTraderFromAlertsListController,
} from '../controllers/traderAlertsController.js';

class AlertsFunctions {
  static async getTraderAlertsListForUser(req: Request, res: Response) {
    try {
      const { userAddress } = req.query;
      const data = await getTraderAlertsListForUserController(
        userAddress as `0x${string}`,
      );
      res.status(200).send(data);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  static async getUserAlertsListForTrader(req: Request, res: Response) {
    try {
      const { traderAddress } = req.query;
      const data = await getUserAlertsListForTraderController(
        traderAddress as `0x${string}`,
      );
      res.status(200).send(data);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  static async addTraderToAlerts(req: Request, res: Response) {
    try {
      const { userAddress, traderAddress } = req.body;
      await addTraderToAlertsListController(userAddress, traderAddress);
      res.status(200).send('Trader added to alerts successfully');
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }

  static async removeTraderFromAlerts(req: Request, res: Response) {
    try {
      const { userAddress, traderAddress } = req.body;
      await removeTraderFromAlertsListController(userAddress, traderAddress);
      res.status(200).send('Trader removed from alerts successfully');
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
}

const alertsFunctionApp = express();
alertsFunctionApp.use(cors());

alertsFunctionApp.get(
  '/getTraderAlertsListForUser',
  AlertsFunctions.getTraderAlertsListForUser,
);
alertsFunctionApp.get(
  '/getUserAlertsListForTrader',
  AlertsFunctions.getUserAlertsListForTrader,
);
alertsFunctionApp.post('/addTraderToAlerts', AlertsFunctions.addTraderToAlerts);
alertsFunctionApp.post(
  '/removeTraderFromAlerts',
  AlertsFunctions.removeTraderFromAlerts,
);

export default alertsFunctionApp;
