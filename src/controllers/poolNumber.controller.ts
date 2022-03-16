import { Request, Response } from 'express';

import asyncHandler from '../middlewares/async.middleware';
import * as poolNumberService from '../services/poolNumber.services';
import { InitAcquisitionInput } from '../validations/poolNumber.schema';

export const initAcquisition = asyncHandler(
	async (req: Request<{}, {}, InitAcquisitionInput>, res: Response) => {
		const data = req.body;

		const response = await poolNumberService.reCreateNumberAsAcquisition(data);

		res.status(200).json({
			response,
		});
	}
);
