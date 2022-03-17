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
		throw new HttpError('Number not prepaid', 400, 'USER');
	}

	// ! Not in pool
	if (cbsInfo.lifeCycleState !== IN_POOL) {
		throw new HttpError('Number not in pool', 400, 'USER');
	}

	// Delete number
	await deleteNumber(requestID, msisdn, agentID);
	await createNumber(requestID, msisdn, agentID);

	return {
		success: true,
		message: 'Number successfully re-created.',
	};
};
