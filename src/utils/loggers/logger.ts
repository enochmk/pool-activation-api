import config from 'config';
import winston, { format } from 'winston';

const transports: any = [];

export const pretty = format.printf((log: any): string => {
	const { timestamp, level, message, context } = log;
	return `[${timestamp}] [${level.toUpperCase()}] [${context?.user || ''} - ${
		context?.label || ''
	}]: ${message}`;
});

// if console logging is enabled
if (config.get('logger.console')) {
	transports.push(
		new winston.transports.Console({
			level: 'verbose',
			format: format.combine(pretty, format.colorize({ all: true })),
		})
	);
}

// Create logger with configurations
const logger = winston.createLogger({
	transports,
	levels: winston.config.npm.levels,
	format: format.combine(
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		format.errors({ stack: true })
	),
});

export default logger;
