"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const middlewares_1 = require("./middlewares");
const services_1 = require("./services");
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(middlewares_1.loggerMiddleware);
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST'],
}));
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to NodeJs Backend',
    });
});
app.use('/', routes_1.default);
app.use((req, res, next) => {
    const error = new Error(`API Endpoint Not found - ${req.originalUrl}`);
    error.status = 404;
    next(error);
});
app.use(middlewares_1.errorHandler);
app.listen(process.env.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, services_1.connectPrisma)().then(() => {
        console.clear();
        console.log(`Server running on port ${process.env.PORT}`);
    });
}));
