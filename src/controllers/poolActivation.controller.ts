import { Request, Response } from 'express';

import asyncHandler from '../middlewares/async.middleware';
import * as poolNumberService from '../services/poolActivation.services';
import { InitAcquisitionInput } from '../validations/poolActivation.schema';

export const initAcquisition = asyncHandler(
	async (req: Request<{}, {}, InitAcquisitionInput>, res: Response) => {
		const data = req.body;

		const response = await poolNumberService.poolActivation(data);

		res.status(200).json({
			...response,
		});
	}
);

export const initAcquisitionBatch = asyncHandler(
	async (req: Request<{}, {}, InitAcquisitionInput>, res: Response) => {
		const data = req.body;
		const file = req.file;

		const response = await poolNumberService.poolActivationBatch(data, file);

		// res.download(response.destination, (err) => {
		// 	if (err) {
		// 		console.error(err);
		// 	} else {
		// 		console.log('download');
		// 	}
		// });
		res.status(200).json({ ...response });
	}
);
