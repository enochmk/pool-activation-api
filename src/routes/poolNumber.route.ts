import { Router } from 'express';

import validator from '../middlewares/validator.middleware';
import { initAcquisitionSchema } from '../validations/poolNumber.schema';
import { initAcquisition } from '../controllers/poolNumber.controller';

const router = Router();

router.route('/init-acquisition').post(validator(initAcquisitionSchema), initAcquisition);

export default router;
