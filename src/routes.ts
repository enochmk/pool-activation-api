import { Router } from 'express';

import poolNumber from './routes/poolNumber.route';

const router = Router();

router.use('/tools', poolNumber);

export default router;
