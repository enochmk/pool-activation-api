import fs from 'fs';

import deleteNumber from '../api/deleteNumber.api';
import logger from '../utils/loggers/logger';
import reportLogger from '../utils/loggers/reportLogger';
import { runInSeriesAndPararrel } from '../helpers/executeFlow';
import { RequestInput } from '../validations/request.schema';
import { cleanMSISDNFromArray } from '../helpers/utilities';
import HttpError from '../utils/errors/HttpError';

export const deleteNumberService = async (data: RequestInput, label = 'deleteNumber') => {
	const requestID = data.requestID;
	const agentID = data.agentID;
	const msisdn = data.msisdn.replace('\r', '').trim();

	const context = {
		user: agentID,
		requestID: requestID,
		label: label,
	};

	try {
		// Delete number and create number
		await deleteNumber(requestID, msisdn, agentID, 'NCA_DELETION');
		const message = 'Number successfully deleted.';
		logger.info(message, { context });

		return {
			success: true,
			message,
		};
	} catch (error: any) {
		return {
			success: false,
			message: error.message,
		};
	}
};

export const deleteNumberAndReport = async (data: RequestInput, label: string) => {
	const { message, success } = await deleteNumberService(data, label);

	const info = {
		message,
		status: success,
		requestID: data.requestID,
		agentID: data.agentID,
		msisdn: data.msisdn,
	};

	const outputDestination = reportLogger(info);

	return { ...info, outputDestination };
};

export const deleteNumberBatch = async (data: any, file: any) => {
	const content = fs.readFileSync(file.path, 'utf8').split('\n');

	const newContent = content.map((str) => str.replace('\r', ''));

	// get clean msisdns from content row by row
	const msisdns = cleanMSISDNFromArray(newContent);

	if (!msisdns.length) {
		const message = `List cannot be empty`;
		const system = 'Delete number';
		throw new HttpError(message, 400, system);
	}

	const requestArray: Array<RequestInput> = msisdns.map((msisdn) => ({
		requestID: data.requestID,
		agentID: data.agentID,
		msisdn,
	}));

	const result = await runInSeriesAndPararrel(
		requestArray,
		'deleteNumberBatch',
		deleteNumberAndReport,
		250
	);

	return {
		destination: result[0]?.outputDestination,
	};
};
