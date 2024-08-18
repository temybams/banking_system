"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const middlewares_1 = require("../../middlewares");
const validation_1 = require("../../validation");
const AuthRouter = express_1.default.Router();
AuthRouter.post('/register', (0, middlewares_1.validationMiddleware)(validation_1.SignupSchema), auth_controller_1.default.signup);
AuthRouter.post('/login', (0, middlewares_1.validationMiddleware)(validation_1.LoginSchema), auth_controller_1.default.login);
AuthRouter.get('/me', middlewares_1.authMiddleware, auth_controller_1.default.me);
exports.default = AuthRouter;
