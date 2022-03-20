import fs from 'fs';
import config from 'config';
import moment from 'moment';

// import logger from '../utils/loggers/logger';
import integrationEnquiry from '../api/integrationEnquiry.api';

const getIntegrationEnquiryAndLog = async (
	msisdn: string,
	requestID: string,
	outputDestination: string
) => {
	try {
		const response = await integrationEnquiry(requestID, msisdn);
		const line = `getIntegrationEnquiryAndLog|true|${msisdn}|${response.lifeCycleState}|${response.paidMode}\n`;
		fs.appendFileSync(outputDestination, line);
	} catch (error: any) {
		const line = `getIntegrationEnquiryAndLog|false|${msisdn}|${error.message}\n`;
		fs.appendFileSync(outputDestination, line);
	}
};

const getFailedIntegrationEnquiryAndLog = async (
	msisdn: string,
	requestID: string,
	outputDestination: string
) => {
	try {
		await integrationEnquiry(requestID, msisdn);
	} catch (error: any) {
		const line = `getFailedIntegrationEnquiryAndLog|false|${msisdn}|${error.message}\n`;
		fs.appendFileSync(outputDestination, line);
	}
};

export const batchGetIntegrationEnquiry = async (data: any, file: any) => {
	const content = fs.readFileSync(file.path, 'utf8').split('\n');

	// get clean msisdns from content row by row
	const msisdns = content.filter((row) => row?.length && row.replace('\r\n', '').trim());

	const time = moment().format('YYYYMMDD_HHmmss');
	const outputFileName = `${time}-${data.agentID}.txt`;
	const outputDestination = `${config.get('upload.output')}/${outputFileName}`;

	const promises = msisdns.map((msisdn) => {
		msisdn = msisdn.replace('\r', '').replace('\n', '').trim();
		return getIntegrationEnquiryAndLog(msisdn, data.requestID, outputDestination);
	});

	await Promise.all(promises);

	return {
		destination: outputDestination,
		fileName: outputFileName,
	};
};

export const batchGetFailedIntegrationEnquiry = async (data: any, file: any) => {
	const content = fs.readFileSync(file.path, 'utf8').split('\n');

	// get clean msisdns from content row by row
	const msisdns = content.filter((row) => row?.length && row.replace('\r\n', '').trim());

	const time = moment().format('YYYYMMDD_HHmmss');
	const outputFileName = `${time}-${data.agentID}.txt`;
	const outputDestination = `${config.get('upload.output')}/${outputFileName}`;

	const promises = msisdns.map((msisdn) => {
		msisdn = msisdn.replace('\r', '').replace('\n', '').trim();
		return getFailedIntegrationEnquiryAndLog(msisdn, data.requestID, outputDestination);
	});

	await Promise.all(promises);

	return {
		destination: outputDestination,
		fileName: outputFileName,
	};
};
