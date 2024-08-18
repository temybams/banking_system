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
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../../middlewares");
const services_1 = require("../../services");
const TransactionController = {
    createTransaction: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const transaction = yield services_1.TransactionsService.createTransaction(req.body, req.user);
        res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            data: {
                transaction,
            },
        });
    })),
    initializeTransfer: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const transfer = yield services_1.TransactionsService.initializeTransfer(req.body, req.user);
        res.status(201).json({
            success: true,
            message: 'Transfer initialized successfully',
            data: {
                transfer,
            },
        });
    })),
    getTransactions: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const transactions = yield services_1.TransactionsService.getTransactions(req.user);
        res.status(200).json({
            success: true,
            message: 'Transactions fetched successfully',
            data: {
                transactions,
            },
        });
    })),
};
exports.default = TransactionController;
