import { cleanMSISDNFromArray } from '../helpers/utilities';

test('return true for clean array', () => {
	const msisdn = ['264567898', '26456789e', '', '264567798', '264567898'];
	const result = cleanMSISDNFromArray(msisdn);

	expect(result).toEqual(['264567898', '264567798', '264567898']);
});
