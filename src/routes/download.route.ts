import { Router } from 'express';

import { downloadFile } from '../controllers/download.controller';

const router = Router();

router.route('/download').post(downloadFile);

export default router;
