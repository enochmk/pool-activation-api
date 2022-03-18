import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

import HttpError from '../utils/errors/HttpError';
import ValidationError from '../utils/errors/ValidationError';
import messages from '../utils/messages/app.messages';

// eslint-disable-next-line
const errorHandler = (error: any, req: Request, res: Response, _next: NextFunction) => {
	const channelID: string = req.body.channelID || req.query.channelID;

	const response = {
		timestamp: moment(),
		requestID: req.body?.requestID || req.query?.requestID,
		message: error.message,
	};

	// HTTP Handler
	if (error instanceof HttpError) {
		return channelID === 'ussd'
			? res.send(response.message)
			: res.status(error.statusCode).json(response);
	}

	// Validation error Handler
	if (error instanceof ValidationError) {
		return channelID === 'ussd'
			? res.send(response.message)
			: res.status(error.statusCode).json(response);
	}

	console.log({ error });

	// ! Generic Error handler
	response.message = messages.TECHNICAL_ISSUE;
	return channelID === 'ussd' ? res.send(response.message) : res.status(500).json(response);
};

export default errorHandler;
