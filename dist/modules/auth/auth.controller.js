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
const AuthController = {
    signup: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield services_1.AuthService.signup(req.body);
        res.status(201).json({
            success: true,
            message: 'User created successfully',
        });
    })),
    login: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield services_1.AuthService.login(req.body);
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: {
                token,
            },
        });
    })),
    me: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(200).json({
            success: true,
            message: 'User fetched successfully',
            data: {
                user: req.user,
            },
        });
    })),
};
exports.default = AuthController;
