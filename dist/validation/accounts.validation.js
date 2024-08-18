"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAccountSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const CreateAccountSchema = zod_1.z.object({
    account_type: zod_1.z.nativeEnum(client_1.AccountType, {
        required_error: 'Account type is required',
        invalid_type_error: `Account type must be one of ${Object.values(client_1.AccountType).join(', ')}`,
    }),
});
exports.CreateAccountSchema = CreateAccountSchema;
