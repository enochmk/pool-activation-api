import { Router } from 'express';

import upload from '../middlewares/upload.middleware';
import validator from '../middlewares/validator.middleware';
import { poolActivation, poolActivationBatch } from '../controllers/poolActivation.controller';
import { requestSchema, batchRequestSchema } from '../validations/request.schema';

const router = Router();

router.route('/pool-activation').post(validator(requestSchema), poolActivation);

router
	.route('/pool-activation/batch')
	.post(upload.single('file'), validator(batchRequestSchema), poolActivationBatch);

export default router;
