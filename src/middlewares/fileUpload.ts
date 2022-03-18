import multer from 'multer';
import config from 'config';

const destination: string = config.get('upload.destination');

const fileStorage = multer.diskStorage({
	destination: destination,
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage: fileStorage });

export default upload;
