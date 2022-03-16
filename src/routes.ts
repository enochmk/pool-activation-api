import { Router } from 'express';

import poolNumber from './routes/poolActivation.route';

const router = Router();

router.use('/tools', poolNumber);

export default router;
