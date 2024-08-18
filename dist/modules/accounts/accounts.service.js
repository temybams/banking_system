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
const services_1 = require("../../services");
const utils_1 = require("../../utils");
const AccountService = {
    createAccount: (dto, user) => __awaiter(void 0, void 0, void 0, function* () {
        const account = yield services_1.prisma.account.create({
            data: {
                account_no: yield AccountService.generateAccountNubmer(),
                user_id: user.id,
                account_type: dto.account_type,
            },
        });
        return account;
    }),
    getAccount: (user, id) => __awaiter(void 0, void 0, void 0, function* () {
        const account = yield services_1.prisma.account.findFirst({
            where: {
                id,
                user_id: user.id,
            },
        });
        if (!account) {
            return (0, utils_1.throwError)('Account not found', http_status_1.default.NOT_FOUND);
        }
        return account;
    }),
    generateAccountNubmer: () => __awaiter(void 0, void 0, void 0, function* () {
        const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
        const account = yield services_1.prisma.account.findUnique({
            where: {
                account_no: accountNumber,
            },
        });
        if (account) {
            return AccountService.generateAccountNubmer();
        }
        return accountNumber;
    }),
};
exports.default = AccountService;
