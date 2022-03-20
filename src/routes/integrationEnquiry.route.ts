import { Router } from 'express';

import upload from '../middlewares/upload.middleware';
import validator from '../middlewares/validator.middleware';
import { batchGetFailedIntegrationEnquiry } from '../controllers/integrationEnquiry.controller';
import { batchRequestSchema } from '../validations/request.schema';

const router = Router();

router
	.route('/integration-enquiry/batch/failed')
	.post(upload.single('file'), validator(batchRequestSchema), batchGetFailedIntegrationEnquiry);

export default router;
