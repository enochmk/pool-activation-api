import { Router } from 'express';

import upload from '../middlewares/upload.middleware';
import validator from '../middlewares/validator.middleware';
import { deleteNumberBatch } from '../controllers/deleteNumber.controller';
import { batchRequestSchema } from '../validations/request.schema';

const router = Router();

router
	.route('/delete-number/batch')
	.post(upload.single('file'), validator(batchRequestSchema), deleteNumberBatch);

export default router;
