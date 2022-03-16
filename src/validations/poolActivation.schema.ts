import * as yup from 'yup';

const schema = {
	requestID: yup
		.string()
		.min(6, 'Request ID must be at least 6 characters long')
		.max(60, 'Request ID must be at most 60 characters long')
		.required(),
	msisdn: yup
		.string()
		.min(9, 'Invalid MSISDN length. Should be 9 digits')
		.max(9, 'Invalid MSISDN length. Should be 9 digits')
		.required(),
	name: yup.string().min(1).max(70).required(),
};

export const initAcquisitionSchema = yup.object({
	body: yup.object({
		requestID: schema.requestID,
		agentID: schema.name,
		msisdn: schema.msisdn,
	}),
});

export type InitAcquisitionInput = yup.InferType<typeof initAcquisitionSchema>['body'];
