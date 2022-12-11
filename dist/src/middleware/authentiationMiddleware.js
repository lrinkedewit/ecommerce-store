"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationMiddleware = void 0;
const error_code_1 = require("../error/error-code");
const error_exception_1 = require("../error/error-exception");
const jwtUtils_1 = require("../utils/jwtUtils");
const authenticationMiddleware = (req, res, next) => {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer')) {
        const token = auth.slice(7);
        try {
            const tokenData = (0, jwtUtils_1.verifyToken)(token);
            req.body.tokenData = tokenData;
            next();
        }
        catch (error) {
            throw new error_exception_1.ErrorException(error_code_1.ErrorCode.Unauthenticated);
        }
    }
    else {
        throw new error_exception_1.ErrorException(error_code_1.ErrorCode.Unauthenticated);
    }
};
exports.authenticationMiddleware = authenticationMiddleware;
