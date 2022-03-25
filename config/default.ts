import dotenv from 'dotenv';

dotenv.config();

const config = {
	port: process.env.PORT || 3000,
	env: process.env.NODE_ENV || 'development',
	logger: {
		console: true,
	},
	tps: Number(process.env.TPS_LIMIT) || 50,
	api: {
		airteltigoVerificationUrl: process.env.VERIFICATION_ENGINE_HOST,
		cbs: {
			url: process.env.CBS_URL,
			username: process.env.CBS_USERNAME,
			password: process.env.CBS_PASSWORD,
		},
	},

	upload: {
		destination: 'public/uploads',
		output: 'public/outputs',
	},
};

export default config;
