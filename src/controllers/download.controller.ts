import config from 'config';
import { Request, Response } from 'express';

import asyncHandler from '../middlewares/async.middleware';

export const downloadFile = asyncHandler(async (req: Request, res: Response) => {
	const name: any = req.query.file;

	return res.download(name, (err) => {
		if (err) throw err;
	});
});
