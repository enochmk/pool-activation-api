export const getKeyByValue = (obj: any, value: any) =>
	Object.keys(obj).find((key) => obj[key] === value);

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

export const cleanXML = (data: string): any => data.replace(/&/g, '&amp;').replace(/-/g, '&#45;');

export const cleanMSISDNFromString = (item: string): boolean => {
	item = item.replace('\r\n', '').trim();
	const isValid: boolean = item?.length === 9 && !Number.isNaN(Number(item));

	return isValid;
};

export const cleanMSISDNFromArray = (content: Array<string>) => {
	const newArray = content.filter((item) => {
		const isValid = cleanMSISDNFromString(item);

		if (isValid) {
			return item;
		}
	});

	return newArray;
};
