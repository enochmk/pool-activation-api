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
