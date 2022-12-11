"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveID = void 0;
const error_code_1 = require("../error/error-code");
const error_exception_1 = require("../error/error-exception");
const db_1 = require("../db/db");
const retrieveID = (req, res, next) => {
    // find users id based on their email
    const email = req.body.tokenData.email;
    const idStmt = db_1.db.prepare('SELECT id FROM Advisor WHERE email = (:email)', { ':email': email });
    idStmt.get((err, row) => {
        if (err) {
            console.log(err);
            next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError));
        }
        else {
            req.body.id = row.id;
            next();
        }
    });
    idStmt.finalize();
};
exports.retrieveID = retrieveID;
