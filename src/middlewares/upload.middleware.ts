import multer from 'multer';
import config from 'config';

const destination: string = config.get('upload.destination');

const middleware = multer.diskStorage({
	destination: destination,
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage: middleware });

export default upload;
