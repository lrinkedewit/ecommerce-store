"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationMiddleware = void 0;
const jwtUtils_1 = require("../utils/jwtUtils");
const authenticationMiddleware = (req, res, next) => {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer')) {
        const token = auth.slice(7);
        try {
            const tokenData = (0, jwtUtils_1.verifyToken)(token);
            res.locals.tokenData = tokenData;
            next();
        }
        catch (error) {
            res.status(401).setHeader('WWW-Authenticate', 'Bearer').send();
        }
    }
    else {
        res.status(401).setHeader('WWW-Authenticate', 'Bearer').send();
    }
};
exports.authenticationMiddleware = authenticationMiddleware;
