import { Request, Response } from 'express';

import * as services from '../services/deleteNumber.services';
import asyncHandler from '../middlewares/async.middleware';
import { BatchRequestInput } from '../validations/request.schema';

export const deleteNumberBatch = asyncHandler(
	async (req: Request<{}, {}, BatchRequestInput>, res: Response) => {
		const data = req.body;
		const file = req.file;

		const response = await services.deleteNumberBatch(data, file);
		return res.status(200).json({ ...response });
	}
);
