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
		const shouldDownload = req.query.download || 'false';

		const response = await poolNumberService.poolActivationBatch(data, file);

		// condition to download or send response
		if (shouldDownload === 'true') {
			return res.download(response.output, (err) => {
				if (err) {
					throw err;
				}
			});
		}

		return res.status(200).json({ ...response });
	}
);
