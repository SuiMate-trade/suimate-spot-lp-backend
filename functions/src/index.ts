/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { getTopSpotTradesController } from './controllers/topTradersController';

export const getTopSpotTraders = onRequest({ cors: true }, async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.status(400).send('Please send a POST request');
      return;
    }

    const data = await getTopSpotTradesController(req.body);

    res.status(200).send(data);
  } catch (error: any) {
    res.status(500).send(error.message);
    logger.error(error);
  }
});
