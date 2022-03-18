import fs from 'fs';
import config from 'config';
import moment from 'moment';
/* eslint-disable arrow-body-style */

import logger from '../utils/loggers/logger';
import createNumber from '../api/createNumber.api';
import deleteNumber from '../api/deleteNumber.api';
import integrationEnquiry from '../api/integrationEnquiry.api';
import { PoolActivationInput } from '../validations/poolActivation.schema';

const IN_POOL = '5';
const PREPAID = '0';

export const poolActivation = async (data: PoolActivationInput, label = 'poolActivation') => {
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

	// Delete number
	await deleteNumber(requestID, msisdn, agentID);
	await createNumber(requestID, msisdn, agentID);

	const message = 'Number successfully re-created.';
	logger.info(message, { context });

	return {
		success: true,
		message,
	};
};

export const poolActivateAndLog = async (
	data: PoolActivationInput,
	path: string,
	label: string
) => {
	const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
	const { agentID, msisdn } = data;
	const { message, success } = await poolActivation(data, label);
	const line = `${timestamp}|${agentID}|${msisdn}|${success}|${message}`;

	// write/append to file
	fs.appendFileSync(path, `${line}\n`);

	return { message, success };
};

export const runInPararrel = async (
	activationInputArray: Array<PoolActivationInput>,
	path: string,
	label: string
) => {
	const promises = activationInputArray.map((input) => {
		return poolActivateAndLog(input, path, label);
	});

	// run all promises concurrently
	const results = await Promise.all(promises);

	return results;
};

export const runInSeries = async (
	activationInputArray: Array<PoolActivationInput>,
	path: string,
	label: string
) => {
	const results = [];

	for (let i = 0; i < activationInputArray.length; i += 1) {
		const response = await poolActivateAndLog(activationInputArray[i], path, label);
		results.push(response);
	}

	return results;
};

export const poolActivationBatch = async (data: any, file: any) => {
	const content = fs.readFileSync(file.path, 'utf8').split('\r\n');

	// get clean msisdns from content row by row
	const msisdns = content.filter((row) => {
		return row?.length && row.replace('\r\n', '').trim();
	});

	const activationInputArray: Array<PoolActivationInput> = msisdns.map((msisdn) => {
		return {
			requestID: data.requestID,
			agentID: data.agentID,
			msisdn,
		};
	});

	const time = moment().format('YYYYMMDD_HHmmss');
	const outputFileName = `${time}-${data.agentID}.txt`;
	const outputDestination = `${config.get('upload.output')}/${outputFileName}`;

	await runInSeries(activationInputArray, outputDestination, 'poolActivationBatch');
	// await runInPararrel(activationInputArray, outputDestination, 'poolActivationBatch');

	return {
		destination: outputDestination,
		fileName: outputFileName,
	};
};
