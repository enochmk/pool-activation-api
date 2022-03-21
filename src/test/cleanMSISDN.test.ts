import { cleanMSISDNFromString } from '../helpers/utilities';

test('return true if number is parsed', () => {
	const msisdn = '264567898';
	const result = cleanMSISDNFromString(msisdn);
	expect(result).toBe(true);
});

test('return false if number  contains letters ', () => {
	const msisdn = '26456789e';
	const result = cleanMSISDNFromString(msisdn);
	expect(result).toBe(false);
});

test('return false if number is empty', () => {
	const msisdn = '';
	const result = cleanMSISDNFromString(msisdn);
	expect(result).toBe(false);
});
