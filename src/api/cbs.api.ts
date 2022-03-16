import axios from 'axios';
import config from 'config';
import xml2js from 'xml2js';
import { nanoid } from 'nanoid';

import { ICbs } from '../interfaces/Cbs.interface';
import { systems } from '../helpers/constants';
import HttpError from '../utils/errors/HttpError';
import messages from '../utils/messages/cbs.messages';
import cleanXml from '../helpers/cleanXml';

const URL: string = config.get('api.cbs.url');
const USERNAME: string = config.get('api.cbs.username');
const PASSWORD: string = config.get('api.cbs.password');
const SUCCESS_CODE: string = '405000000';
const SYSTEM: string = systems.CBS;

export const integrationEnquiry = async (requestID: string, msisdn: string) => {
	const soapActionConfig = {
		headers: {
			'Content-Type': 'text/xml',
			SoapAction: 'IntegrationEnquiry',
		},
	};

	const soapRequest = `
		<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:bus="http://www.huawei.com/bme/cbsinterface/cbs/businessmgrmsg" xmlns:com="http://www.huawei.com/bme/cbsinterface/common" xmlns:bus1="http://www.huawei.com/bme/cbsinterface/cbs/businessmgr">
		<soapenv:Header/>
		<soapenv:Body>
				<bus:IntegrationEnquiryRequestMsg>
					<RequestHeader>
							<com:CommandId>IntegrationEnquiry</com:CommandId>
							<com:Version>1</com:Version>
							<com:TransactionId></com:TransactionId>
							<com:SequenceId>1</com:SequenceId>
							<com:RequestType>Event</com:RequestType>
							<com:SessionEntity>
								<com:Name>${USERNAME}</com:Name>
								<com:Password>${PASSWORD}</com:Password>
								<com:RemoteAddress></com:RemoteAddress>
							</com:SessionEntity>
							<com:SerialNo>${requestID}</com:SerialNo>
					</RequestHeader>
					<IntegrationEnquiryRequest>
							<bus1:SubscriberNo>${msisdn}</bus1:SubscriberNo>
							<bus1:QueryType>0</bus1:QueryType>
					</IntegrationEnquiryRequest>
					</bus:IntegrationEnquiryRequestMsg>
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

	const integrationEnquiryResultMsg =
		jsonResponse['soapenv:Envelope']['soapenv:Body'][0].IntegrationEnquiryResultMsg[0];

	const resultCode: string = integrationEnquiryResultMsg.ResultHeader[0].ResultCode[0]._;
	const resultDesc: string = integrationEnquiryResultMsg.ResultHeader[0].ResultDesc[0]._;

	// ! not a successful response
	if (resultCode !== SUCCESS_CODE) {
		if (resultDesc.includes(messages.CBS_ERROR_MESSAGE)) {
			throw new HttpError(messages.SYSTEM_BUSY, 503, SYSTEM);
		}
		throw new HttpError(resultDesc, 400, SYSTEM);
	}

	const cbsInfo: ICbs = {
		lifeCycleState:
			integrationEnquiryResultMsg.IntegrationEnquiryResult[0].SubscriberState[0].LifeCycleState[0],
		paidMode:
			integrationEnquiryResultMsg.IntegrationEnquiryResult[0].SubscriberInfo[0].Subscriber[0]
				.PaidMode[0],
	};

	return cbsInfo;
};

export const deleteNumber = async (requestID: string, msisdn: string) => {
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
								<com:Remark>Pool recreation</com:Remark>
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

export const createNumber = async (requestID: string, msisdn: string) => {
	const soapActionConfig = {
		headers: {
			'Content-Type': 'text/xml',
			SoapAction: 'NewSubscriber',
		},
	};

	const newRequestID = nanoid();

	const soapRequest = `
		<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:bus="http://www.huawei.com/bme/cbsinterface/cbs/businessmgrmsg" xmlns:com="http://www.huawei.com/bme/cbsinterface/common" xmlns:bus1="http://www.huawei.com/bme/cbsinterface/cbs/businessmgr">
   <soapenv:Header/>
			<soapenv:Body>
					<bus:NewSubscriberRequestMsg>
						<RequestHeader>
								<com:CommandId>NewSubscriber</com:CommandId>
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
								<com:Remark>Pool recreation</com:Remark>
						</RequestHeader>
						<NewSubscriberRequest>
								<bus1:SubscriberNo>${msisdn}</bus1:SubscriberNo>
								<bus1:Subscriber>
									<bus1:Lang>1</bus1:Lang>
									<bus1:PaidMode>0</bus1:PaidMode>
									<bus1:MainProductID>2018254719</bus1:MainProductID>
								</bus1:Subscriber>
						</NewSubscriberRequest>
					</bus:NewSubscriberRequestMsg>
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

	const newSubscriberResultMsg =
		jsonResponse['soapenv:Envelope']['soapenv:Body'][0].NewSubscriberResultMsg[0];

	const resultCode: string = newSubscriberResultMsg.ResultHeader[0].ResultCode[0]._;
	const resultDesc: string = newSubscriberResultMsg.ResultHeader[0].ResultDesc[0]._;

	// ! not a successful response
	if (resultCode !== SUCCESS_CODE) {
		if (resultDesc.includes(messages.CBS_ERROR_MESSAGE)) {
			throw new HttpError(messages.SYSTEM_BUSY, 503, SYSTEM);
		}
		throw new HttpError(resultDesc, 400, SYSTEM);
	}

	return true;
};
