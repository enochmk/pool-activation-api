import { Request, Response } from 'express';

import asyncHandler from '../middlewares/async.middleware';
import * as poolNumberService from '../services/poolActivation.services';
import {
	PoolActivationInput,
	BatchPoolActivationInput,
} from '../validations/poolActivation.schema';

export const poolActivation = asyncHandler(
	async (req: Request<{}, {}, PoolActivationInput>, res: Response) => {
		const data = req.body;

		const response = await poolNumberService.poolActivation(data);

		res.status(200).json({
			...response,
		});
	}
);

export const poolActivationBatch = asyncHandler(
	async (req: Request<{}, {}, BatchPoolActivationInput>, res: Response) => {
		const data = req.body;
		const file = req.file;
		const shouldDownload = req.query.download;

		const response = await poolNumberService.poolActivationBatch(data, file);

		// condition to download or send response
		if (shouldDownload === 'true') {
			return res.download(response.destination, (err) => {
				if (err) {
					throw err;
				}
			});
		}

		return res.status(200).json({ ...response });
	}
);
