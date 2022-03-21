import { cleanMSISDNFromArray } from '../helpers/utilities';

test('return true for clean array', () => {
	const msisdn = ['264567898', '26456789e', '', '264567798', '264567898'];
	const result = cleanMSISDNFromArray(msisdn);

	expect(result).toEqual(['264567898', '264567798']);
});

test('return true for unique array', () => {
	const msisdn = ['264567898', '26456789e', '', '264567798', '264567898'];
	const result = cleanMSISDNFromArray(msisdn);

	expect(result).toEqual(['264567898', '264567798']);
});

test('return false if array is empty', () => {
	const msisdn: Array<string> = [];
	const result = cleanMSISDNFromArray(msisdn);
	expect(result).toEqual([]);
});
test('return true if array with number is parsed', () => {
	const msisdn: Array<string> = ['264567898'];
	const result = cleanMSISDNFromArray(msisdn);
	expect(result).toEqual(['264567898']);
});
