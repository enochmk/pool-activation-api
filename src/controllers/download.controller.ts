import { Request, Response } from 'express';

import asyncHandler from '../middlewares/async.middleware';
import HttpError from '../utils/errors/HttpError';

export const downloadFile = asyncHandler((req: Request, res: Response) => {
	if (!req.query.filePath) {
		throw new HttpError('filePath need', 400, 'APP');
	}

	const filePath: any = req.query?.filePath;

	res.download(filePath, (err) => {
		if (err) throw err;
	});
});
