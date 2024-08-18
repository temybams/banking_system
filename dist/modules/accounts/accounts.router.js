"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const accounts_controller_1 = __importDefault(require("./accounts.controller"));
const middlewares_1 = require("../../middlewares");
const validation_1 = require("../../validation");
const AccountRouter = express_1.default.Router();
AccountRouter.post('/', middlewares_1.authMiddleware, (0, middlewares_1.validationMiddleware)(validation_1.CreateAccountSchema), accounts_controller_1.default.createAccount);
AccountRouter.get('/:id', middlewares_1.authMiddleware, accounts_controller_1.default.getAccount);
exports.default = AccountRouter;
