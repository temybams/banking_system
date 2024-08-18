"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const argon = __importStar(require("argon2"));
const http_status_1 = __importDefault(require("http-status"));
const services_1 = require("../../services");
const utils_1 = require("../../utils");
const AuthService = {
    signup: (dto) => __awaiter(void 0, void 0, void 0, function* () {
        let user = yield services_1.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if (user) {
            return (0, utils_1.throwError)('User already exists', http_status_1.default.CONFLICT);
        }
        user = yield services_1.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: yield argon.hash(dto.password),
            },
        });
        services_1.EmailService.sendEmail({
            email: user.email,
            subject: 'Welcome to our platform',
            text: `Dear ${user.name}, welcome to our platform, we are glad to have you on board. You can now enjoy our services.`,
        });
        return user;
    }),
    login: (dto) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield services_1.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if (!user) {
            return (0, utils_1.throwError)('Invalid credentials', http_status_1.default.NOT_FOUND);
        }
        const valid = yield argon.verify(user.password, dto.password);
        if (!valid) {
            return (0, utils_1.throwError)('Invalid credentials', http_status_1.default.NOT_ACCEPTABLE);
        }
        const token = services_1.JWTService.sign({ sub: user.id });
        services_1.EmailService.sendEmail({
            email: user.email,
            subject: 'Login Banking Alert',
            text: `Dear ${user.name}, you have successfully logged in to your account. on ${new Date().toLocaleString()}, if this was not you, please contact us immediately.`,
        });
        return token;
    }),
};
exports.default = AuthService;
