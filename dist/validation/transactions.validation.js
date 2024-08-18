"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializeTransferSchema = exports.CreateTransactionSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const CreateTransactionSchema = zod_1.z.object({
    amount: zod_1.z
        .number({
        required_error: 'Amount is required',
    })
        .positive({
        message: 'Amount must be a positive number',
    }),
    description: zod_1.z
        .string({
        required_error: 'Description is required',
    })
        .min(3, 'Description must be at least 3 characters long')
        .nullable(),
    type: zod_1.z.nativeEnum(client_1.TransactionType, {
        required_error: 'Transaction type is required',
        invalid_type_error: `Transaction type must be one of ${Object.values(client_1.TransactionType).join(', ')}`,
    }),
    account_id: zod_1.z
        .number({
        invalid_type_error: 'Account ID must be a number',
        required_error: 'Account ID is required',
    })
        .positive({
        message: 'Account ID must be a positive number',
    }),
});
exports.CreateTransactionSchema = CreateTransactionSchema;
const InitializeTransferSchema = zod_1.z.object({
    amount: zod_1.z
        .number({
        required_error: 'Amount is required',
    })
        .positive({
        message: 'Amount must be a positive number',
    }),
    account_no: zod_1.z
        .string({
        required_error: 'Account number is required',
    })
        .min(10, {
        message: 'Account number must be 10 digits',
    })
        .max(10, {
        message: 'Account number must be 10 digits',
    })
        .regex(/^\d+$/, {
        message: 'Account number must be a positive number',
    }),
    account_id: zod_1.z
        .number({
        required_error: 'Account ID is required',
    })
        .positive({
        message: 'Account ID must be a positive number',
    }),
});
exports.InitializeTransferSchema = InitializeTransferSchema;
