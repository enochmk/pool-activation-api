export interface ICbs {
	lifeCycleState: string;
	paidMode: '0' | '1' | '2';
	paidModeName?: 'PREPAID' | 'POSTPAID' | 'HYBRID' | 'UNDEFINED';
}
