const getKeyByValue = (obj: any, value: any) => Object.keys(obj).find((key) => obj[key] === value);

export const getPaymentMode = (paidMode: string) => {
	switch (paidMode) {
		case '0':
			return 'PREPAID';
		case '1':
			return 'POSTPAID';
		case '2':
			return 'HYBRID';
		default:
			return 'UNDEFINED';
	}
};
