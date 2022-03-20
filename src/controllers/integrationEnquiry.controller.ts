import { Request, Response } from 'express';

import asyncHandler from '../middlewares/async.middleware';
import * as services from '../services/integrationEnquiry.services';
import { BatchRequestInput } from '../validations/request.schema';

export const batchGetFailedIntegrationEnquiry = asyncHandler(
	async (req: Request<{}, {}, BatchRequestInput>, res: Response) => {
		const data = req.body;
		const file = req.file;

		const response = await services.batchGetFailedIntegrationEnquiry(data, file);

		return res.status(200).json({ ...response });
	}
);
