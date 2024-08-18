"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_router_1 = __importDefault(require("../modules/auth/auth.router"));
const accounts_router_1 = __importDefault(require("../modules/accounts/accounts.router"));
const transactions_router_1 = __importDefault(require("../modules/transactions/transactions.router"));
const router = express_1.default.Router();
router.use('/auth', auth_router_1.default);
router.use('/accounts', accounts_router_1.default);
router.use('/transactions', transactions_router_1.default);
exports.default = router;
