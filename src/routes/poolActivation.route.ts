import { Router } from 'express';
import config from 'config';

import validator from '../middlewares/validator.middleware';
import { initAcquisitionSchema } from '../validations/poolActivation.schema';
import { initAcquisition, initAcquisitionBatch } from '../controllers/poolActivation.controller';
import fileUpload from '../middlewares/fileUpload';

const router = Router();

router.route('/pool-activation').post(validator(initAcquisitionSchema), initAcquisition);

router.route('/pool-activation/batch').post(fileUpload.single('file'), initAcquisitionBatch);

router.route('/download').get((req, res) => {
	const file: any = req.query.file;
	const source: string = config.get('upload.output');

	return res.download(`${source}/${file}`, (err) => {
		if (err) throw err;
	});
});

export default router;
