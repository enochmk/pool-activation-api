import fs from 'fs';
import config from 'config';
import moment from 'moment';
/* eslint-disable arrow-body-style */

import logger from '../utils/loggers/logger';
import createNumber from '../api/createNumber.api';
import deleteNumber from '../api/deleteNumber.api';
import integrationEnquiry from '../api/integrationEnquiry.api';
import HttpError from '../utils/errors/HttpError';
import { InitAcquisitionInput as ActivationInput } from '../validations/poolActivation.schema';

const IN_POOL = '5';
const PREPAID = '0';

export const poolActivation = async (data: ActivationInput) => {
	const requestID = data.requestID;
	const agentID = data.agentID;
	const msisdn = data.msisdn.replace('\r', '').trim();

	const cbsInfo = await integrationEnquiry(requestID, msisdn);

	// ! Not prepaid
	if (cbsInfo.paidMode !== PREPAID) {
		throw new HttpError(`Number not prepaid. Number is ${cbsInfo.paidModeName}`, 400, 'USER');
	}

	// ! Not in pool
	if (cbsInfo.lifeCycleState !== IN_POOL) {
		throw new HttpError(
			`Number not in pool. Lifecycle state is '${cbsInfo.lifeCycleState}'`,
			400,
			'USER'
		);
	}

	// Delete number
	await deleteNumber(requestID, msisdn, agentID);
	await createNumber(requestID, msisdn, agentID);

	return {
		success: true,
		message: 'Number successfully re-created.',
	};
};

export const poolActivationBatch = async (data: any, file: any) => {
	const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
	const currentDate = moment().format('YYYY-MM-DD');
	const outputFileName = `output-${data.agentID}-${currentDate}.txt`;
	const outputDestination = `${config.get('upload.output')}/${outputFileName}`;
	const batchMsisdns = fs.readFileSync(file.path, 'utf8').split('\r\n');
	const context = {
		user: data.agentID,
		requestID: data.requestID,
		label: 'poolActivationBatch',
	};

	const batchActivationToProcess: Array<ActivationInput> = [];

	batchMsisdns.forEach((row) => {
		// ! empty row
		if (!row?.length) return;

		const requestID = data.requestID;
		const agentID = data.agentID;
		const msisdn = row.replace('\r', '').trim();

		batchActivationToProcess.push({ requestID, msisdn, agentID });
	});

	const result: any = [];

	let line = '';
	await Promise.all(
		batchActivationToProcess.map(async (item: ActivationInput) =>
			poolActivation(item)
				.then((response) => {
					const msisdn = item.msisdn.replace('\r', '');
					const newLine = `${timestamp}|${data.agentID}|${msisdn}|${response.success}|${response.message}`;
					logger.info(newLine, { context });

					line += `${newLine}\n`;
					fs.writeFileSync(outputDestination, line);

					result.push({
						msisdn: item.msisdn,
						message: response.message,
						status: true,
					});
				})
				.catch((error: any) => {
					const msisdn = item.msisdn.replace('\r', '');
					const newLine = `${timestamp}|${data.agentID}|${msisdn}|false|${error.message}`;
					logger.error(newLine, { context });

					line += `${newLine}\n`;
					fs.writeFileSync(outputDestination, line);

					result.push({
						msisdn: item.msisdn,
						message: error.message,
						status: false,
					});
				})
		)
	);

	return {
		output: outputDestination,
		fileName: outputFileName,
	};
};
