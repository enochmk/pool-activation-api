import config from 'config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import * as uuid from 'uuid';

import routes from './routes';
import errorHandler from './middlewares/errorHandler.middleware';
import logger from './utils/loggers/logger';

const port: number = config.get('port');
const env: string = config.get('env');
const context = { user: 'Server', label: 'startup', requestID: uuid.v4, env, port };
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(hpp());
app.use('/v1', routes);
app.use(errorHandler);

// start express server
app.listen(port, () => {
	const message = `Server is running in mode: ${env} at http://localhost:${port}`;
	logger.info(message, { context });
});
