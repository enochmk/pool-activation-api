import { Router } from 'express';

import validator from '../middlewares/validator.middleware';
import { initAcquisitionSchema } from '../validations/poolActivation.schema';
import { initAcquisition } from '../controllers/poolActivation.controller';

const router = Router();

router.route('/pool-activation').post(validator(initAcquisitionSchema), initAcquisition);

export default router;
