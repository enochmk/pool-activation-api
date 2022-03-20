import { Router } from 'express';

import fileUpload from '../middlewares/upload.middleware';
import validator from '../middlewares/validator.middleware';
import { batchRequestSchema } from '../validations/request.schema';
import { createNewNumberBatch } from '../controllers/createNumber.controller';

const router = Router();

router
	.route('/create-number/batch')
	.post(fileUpload.single('file'), validator(batchRequestSchema), createNewNumberBatch);

export default router;
