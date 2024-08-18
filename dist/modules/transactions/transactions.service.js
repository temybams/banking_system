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
const client_1 = require("@prisma/client");
const services_1 = require("../../services");
const utils_1 = require("../../utils");
const TransactionsService = {
    createTransaction: (dto, user) => __awaiter(void 0, void 0, void 0, function* () {
        const initialAccount = yield services_1.prisma.account.findFirst({
            where: {
                id: dto.account_id,
                user_id: user.id,
            },
        });
        if (!initialAccount) {
            return (0, utils_1.throwError)('Account not found', http_status_1.default.NOT_FOUND);
        }
        let transaction;
        try {
            yield services_1.prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
                let account = yield prisma.account.findUnique({
                    where: {
                        id_user_id_version: {
                            user_id: user.id,
                            id: initialAccount.id,
                            version: initialAccount.version,
                        },
                    },
                });
                if (!account) {
                    return (0, utils_1.throwError)('Account not found or version mismatch', http_status_1.default.NOT_FOUND);
                }
                if (dto.type === client_1.TransactionType.DEBIT) {
                    if (account.balance < dto.amount) {
                        return (0, utils_1.throwError)('Insufficient balance', http_status_1.default.BAD_REQUEST);
                    }
                    account = yield prisma.account.update({
                        where: {
                            id_user_id_version: {
                                user_id: user.id,
                                id: initialAccount.id,
                                version: initialAccount.version,
                            },
                        },
                        data: {
                            balance: {
                                decrement: dto.amount,
                            },
                            version: {
                                increment: 1,
                            },
                        },
                    });
                    if (account.version !== initialAccount.version + 1) {
                        return (0, utils_1.throwError)('Account version mismatch, please retry your transaction', http_status_1.default.NOT_FOUND);
                    }
                    transaction = yield prisma.transaction.create({
                        data: {
                            account_id: account.id,
                            type: dto.type,
                            amount: dto.amount,
                            description: dto.description ||
                                `Debit of ${dto.amount} from account ${account.account_no}`,
                        },
                    });
                }
                if (dto.type === client_1.TransactionType.CREDIT) {
                    yield prisma.account.update({
                        where: {
                            id: account.id,
                            version: account.version,
                        },
                        data: {
                            balance: {
                                increment: dto.amount,
                            },
                            version: {
                                increment: 1,
                            },
                        },
                    });
                    transaction = yield prisma.transaction.create({
                        data: {
                            account_id: account.id,
                            type: dto.type,
                            amount: dto.amount,
                            description: dto.description ||
                                `Credit of ${dto.amount} to account ${account.account_no}`,
                        },
                    });
                }
            }));
            return transaction;
        }
        catch (error) {
            return TransactionsService.handleTransactionErrors(error);
        }
        finally {
            if (transaction) {
                if (transaction.type === client_1.TransactionType.DEBIT) {
                    services_1.EmailService.sendEmail({
                        email: user.email,
                        subject: 'Debit Alert',
                        text: `Dear ${user.name}, a debit of ${dto.amount} was made from your account on ${transaction.createdAt.toLocaleString()} with account no ${initialAccount.account_no}. If this was not you, please contact us immediately.`,
                    });
                }
                if (transaction.type === client_1.TransactionType.CREDIT) {
                    services_1.EmailService.sendEmail({
                        email: user.email,
                        subject: 'Credit Alert',
                        text: `Dear ${user.name}, a credit of ${dto.amount} was made to your account on ${transaction.createdAt.toLocaleString()} with account no ${initialAccount.account_no}. If this was not you, please contact us immediately.`,
                    });
                }
            }
        }
    }),
    getTransactions: (user) => __awaiter(void 0, void 0, void 0, function* () {
        const accounts = yield services_1.prisma.account.findMany({
            where: {
                user_id: user.id,
            },
        });
        const accountIds = accounts.map((account) => account.id);
        const transactions = yield services_1.prisma.transaction.findMany({
            where: {
                account_id: {
                    in: accountIds,
                },
            },
            include: {
                account: true,
            },
        });
        return transactions;
    }),
    initializeTransfer: (dto, user) => __awaiter(void 0, void 0, void 0, function* () {
        const senderAccount = yield services_1.prisma.account.findFirst({
            where: {
                id: dto.account_id,
                user_id: user.id,
            },
        });
        if (!senderAccount) {
            return (0, utils_1.throwError)('Account not found', http_status_1.default.NOT_FOUND);
        }
        if (senderAccount.balance < dto.amount) {
            return (0, utils_1.throwError)('Insufficient balance', http_status_1.default.BAD_REQUEST);
        }
        const receiverAccount = yield services_1.prisma.account.findUnique({
            where: {
                account_no: Number(dto.account_no),
            },
            include: {
                user: true,
            },
        });
        if (!receiverAccount) {
            return (0, utils_1.throwError)('Receiver account not found', http_status_1.default.NOT_FOUND);
        }
        if (receiverAccount.id === senderAccount.id) {
            return (0, utils_1.throwError)('Cannot transfer to the same account', http_status_1.default.BAD_REQUEST);
        }
        let senderTransaction;
        let receiverTransaction;
        try {
            yield services_1.prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
                let sender = yield prisma.account.findUnique({
                    where: {
                        id_user_id_version: {
                            id: senderAccount.id,
                            user_id: user.id,
                            version: senderAccount.version,
                        },
                    },
                });
                if (!sender) {
                    return (0, utils_1.throwError)('Sender account not found or version mismatch', http_status_1.default.NOT_FOUND);
                }
                if (sender.balance < dto.amount) {
                    return (0, utils_1.throwError)('Insufficient balance', http_status_1.default.BAD_REQUEST);
                }
                let receiver = yield prisma.account.findUnique({
                    where: {
                        id: receiverAccount.id,
                    },
                });
                if (!receiver) {
                    return (0, utils_1.throwError)('Receiver account not found', http_status_1.default.NOT_FOUND);
                }
                sender = yield prisma.account.update({
                    where: {
                        id_user_id_version: {
                            id: sender.id,
                            user_id: user.id,
                            version: sender.version,
                        },
                    },
                    data: {
                        balance: {
                            decrement: dto.amount,
                        },
                        version: {
                            increment: 1,
                        },
                    },
                });
                if (sender.version !== senderAccount.version + 1) {
                    return (0, utils_1.throwError)('Sender account version mismatch, please retry your transaction', http_status_1.default.NOT_FOUND);
                }
                yield prisma.account.update({
                    where: {
                        id: receiver.id,
                    },
                    data: {
                        balance: {
                            increment: dto.amount,
                        },
                    },
                });
                senderTransaction = yield prisma.transaction.create({
                    data: {
                        account_id: sender.id,
                        type: client_1.TransactionType.DEBIT,
                        amount: dto.amount,
                        description: `Transfer of ${dto.amount} to account ${receiver.account_no}`,
                    },
                });
                receiverTransaction = yield prisma.transaction.create({
                    data: {
                        account_id: receiver.id,
                        type: client_1.TransactionType.CREDIT,
                        amount: dto.amount,
                        description: `Transfer of ${dto.amount} from account ${sender.account_no}`,
                    },
                });
            }));
            return senderTransaction;
        }
        catch (error) {
            return TransactionsService.handleTransactionErrors(error);
        }
        finally {
            if (senderTransaction) {
                services_1.EmailService.sendEmail({
                    email: user.email,
                    subject: 'Transfer Debit Alert',
                    text: `Dear ${user.name}, a transfer of ${dto.amount} was made from your account with account number on ${senderAccount.account_no} ${senderTransaction.createdAt.toLocaleString()} to ${receiverAccount.user.name} . If this was not you, please contact us immediately.`,
                });
            }
            if (receiverTransaction) {
                services_1.EmailService.sendEmail({
                    email: receiverAccount.user.email,
                    subject: 'Transfer Credit Alert',
                    text: `Dear ${receiverAccount.user.name}, a transfer of ${dto.amount} was made by ${user.name} to your account with account no ${receiverAccount.account_no} on ${receiverTransaction.createdAt.toLocaleString()}.`,
                });
            }
        }
    }),
    handleTransactionErrors: (error) => {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2034') {
                return (0, utils_1.throwError)('Transaction failed due to a write conflict or a deadlock. Please retry your transaction', http_status_1.default.NOT_ACCEPTABLE);
            }
            if (error.code === 'P2025') {
                return (0, utils_1.throwError)('Transaction failed due to a version mismatch. Please retry your transaction', http_status_1.default.NOT_FOUND);
            }
            throw error;
        }
        throw error;
    },
};
exports.default = TransactionsService;
