"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.passwordHash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const passwordHash = (plainPassword) => {
    const hash = bcrypt_1.default.hashSync(plainPassword, 10);
    return hash;
};
exports.passwordHash = passwordHash;
const comparePassword = (plainPassword, passwordHash) => {
    const compared = bcrypt_1.default.compareSync(plainPassword, passwordHash);
    return compared;
};
exports.comparePassword = comparePassword;
