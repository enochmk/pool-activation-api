import config from 'config';
import { RequestInput } from '../validations/request.schema';

export const runInPararrel = async (requestArray: Array<RequestInput>, label: string, fn: any) => {
	const promises = requestArray.map((input) => fn(input, label));
	const results = await Promise.allSettled(promises);
	const resultValues = results.map((item) => {
		if (item.status === 'fulfilled') {
			return item.value;
		}
	});

	return resultValues;
};

export const runInSeries = async (requestArray: Array<RequestInput>, label: string, fn: any) => {
	const result = [];

	for (let i = 0; i < requestArray.length; i += 1) {
		const response = await fn(requestArray[i], label);
		result.push(response);
	}

	return result;
};

export const runInSeriesAndPararrel = async (
	requestArray: Array<RequestInput>,
	label: string,
	fn: any
) => {
	const LIMIT = config.get('tps') as number;
	const size = requestArray.length;
	const result = [];

	let temp = [];
	for (let index = 0; index < requestArray.length; index++) {
		temp.push(requestArray[index]);

		if (temp.length === LIMIT || index === size - 1) {
			const response = await runInPararrel(temp, label, fn);
			result.push(...response);
			temp = [];
		}
	}

	return result;
};
