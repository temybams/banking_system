"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactions_controller_1 = __importDefault(require("./transactions.controller"));
const middlewares_1 = require("../../middlewares");
const validation_1 = require("../../validation");
const TransactionRouter = express_1.default.Router();
TransactionRouter.post('/', middlewares_1.authMiddleware, (0, middlewares_1.validationMiddleware)(validation_1.CreateTransactionSchema), transactions_controller_1.default.createTransaction);
TransactionRouter.get('/', middlewares_1.authMiddleware, transactions_controller_1.default.getTransactions);
TransactionRouter.post('/transfer', middlewares_1.authMiddleware, (0, middlewares_1.validationMiddleware)(validation_1.InitializeTransferSchema), transactions_controller_1.default.initializeTransfer);
exports.default = TransactionRouter;
