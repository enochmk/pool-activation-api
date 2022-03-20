import { RequestInput } from '../validations/request.schema';

export const runInPararrel = async (requestArray: Array<RequestInput>, label: string, fn: any) => {
	const promises = requestArray.map((input) => fn(input, label));
	const results = await Promise.allSettled(promises);
	return results;
};

export const runInSeries = async (requestArray: Array<RequestInput>, label: string, fn: any) => {
	const result = [];

	for (let i = 0; i < requestArray.length; i += 1) {
		const response = await fn(requestArray[i], label);
		result.push(response);
	}

	return result;
};
