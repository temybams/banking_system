"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = exports.EmailService = exports.AccountService = exports.AuthService = exports.JWTService = exports.connectPrisma = exports.prisma = void 0;
const prisma_service_1 = require("./prisma.service");
Object.defineProperty(exports, "prisma", { enumerable: true, get: function () { return prisma_service_1.prisma; } });
Object.defineProperty(exports, "connectPrisma", { enumerable: true, get: function () { return prisma_service_1.connectPrisma; } });
const jwt_service_1 = __importDefault(require("./jwt.service"));
exports.JWTService = jwt_service_1.default;
const auth_service_1 = __importDefault(require("../modules/auth/auth.service"));
exports.AuthService = auth_service_1.default;
const accounts_service_1 = __importDefault(require("../modules/accounts/accounts.service"));
exports.AccountService = accounts_service_1.default;
const email_service_1 = __importDefault(require("./email.service"));
exports.EmailService = email_service_1.default;
const transactions_service_1 = __importDefault(require("../modules/transactions/transactions.service"));
exports.TransactionsService = transactions_service_1.default;
