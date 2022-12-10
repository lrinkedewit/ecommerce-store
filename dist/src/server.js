"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_handler_1 = require("error-handler/error-handler");
const error_exception_1 = require("error-handler/error-exception");
const error_code_1 = require("error-handler/error-code");
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.send('Application works!');
});
app.get('/throw-unauthenticated', (req, res, next) => {
    throw new error_exception_1.ErrorException(error_code_1.ErrorCode.Unauthenticated);
    // or
    // next(new ErrorException(ErrorCode.Unauthenticated))
});
app.get('/throw-maximum-allowed-grade', (req, res, next) => {
    throw new error_exception_1.ErrorException(error_code_1.ErrorCode.MaximumAllowedGrade, { grade: Math.random() });
    // or
    // next(new ErrorException(ErrorCode.MaximumAllowedGrade, { grade: Math.random() }))
});
app.get('/throw-unknown-error', (req, res, next) => {
    const num = null;
    // Node.js will throw an error because there is no length property inside num variable
    console.log(num.length);
});
app.use(error_handler_1.errorHandler); // registration of handler
app.listen(3000, () => {
    console.log('Application started on port 3000!');
});
