"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db/db");
const error_exception_1 = require("./error/error-exception");
const error_code_1 = require("./error/error-code");
const passwordUtils_1 = require("./utils/passwordUtils");
const jwtUtils_1 = require("./utils/jwtUtils");
const authentiationMiddleware_1 = require("./middleware/authentiationMiddleware");
const retrieveID_1 = require("./middleware/retrieveID");
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({
    extended: true,
}));
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Application works!');
});
app.post('/sign-up', (req, res, next) => {
    const { email, name, password } = req.body;
    // hash password
    const hash = (0, passwordUtils_1.passwordHash)(password);
    // insert sanitized values into Advisor table
    const stmt = db_1.db.prepare('INSERT INTO Advisor (email, name, password) VALUES (:email, :name, :password)', { ':email': email, ':name': name, ':password': hash }, (err) => {
        if (err) {
            console.log('Error preparing statement', err);
        }
        else {
            console.log('Successfully prepared statement with params.');
        }
    });
    stmt.get((err) => {
        if (err) {
            next(new error_exception_1.ErrorException(error_code_1.ErrorCode.AlreadyExists));
        }
        else
            res.status(200).send('Successfully added new user.');
    });
    stmt.finalize();
});
app.post('/login', (req, res, next) => {
    // destructure req.body
    const { email, password } = req.body;
    // check if email exists
    const stmt = db_1.db.prepare('SELECT * FROM Advisor WHERE (email) = (:email)', { ':email': email }, (err) => {
        if (err) {
            console.log('Error preparing statement', err);
        }
        else {
            console.log('Successfully prepared statement with params.');
            console.log(email);
        }
    });
    stmt.get((err, row) => {
        if (err) {
            console.log('Error querying database in login flow', err);
        }
        else {
            if (row === undefined) {
                console.log('Email does not exist');
            }
            else {
                console.log('Email exists', row);
                const passwordCorrect = (0, passwordUtils_1.comparePassword)(password, row.password);
                if (passwordCorrect === true) {
                    // respond with JWT
                    console.log('issuing JWT');
                    const token = (0, jwtUtils_1.generateAuthToken)(row);
                    res.status(200).send(token);
                }
                else {
                    // THROW ERROR password is incorrect
                    next(new error_exception_1.ErrorException(error_code_1.ErrorCode.Unauthenticated));
                    console.log('password is incorrect');
                }
            }
        }
    });
    stmt.finalize();
});
app.post('/product', authentiationMiddleware_1.authenticationMiddleware, retrieveID_1.retrieveID, (req, res, next) => {
    // if all is verified, insert new product into table
    const { name, description, price } = req.body;
    const id = req.body.id;
    // add product to table
    const stmt = db_1.db.prepare('INSERT INTO Product (advisor_id, name, description, price) VALUES (:advisor_id, :name, :description, :price)', { ':advisor_id': id, ':name': name, ':description': description, ':price': price }, (err) => {
        if (err) {
            console.log('Error preparing statement', err);
        }
        else {
            console.log('Successfully prepared statement with params.');
        }
    });
    stmt.get((err) => {
        if (err) {
            console.log(err);
            next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError));
        }
        else
            res.status(200).send('Successfully added new product.');
    });
    stmt.finalize();
});
app.get('/product', authentiationMiddleware_1.authenticationMiddleware, retrieveID_1.retrieveID, (req, res, next) => {
    const id = req.body.id;
    console.log(`this is our id!!!!`, id);
    const stmt = db_1.db.prepare('SELECT * FROM Product WHERE advisor_id = (:advisor_id)', { ':advisor_id': id }, (err) => {
        if (err) {
            console.log('Error preparing statement', err);
        }
        else {
            console.log('Successfully prepared statement with params.');
        }
    });
    stmt.all((err, rows) => {
        if (err) {
            console.log(err);
            next(new error_exception_1.ErrorException(error_code_1.ErrorCode.UnknownError));
        }
        else {
            console.log(rows);
            res.status(200).send(rows);
        }
    });
});
app.get('/test', (req, res) => {
    db_1.db.all('SELECT * FROM Advisor;', (err, rows) => {
        if (err) {
            console.log('Error retaining rows from Advisor table', err);
        }
        else {
            console.log(`Here are the rows in the Advisor table`, rows);
        }
    });
    db_1.db.all('SELECT * FROM Product;', (err, rows) => {
        if (err) {
            console.log('Error retaining rows from Product table', err);
        }
        else {
            console.log('Here are the rows in the Product table', rows);
        }
    });
    res.status(200).send('All entries are available in Advisor and Product table.');
});
app.listen(3000, () => {
    console.log('Application started on port 3000!');
});
