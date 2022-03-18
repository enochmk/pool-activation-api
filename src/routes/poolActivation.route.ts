import { Router } from 'express';
import config from 'config';

import validator from '../middlewares/validator.middleware';
import {
	poolActivationSchema,
	batchPoolActivationSchema,
} from '../validations/poolActivation.schema';
import { poolActivation, poolActivationBatch } from '../controllers/poolActivation.controller';
import fileUpload from '../middlewares/fileUpload';

const router = Router();

router.route('/pool-activation').post(validator(poolActivationSchema), poolActivation);

router
	.route('/pool-activation/batch')
	.post(fileUpload.single('file'), validator(batchPoolActivationSchema), poolActivationBatch);

router.route('/download').get((req, res) => {
	const file: any = req.query.file;
	const source: string = config.get('upload.output');

	return res.download(`${source}/${file}`, (err) => {
		if (err) throw err;
	});
});

export default router;
