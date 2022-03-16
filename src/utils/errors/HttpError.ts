class HttpError extends Error {
	statusCode: number;

	system: string;

	constructor(message: string, statusCode: number, system: string | null) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = statusCode || 500;
		this.system = system || 'BIOSIMREG';
	}
}

export default HttpError;
