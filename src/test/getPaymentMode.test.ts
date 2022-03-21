import { getPaymentMode } from '../helpers/utilities';

test('return PREPAID when value is 0', () => {
	const value = getPaymentMode('0');
	expect(value).toBe('PREPAID');
});
