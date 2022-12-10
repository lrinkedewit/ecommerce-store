"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.send('Application works!');
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
