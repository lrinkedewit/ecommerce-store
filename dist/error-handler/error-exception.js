import { ErrorCode } from './error-code';
export class ErrorException extends Error {
    constructor(code = ErrorCode.UnknownError, metaData = null) {
        super(code);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = code;
        this.status = 500;
        this.metaData = metaData;
        switch (code) {
            case ErrorCode.Unauthenticated:
                this.status = 401;
                break;
            case ErrorCode.MaximumAllowedGrade:
                this.status = 400;
                break;
            case ErrorCode.AsyncError:
                this.status = 400;
                break;
            case ErrorCode.NotFound:
                this.status = 404;
                break;
            default:
                this.status = 500;
                break;
        }
    }
}
