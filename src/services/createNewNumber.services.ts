import fs from 'fs';
import config from 'config';
import moment from 'moment';

// import logger from '../utils/loggers/logger';
import createNumber from '../api/createNumber.api';
import { RequestInput } from '../validations/request.schema';

const createNewNumberAndLog = async (
	msisdn: string,
	requestID: string,
	agentID: string,
	outputDestination: string
) => {
	try {
		const response = await createNumber(requestID, msisdn, agentID);
		const line = `createNumber|true|${msisdn}\n`;
		fs.appendFileSync(outputDestination, line);
	} catch (error: any) {
		const line = `createNumber|false|${msisdn}|${error.message}\n`;
		fs.appendFileSync(outputDestination, line);
	}
};

export const batchCreateNewNumber = async (data: any, file: any) => {
	const content = fs.readFileSync(file.path, 'utf8').split('\n');

	// get clean msisdns from content row by row
	const msisdns = content.filter((row) => row?.length && row.replace('\r\n', '').trim());

	const activationInputArray: Array<RequestInput> = msisdns.map((msisdn) => ({
		requestID: data.requestID,
		agentID: data.agentID,
		msisdn,
	}));

	const time = moment().format('YYYYMMDD_HHmmss');
	const outputFileName = `${time}-${data.agentID}.txt`;
	const outputDestination = `${config.get('upload.output')}/${outputFileName}`;

	const promises = msisdns.map((msisdn) => {
		msisdn = msisdn.replace('\r', '').replace('\n', '').trim();
		console.log(msisdn);
		return createNewNumberAndLog(msisdn, data.requestID, data.agentID, outputDestination);
	});

	const result = await Promise.all(promises);
	console.log({ result });

	return {
		destination: outputDestination,
		fileName: outputFileName,
	};
};
