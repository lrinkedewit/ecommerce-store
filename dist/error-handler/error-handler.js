import { ErrorCode } from './error-code';
import { ErrorException } from './error-exception';
export const errorHandler = (err, req, res, next) => {
    console.log('Error handling middleware called.');
    console.log('Path:', req.path);
    console.error('Error occured:', err);
    if (err instanceof ErrorException) {
        console.log('Error is known.');
        res.status(err.status).send(err);
    }
    else {
        // For unhandled errors.
        res.status(500).send({ code: ErrorCode.UnknownError, status: 500 });
    }
};
