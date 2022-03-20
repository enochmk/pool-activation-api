import config from 'config';
import { Request, Response } from 'express';

import asyncHandler from '../middlewares/async.middleware';

export const downloadFile = asyncHandler(async (req: Request, res: Response) => {
	const file: any = req.query.file;
	const source: string = config.get('upload.output');

	return res.download(`${source}/${file}`, (err) => {
		if (err) throw err;
	});
});
