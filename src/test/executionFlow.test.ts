import { runInPararrel, runInSeries } from '../helpers/executeFlow';
import { batchGetIntegrationEnquiry } from '../services/integrationEnquiry.services';

const requestArray = [
	{
		requestID: 'kajhsdj',
		agentID: 'EnochK',
		msisdn: '566589891',
	},
	{
		requestID: 'h8982',
		agentID: 'EnochK',
		msisdn: '561360545',
	},
	{
		requestID: '487974',
		agentID: 'EnochK',
		msisdn: '567899999',
	},
];

test('run array of request in parallel', async () => {
	// const result = await runInPararrel(requestArray, 'test', poolActivateAndReport);
	// console.log(result);
});

// test('run array of request in series', async () => {
// 	const result = await runInSeries(requestArray, 'test', poolActivateAndReport);
// 	console.log(result);
// });
