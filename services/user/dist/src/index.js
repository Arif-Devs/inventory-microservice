"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const controllers_1 = require("./controllers");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.get('/health', (req, res) => {
    res.status(200).json({ health: 'ok' });
});
// app.use((req, res, next) => {
//   const allowedOrigins = ['http://localhost:8081', 'http://127.0.0.1:8081'];
//   const origin = req.headers.origin || '';
//   if (allowedOrigins.includes(origin)) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//     next();
//   } else {
//     res.status(403).json({ message: 'Forbidden' });
//   }
// });
//routes
app.get('/users/:id', controllers_1.getUserById);
app.post('/users', controllers_1.createUser);
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({ message: 'internal server error' });
});
const port = process.env.PORT || 4004;
const serviceName = process.env.SERVICE_NAME || 'User-Service';
app.listen(port, () => {
    console.log(`${serviceName} is running on port ${port}`);
});
//# sourceMappingURL=index.js.map