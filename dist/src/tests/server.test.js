"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const nock_1 = __importDefault(require("nock"));
(0, globals_1.describe)('/sign-up flow', () => {
    const req = {
        "email": "elaine.jackson@gmail.com",
        "name": "Elaine Jackson",
        "password": "Elaine123"
    };
    (0, nock_1.default)('http://localhost:3000')
        .post('/sign-up', req);
});
