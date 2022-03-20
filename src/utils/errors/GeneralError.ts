import Messages from '../messages/app.messages';

class GeneralError extends Error {
	statusCode: number;

	system: string;

	constructor(system: string = 'BIOSIMREG') {
		super(Messages.TECHNICAL_ISSUE);
		this.system = system;
		this.name = this.constructor.name;
		this.statusCode = 500;
	}
}

export default GeneralError;
