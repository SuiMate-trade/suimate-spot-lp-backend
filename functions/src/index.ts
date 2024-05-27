/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from 'firebase-functions/v2/https';
import { onValueWritten } from 'firebase-functions/v2/database';
import * as logger from 'firebase-functions/logger';
import { getTopSpotTradesController } from './controllers/topTradersController.js';
import {
  getAccountHoldingsController,
  getAccountStatsController,
} from './controllers/accountDataController.js';
import { getPastSpotTradesController } from './controllers/pastSpotTradesController.js';
import userFunctionApp from './routes/userRoutes.js';
import alertsFunctionApp from './routes/alertsRoute.js';
import { db } from './utils/firebase.js';
import { SpotTradesDataType } from './types/dataTypes/spotTradesDataType.js';
import { getCoinMetadata } from './utils/sui.js';
import bot from './utils/bot.js';
import { CoinMetadata } from '@mysten/sui.js/dist/cjs/client/index.js';
import { toDecimalString } from './helpers/parseBignum.js';
import { DateTime } from 'luxon';

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

export const getAccountHoldings = onRequest(
  { cors: true },
  async (req, res) => {
    try {
      if (req.method !== 'GET') {
        res.status(400).send('Please send a GET request');
        return;
      }

      const data = await getAccountHoldingsController(
        req.query.address as string,
      );

      res.status(200).send(data);
    } catch (error: any) {
      res.status(500).send(error.message);
      logger.error(error);
    }
  },
);

export const getAccountStats = onRequest({ cors: true }, async (req, res) => {
  try {
    if (req.method !== 'GET') {
      res.status(400).send('Please send a GET request');
      return;
    }

    const data = await getAccountStatsController(req.query.address as string);

    res.status(200).send(data);
  } catch (error: any) {
    res.status(500).send(error.message);
    logger.error(error);
  }
});

export const getPastSpotTrades = onRequest({ cors: true }, async (req, res) => {
  try {
    if (req.method !== 'GET') {
      res.status(400).send('Please send a GET request');
      return;
    }

    const data = await getPastSpotTradesController(req.query.address as string);

    res.status(200).send(data);
  } catch (error: any) {
    res.status(500).send(error.message);
    logger.error(error);
  }
});

export const userFunctions = onRequest(userFunctionApp);
export const alertsFunctions = onRequest(alertsFunctionApp);

// Trigger function to send telegram alerts when a traders places a trade
export const sendTradeAlerts = onValueWritten(
  `/swaps/{traderAddress}/{txnId}`,
  async (event) => {
    try {
      const { traderAddress } = event.params;

      const swapData: SpotTradesDataType = event.data.after.val();

      const traderAlertsRef = await db
        .collection('alerts')
        .doc(traderAddress)
        .get();
      const traderAlertsList: string[] = traderAlertsRef.data()?.alerts || [];

      const {
        tokenAType,
        tokenBType,
        atob,
        amountIn,
        amountOut,
        platform,
        timestampMs,
        txnDigest,
      } = swapData;
      const tokenAMetadata = (await getCoinMetadata(
        tokenAType,
      )) as CoinMetadata;
      const tokenBMetadata = (await getCoinMetadata(
        tokenBType,
      )) as CoinMetadata;

      const tokenInMetadata = atob ? tokenAMetadata : tokenBMetadata;
      const tokenOutMetadata = atob ? tokenBMetadata : tokenAMetadata;

      return await Promise.all(
        traderAlertsList.map(async (userAddress) => {
          try {
            const userRef = await db
              .collection('suimate-users')
              .doc(userAddress)
              .get();
            const chatId = userRef.data()?.chatId;

            await bot.sendMessage(
              chatId,
              `🚨 New spot exchange alert 🚨\n\n ${traderAddress} just swapped ${
                tokenInMetadata.symbol
              } for ${
                tokenOutMetadata.symbol
              } \n\n Swap Details: \n Amount In: ${toDecimalString(
                amountIn,
                tokenInMetadata.decimals,
              )} ${tokenInMetadata.symbol} \n Amount Out: $${toDecimalString(
                amountOut,
                tokenOutMetadata.decimals,
              )} ${tokenOutMetadata.symbol} \n Timestamp: ${DateTime.fromMillis(
                timestampMs,
              ).toFormat(
                'hh:mm a, MM/dd/yyyy',
              )} \n Platform: ${platform} \n\n Click here to view the trade: https://suivision.xyz/txblock/${txnDigest} \n\n Happy trading! 🚀`,
            );
          } catch (err) {
            console.error(err);
          }
        }),
      );
    } catch (error) {
      console.error(error);
      return null;
    }
  },
);
