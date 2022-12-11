"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateAuthToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_exception_1 = require("../error/error-exception");
const error_code_1 = require("../error/error-code");
const jwtKey = '12345';
const generateAuthToken = (user) => {
    const token = jsonwebtoken_1.default.sign({ _id: user._id, email: user.email }, jwtKey, {
        expiresIn: '2h',
    });
    return token;
};
exports.generateAuthToken = generateAuthToken;
const verifyToken = (token) => {
    try {
        const tokenData = jsonwebtoken_1.default.verify(token, jwtKey);
        return tokenData;
    }
    catch (error) {
        throw new error_exception_1.ErrorException(error_code_1.ErrorCode.Unauthenticated);
    }
};
exports.verifyToken = verifyToken;
