"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db/db");
const passwordUtils_1 = require("./utils/passwordUtils");
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({
    extended: true,
}));
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Application works!');
});
app.post('/sign-up', (req, res) => {
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
            console.log('Error adding param', err);
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
                }
                else {
                    //throw error password is incorrect
                    // next(new ErrorException(ErrorCode.Unauthenticated));
                    console.log('password is incorrect');
                }
            }
        }
    });
});
app.get('/test', (req, res) => {
    db_1.db.all('SELECT * FROM Advisor;', (err) => {
        if (err) {
            console.log('Error retaining rows from Advisor table', err);
        }
    });
    res.status(200).send('All entries are available in Advisor table.');
});
// app.get('/throw-unauthenticated', (req: Request, res: Response, next: NextFunction) => {
//   throw new ErrorException(ErrorCode.Unauthenticated);
//   // or
//   // next(new ErrorException(ErrorCode.Unauthenticated))
// });
// app.get('/throw-maximum-allowed-grade', (req: Request, res: Response, next: NextFunction) => {
//   throw new ErrorException(ErrorCode.MaximumAllowedGrade, { grade: Math.random() });
//   // or
//   // next(new ErrorException(ErrorCode.MaximumAllowedGrade, { grade: Math.random() }))
// });
// app.get('/throw-unknown-error', (req: Request, res: Response, next: NextFunction) => {
//   const num: any = null;
//   // Node.js will throw an error because there is no length property inside num variable
//   console.log(num.length);
// });
// app.use(errorHandler); // registration of handler
app.listen(3000, () => {
    console.log('Application started on port 3000!');
});
