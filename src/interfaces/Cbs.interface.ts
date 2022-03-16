export interface ICbs {
	state: string;
	activationYear: string;
	paidMode: '0' | '1' | '2';
	paidModeName: 'PREPAID' | 'POSTPAID' | 'HYBRID';
}
