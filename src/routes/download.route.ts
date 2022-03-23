import { Router } from 'express';

import { downloadFile } from '../controllers/download.controller';

const router = Router();

router.route('/download').get(downloadFile);

export default router;
