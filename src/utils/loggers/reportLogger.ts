import fs from 'fs';
import config from 'config';
import moment from 'moment';

const outputPath: string = config.get('upload.output');

interface IContext {
	requestID: string;
	agentID: string;
	msisdn: string;
	status: boolean;
	message: string;
}

const reportLogger = (info: IContext): string => {
	const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
	const row = `${timestamp}|${info.agentID}|${info.status}|${info.msisdn}|${info.message}\n`;

	const currentDate = moment().format('YYYYMMDD');
	const folder = `${outputPath}/${currentDate}`;

	if (!fs.existsSync(folder)) {
		fs.mkdirSync(folder);
	}

	const fileName = `${info.requestID}.txt`;
	const outputDestination = `${folder}/${fileName}`;

	// write/append to file
	fs.appendFileSync(outputDestination, `${row}`);

	return outputDestination;
};

export default reportLogger;
