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
const http_status_1 = __importDefault(require("http-status"));
const middlewares_1 = require("../middlewares");
const services_1 = require("../services");
const utils_1 = require("../utils");
const authMiddleware = (0, middlewares_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let token;
    let type;
    [type, token] = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')) !== null && _b !== void 0 ? _b : [];
    type === 'Bearer' ? (token = token) : (token = undefined);
    if (!token) {
        return (0, utils_1.throwError)('Unauthorized', http_status_1.default.UNAUTHORIZED);
    }
    const decoded = services_1.JWTService.verify(token);
    if (!decoded) {
        return (0, utils_1.throwError)('Unauthorized', http_status_1.default.UNAUTHORIZED);
    }
    const user = yield services_1.prisma.user.findUnique({
        where: {
            id: Number(decoded.sub),
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!user) {
        return (0, utils_1.throwError)('Unauthorized', http_status_1.default.UNAUTHORIZED);
    }
    req.user = user;
    next();
}));
exports.default = authMiddleware;
