import axios from 'axios';
import config from 'config';
import xml2js from 'xml2js';
import { nanoid } from 'nanoid';

import { systems } from '../helpers/constants';
import HttpError from '../utils/errors/HttpError';
import messages from '../utils/messages/cbs.messages';
import cleanXml from '../helpers/cleanXml';

const URL: string = config.get('api.cbs.url');
const USERNAME: string = config.get('api.cbs.username');
const PASSWORD: string = config.get('api.cbs.password');
const SUCCESS_CODE: string = '405000000';
const SYSTEM: string = systems.CBS;

const deleteNumber = async (requestID: string, msisdn: string, agentID: string) => {
	const soapActionConfig = {
		headers: {
			'Content-Type': 'text/xml',
			SoapAction: 'DeleteSubscriber',
		},
	};

	const newRequestID = nanoid();

	const soapRequest = `
		<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:bus="http://www.huawei.com/bme/cbsinterface/cbs/businessmgrmsg" xmlns:com="http://www.huawei.com/bme/cbsinterface/common" xmlns:bus1="http://www.huawei.com/bme/cbsinterface/cbs/businessmgr">
			<soapenv:Header/>
			<soapenv:Body>
					<bus:DeleteSubscriberRequestMsg>
						<RequestHeader>
								<com:CommandId>DeleteSubscriber</com:CommandId>
								<com:Version>1</com:Version>
								<com:TransactionId></com:TransactionId>
								<com:SequenceId>1</com:SequenceId>
								<com:RequestType>Event</com:RequestType>
								<com:SessionEntity>
									<com:Name>${USERNAME}</com:Name>
									<com:Password>${PASSWORD}</com:Password>
									<com:RemoteAddress></com:RemoteAddress>
								</com:SessionEntity>
								<com:SerialNo>${newRequestID}</com:SerialNo>
								<!--Optional:-->
								<com:Remark>Pool_recreation_${agentID}</com:Remark>
						</RequestHeader>
						<DeleteSubscriberRequest>
								<bus1:SubscriberNo>
									<bus1:SubscriberNo>${msisdn}</bus1:SubscriberNo>
								</bus1:SubscriberNo>
						</DeleteSubscriberRequest>
					</bus:DeleteSubscriberRequestMsg>
			</soapenv:Body>
		</soapenv:Envelope>
	`;

	const soapResponseRaw = await axios.post(URL, soapRequest, soapActionConfig);
	const soapResponseClean: string = cleanXml(soapResponseRaw.data);

	const jsonResponse = await xml2js.parseStringPromise(soapResponseClean);
	const responseData = jsonResponse['soapenv:Envelope']['soapenv:Body'][0];

	// ! fault response
	if (responseData['soapenv:Fault']) {
		const faultMessage = responseData['soapenv:Fault'][0].faultString[0];
		throw new HttpError(faultMessage, 500, SYSTEM);
	}

	const deleteSubscriberResultMsg =
		jsonResponse['soapenv:Envelope']['soapenv:Body'][0].DeleteSubscriberResultMsg[0];

	const resultCode: string = deleteSubscriberResultMsg.ResultHeader[0].ResultCode[0]._;
	const resultDesc: string = deleteSubscriberResultMsg.ResultHeader[0].ResultDesc[0]._;

	// ! not a successful response
	if (resultCode !== SUCCESS_CODE) {
		if (resultDesc.includes(messages.CBS_ERROR_MESSAGE)) {
			throw new HttpError(messages.SYSTEM_BUSY, 503, SYSTEM);
		}
		throw new HttpError(resultDesc, 400, SYSTEM);
	}

	return true;
};

export default deleteNumber;
