import fs from 'fs';

import createNumber from '../api/createNumber.api';
import deleteNumber from '../api/deleteNumber.api';
import integrationEnquiry from '../api/integrationEnquiry.api';
import logger from '../utils/loggers/logger';
import reportLogger from '../utils/loggers/reportLogger';
import { runInPararrel } from '../helpers/executeFlow';
import { RequestInput } from '../validations/request.schema';

const IN_POOL = '5';
const PREPAID = '0';

export const poolActivation = async (data: RequestInput, label = 'poolActivation') => {
	const requestID = data.requestID;
	const agentID = data.agentID;
	const msisdn = data.msisdn.replace('\r', '').trim();

	const context = {
		user: agentID,
		requestID: requestID,
		label: label,
	};

	const cbsInfo = await integrationEnquiry(requestID, msisdn);

	// ! Not prepaid
	if (cbsInfo.paidMode !== PREPAID) {
		const message = `Number not prepaid. Number is ${cbsInfo.paidModeName}`;
		logger.error(message, { context });

		return {
			success: false,
			message: message,
		};
	}

	// ! Not in pool
	if (cbsInfo.lifeCycleState !== IN_POOL) {
		const message = `Number not in pool. Lifecycle state is '${cbsInfo.lifeCycleState}'`;
		logger.error(message, { context });

		return {
			success: false,
			message,
		};
	}

	// Delete number and create number
	await deleteNumber(requestID, msisdn, agentID);
	await createNumber(requestID, msisdn, agentID);

	const message = 'Number successfully re-created.';
	logger.info(message, { context });

	return {
		success: true,
		message,
	};
};

export const poolActivateAndReport = async (data: RequestInput, label: string) => {
	const { message, success } = await poolActivation(data, label);

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

export const poolActivationBatch = async (data: any, file: any) => {
	const content = fs.readFileSync(file.path, 'utf8').split('\n');

	// get clean msisdns from content row by row
	const msisdns = content.filter((row) => row?.length && row.replace('\r\n', '').trim());

	const activationInputArray: Array<RequestInput> = msisdns.map((msisdn) => ({
		requestID: data.requestID,
		agentID: data.agentID,
		msisdn,
	}));

	const result = await runInPararrel(
		activationInputArray,
		'poolActivationBatch',
		poolActivateAndReport
	);

	return {
		destination: result,
	};
};
