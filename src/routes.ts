import { Router } from 'express';

import createNumber from './routes/createNumber.route';
import integrationEnquiry from './routes/integrationEnquiry.route';
import poolActivation from './routes/poolActivation.route';
import download from './routes/download.route';
import deleteNumber from './routes/deleteNumber.route';

const router = Router();

router.use(createNumber);
router.use(integrationEnquiry);
router.use(poolActivation);
router.use(deleteNumber);
router.use('/tools', poolActivation);
router.use(download);

export default router;
