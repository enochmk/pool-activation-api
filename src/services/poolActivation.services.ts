import fs from 'fs';
import { nanoid } from 'nanoid';
import config from 'config';
import moment from 'moment';
/* eslint-disable arrow-body-style */

import createNumber from '../api/createNumber.api';
import deleteNumber from '../api/deleteNumber.api';
import integrationEnquiry from '../api/integrationEnquiry.api';
import HttpError from '../utils/errors/HttpError';
import { InitAcquisitionInput } from '../validations/poolActivation.schema';

const IN_POOL = '5';
const PREPAID = '0';

export const poolActivation = async (data: InitAcquisitionInput) => {
	const requestID = data.requestID;
	const msisdn = data.msisdn;
	const agentID = data.agentID;

	const cbsInfo = await integrationEnquiry(requestID, msisdn);

	// ! Not prepaid
	if (cbsInfo.paidMode !== PREPAID) {
		throw new HttpError(`Number not prepaid. Paidmode is ${cbsInfo.paidModeName}`, 400, 'USER');
	}

	// ! Not in pool
	if (cbsInfo.lifeCycleState !== IN_POOL) {
		throw new HttpError(
			`Number not in pool. Lifecycle is '${cbsInfo.lifeCycleState}'`,
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
	const content = fs.readFileSync(file.path, 'utf8');
	const msisdns = content.split('\n');

	const result = [];
	const promises = [];
	for (let i = 0; i < msisdns.length; i += 1) {
		const msisdn = msisdns[i].replace('\r', '');

		const input: InitAcquisitionInput = {
			agentID: data.agentID,
			requestID: data.requestID,
			msisdn: msisdn,
		};

		// promises.push(poolActivation(input))

		try {
			// eslint-disable-next-line no-await-in-loop
			const response = await poolActivation(input);
			result.push({
				msisdn,
				message: response.message,
				status: response.success,
			});
		} catch (error: any) {
			result.push({
				msisdn,
				message: error.message,
				status: false,
			});
		}
	}

	let lines = '';
	const fileName = `output_${nanoid()}.txt`;
	const path: string = config.get('upload.output');
	const destination = `${path}/${fileName}`;
	const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

	for (let x = 0; x < result.length; x += 1) {
		lines += `${timestamp}|${data.agentID}|${result[x].msisdn}|${result[x].status}|${result[x].message}\n`;
	}

	fs.writeFileSync(destination, lines);

	return {
		success: true,
		destination,
	};
};
