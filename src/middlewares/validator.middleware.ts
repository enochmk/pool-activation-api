import { AnySchema } from 'yup';
import { Request, Response, NextFunction } from 'express';

import ValidationError from '../utils/errors/ValidationError';

const validator =
	(schema: AnySchema) => async (req: Request, res: Response, next: NextFunction) => {

		console.log({ file: req.file })
		
		try {
			await schema.validate({
				body: req.body,
				query: req.query,
				params: req.params,
				file: req.file,
				files: req.files,
			});

			return next();
		} catch (err: any) {
			return next(new ValidationError(err));
		}
	};

export default validator;
